import React, { useEffect } from 'react';
import { Notification } from '../types';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getStyles = () => {
    switch (notification.type) {
      case 'SUCCESS': return 'bg-emerald-600 border-emerald-400 text-white';
      case 'WARNING': return 'bg-amber-500 border-amber-300 text-white';
      default: return 'bg-blue-600 border-blue-400 text-white';
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'SUCCESS': return '✅';
      case 'WARNING': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`p-5 rounded-[1.8rem] shadow-3xl border-4 flex items-center gap-5 transition-all animate-fade-in-down mb-3 pointer-events-auto w-full max-w-sm mx-auto ${getStyles()}`}>
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-black text-xs uppercase tracking-wider">{notification.title}</p>
        <p className="text-[10px] font-medium opacity-90 leading-relaxed mt-1">{notification.message}</p>
      </div>
      <button onClick={() => onClose(notification.id)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-xs">✕</button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: Notification[], onClose: (id: string) => void }> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[400] flex flex-col items-center w-full px-4 pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} notification={toast} onClose={onClose} />
      ))}
    </div>
  );
};