
import React, { useState, useEffect } from 'react';
import { AnalyticalQuestion, ApplicantProfile } from '../../types';
import { generateAnalyticalQuestions } from '../../services/geminiService';
import { playPositiveSound, playErrorSound } from '../../services/audioService';

interface AnalyticalTestProps {
  profile: ApplicantProfile;
  onComplete: (score: number) => void;
}

export const AnalyticalTest: React.FC<AnalyticalTestProps> = ({ profile, onComplete }) => {
  const [questions, setQuestions] = useState<AnalyticalQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for answer processing animation
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const loadQs = async () => {
      const qs = await generateAnalyticalQuestions(profile);
      setQuestions(qs);
      setIsLoading(false);
    };
    loadQs();
  }, [profile]);

  const handleAnswer = (optionIdx: number) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === questions[currentIndex].correctIndex;
    
    // Play sound immediately for responsiveness
    if (isCorrect) {
      playPositiveSound();
    } else {
      playErrorSound();
    }

    // Delay to show the spinner and simulate processing
    setTimeout(() => {
      let newScore = score;
      if (isCorrect) {
        newScore = score + 1;
        setScore(newScore);
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsProcessing(false);
        setSelectedOption(null);
      } else {
        // Finish
        const percentage = Math.round((newScore / questions.length) * 100);
        onComplete(percentage);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">جاري إعداد الاختبار التحليلي الخاص بقطاع {profile.sector}...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-end mb-6">
           <div>
             <h2 className="text-2xl font-bold text-slate-800">📊 التقييم التحليلي</h2>
             <p className="text-slate-500 text-sm">أثبت قدرتك على التفكير الريادي.</p>
           </div>
           <div className="text-left">
             <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">مؤشر الأداء</div>
             <div className={`text-xl font-bold ${score > currentIndex / 2 ? 'text-green-600' : 'text-orange-500'}`}>
                {Math.round((score / (currentIndex + 1 || 1)) * 100)}%
             </div>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
          {/* Difficulty Banner */}
          <div className={`absolute top-0 right-0 left-0 h-1.5 ${
            currentQ.difficulty === 'Easy' ? 'bg-green-500' : 
            currentQ.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>

          <div className="p-8 md:p-10">
            <div className="flex justify-between items-start mb-6">
               <span className={`text-xs font-bold px-2 py-1 rounded text-white ${
                 currentQ.difficulty === 'Easy' ? 'bg-green-500' : 
                 currentQ.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
               }`}>
                 {currentQ.difficulty === 'Easy' ? 'سهل' : currentQ.difficulty === 'Medium' ? 'متوسط' : 'صعب'}
               </span>
               <span className="text-slate-400 text-sm font-bold">
                 {currentIndex + 1} / {questions.length}
               </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
              {currentQ.text}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isProcessing}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-right font-medium relative min-h-[60px]
                    ${isProcessing && selectedOption === idx 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-slate-700'}
                    ${isProcessing && selectedOption !== idx ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className={`transition-opacity duration-200 ${isProcessing && selectedOption === idx ? 'opacity-0' : 'opacity-100'}`}>
                    {opt}
                  </span>
                  
                  {isProcessing && selectedOption === idx && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
