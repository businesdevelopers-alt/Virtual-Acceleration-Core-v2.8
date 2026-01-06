
import React from 'react';
import { UserProfile } from '../types';
import { playPositiveSound } from '../services/audioService';

interface DocumentsPortalProps {
  user: UserProfile;
  progress: number;
  onShowCertificate: () => void;
}

export const DocumentsPortal: React.FC<DocumentsPortalProps> = ({ user, progress, onShowCertificate }) => {
  const isCompleted = progress >= 100;

  const handleDownloadPDF = (docName: string) => {
    playPositiveSound();
    // Simulate generation and download
    alert(`جاري تجهيز نسخة PDF من ${docName}...`);
    window.print(); 
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-up pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. Incubation Contract */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-600 transition-all">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform">📄</div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">عقد الاحتضان</h3>
              <p className="text-slate-400 text-sm font-medium mt-2">اتفاقية تقديم خدمات التسريع الرقمية المعتمدة.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                 <span>حالة العقد</span>
                 <span className="text-emerald-500">موقع رقمياً</span>
               </div>
               <p className="text-xs font-bold text-slate-700">تاريخ التوقيع: {new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
          <button 
            onClick={() => handleDownloadPDF('عقد الاحتضان')}
            className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>تحميل العقد PDF</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2.5} /></svg>
          </button>
        </div>

        {/* 2. MISA Support Letter */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-emerald-600 transition-all">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform">📜</div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">خطاب دعم الاستثمار</h3>
              <p className="text-slate-400 text-sm font-medium mt-2">موجّه لوزارة الاستثمار (MISA) لتسهيل استخراج التراخيص.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">الغرض من الخطاب:</p>
               <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"توصية رسمية بانضمام الشركة لبرنامج بيزنس ديفلوبرز المعتمد لرواد الأعمال."</p>
            </div>
          </div>
          <button 
            onClick={() => handleDownloadPDF('خطاب دعم الاستثمار')}
            className="w-full mt-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>طلب رخصة الاستثمار</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2.5} /></svg>
          </button>
        </div>

        {/* 3. Program Completion Certificate */}
        <div className={`p-10 rounded-[3rem] border shadow-sm flex flex-col justify-between group transition-all
          ${isCompleted ? 'bg-white border-slate-100 hover:border-blue-600' : 'bg-slate-50 border-slate-200 opacity-60 grayscale'}
        `}>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform">🎓</div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">شهادة إتمام البرنامج</h3>
              <p className="text-slate-400 text-sm font-medium mt-2">تُمنح بعد إنهاء كافة مراحل التسريع وتدقيق المخرجات.</p>
            </div>
            {!isCompleted && (
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">المتبقي للتخرج</p>
                 <div className="w-full bg-blue-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${progress}%` }}></div>
                 </div>
                 <p className="text-[9px] font-bold text-blue-500 mt-2">أكمل خارطة الطريق لتفعيل الشهادة.</p>
              </div>
            )}
          </div>
          <button 
            disabled={!isCompleted}
            onClick={onShowCertificate}
            className={`w-full mt-8 py-4 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2
              ${isCompleted ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            <span>عرض الشهادة الرسمية</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2.5} /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2.5} /></svg>
          </button>
        </div>

      </div>
    </div>
  );
};
