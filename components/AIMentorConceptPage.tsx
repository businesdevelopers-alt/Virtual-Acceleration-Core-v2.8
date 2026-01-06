
import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface AIMentorConceptPageProps {
  onStart: () => void;
  onBack: () => void;
}

export const AIMentorConceptPage: React.FC<AIMentorConceptPageProps> = ({ onStart, onBack }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden" dir="rtl">
      <style>{`
        .ai-gradient { background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 50%); }
        .pulse-border { animation: pulse-border 2s infinite; }
        @keyframes pulse-border {
          0% { border-color: rgba(59, 130, 246, 0.1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
          100% { border-color: rgba(59, 130, 246, 0.1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.1); }
        }
        .ai-grid { background-image: radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px); background-size: 30px 30px; }
      `}</style>
      
      <div className="fixed inset-0 ai-gradient pointer-events-none"></div>
      <div className="fixed inset-0 ai-grid opacity-20 pointer-events-none"></div>

      <header className="relative z-10 px-8 py-6 flex justify-between items-center bg-[#020617]/40 backdrop-blur-2xl border-b border-white/5">
        <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
           <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-2xl shadow-blue-500/20">AI</div>
          <div className="text-right">
             <span className="text-xl font-black tracking-tight block leading-none">الموجه الرقمي</span>
             <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Gemini 3 Pro Powered</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 bg-blue-500/10 text-blue-400 px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] border border-blue-500/20">
                Cognitive Acceleration Core
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.95]">
                موجهك <br/> 
                <span className="text-blue-500">لا ينام.</span>
              </h1>
              <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl px-2">
                تجاوز عقبات الجدولة والانتظار. الموجه الرقمي يحلل مخرجاتك، يكشف الثغرات المنطقية، ويحضر مشروعك لمقابلة المرشدين البشريين بأعلى معايير الجودة.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { t: 'تحليل PDFs فوري', d: 'ارفع ملفاتك واحصل على نقد استراتيجي في ثوانٍ.' },
                   { t: 'محاكاة المستثمر', d: 'تدرب على أصعب الأسئلة قبل مواجهة الممولين.' },
                   { t: 'توليد الفرضيات', d: 'اكتشف مسارات نمو لم تكن تخطر ببالك.' },
                   { t: 'تحقق مستمر', d: 'تأكد من مواءمة مشروعك مع توجهات السوق ٢٤/٧.' }
                 ].map((feat, i) => (
                   <div key={i} className="flex gap-5 group">
                      <div className="w-8 h-8 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center text-[10px] font-black transition-all group-hover:scale-125 shrink-0 mt-1 shadow-lg shadow-blue-500/10">✓</div>
                      <div>
                         <h4 className="font-black text-slate-100 text-lg mb-1">{feat.t}</h4>
                         <p className="text-sm text-slate-500 font-medium leading-relaxed">{feat.d}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => { playPositiveSound(); onStart(); }}
                  className="px-16 py-8 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-black rounded-[3rem] shadow-3xl shadow-blue-900/40 transition-all transform active:scale-95 flex items-center justify-center gap-6 group"
                >
                  <span>ابدأ مع الموجه الرقمي</span>
                  <svg className="w-8 h-8 transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
           </div>

           <div className="relative animate-fade-in group">
              <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
              <div className="bg-slate-900/60 p-16 rounded-[6rem] border-2 border-blue-500/20 pulse-border relative overflow-hidden backdrop-blur-3xl shadow-3xl group-hover:scale-[1.02] transition-all duration-700">
                 <div className="space-y-16">
                    <div className="flex justify-between items-center pb-8 border-b border-white/5">
                       <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl shadow-2xl">🤖</div>
                       <div className="text-left">
                          <p className="text-5xl font-black text-blue-400 tracking-tighter">98.4%</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Accuracy Index</p>
                       </div>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                          <div className="flex gap-2">
                             <div className="h-2 w-12 bg-blue-600/40 rounded-full"></div>
                             <div className="h-2 w-24 bg-blue-600/20 rounded-full"></div>
                          </div>
                          <p className="text-slate-300 italic text-xl font-medium leading-relaxed">
                            "بناءً على تحليل نموذج عملك، لاحظت فجوة في تدفق الإيرادات المتكرر. هل فكرت في نموذج الاشتراك (SaaS) بدلاً من البيع لمرة واحدة؟"
                          </p>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-8 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/10 text-center hover:bg-blue-500/10 transition-colors">
                             <span className="block text-4xl mb-4">🔎</span>
                             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Deep Market Scan</span>
                          </div>
                          <div className="p-8 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/10 text-center hover:bg-blue-500/10 transition-colors">
                             <span className="block text-4xl mb-4">⚖️</span>
                             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Risk Assessment</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="py-24 text-center opacity-20">
        <p className="text-[11px] font-black uppercase tracking-[0.6em]">Powered by Business Developers Intelligent Core • 2024</p>
      </footer>
    </div>
  );
};
