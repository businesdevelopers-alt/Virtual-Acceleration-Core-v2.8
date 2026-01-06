
import React from 'react';
import { Language, getTranslation } from '../services/i18nService';
import { LanguageSwitcher } from './LanguageSwitcher';

interface FooterProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onIncubation: () => void;
  onPartnerConcept: () => void;
  onMentorship: () => void;
  onTools: () => void;
  onRoadmap: () => void;
  onAIMentorConcept: () => void;
  onLogin: () => void;
  onStart: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onLanguageChange,
  onIncubation,
  onPartnerConcept,
  onMentorship,
  onTools,
  onRoadmap,
  onAIMentorConcept,
  onLogin,
  onStart
}) => {
  const t = getTranslation(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-black/[0.03] dark:border-white/[0.03] bg-transparent backdrop-blur-[2px] pt-32 pb-12 px-8 overflow-hidden" dir={t.dir}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 lg:gap-48 mb-24">
          
          {/* Column 1: Identity - Premium & Minimal */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 transition-transform group-hover:rotate-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6 text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight uppercase dark:text-white text-slate-900 leading-none">{t.brand}</span>
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-2">Virtual Accelerator</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 leading-relaxed max-w-[260px] uppercase tracking-wider">
              An ecosystem crafted for elite founders, strategic partners, and professional mentors.
            </p>
          </div>

          {/* Column 2: Strategic Navigation - Direct Links */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 border-b border-black/[0.02] dark:border-white/[0.02] pb-4 w-fit">
              Navigation
            </h4>
            <ul className="flex flex-col gap-y-5">
              <li><button onClick={onIncubation} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors duration-300">شركة محتضنة</button></li>
              <li><button onClick={onPartnerConcept} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors duration-300">شركاء</button></li>
              <li><button onClick={onMentorship} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors duration-300">مرشد</button></li>
              <li><button onClick={onTools} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors duration-300">الأدوات</button></li>
              <li><button onClick={onRoadmap} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors duration-300">الخارطة</button></li>
              <li>
                <button onClick={onAIMentorConcept} className="text-sm font-black text-blue-600/70 hover:text-blue-600 transition-all flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
                  الموجه الذكي
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Access & Portals - Utility */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 border-b border-black/[0.02] dark:border-white/[0.02] pb-4 w-fit">
              Gateways
            </h4>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <button onClick={onLogin} className="text-sm font-black dark:text-white text-slate-900 hover:text-blue-600 transition-colors w-fit">دخول</button>
                <button onClick={onStart} className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors w-fit">ابدأ مجاناً</button>
              </div>
              
              <div className="pt-8 border-t border-black/[0.03] dark:border-white/[0.03] space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest block">تسجيل حسب الدور</span>
                  <div className="flex flex-wrap gap-x-5 gap-y-3">
                    <button onClick={onIncubation} className="text-[10px] font-black text-slate-500 hover:text-blue-500 uppercase tracking-tighter">شركة محتضنة</button>
                    <button onClick={onPartnerConcept} className="text-[10px] font-black text-slate-500 hover:text-blue-500 uppercase tracking-tighter">شريك</button>
                    <button onClick={onMentorship} className="text-[10px] font-black text-slate-500 hover:text-blue-500 uppercase tracking-tighter">مرشد</button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} variant="minimal" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Signature - One Single Elegant Line */}
        <div className="pt-10 border-t border-black/[0.03] dark:border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <div className="flex items-center gap-4">
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">© {currentYear} Business Developers</p>
             <div className="w-1 h-1 rounded-full bg-slate-400"></div>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Built with purpose</p>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Virtual Accelerator Platform</p>
        </div>
      </div>
    </footer>
  );
};
