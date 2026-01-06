
import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface PartnerConceptPageProps {
  onRegister: () => void;
  onBack: () => void;
}

export const PartnerConceptPage: React.FC<PartnerConceptPageProps> = ({ onRegister, onBack }) => {
  // Mock data for the "Top 10 Preview" section
  const topMatchesPreview = [
    { name: 'م. سارة المهدي', role: 'CTO / تقني', score: 98, reason: 'خبرة 12 سنة في FinTech وتوافق تام مع مرحلة الـ MVP.', tags: ['توسعية', 'هندسة نظم'] },
    { name: 'أ. فهد الكويتي', role: 'COO / تشغيلي', score: 95, reason: 'سجل حافل في تحجيم العمليات اللوجستية وتفرغ كامل.', tags: ['إدارة نمو', 'لوجستيات'] },
    { name: 'د. ليلى القاسم', role: 'CMO / تسويق', score: 92, reason: 'متخصصة في استراتيجيات Go-to-Market للأسواق الخليجية.', tags: ['B2B', 'استحواذ'] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-all duration-500" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-black/5 dark:border-white/5 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all group">
              <svg className="w-5 h-5 transform rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black dark:text-white text-slate-900 leading-none">بوابة الشريك الاستراتيجي</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Intelligent Co-Founder Matching</p>
            </div>
          </div>
          <button 
            onClick={() => { playPositiveSound(); onRegister(); }}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            التسجيل كشريك
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-32">
        
        {/* Hero Section */}
        <section className="text-center space-y-10 animate-fade-up">
          <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 dark:border-blue-500/20">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            The Logic of Synergy
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            مطابقة مبنية <br/> 
            <span className="text-blue-600">على البيانات لا الصدفة.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
            نظام "شريك" يعيد تعريف كيفية بناء الفرق التأسيسية عبر محرك مطابقة ذكي يحلل التكامل الفني والسلوكي والقطاعي لضمان نجاح الشراكة واستدامتها.
          </p>
        </section>

        {/* Algorithm Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { t: 'تكامل الأدوار (Role-Fit)', d: 'تحديد الثغرات في الفريق الحالي (مثلاً: مؤسس تسويقي يحتاج عبقرية تقنية) واقتراح المكمل المثالي.', i: '🧩' },
             { t: 'توافق المرحلة (Stage-Fit)', d: 'مطابقة الشركاء الذين يملكون الخبرة المناسبة لمرحلة المشروع الحالية (فكرة، نمو، أو استثمار).', i: '📈' },
             { t: 'خبرة المجال (Domain-Fit)', d: 'التركيز على عمق الخبرة في القطاع المستهدف (Fintech, SaaS, الخ) لتقليل منحنى التعلم.', i: '🏛️' }
           ].map((pillar, i) => (
             <div key={i} className="card-premium p-10 space-y-6 relative overflow-hidden group">
                <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">{pillar.i}</div>
                <h4 className="text-2xl font-black dark:text-white text-slate-900">{pillar.t}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{pillar.d}</p>
                <div className="absolute bottom-0 right-0 w-24 h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-all"></div>
             </div>
           ))}
        </section>

        {/* Top 10 Preview Section */}
        <section className="space-y-16 animate-fade-up">
          <div className="text-center space-y-4">
             <h3 className="text-4xl font-black dark:text-white text-slate-900">رادار النخبة (Top 10)</h3>
             <p className="text-slate-500 font-medium max-w-2xl mx-auto">محاكاة لكيفية عرض النظام لأفضل الكفاءات المختارة بناءً على نقاط المطابقة النهائية (Matching Score).</p>
          </div>

          <div className="bg-white dark:bg-slate-900/50 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden">
             <div className="p-8 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Algorithm Preview</span>
             </div>

             <div className="divide-y divide-slate-50 dark:divide-white/5">
                {topMatchesPreview.map((match, i) => (
                  <div key={i} className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-blue-600/[0.02] transition-colors group">
                     <div className="flex items-center gap-8 flex-1">
                        <div className="text-4xl font-black text-slate-200 dark:text-slate-800 tabular-nums">0{i+1}</div>
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">👤</div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h5 className="text-xl font-black dark:text-white text-slate-900">{match.name}</h5>
                              <span className="px-3 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full border border-blue-100 dark:border-blue-500/20">{match.role}</span>
                           </div>
                           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-lg">
                              <span className="text-blue-600 font-black">سبب الترشيح:</span> {match.reason}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-12 shrink-0">
                        <div className="flex gap-2">
                           {match.tags.map(tag => (
                             <span key={tag} className="text-[9px] font-black text-slate-400 uppercase tracking-tighter border border-slate-200 dark:border-white/10 px-3 py-1 rounded-lg">#{tag}</span>
                           ))}
                        </div>
                        <div className="text-center">
                           <p className="text-4xl font-black text-blue-600 tabular-nums">{match.score}%</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Scoring</p>
                        </div>
                     </div>
                  </div>
                ))}
                <div className="p-10 text-center bg-slate-50/30 dark:bg-white/[0.01]">
                   <button onClick={onRegister} className="text-blue-600 font-black text-sm hover:underline underline-offset-8">عرض بقية القائمة (Top 10) وتفعيل المطابقة الكاملة ←</button>
                </div>
             </div>
          </div>
        </section>

        {/* System Value */}
        <section className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-3xl">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <h3 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">بناء فرق <br/> لا تنكسر.</h3>
                 <p className="text-slate-400 text-xl leading-relaxed font-medium">
                   نظام الشريك ليس مجرد قاعدة بيانات، بل هو بروتوكول لضمان جودة الفرق التأسيسية قبل دخول البرنامج التدريبي المكثف.
                 </p>
                 <div className="space-y-4">
                    {[
                      'تحليل التوافق السلوكي والقيادي.',
                      'نظام تقييم الأداء خلال فترة التجربة (14 يوم).',
                      'حماية قانونية لبيانات المشروع وبروفايل الشريك.'
                    ].map((val, i) => (
                      <div key={i} className="flex gap-4 items-center">
                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                         <span className="text-lg font-bold text-slate-200">{val}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] space-y-10">
                 <div className="text-center space-y-4">
                    <h4 className="text-3xl font-black">جاهز للبدء؟</h4>
                    <p className="text-slate-400 font-medium">سجل بياناتك الآن ليقوم النظام بربطك بأفضل الفرص.</p>
                 </div>
                 <button 
                  onClick={() => { playPositiveSound(); onRegister(); }}
                  className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95"
                 >
                    سجل بصمتك كشريك الآن
                 </button>
                 <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Zero Compromise • Elite Network Only</p>
              </div>
           </div>
        </section>

      </main>

      <footer className="py-20 border-t border-black/5 dark:border-white/5 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] dark:text-white text-slate-900">Partnership Protocol • Business Developers Hub • 2024</p>
      </footer>
    </div>
  );
};
