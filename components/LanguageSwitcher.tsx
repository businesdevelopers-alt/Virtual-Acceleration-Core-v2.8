
import React from 'react';
import { Language } from '../services/i18nService';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'minimal' | 'full';
}

const LANGUAGES = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' }
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange, variant = 'full' }) => {
  return (
    <div className="flex items-center gap-2">
      {variant === 'full' ? (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code as Language)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                currentLang === lang.code 
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className="mr-1">{lang.flag}</span>
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      ) : (
        <select 
          value={currentLang} 
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-transparent text-xs font-bold border-none outline-none cursor-pointer text-slate-500 hover:text-blue-600 transition-colors"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code} className="text-slate-900">{l.flag} {l.label}</option>
          ))}
        </select>
      )}
    </div>
  );
};
