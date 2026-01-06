
import React from 'react';
import { ApplicantProfile, FinalResult } from '../../types';

interface DevelopmentPlanProps {
  profile: ApplicantProfile;
  result: FinalResult;
  onRestart: () => void;
}

export const DevelopmentPlan: React.FC<DevelopmentPlanProps> = ({ result, onRestart }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-200">
            <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">خطة التطوير الإجبارية</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg">
            درجتك النهائية ({result.score}%) كانت دون عتبة القبول. لا تقلق، هذه مجرد بداية لتحسين فكرتك وجعلها قابلة للاستثمار.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div className="bg-white p-10 rounded-[3rem] border border-red-100 shadow-xl shadow-red-500/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
             <h3 className="font-black text-red-800 mb-6 text-xl flex items-center gap-3">
               <span className="w-2 h-6 bg-red-600 rounded-full"></span>
               لماذا لم تتأهل؟
             </h3>
             <ul className="space-y-4">
               {result.metrics.tech < 50 && (
                 <li className="flex gap-4 items-start p-4 bg-red-50/50 rounded-2xl border border-red-50">
                   <span className="text-xl">❌</span>
                   <div className="space-y-1">
                      <p className="font-black text-red-900 text-sm">ضعف الجانب التقني</p>
                      <p className="text-xs text-red-700/70">الفكرة تفتقر للوضوح التقني حول كيفية بناء المنتج وتوسعه.</p>
                   </div>
                 </li>
               )}
               {result.metrics.analysis < 50 && (
                 <li className="flex gap-4 items-start p-4 bg-red-50/50 rounded-2xl border border-red-50">
                   <span className="text-xl">❌</span>
                   <div className="space-y-1">
                      <p className="font-black text-red-900 text-sm">قصور في التحليل السوقي</p>
                      <p className="text-xs text-red-700/70">لم تقدم إثباتات كافية حول حجم الطلب أو تميزك عن المنافسين.</p>
                   </div>
                 </li>
               )}
               {result.metrics.readiness < 50 && (
                 <li className="flex gap-4 items-start p-4 bg-red-50/50 rounded-2xl border border-red-50">
                   <span className="text-xl">❌</span>
                   <div className="space-y-1">
                      <p className="font-black text-red-900 text-sm">عدم نضج نموذج العمل</p>
                      <p className="text-xs text-red-700/70">طريقة تحقيق الربح غير واضحة أو غير مستدامة مالياً.</p>
                   </div>
                 </li>
               )}
               <li className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                   <span className="text-xl">⚠️</span>
                   <p className="text-xs font-bold text-slate-600">نوصي بإعادة صياغة عرض القيمة (Value Proposition) بشكل أدق.</p>
               </li>
             </ul>
           </div>

           <div className="bg-slate-900 text-white p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
             <h3 className="font-black mb-8 text-xl flex items-center gap-3">
               <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
               خارطة الطريق للإصلاح
             </h3>
             <div className="space-y-6 relative">
                <div className="absolute top-2 right-3 bottom-2 w-0.5 bg-white/10"></div>
                {[
                  { d: "يوم 1-2", t: "بحث معمق", c: "دراسة 5 منافسين وتحديد ثغراتهم." },
                  { d: "يوم 3-4", t: "تطوير الحل", c: "تبسيط المنتج والتركيز على الميزة الأساسية." },
                  { d: "يوم 5-7", t: "صياغة الأرقام", c: "توقع الإيرادات بناءً على حجم السوق المتاح." }
                ].map((step, i) => (
                  <div key={i} className="relative pr-10">
                     <div className="absolute right-0 top-0.5 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center font-black text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                       {i+1}
                     </div>
                     <h4 className="font-black text-blue-400 text-sm">{step.d}: {step.t}</h4>
                     <p className="text-[11px] text-slate-400 mt-1">{step.c}</p>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="flex flex-col items-center gap-6">
           <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 max-w-2xl text-center">
              <p className="text-amber-800 text-sm font-bold leading-relaxed">
                💡 "الفشل ليس سوى فرصة لبدء من جديد، ولكن بذكاء أكبر." - هنري فورد <br/>
                خذ وقتك في تطوير مدخلاتك ثم عد لإعادة المحاولة.
              </p>
           </div>
           <button 
             onClick={onRestart}
             className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4"
           >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             إعادة اختبار القبول الآن
           </button>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">جميع البيانات السابقة سيتم تصفيرها للبدء بفرصة جديدة</p>
        </div>
      </div>
    </div>
  );
};
