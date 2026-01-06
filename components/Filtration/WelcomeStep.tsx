
import React, { useState, useEffect } from 'react';
import { ApplicantProfile, ProjectStageType, TechLevelType, SECTORS } from '../../types';

interface WelcomeStepProps {
  onNext: (profile: ApplicantProfile) => void;
  onAdminLogin: () => void;
}

const QUOTES = [
  "الابتكار هو ما يميز القائد عن التابع.",
  "أفضل طريقة للتنبؤ بالمستقبل هي ابتكاره.",
  "الأفكار العظيمة تبدأ بخطوات بسيطة وذكية."
];

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onAdminLogin }) => {
  const [profile, setProfile] = useState<ApplicantProfile>({
    codeName: '',
    projectStage: 'Idea',
    sector: 'Tech',
    goal: '',
    techLevel: 'Medium'
  });
  
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.codeName.trim()) {
      onNext(profile);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Side: Visual Inspiration (Split Screen) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 opacity-90"></div>
        
        {/* Animated Mesh Gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/20 shadow-2xl transform -rotate-6">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">بيزنس ديفلوبرز</h2>
          <div className="h-px w-24 bg-blue-500 mx-auto mb-8 opacity-50"></div>
          <p className="text-xl text-blue-100 font-medium italic animate-fade-in" key={quoteIndex}>
            "{QUOTES[quoteIndex]}"
          </p>
          
          <div className="mt-16 grid grid-cols-3 gap-8">
             <div className="text-center">
               <p className="text-2xl font-black text-white">100+</p>
               <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">مشروع محتضن</p>
             </div>
             <div className="text-center">
               <p className="text-2xl font-black text-white">AI</p>
               <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">توجيه ذكي</p>
             </div>
             <div className="text-center">
               <p className="text-2xl font-black text-white">24/7</p>
               <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">دعم فني</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50 overflow-y-auto">
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
               Phase 01 • Onboarding
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">ابدأ رحلتك الريادية</h1>
            <p className="text-slate-500">أدخل بياناتك الأساسية لنقوم بتخصيص مسارك التدريبي.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">الاسم الرمزي أو الحقيقي</label>
              <input 
                type="text" 
                required
                placeholder="كيف تود أن نناديك؟"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                value={profile.codeName}
                onChange={e => setProfile({...profile, codeName: e.target.value})}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-3 group-focus-within:text-blue-600 transition-colors">في أي مرحلة مشروعك حالياً؟</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Idea', 'Prototype', 'Product'] as ProjectStageType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProfile({...profile, projectStage: type})}
                    className={`py-3 px-2 rounded-2xl text-xs font-black border-2 transition-all flex flex-col items-center gap-2 ${
                      profile.projectStage === type 
                      ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-500/5' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-xl">
                      {type === 'Idea' ? '💡' : type === 'Prototype' ? '🧩' : '🚀'}
                    </span>
                    {type === 'Idea' ? 'مجرد فكرة' : type === 'Prototype' ? 'نموذج أولي' : 'منتج قائم'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">قطاع العمل</label>
                  <select 
                    className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 transition-all shadow-sm font-medium"
                    value={profile.sector}
                    onChange={e => setProfile({...profile, sector: e.target.value})}
                  >
                    {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
               </div>
               <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">المستوى التقني</label>
                  <select 
                    className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 transition-all shadow-sm font-medium"
                    value={profile.techLevel}
                    onChange={e => setProfile({...profile, techLevel: e.target.value as TechLevelType})}
                  >
                    <option value="Low">مبتدئ</option>
                    <option value="Medium">متوسط</option>
                    <option value="High">متقدم</option>
                  </select>
               </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">ما هو أكبر تحدي تواجهه حالياً؟</label>
              <textarea 
                placeholder="مثال: بناء نموذج العمل، الحصول على تمويل..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:border-blue-500 outline-none transition-all shadow-sm min-h-[100px] resize-none"
                value={profile.goal}
                onChange={e => setProfile({...profile, goal: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>المتابعة لنظام الترشيح</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <button type="button" onClick={onAdminLogin} className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors text-center uppercase tracking-widest">
              بوابة الإدارة المركزية
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
