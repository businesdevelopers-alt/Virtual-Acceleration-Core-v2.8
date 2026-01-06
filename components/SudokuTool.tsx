
import React, { useState, useEffect } from 'react';
import { generateSudokuAI } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { SudokuStats } from '../types';

interface SudokuToolProps {
  onBack: () => void;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const SudokuTool: React.FC<SudokuToolProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isGameWon, setIsGameWon] = useState(false);
  
  // Stats & Timer
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [stats, setStats] = useState<SudokuStats | null>(null);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  useEffect(() => {
    const session = storageService.getCurrentSession();
    if (session) {
      setCurrentUserUid(session.uid);
      setStats(storageService.getSudokuStats(session.uid));
    }
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerActive) {
      interval = window.setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      window.clearInterval(interval);
    }
    return () => window.clearInterval(interval);
  }, [isTimerActive]);

  const startNewGame = async (diff: Difficulty) => {
    setIsLoading(true);
    setDifficulty(diff);
    setIsGameWon(false);
    setSelectedCell(null);
    setTimer(0);
    setIsTimerActive(false);
    playPositiveSound();

    try {
      const data = await generateSudokuAI(diff);
      setBoard(JSON.parse(JSON.stringify(data.puzzle)));
      setInitialBoard(JSON.parse(JSON.stringify(data.puzzle)));
      setSolution(data.solution);
      setIsTimerActive(true);
      
      if (currentUserUid) {
        // Log game attempt (win=false initially)
        storageService.updateSudokuStats(currentUserUid, false);
        setStats(storageService.getSudokuStats(currentUserUid));
      }
    } catch (e) {
      alert("فشل توليد اللغز. حاول مرة أخرى.");
      setDifficulty(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellInput = (num: number) => {
    if (!selectedCell || isGameWon) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== 0) return;

    const newBoard = [...board.map(row => [...row])];
    newBoard[r][c] = num;
    setBoard(newBoard);

    // Check if correct
    if (num !== 0 && num !== solution[r][c]) {
      playErrorSound();
    } else if (num !== 0) {
      playPositiveSound();
    }

    // Check win condition
    const isFull = newBoard.every(row => row.every(cell => cell !== 0));
    const isCorrect = newBoard.every((row, ri) => row.every((cell, ci) => cell === solution[ri][ci]));
    
    if (isFull && isCorrect) {
      setIsGameWon(true);
      setIsTimerActive(false);
      playCelebrationSound();
      
      if (currentUserUid) {
        storageService.updateSudokuStats(currentUserUid, true, timer);
        setStats(storageService.getSudokuStats(currentUserUid));
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const winRate = stats ? (stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0) : 0;
  const avgTime = stats ? (stats.gamesWon > 0 ? Math.round(stats.totalTimeSeconds / stats.gamesWon) : 0) : 0;

  if (!difficulty) {
    return (
      <div className="space-y-12 py-10 animate-fade-up">
        <div className="text-center space-y-4">
           <h2 className="text-4xl font-black text-slate-900 dark:text-white">تدريب المنطق والتركيز</h2>
           <p className="text-slate-500 max-w-md mx-auto">تعتبر السودوكو أداة ممتازة لرواد الأعمال لتعزيز مهارات حل المشكلات والتفكير الاستراتيجي.</p>
        </div>

        {/* Performance Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
             {[
               { label: 'عدد المحاولات', value: stats.gamesPlayed, icon: '🎮', color: 'text-blue-600' },
               { label: 'معدل الفوز', value: `${winRate}%`, icon: '🏆', color: 'text-emerald-600' },
               { label: 'أفضل زمن', value: stats.bestTimeSeconds ? formatTime(stats.bestTimeSeconds) : '--', icon: '⏱️', color: 'text-amber-600' },
               { label: 'متوسط الزمن', value: avgTime > 0 ? formatTime(avgTime) : '--', icon: '📊', color: 'text-indigo-600' }
             ].map((stat, i) => (
               <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm text-center">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
               </div>
             ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mx-auto">
           {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(diff => (
             <button
               key={diff}
               onClick={() => startNewGame(diff)}
               className={`p-10 rounded-[2.5rem] border-2 transition-all group flex flex-col items-center gap-4
                 ${diff === 'Easy' ? 'border-emerald-100 hover:border-emerald-500 bg-emerald-50/30' : 
                   diff === 'Medium' ? 'border-blue-100 hover:border-blue-500 bg-blue-50/30' : 
                   'border-rose-100 hover:border-rose-500 bg-rose-50/30'}
               `}
             >
               <span className="text-4xl">{diff === 'Easy' ? '🌱' : diff === 'Medium' ? '⚖️' : '🔥'}</span>
               <span className="font-black text-lg uppercase tracking-widest">{diff === 'Easy' ? 'سهل' : diff === 'Medium' ? 'متوسط' : 'صعب'}</span>
             </button>
           ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-500 animate-pulse uppercase tracking-[0.2em]">جاري بناء اللغز المنطقي...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 py-10 animate-fade-in items-start justify-center">
      {/* Sudoku Grid */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/5">
        <div className="flex justify-between items-center mb-6 px-2">
           <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{formatTime(timer)}</span>
           </div>
           <div className="flex items-center gap-2">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' : difficulty === 'Medium' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                {difficulty === 'Easy' ? 'سهل' : difficulty === 'Medium' ? 'متوسط' : 'صعب'}
              </span>
           </div>
        </div>
        <div className="grid grid-cols-9 border-4 border-slate-900 dark:border-white/20">
          {board.map((row, ri) => row.map((cell, ci) => {
            const isInitial = initialBoard[ri][ci] !== 0;
            const isSelected = selectedCell?.[0] === ri && selectedCell?.[1] === ci;
            const isError = cell !== 0 && cell !== solution[ri][ci];
            
            return (
              <div
                key={`${ri}-${ci}`}
                onClick={() => setSelectedCell([ri, ci])}
                className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-xl md:text-2xl font-black cursor-pointer border transition-all
                  ${(ri + 1) % 3 === 0 && ri !== 8 ? 'border-b-4 border-b-slate-900 dark:border-b-white/40' : 'border-slate-200 dark:border-white/10'}
                  ${(ci + 1) % 3 === 0 && ci !== 8 ? 'border-l-4 border-l-slate-900 dark:border-l-white/40' : 'border-slate-200 dark:border-white/10'}
                  ${isInitial ? 'bg-slate-50 dark:bg-white/5 text-slate-400' : 'text-blue-600'}
                  ${isSelected ? 'bg-blue-600/10 ring-4 ring-blue-500/50 z-10' : ''}
                  ${isError ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''}
                `}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          }))}
        </div>
      </div>

      {/* Controls & Numpad */}
      <div className="space-y-10 w-full max-w-sm">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">تحكم السودوكو</span>
              <button onClick={() => { setIsTimerActive(!isTimerActive); playPositiveSound(); }} className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
                {isTimerActive ? '⏸️ إيقاف مؤقت' : '▶️ استئناف'}
              </button>
           </div>
           
           {isGameWon ? (
             <div className="text-center py-6 space-y-4">
                <div className="text-5xl">🏆</div>
                <h3 className="text-2xl font-black text-emerald-400">رائع! تم حل اللغز</h3>
                <p className="text-slate-400 text-sm">الزمن المحقق: {formatTime(timer)}</p>
                <button onClick={() => setDifficulty(null)} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 transition-all">العودة للاختيار</button>
             </div>
           ) : (
             <div className="space-y-8">
               <div className="grid grid-cols-3 gap-3">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                   <button
                     key={num}
                     onClick={() => handleCellInput(num)}
                     className="py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xl border border-white/5 active:scale-95 transition-all"
                   >
                     {num}
                   </button>
                 ))}
                 <button
                   onClick={() => handleCellInput(0)}
                   className="col-span-3 py-4 bg-rose-500/20 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-500/20"
                 >
                   مسح الخلية
                 </button>
               </div>
               <button onClick={() => setDifficulty(null)} className="w-full text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors">تغيير الصعوبة / انسحاب</button>
             </div>
           )}
        </div>
        
        <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-[-20px] left-[-20px] text-7xl opacity-10 group-hover:rotate-12 transition-transform duration-700">🧩</div>
           <h4 className="font-black text-xs uppercase tracking-widest mb-2 relative z-10">لماذا هذه اللعبة؟</h4>
           <p className="text-sm leading-relaxed opacity-90 relative z-10 font-medium">التركيز في حل السودوكو يدرب العقل على معالجة عدة متغيرات في وقت واحد، وهي مهارة جوهرية عند اتخاذ القرارات تحت الضغط.</p>
        </div>
      </div>
    </div>
  );
};
