
import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface ForeignInvestmentPageProps {
  onBack: () => void;
  onApply: () => void;
}

export const ForeignInvestmentPage: React.FC<ForeignInvestmentPageProps> = ({ onBack, onApply }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <style>{`
        .luxury-gradient { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); }
        .misa-card { transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1); }
        .misa-card:hover { transform: translateY(-10px); border-color: #2563eb; }
        .gold-accent { background: linear-gradient(135deg, #d4af37 0%, #f1d279 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}`</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all group">
            <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">بوابة الاستثمار الأجنبي</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">MISA & Premium Residency Guide</p>
          </div>
        </div>
        <button onClick={onApply} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">تحدث مع مستشار</button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="luxury-gradient py-32 px-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-0"></div>
          <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
              Invest in Saudi Arabia • Vision 2030
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
              أطلق مشروعك <br/> 
              <span className="gold-accent">بسيادة عالمية.</span>
            </h2>
            <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
              المملكة العربية السعودية تفتح أبوابها للمبتكرين العالميين. عبر رخصة MISA وبرامج الإقامة المميزة، نوفر لك البيئة الأسرع نمواً في العالم.
            </p>
          </div>
        </section>

        {/* MISA Section */}
        <section className="py-24 px-10 max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">رخصة وزارة الاستثمار (MISA)</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  هي البوابة القانونية الأولى التي تسمح للمستثمر الأجنبي بالتملك الكامل لمشروعه داخل المملكة وممارسة الأعمال التجارية بكفاءة عالية.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  { t: 'رخصة ريادة الأعمال', d: 'مخصصة للشركات الناشئة المبتكرة بمتطلبات ميسرة ودعم حكومي مكثف.' },
                  { t: 'التملك الأجنبي بنسبة 100%', d: 'لا حاجة لشريك محلي؛ مشروعك ملك لك بالكامل.' },
                  { t: 'سهولة الاستقدام', d: 'تسهيلات كبيرة في إصدار تأشيرات العمل للفريق التقني والإداري.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black shrink-0">✓</div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xl mb-1">{item.t}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl relative">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-blue-500/20">📜</div>
              <h4 className="text-2xl font-black text-slate-900 mb-8">خطوات الحصول على الرخصة:</h4>
              <div className="space-y-8 relative before:absolute before:right-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {[
                  'الحصول على شهادة قبول من مسرعة معتمدة (مثل بيزنس ديفلوبرز).',
                  'تقديم طلب عبر بوابة وزارة الاستثمار الإلكترونية.',
                  'دفع الرسوم السنوية للرخصة.',
                  'إصدار السجل التجاري الأجنبي.'
                ].map((step, i) => (
                  <div key={i} className="relative pr-12 group">
                    <div className="absolute right-0 top-1 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 text-xs font-black z-10 transition-all group-hover:bg-blue-600 group-hover:text-white">
                      {i + 1}
                    </div>
                    <p className="font-bold text-slate-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-900 py-32 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-10">
            <div className="text-center space-y-6 mb-24">
              <h3 className="text-5xl font-black tracking-tight">لماذا تستثمر في السعودية الآن؟</h3>
              <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto">الفوائد تتجاوز مجرد الرخصة القانونية؛ نحن نبني مستقبلاً لا يُنافس.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { i: '🌍', t: 'أكبر اقتصاد إقليمي', d: 'الوصول لسوق يمثل أكثر من 25% من الناتج المحلي العربي.' },
                { i: '🏛️', t: 'المناقصات الحكومية', d: 'القدرة على المنافسة في المشاريع الحكومية الكبرى (نيوم، البحر الأحمر).' },
                { i: '🛡️', t: 'حماية المستثمر', d: 'نظام تشريعي وقانوني يحمي حقوق الملكية والاستثمارات الأجنبية.' },
                { i: '💰', t: 'حوافز مالية', d: 'دخول في صناديق التمويل الحكومية والبرامج الداعمة للمنشآت.' }
              ].map((benefit, i) => (
                <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md hover:bg-white/10 transition-all">
                  <span className="text-5xl mb-8 block">{benefit.i}</span>
                  <h4 className="text-xl font-black text-blue-400 mb-4">{benefit.t}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{benefit.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Residency Section */}
        <section className="py-32 px-10 max-w-7xl mx-auto">
          <div className="bg-white rounded-[5rem] border border-slate-200 shadow-3xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-16 md:p-24 space-y-12">
              <div className="space-y-4">
                <span className="px-4 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Premium Privilege</span>
                <h3 className="text-5xl font-black text-slate-900 leading-tight">الإقامة المميزة <br/> <span className="text-blue-600">(مسار رائد الأعمال)</span></h3>
                <p className="text-slate-500 text-xl font-medium leading-relaxed">
                  احصل على مزايا "المواطن الاقتصادي" واستمتع بالاستقرار التام لتفرغ وقتك للإبداع وبناء مشروعك.
                </p>
              </div>
              <ul className="space-y-6">
                {[
                  'الإقامة بدون كفيل وحرية التنقل داخل وخارج المملكة.',
                  'تملك العقارات السكنية والتجارية والصناعية.',
                  'الاستقدام الميسر للعمالة المنزلية والمرافقين.',
                  'إمكانية الحصول على الإقامة الدائمة عند استيفاء المعايير.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start font-bold text-slate-700 text-lg">
                    <span className="text-emerald-500 text-2xl">★</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={onApply} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-all">تحقق من أهليتك للإقامة</button>
            </div>
            <div className="lg:w-1/2 bg-blue-50 p-16 md:p-24 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px]"></div>
               <div className="relative z-10 space-y-8 w-full">
                  <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-blue-100 rotate-2 hover:rotate-0 transition-transform cursor-default">
                    <p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest">Entrepreneur Eligibility</p>
                    <h5 className="text-xl font-black text-slate-900 mb-6">متطلبات مسار رائد الأعمال:</h5>
                    <div className="space-y-4">
                       <div className="flex justify-between text-sm font-bold text-slate-500 py-3 border-b border-slate-50">
                         <span>رخصة ريادة أعمال (MISA)</span>
                         <span className="text-emerald-500">مطلوبة</span>
                       </div>
                       <div className="flex justify-between text-sm font-bold text-slate-500 py-3 border-b border-slate-50">
                         <span>استثمار الحد الأدنى</span>
                         <span className="text-slate-900">400,000 ريال</span>
                       </div>
                       <div className="flex justify-between text-sm font-bold text-slate-500 py-3">
                         <span>توصية من جهة معتمدة</span>
                         <span className="text-blue-600">عبر بيزنس ديفلوبرز</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900">جاهز لنقل مشروعك للعالمية؟</h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            نحن هنا لنكون شريكك الاستراتيجي في كافة الإجراءات القانونية والتقنية لتأسيس مشروعك في السعودية.
          </p>
          <div className="flex justify-center gap-6">
            <button onClick={onApply} className="px-16 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-500/20 hover:scale-105 transition-all">ابدأ الآن</button>
            <button onClick={onBack} className="px-16 py-7 bg-white border border-slate-200 text-slate-700 rounded-[2.5rem] font-black text-2xl hover:bg-slate-50 transition-all">العودة للرئيسية</button>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-slate-200 text-center opacity-30">
        <p className="text-[11px] font-black uppercase tracking-[0.5em]">Foreign Investment Portal • Business Developers Accelerator • 2024</p>
      </footer>
    </div>
  );
};
