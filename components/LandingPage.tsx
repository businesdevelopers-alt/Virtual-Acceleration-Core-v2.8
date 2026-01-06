
import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from '../services/i18nService';

interface LandingPageProps {
  onStart: () => void;
  onQuickDemo: () => void;
  onPathFinder: () => void;
  onSmartFeatures: () => void;
  onGovDashboard: () => void;
  onRoadmap: () => void;
  onTools: () => void;
  onAchievements: () => void;
  onMentorship: () => void;
  onIncubation: () => void;
  onMemberships: () => void;
  onPartnerConcept: () => void;
  onAIMentorConcept: () => void;
  onForeignInvestment: () => void;
  onLegalClick: (type: 'PRIVACY' | 'TERMS' | 'CONTACT') => void;
  onLogin?: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStart, onQuickDemo, onRoadmap, onTools, onMentorship, onIncubation, 
  onMemberships, onPartnerConcept, onLogin, onAchievements,
  onAIMentorConcept,
  lang 
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-white transition-colors duration-500" dir="rtl">
      
      {/* Precision Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 ${scrolled ? 'py-4 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-6 w-6 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase leading-none">بيزنس ديفلوبرز</h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 font-bold text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
             <button onClick={onIncubation} className="hover:text-blue-600 transition-colors">عن البرنامج</button>
             <button onClick={onRoadmap} className="hover:text-blue-600 transition-colors">الخارطة</button>
             <button onClick={onTools} className="hover:text-blue-600 transition-colors">الأدوات</button>
             <button onClick={onAchievements} className="hover:text-blue-600 transition-colors">الأثر</button>
             <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
             <button onClick={onQuickDemo} className="text-blue-600 hover:text-blue-700 transition-colors underline underline-offset-4">تجربة محاكاة</button>
             <button onClick={onLogin} className="text-slate-900 dark:text-white hover:text-blue-600 transition-colors">دخول</button>
             <button onClick={onStart} className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95">ابدأ الآن</button>
          </div>
        </div>
      </nav>

      {/* Hero Section — Data & Minimal Tech Imagery */}
      <section className="pt-56 pb-40 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 animate-fade-up">
            <div className="inline-flex items-center gap-4 px-5 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-100 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              Virtual Acceleration Core v2.8
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-slate-950 dark:text-white leading-[0.95] tracking-tighter">
              ابنِ مشروعك <br/> <span className="text-blue-600">بمعايير عالمية.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              المنصة الرسمية المعتمدة لتحويل الأفكار الريادية إلى كيانات قابلة للاستثمار عبر محرك Gemini الذكي.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button onClick={onStart} className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-700 transition-all active:scale-95">ابدأ رحلة البناء</button>
              <button onClick={onQuickDemo} className="px-12 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black text-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                 <span>استكشاف كحساب تجريبي</span>
                 <span className="group-hover:translate-x-[-4px] transition-transform">✨</span>
              </button>
            </div>
            
            {/* Real Impact Counters */}
            <div className="grid grid-cols-3 gap-12 pt-16 border-t border-slate-100 dark:border-white/5">
               <div>
                  <p className="text-5xl font-black text-slate-900 dark:text-white tabular-nums">1.4K</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">رائد أعمال نشط</p>
               </div>
               <div>
                  <p className="text-5xl font-black text-slate-900 dark:text-white tabular-nums">12M$</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">تمويل مستقطب</p>
               </div>
               <div>
                  <p className="text-5xl font-black text-blue-600 tabular-nums">98%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">دقة التقييم</p>
               </div>
            </div>
          </div>

          <div className="relative group stagger-load">
             <div className="aspect-[4/5] rounded-[4rem] bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-white/10 relative shadow-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" 
                  alt="Corporate Building" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
                
                {/* Floating Insight UI */}
                <div className="absolute bottom-10 right-10 left-10 p-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20 animate-fade-up">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">🤖</div>
                      <div>
                         <p className="text-xs font-black dark:text-white text-slate-900">تحليل Gemini اللحظي</p>
                         <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Active Intelligence</p>
                      </div>
                   </div>
                   <p className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                      "النظام يرصد ارتفاعاً بنسبة ٢٤٪ في جاهزية مشاريع قطاع Fintech هذا الأسبوع."
                   </p>
                </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] -z-10"></div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section — Icons & Systematic Data */}
      <section className="py-40 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-8">
           <div className="text-center mb-24 space-y-6">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">منظومة ريادية متكاملة</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">نجمع لك كافة الأدوار التي يحتاجها مشروعك للنمو في مكان واحد.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { t: 'المؤسسون (Startups)', d: 'أدوات بناء المشروع، التحقق من الفكرة، والوصول للجاهزية.', i: '🚀', stat: '480 مشروعاً' },
                { t: 'الشركاء (Co-Founders)', d: 'نظام مطابقة ذكي يربط المهارات التقنية بالفرص الريادية.', i: '🤝', stat: '120 شريكاً معتمداً' },
                { t: 'الخبراء (Mentors)', d: 'جلسات إرشاد متخصصة بعد تخطي مرحلة التدقيق الذكي.', i: '🧠', stat: '65 مرشداً متخصصاً' }
              ].map((item, i) => (
                <div key={i} className="p-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[3.5rem] card-premium transition-all">
                  <div className="text-5xl mb-10 bg-slate-50 dark:bg-white/5 w-24 h-24 rounded-3xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">{item.i}</div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{item.t}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-12 text-lg">{item.d}</p>
                  <div className="pt-8 border-t border-slate-50 dark:border-white/5">
                     <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">{item.stat}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Global Presence Section — Modern Map & Imagery */}
      <section className="py-40 px-8">
         <div className="max-w-7xl mx-auto bg-slate-900 rounded-[5rem] overflow-hidden relative group">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
              alt="Global Office" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="relative z-10 p-16 md:p-32 text-center space-y-16">
               <h3 className="text-6xl md:text-9xl font-black text-white leading-none tracking-tighter">حضور عالمي <br/> برؤية وطنية.</h3>
               <p className="text-slate-400 text-xl md:text-3xl max-w-4xl mx-auto leading-relaxed font-medium">
                  نحن نربط مشاريعنا بشبكة تضم أكثر من ١٤ دولة، لضمان تبادل الخبرات وفتح آفاق للتوسع الإقليمي والدولي.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-8">
                  <button onClick={onStart} className="px-20 py-8 bg-white text-slate-900 text-2xl font-black rounded-[3rem] shadow-3xl hover:scale-105 transition-all active:scale-95">سجل مشروعك الآن</button>
               </div>
            </div>
         </div>
      </section>

      <footer className="py-24 border-t border-slate-100 dark:border-white/5 text-center">
         <div className="flex justify-center gap-12 mb-12 opacity-30 grayscale hover:grayscale-0 transition-all">
            {/* Mock Ecosystem Partners Logos */}
            <span className="text-xl font-black tracking-widest uppercase">MISA</span>
            <span className="text-xl font-black tracking-widest uppercase">VISION 2030</span>
            <span className="text-xl font-black tracking-widest uppercase">GEMINI</span>
            <span className="text-xl font-black tracking-widest uppercase">GOV HUB</span>
         </div>
         <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em]">Business Developers Hub • 2024</p>
      </footer>
    </div>
  );
};
