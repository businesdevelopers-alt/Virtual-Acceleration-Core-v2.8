
import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  { value: 'AI', label: 'الذكاء الاصطناعي (AI & ML)' },
  { value: 'Fintech', label: 'التقنية المالية (Fintech)' },
  { value: 'HealthTech', label: 'الرعاية الصحية (HealthTech)' },
  { value: 'CleanTech', label: 'الطاقة والاستدامة (CleanTech)' },
  { value: 'EdTech', label: 'التعليم والتدريب (EdTech)' },
  { value: 'Logistics', label: 'الخدمات اللوجستية (Logistics)' },
  { value: 'Blockchain', label: 'البلوكشين والويب ٣ (Web3)' },
  { value: 'Ecommerce', label: 'التجارة الإلكترونية (E-commerce)' },
  { value: 'Industrial', label: 'القطاع الصناعي (Industry 4.0)' },
  { value: 'AgTech', label: 'التقنيات الزراعية (AgTech)' }
];

const STAGE_OPTIONS = [
  { value: 'Idea', label: 'فكرة مصاغة (Discovery)' },
  { value: 'Prototype', label: 'نموذج أولي (Prototype)' },
  { value: 'MVP', label: 'منتج أولي (MVP Stage)' },
  { value: 'Traction', label: 'نمو أولي (Validation)' },
  { value: 'Scaling', label: 'توسع وانتشار (Scaling)' },
  { value: 'InvestReady', label: 'جاهز للاستثمار (Invest Ready)' }
];

const CITY_OPTIONS = [
  "الرياض، السعودية", "جدة، السعودية", "الدمام، السعودية", "دبي، الإمارات", "أبوظبي، الإمارات",
  "المنامة، البحرين", "الدوحة، قطر", "الكويت العاصمة، الكويت", "مسقط، عمان",
  "القاهرة، مصر", "الإسكندرية، مصر", "عمان، الأردن", "بيروت، لبنان", 
  "بغداد، العراق", "الدار البيضاء، المغرب", "تونس العاصمة، تونس", "الجزائر العاصمة، الجزائر"
];

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister, onStaffLogin, lang }) => {
  const t = getTranslation(lang);
  const [step, setStep] = useState(1);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const cityRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', city: '', 
    agreedToTerms: false, agreedToContract: false,
    startupName: '', startupDescription: '',
    industry: 'AI', startupStage: 'Idea',
    existingRoles: [], missingRoles: [], supportNeeded: [], mentorExpertise: [], mentorSectors: [],
    skills: []
  });

  const roleMeta = {
    STARTUP: { title: 'مؤسس مشروع', color: 'blue', icon: '🚀', total: 3 },
    PARTNER: { title: 'شريك استراتيجي', color: 'emerald', icon: '🤝', total: 3 },
    MENTOR: { title: 'مرشد خبير', color: 'purple', icon: '🧠', total: 3 }
  }[role] || { title: 'تسجيل', color: 'blue', icon: '🚀', total: 3 };

  const filteredCities = useMemo(() => {
    return CITY_OPTIONS.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()));
  }, [citySearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  
                  {/* Searchable City Dropdown */}
                  <div className="relative" ref={cityRef}>
                    <div 
                      onClick={() => setIsCityOpen(!isCityOpen)}
                      className={`${inputClass} flex justify-between items-center cursor-pointer ${!formData.city ? 'text-slate-300 dark:text-slate-700' : ''}`}
                    >
                      <span>{formData.city || "المدينة / الدولة"}</span>
                      <svg className={`w-5 h-5 transition-transform duration-300 ${isCityOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    
                    {isCityOpen && (
                      <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-3xl z-50 overflow-hidden animate-fade-in">
                        <div className="p-4 border-b border-slate-100 dark:border-white/5">
                           <input 
                            autoFocus
                            className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm font-bold" 
                            placeholder="ابحث عن مدينتك..." 
                            value={citySearch}
                            onChange={e => setCitySearch(e.target.value)}
                           />
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                           {filteredCities.length > 0 ? (
                             filteredCities.map(city => (
                               <button 
                                key={city}
                                onClick={() => { setFormData({...formData, city}); setIsCityOpen(false); setCitySearch(''); }}
                                className="w-full p-5 text-right hover:bg-primary hover:text-white transition-colors font-bold text-sm border-b border-slate-50 dark:border-white/5 last:border-none"
                               >
                                 {city}
                               </button>
                             ))
                           ) : (
                             <div className="p-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">لا توجد نتائج</div>
                           )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                   <input className={inputClass} placeholder="اسم المشروع الناشئ" value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} />
                   <textarea className={`${inputClass} h-32 resize-none`} placeholder="وصف مختصر للفكرة" value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} />
                   
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">قطاع الشركة</label>
                     <div className="relative">
                        <select className={selectClass} value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
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
                      <span className="font-bold text-slate-500">الموقع:</span>
                      <span className="font-black text-slate-900 dark:text-white">{formData.city}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
                      <span className="font-bold text-slate-500">المشروع:</span>
                      <span className="font-black text-slate-900 dark:text-white">{formData.startupName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-4">
                      <span className="font-bold text-slate-500">القطاع:</span>
                      <span className="font-black text-primary">{INDUSTRY_OPTIONS.find(o => o.value === formData.industry)?.label}</span>
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
                className="w-full py-7 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[2.2rem] font-black text-2xl shadow-2xl shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-50"
              >
                <span className="animate-fade-in">{step === roleMeta.total ? 'إتمام التسجيل' : 'المتابعة للمرحلة التالية'}</span>
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