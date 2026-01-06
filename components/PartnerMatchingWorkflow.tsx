
import React, { useState } from 'react';
import { UserProfile, UserRole, MatchResult } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { runSmartMatchingAlgorithmAI } from '../services/geminiService';

interface PartnerMatchingWorkflowProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  isDark: boolean;
}

export const PartnerMatchingWorkflow: React.FC<PartnerMatchingWorkflowProps> = ({ user, isDark }) => {
  const [phase, setPhase] = useState<'IDLE' | 'ANALYZING' | 'RESULTS'>('IDLE');
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const runAlgorithm = async () => {
    setPhase('ANALYZING');
    playPositiveSound();

    try {
      const allPartners = storageService.getAllPartners();
      const allStartups = storageService.getAllStartups();
      const currentStartup = allStartups.find(s => s.ownerId === user.uid);

      if (!currentStartup) {
        alert("يرجى إكمال بيانات مشروعك في الملف الشخصي أولاً لتفعيل نظام المطابقة.");
        setPhase('IDLE');
        return;
      }

      // Execute AI Algorithm
      const results = await runSmartMatchingAlgorithmAI(currentStartup, allPartners);
      
      // Limit to Top 10 as per requirements
      setMatches(results.slice(0, 10));
      setPhase('RESULTS');
      playCelebrationSound();
    } catch (e) {
      console.error("Algorithm Error:", e);
      alert("حدث خطأ في محرك المطابقة. يرجى المحاولة لاحقاً.");
      setPhase('IDLE');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-up text-right" dir="rtl">
      
      {phase === 'IDLE' && (
        <div className="space-y-16 py-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              Strategic Synergy System
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">نظام مطابقة الشركاء المتقدم</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              خوارزمية ذكاء اصطناعي تقوم بتحليل مصفوفة الكفاءات والاحتياجات لاختيار الشريك المؤسس الأكثر ملاءمة لأهداف مشروعك الاستراتيجية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { t: 'تكامل الدور', d: 'مطابقة المهارات المفقودة.', i: '🧩' },
               { t: 'مستوى الخبرة', d: 'توافق العمر التشغيلي.', i: '📉' },
               { t: 'تخصص المجال', d: 'العمق المعرفي للقطاع.', i: '🏛️' },
               { t: 'نمط العمل', d: 'التوافق السلوكي والقيادي.', i: '⚖️' }
             ].map((pillar, i) => (
               <div key={i} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                  <span className="text-3xl block mb-4">{pillar.i}</span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{pillar.t}</h4>
                  <p className="text-slate-400 text-xs font-bold">{pillar.d}</p>
               </div>
             ))}
          </div>

          <div className="flex justify-center pt-8">
            <button 
              onClick={runAlgorithm}
              className="px-16 py-6 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-4"
            >
              <span>تفعيل محرك المطابقة (Top 10)</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </button>
          </div>
        </div>
      )}

      {phase === 'ANALYZING' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
          <div className="relative">
            <div className="w-40 h-40 border-8 border-slate-100 dark:border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-5xl">🧠</div>
          </div>
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">جاري تحليل مصفوفة الشركاء...</h3>
            <div className="flex gap-2 justify-center">
              {['Role Analysis', 'Experience Mapping', 'Behavioral Check'].map((tag, i) => (
                <span key={i} className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full animate-pulse" style={{animationDelay: `${i*0.3}s`}}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === 'RESULTS' && (
        <div className="space-y-10 animate-fade-up">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-10 gap-6">
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">أفضل ١٠ شركاء مرشحين</h3>
              <p className="text-slate-500 font-medium mt-2">بناءً على التوافق الاستراتيجي مع: <span className="text-blue-600 font-black">{user.startupName}</span></p>
            </div>
            <button onClick={() => setPhase('IDLE')} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-500 hover:text-blue-600 transition-colors">إعادة التحليل ↺</button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {matches.map((match, i) => (
              <div key={match.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-12 group hover:border-blue-600 transition-all">
                
                <div className="text-5xl font-black text-slate-100 dark:text-slate-800 tabular-nums shrink-0">0{i+1}</div>
                
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-6xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  {match.avatar || '👤'}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">{match.name}</h4>
                    <span className="px-4 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">{match.role}</span>
                  </div>
                  
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium italic">
                      <span className="text-blue-600 font-black not-italic ml-2 underline underline-offset-4">سبب الترشيح:</span>
                      "{match.reason}"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { l: 'الدور', v: match.scores.roleFit },
                      { l: 'الخبرة', v: match.scores.experienceFit },
                      { l: 'المجال', v: match.scores.industryFit },
                      { l: 'النمط', v: match.scores.styleFit }
                    ].map(s => (
                      <div key={s.l} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                          <span>{s.l}</span>
                          <span className="text-blue-600">{s.v}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 transition-all duration-1000 delay-300" style={{width: `${s.v}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-6 pt-4 lg:pt-0">
                  <div className="text-center">
                    <p className="text-6xl font-black text-blue-600 tracking-tighter leading-none">{match.totalScore}%</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Alignment</p>
                  </div>
                  <button className="w-full px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all">
                    طلب تواصل
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-12 bg-slate-100 dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 text-center space-y-6">
             <h4 className="text-2xl font-black text-slate-900 dark:text-white">هل ترغب في تحسين دقة النتائج؟</h4>
             <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                كلما زادت دقة البيانات الوصفية لمشروعك (المشكلة، الحل، السوق)، استطاع المحرك الذكي تحديد الشركاء الذين يملكون الخبرة النوعية المناسبة لسد ثغرات فريقك الحالية.
             </p>
             <button className="text-blue-600 font-black text-sm hover:underline underline-offset-8">تحديث بيانات المشروع الآن ←</button>
          </div>
        </div>
      )}
    </div>
  );
};
