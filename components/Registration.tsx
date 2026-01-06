
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { Language, getTranslation } from '../services/i18nService';

interface RegistrationProps {
  role?: UserRole;
  onRegister: (profile: UserProfile) => void;
  onStaffLogin?: () => void;
  lang: Language;
}

const INDUSTRY_OPTIONS = [
  { value: 'Technology', label: 'التقنية والبرمجيات' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'Ecommerce', label: 'التجارة الإلكترونية' },
  { value: 'Healthcare', label: 'الرعاية الصحية' },
  { value: 'Education', label: 'التعليم' },
  { value: 'Logistics', label: 'الخدمات اللوجستية' },
  { value: 'Industrial', label: 'القطاع الصناعي' },
  { value: 'Food', label: 'الأغذية والمشروبات' },
  { value: 'Energy', label: 'الطاقة والاستدامة' },
  { value: 'RealEstate', label: 'العقارات والإنشاءات' },
  { value: 'Media', label: 'الإعلام والترفيه' }
];

const STAGE_OPTIONS = [
  { value: 'Idea', label: 'فكرة (Idea)' },
  { value: 'Prototype', label: 'نموذج أولي (Prototype)' },
  { value: 'MVP', label: 'منتج أولي (MVP)' },
  { value: 'Traction', label: 'نمو أولي (Traction)' },
  { value: 'Growth', label: 'توسع (Growth)' },
  { value: 'InvestReady', label: 'جاهز للاستثمار (Invest Ready)' }
];

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister, onStaffLogin, lang }) => {
  const t = getTranslation(lang);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', city: '', 
    agreedToTerms: false, agreedToContract: false,
    startupName: '', startupDescription: '', industry: 'Technology',
    companyIndustry: 'Technology', startupStage: 'Idea',
    existingRoles: [], missingRoles: [], supportNeeded: [], mentorExpertise: [], mentorSectors: [],
    skills: []
  });

  const roleMeta = {
    STARTUP: { title: 'مؤسس مشروع', color: 'blue', icon: '🚀', total: 3 },
    PARTNER: { title: 'شريك استراتيجي', color: 'emerald', icon: '🤝', total: 3 },
    MENTOR: { title: 'مرشد خبير', color: 'purple', icon: '🧠', total: 3 }
  }[role] || { title: 'تسجيل', color: 'blue', icon: '🚀', total: 3 };

  const handleNext = () => { 
    if (step < roleMeta.total) {
      setStep(s => s + 1); 
      playPositiveSound(); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } else {
      onRegister(formData);
      playCelebrationSound();
    }
  };

  const inputClass = "w-full p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.8rem] outline-none focus:border-primary transition-all font-bold text-lg dark:text-white placeholder-slate-300 dark:placeholder-slate-700";
  const selectClass = "w-full p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.8rem] outline-none focus:border-primary transition-all font-bold text-lg dark:text-white appearance-none cursor-pointer";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans" dir="rtl">
      {/* Context Panel */}
      <div className="lg:w-2/5 bg-slate-900 p-12 md:p-24 flex flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="relative z-10 space-y-12">
          <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center text-5xl shadow-3xl transform rotate-6">
            {roleMeta.icon}
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl font-black leading-tight tracking-tighter">{roleMeta.title}</h1>
            <p className="text-slate-400 text-2xl font-medium leading-relaxed max-w-md">انضم إلى مجتمع النخبة في بيزنس ديفلوبرز وابدأ في صياغة مستقبلك اليوم.</p>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4 pt-10">
          {[...Array(roleMeta.total)].map((_, s) => (
            <div key={s} className={`h-2 rounded-full transition-all duration-700 ${step > s ? 'w-16 bg-primary' : 'w-4 bg-white/10'}`}></div>
          ))}
        </div>
      </div>

      {/* Form Panel */}
      <main className="flex-1 flex items-center justify-center p-8 md:p-20 overflow-y-auto">
        <div className="max-w-xl w-full space-y-12 animate-fade-up">
           <header className="space-y-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Step 0{step} of 0{roleMeta.total}</span>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                {step === 1 ? 'فلنبدأ بالتعارف' : step === 2 ? 'بيانات المشروع' : 'تأكيد التسجيل'}
              </h2>
           </header>

           <div className="space-y-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <input className={inputClass} placeholder="الاسم الأول" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    <input className={inputClass} placeholder="اللقب" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <input className={inputClass} placeholder="البريد الإلكتروني الرسمي" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input className={inputClass} placeholder="رقم الجوال" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                   <input className={inputClass} placeholder="اسم المشروع الناشئ" value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} />
                   <textarea className={`${inputClass} h-32 resize-none`} placeholder="وصف مختصر للفكرة" value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} />
                   
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">قطاع الشركة</label>
                     <div className="relative">
                        <select className={selectClass} value={formData.companyIndustry} onChange={e => setFormData({...formData, companyIndustry: e.target.value})}>
                          {INDUSTRY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">مرحلة المشروع الحالية</label>
                     <div className="relative">
                        <select className={selectClass} value={formData.startupStage} onChange={e => setFormData({...formData, startupStage: e.target.value})}>
                          {STAGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">▼</div>
                     </div>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
                      <span className="font-bold text-slate-500">الاسم:</span>
                      <span className="font-black text-slate-900 dark:text-white">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
                      <span className="font-bold text-slate-500">المشروع:</span>
                      <span className="font-black text-slate-900 dark:text-white">{formData.startupName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
                      <span className="font-bold text-slate-500">القطاع:</span>
                      <span className="font-black text-primary">{INDUSTRY_OPTIONS.find(o => o.value === formData.companyIndustry)?.label}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">المرحلة:</span>
                      <span className="font-black text-primary">{STAGE_OPTIONS.find(o => o.value === formData.startupStage)?.label}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <input type="checkbox" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} className="w-6 h-6 rounded-lg accent-primary" />
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">أوافق على سياسة الخصوصية وشروط الاستخدام</span>
                    </label>
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleNext} 
                disabled={step === 3 && !formData.agreedToTerms}
                className="w-full py-7 bg-primary text-white rounded-[2.2rem] font-black text-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-50"
              >
                <span>{step === roleMeta.total ? 'إتمام التسجيل' : 'المتابعة للمرحلة التالية'}</span>
                <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
           </div>
           
           <div className="text-center">
              <button onClick={onStaffLogin} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Central Administration Portal</button>
           </div>
        </div>
      </main>
    </div>
  );
};
