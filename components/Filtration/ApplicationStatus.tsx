
import React from 'react';
import { FinalResult, ApplicantProfile } from '../../types';

interface ApplicationStatusProps {
  profile: ApplicantProfile;
  result: FinalResult;
  onNext: () => void;
}

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ profile, result, onNext }) => {
  const steps = [
    { id: 1, label: 'تقديم الطلب', status: 'completed', date: 'اليوم' },
    { id: 2, label: 'التحليل الذكي (AI)', status: 'completed', date: 'اليوم' },
    { id: 3, label: 'قرار لجنة القبول', status: result.isQualified ? 'completed' : 'failed', date: 'الآن' },
    { id: 4, label: 'بدء الاحتضان', status: result.isQualified ? 'pending' : 'locked', date: '-' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center font-sans">
      <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">حالة الطلب</h2>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">تتبع طلب ريادة الأعمال الخاص بك</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 block mb-1">رقم المرجع</span>
            <span className="font-mono text-blue-400">BD-{Math.floor(1000 + Math.random() * 9000)}</span>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Progress Tracker */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2"></div>
            <div className="flex justify-between relative">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500
                    ${step.status === 'completed' ? 'bg-blue-600 border-white text-white shadow-lg' : 
                      step.status === 'failed' ? 'bg-red-500 border-white text-white' :
                      step.status === 'locked' ? 'bg-gray-100 border-white text-gray-300' : 'bg-white border-blue-100 text-blue-600'}
                  `}>
                    {step.status === 'completed' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : step.status === 'failed' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <span className="text-xs font-bold">{step.id}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] font-black whitespace-nowrap ${step.status === 'completed' ? 'text-blue-700' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[8px] text-slate-300 font-bold">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3
                ${result.isQualified ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
              `}>
                {result.isQualified ? '✅' : '❌'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {result.isQualified ? 'تم قبول طلبك مبدئياً' : 'نعتذر عن عدم قبول الطلب حالياً'}
                </h3>
                <p className="text-slate-500 text-sm">بناءً على نتائج التقييم الشامل</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center py-3 border-b border-slate-200">
                 <span className="text-sm text-slate-500 font-bold">المتقدم:</span>
                 <span className="text-sm text-slate-900 font-black">{profile.codeName}</span>
               </div>
               <div className="flex justify-between items-center py-3 border-b border-slate-200">
                 <span className="text-sm text-slate-500 font-bold">نتيجة الاختبار:</span>
                 <span className={`text-sm font-black ${result.score >= 65 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.score}/100
                 </span>
               </div>
               <div className="flex justify-between items-center py-3">
                 <span className="text-sm text-slate-500 font-bold">القرار:</span>
                 <span className={`text-sm font-black px-3 py-1 rounded-full ${result.isQualified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {result.isQualified ? 'مؤهل' : 'يحتاج تطوير'}
                 </span>
               </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={onNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{result.isQualified ? 'عرض التقرير النهائي' : 'عرض خطة التحسين'}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            تم تحليل هذا الطلب بواسطة Business Developers AI Engine
          </p>
        </div>
      </div>
    </div>
  );
};
