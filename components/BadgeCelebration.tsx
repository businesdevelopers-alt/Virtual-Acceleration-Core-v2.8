
import React from 'react';
import { Badge, UserProfile } from '../types';

interface BadgeCelebrationProps {
  badge: Badge;
  user: UserProfile;
  onClose: () => void;
}

export const BadgeCelebration: React.FC<BadgeCelebrationProps> = ({ badge, user, onClose }) => {
  const shareText = encodeURIComponent(`الحمد لله! حصلت اليوم على وسام "${badge.name}" من مسرعة "بيزنس ديفلوبرز" بعد اجتياز محطة ${badge.description} لمشروعي "${user.startupName}". #ريادة_أعمال #بيزنس_ديفلوبرز`);
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://bizdev-accelerator.ai')}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-[4rem] shadow-3xl overflow-hidden animate-fade-in-up">
        <div className={`h-40 bg-gradient-to-br ${badge.color} flex items-center justify-center relative`}>
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
           <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-7xl shadow-2xl border border-white/30 animate-bounce">
              {badge.icon}
           </div>
        </div>

        <div className="p-10 text-center space-y-8">
           <div className="space-y-2">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">إنجاز جديد محقق</span>
              <h2 className="text-3xl font-black text-slate-900">وسام: {badge.name}</h2>
              <p className="text-slate-500 font-medium leading-relaxed">{badge.description}</p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all active:scale-95"
              >
                <span>مشاركة X</span>
                <span className="text-lg">𝕏</span>
              </a>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-blue-700 text-white rounded-2xl font-black text-xs hover:bg-blue-800 transition-all active:scale-95"
              >
                <span>مشاركة LinkedIn</span>
                <span className="text-lg">in</span>
              </a>
           </div>

           <button 
            onClick={onClose}
            className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
           >
             العودة للمسار التدريبي
           </button>
        </div>
      </div>
    </div>
  );
};
