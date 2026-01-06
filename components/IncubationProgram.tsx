
import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface IncubationProgramProps {
  onBack: () => void;
  onApply: () => void;
}

export const IncubationProgram: React.FC<IncubationProgramProps> = ({ onBack, onApply }) => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900" dir="rtl">
      <style>{`
        .glass-depth { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(226, 232, 240, 0.5); }
        .hero-gradient { background: radial-gradient(circle at 0% 0%, #f0f9ff 0%, transparent 50%), radial-gradient(circle at 100% 100%, #eef2ff 0%, transparent 50%); }
        .principle-card { transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
        .principle-card:hover { transform: translateY(-12px); box-shadow: 0 40px 80px -15px rgba(0,0,0,0.08); }
        .timeline-gradient { background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%); }
      `}</style>

      {/* Premium Navigation */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <button onClick={onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-95 group">
              <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="hidden md:block">
               <h1 className="text-xl font-black text-slate-900 tracking-tighter">برنامج الاحتضان والتسريع</h1>
               <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Professional Incubation Protocol</p>
            </div>
          </div>
          <button onClick={() => { playPositiveSound(); onApply(); }} className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">قدم الآن</button>
        </div>
      </header>

      <main className="hero-gradient">
        
        {/* Dynamic Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-40 text-center space-y-12 animate-fade-in">
           <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-blue-100 shadow-sm">
             <span className="animate-pulse">●</span> Global Standard Accelerator
           </div>
           <h2 className="text-6xl md:text-9xl font-black text-slate-900 leading-[1] tracking-tighter">
             القيمة تُبنى. <br/> 
             <span className="text-blue-600">النتائج تُموَّل.</span>
           </h2>
           <p className="text-slate-500 text-xl md:text-3xl max-w-4xl mx-auto leading-relaxed font-medium px-4">
             حاضنة افتراضية رائدة تنقل مشروعك من "مجرد فكرة" إلى "منتج جاهز للسوق"، ببرنامج احتضان مجاني مكثف يركز على الجدية، التنفيذ، والجاهزية للاستثمار.
           </p>
           <div className="pt-8">
              <button onClick={onApply} className="px-16 py-7 bg-slate-900 text-white text-2xl font-black rounded-[2.5rem] shadow-2xl hover:scale-105 transition-all">ابدأ رحلة البناء</button>
           </div>
        </section>

        {/* Core Philosophy Section */}
        <section className="bg-white py-32 border-y border-slate-50">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
             <div className="text-center space-y-6">
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">فلسفة الاحتضان لدينا</h3>
                <p className="text-slate-500 text-xl font-medium">لماذا اخترنا أن يكون برنامجنا متاحاً للجادين مجاناً؟</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { title: 'اختبار الفرضيات أولاً', desc: 'نؤمن أن الأفكار يجب أن تُختبر في الواقع وتُصقل قبل أن تُطلب لها الاستثمارات الضخمة.', icon: '🧪' },
                  { title: 'استثمار الوقت والالتزام', desc: 'العملة الحقيقية لدينا هي التزامك؛ نحن نستثمر خبراتنا في رائد الأعمال الذي يملك الانضباط.', icon: '⌛' },
                  { title: 'بناء القيمة الملموسة', desc: 'هدفنا هو الخروج بمنتج وظيفي (MVP) وخارطة طريق واضحة، وليس مجرد تدريب نظري.', icon: '🏗️' }
                ].map((item, i) => (
                  <div key={i} className="principle-card p-12 rounded-[4rem] bg-slate-50 border border-slate-100 flex flex-col gap-8 group">
                     <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-5xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        {item.icon}
                     </div>
                     <h4 className="text-2xl font-black text-slate-900">{item.title}</h4>
                     <p className="text-slate-500 text-lg leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Detailed Curriculum Section */}
        <section className="py-40 bg-slate-50/50">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-12">
                 <div className="space-y-6">
                    <h3 className="text-5xl font-black text-slate-900 tracking-tight">بروتوكول الـ 8 أسابيع</h3>
                    <p className="text-slate-500 text-xl leading-relaxed font-medium">منهجية عمل احترافية تضمن نضج مشروعك في وقت قياسي عبر مخرجات محددة لكل مرحلة.</p>
                 </div>
                 <div className="space-y-6">
                    {[
                      'تقييم استراتيجي متكامل لفكرة المشروع ونموذج العمل.',
                      'هيكلة السوق المستهدف وتحديد ملف العميل المثالي.',
                      'بناء خارطة طريق تقنية وتنفيذية للمنتج الأولي (MVP).',
                      'جلسات إرشاد أسبوعية وجهاً لوجه (افتراضياً) مع خبراء.',
                      'مراجعات نقدية واقعية لمخرجات التنفيذ الأسبوعية.',
                      'يوم العرض النهائي وقرار المسار (نمو - تسريع - إعادة تهيئة).'
                    ].map((text, i) => (
                      <div key={i} className="flex items-start gap-5 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                         <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-1 shadow-lg shadow-blue-200">✓</div>
                         <p className="font-bold text-slate-700 text-lg">{text}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-8 bg-blue-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px]"></div>
                    <p className="text-xl font-bold leading-relaxed relative z-10">البرنامج مجاني بالكامل للشركات المختارة، بدون رسوم خفية أو نسبة من الملكية في مرحلة الاحتضان.</p>
                 </div>
              </div>
              
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-400 rounded-full blur-[120px] opacity-10"></div>
                 <div className="glass-depth p-12 md:p-16 rounded-[5rem] shadow-2xl space-y-12 relative z-10 border-white">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-3xl font-black text-slate-900">المخطط الزمني</h4>
                       <span className="px-4 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">Protocol 1.0</span>
                    </div>
                    <div className="space-y-12 relative before:absolute before:right-4 before:top-2 before:bottom-2 before:w-1 before:bg-slate-100">
                       {[
                         { week: '1-2', title: 'التثبت والتحقق الاستراتيجي', desc: 'تحليل المشكلة، الجدوى، والتحقق الميداني من احتياج السوق.' },
                         { week: '3-4', title: 'هيكلة القيمة ونموذج الربح', desc: 'تصميم BMC احترافي وتحديد قنوات الوصول للعملاء.' },
                         { week: '5-6', title: 'هندسة المنتج والـ MVP', desc: 'رسم رحلة المستخدم وتحديد المزايا الجوهرية للإطلاق.' },
                         { week: '7-8', title: 'يوم العرض والقرار النهائي', desc: 'تقييم الجاهزية وتحديد مسار التخرج أو التسريع.' }
                       ].map((step, i) => (
                         <div key={i} className="relative pr-14 group">
                            <div className="absolute right-0 top-1 w-9 h-9 timeline-gradient rounded-full flex items-center justify-center text-white text-xs font-black z-10 shadow-xl border-4 border-white group-hover:scale-110 transition-transform"></div>
                            <h5 className="font-black text-blue-600 text-sm mb-1 uppercase tracking-widest">أسبوع {step.week}</h5>
                            <p className="font-black text-slate-900 text-xl mb-2">{step.title}</p>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Elite Selection Criteria */}
        <section className="bg-slate-900 py-40 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
           
           <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                 <h3 className="text-5xl md:text-7xl font-black tracking-tight">معايير القبول</h3>
                 <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed">نحن لا نبحث عن الكثير من المشاريع، بل نبحث عن "القليل الجاد" القادر على إحداث تغيير حقيقي.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { title: 'التزام حقيقي', desc: 'القدرة على تخصيص وقت كافٍ للتنفيذ الأسبوعي والالتزام بالجلسات.', icon: '🤝' },
                   { title: 'مشكلة سوقية واضحة', desc: 'حلول ذكية لمشاكل يعاني منها قطاع واسع من المستخدمين.', icon: '🔎' },
                   { title: 'قابلية التنفيذ التقني', desc: 'أفكار يمكن بناؤها وتحجيمها ضمن الموارد والخبرات المتاحة.', icon: '⚙️' },
                   { title: 'عقلية منفتحة للنمو', desc: 'الاستعداد لتلقي التوجيه، التعديل على المسار، واتخاذ القرارات الصعبة.', icon: '💡' }
                 ].map((item, i) => (
                   <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-2">
                      <div className="text-4xl mb-6">{item.icon}</div>
                      <h4 className="text-2xl font-black text-blue-400 mb-4">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                   </div>
                 ))}
              </div>

              <div className="pt-16 text-center space-y-10">
                 <div className="space-y-4">
                    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs text-center">Selection Pipeline</p>
                    <div className="flex justify-center items-center gap-4 text-sm font-bold text-slate-400">
                       <span>نموذج ترشيح</span>
                       <span className="w-4 h-px bg-slate-700"></span>
                       <span>اختبار جاهزية</span>
                       <span className="w-4 h-px bg-slate-700"></span>
                       <span>مقابلة قبول</span>
                    </div>
                 </div>
                 <button onClick={onApply} className="px-20 py-8 bg-white text-blue-900 text-2xl font-black rounded-[3rem] shadow-3xl hover:scale-105 transition-all active:scale-95">قدّم طلب الانضمام الآن</button>
                 <p className="text-slate-500 text-sm font-bold">احصل على قرار القبول المبدئي خلال ٤٨ ساعة.</p>
              </div>
           </div>
        </section>

        {/* Final Branding Statement */}
        <footer className="py-40 bg-white text-center">
           <div className="max-w-4xl mx-auto space-y-8 px-6">
              <h4 className="text-5xl md:text-8xl font-black text-slate-100 uppercase tracking-tighter select-none">No Dreams. Only Builds.</h4>
              <div className="space-y-4 relative">
                 <p className="text-slate-500 text-3xl font-bold leading-relaxed">
                   نحن لا نبيع أحلاماً ريادية.. <br/> 
                   نحن نبني مشاريع حقيقية تواجه تحديات السوق، <br/>
                   <span className="text-blue-600">ومن ينجح، ننجح معه.</span>
                 </p>
              </div>
           </div>
        </footer>

      </main>
    </div>
  );
};
