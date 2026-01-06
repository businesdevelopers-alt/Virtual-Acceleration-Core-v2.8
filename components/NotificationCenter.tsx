
import React from 'react';
import { Notification } from '../types';
import { storageService } from '../services/storageService';

interface NotificationCenterProps {
  notifications: Notification[];
  onUpdate: () => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onUpdate, onClose }) => {
  const handleRead = (id: string) => {
    storageService.markNotificationAsRead(id);
    onUpdate();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS': return '✅';
      case 'WARNING': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'WARNING': return 'text-amber-500 bg-amber-50 border-amber-100';
      default: return 'text-blue-500 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="absolute top-16 left-0 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-3xl border border-slate-200 dark:border-white/10 overflow-hidden z-[60] animate-fade-in-up text-right" dir="rtl">
      <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
         <h4 className="font-black text-slate-900 dark:text-white">الإشعارات</h4>
         <button onClick={onClose} className="text-xs text-slate-400 font-bold hover:text-slate-600 transition-colors">إغلاق</button>
      </div>
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 text-center space-y-4">
             <div className="text-4xl opacity-20">🔔</div>
             <p className="text-sm font-bold text-slate-400">لا توجد إشعارات حالياً</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-white/5">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => handleRead(n.id)}
                className={`p-5 transition-all cursor-pointer group ${n.isRead ? 'opacity-50' : 'bg-blue-600/[0.02]'}`}
              >
                 <div className="flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${getColor(n.type)} shrink-0`}>
                       {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                       <p className="font-black text-xs text-slate-900 dark:text-white leading-tight">{n.title}</p>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">{n.message}</p>
                       <p className="text-[9px] text-slate-400 font-bold mt-1">
                         {new Date(n.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-50 dark:bg-white/5 text-center">
         <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">مشاهدة الأرشيف الكامل</button>
      </div>
    </div>
  );
};
