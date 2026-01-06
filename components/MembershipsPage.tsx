
import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface MembershipsPageProps {
  onBack: () => void;
  onSelect: (pkgName: string) => void;
}

interface Package {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  gradient: string;
  btnText: string;
  icon: string;
  suitability: {
    community: 'High' | 'Medium' | 'Basic';
    execution: 'High' | 'Medium' | 'None';
    partnerships: 'Full' | 'Limited' | 'None';
    growth: 'Priority' | 'Standard' | 'Standard';
  }
}

const PACKAGES: Package[] = [
  {
    id: 'startup',
    title: 'باقة الانضمام الأساسي',
    subtitle: 'Startup Entry',
    price: '199',
    period: 'ريال / شهر',
    icon: '🟦',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-400',
    btnText: 'انضم كشريك ناشئ',
    features: [
      'الوصول لمجتمع الأعمال الرقمي',
      'محتوى تدريبي أساسي',
      'حضور الندوات العامة',
      'فرص التعارف مع الزملاء'
    ],
    suitability: {
      community: 'Basic',
      execution: 'None',
      partnerships: 'None',
      growth: 'Standard'
    }
  },
  {
    id: 'growth',
    title: 'باقة النمو التنفيذية',
    subtitle: 'Growth Membership',
    price: '399',
    period: 'ريال / شهر',
    icon: '🟩',
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-400',
    btnText: 'تفعيل عضوية النمو',
    features: [
      'جلسات إرشاد شهرية',
      'خصومات على خدمات التنفيذ',
      'أولوية في الشراكات التقنية',
      'تقارير نمو دورية'
    ],
    suitability: {
      community: 'Medium',
      execution: 'Medium',
      partnerships: 'Limited',
      growth: 'Standard'
    }
  },
  {
    id: 'premium',
    title: 'الباقة المتكاملة (Pro)',
    subtitle: 'Elite Acceleration',
    price: '999',
    period: 'ريال / شهر',
    icon: '💎',
    color: 'indigo',
    gradient: 'from-indigo-600 to-blue-700',
    btnText: 'انضم للنخبة',
    features: [
      'وصول كامل لمجتمع المستثمرين',
      'دعم تنفيذي مباشر (SLA)',
      'شراكات استراتيجية مفعلة',
      'أولوية قصوى في فرص النمو'
    ],
    suitability: {
      community: 'High',
      execution: 'High',
      partnerships: 'Full',
      growth: 'Priority'
    }
  }
];

export const MembershipsPage: React.FC<MembershipsPageProps> = ({ onBack, onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100" dir="rtl">
      <style>{`
        .pricing-card { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .pricing-card:hover { transform: translateY(-12px); box-shadow: 0 40px 80px -20px rgba(0,0,0,0.1); }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
      `}</style>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-all active:scale-95 group">
              <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-black text-slate-900 hidden sm:block">باقات بيزنس ديفلوبرز</h1>
          </div>
          <div className="flex gap-2">
             <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">Membership v2.5</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        
        {/* Intro Branding */}
        <section className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in">
           <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter">
             Business Developers Packages
           </h2>
           <div className="flex flex-wrap justify-center gap-4 text-blue-600 font-black text-sm md:text-lg uppercase tracking-widest">
              <span>Business Community</span>
              <span className="text-slate-300">|</span>
              <span>Execution</span>
              <span className="text-slate-300">|</span>
              <span>Partnerships</span>
              <span className="text-slate-300">|</span>
              <span>Growth Opportunities</span>
           </div>
           <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
             نقدم لك منظومة متكاملة تدعم رحلتك الريادية من الفكرة إلى التوسع العالمي، اختر الباقة التي تدفع مشروعك للأمام.
           </p>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {PACKAGES.map((pkg, idx) => (
             <div key={pkg.id} className={`pricing-card bg-white p-10 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between group animate-fade-in-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-50 group-hover:scale-110 transition-transform">
                        {pkg.icon}
                      </div>
                      <div className="text-left">
                         <p className="text-3xl font-black text-slate-900">{pkg.price}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{pkg.period}</p>
                      </div>
                   </div>
                   
                   <div className="mb-10">
                      <h3 className="text-2xl font-black text-slate-900 mb-1">{pkg.title}</h3>
                      <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">{pkg.subtitle}</p>
                   </div>

                   <div className="space-y-4 mb-12">
                      {pkg.features.map((f, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <span className="text-sm font-medium text-slate-600">{f}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={() => { playPositiveSound(); onSelect(pkg.title); }}
                  className={`w-full py-5 rounded-[2rem] font-black text-sm text-white shadow-xl transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${pkg.gradient}`}
                >
                   {pkg.btnText}
                </button>
             </div>
           ))}
        </section>

        {/* Detailed Decision Table */}
        <section className="space-y-12 animate-fade-in pt-10">
           <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-slate-900">جدول مقارنة العضويات الاستراتيجي</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Strategic Comparison Matrix</p>
           </div>
           
           <div className="overflow-x-auto rounded-[3rem] border border-slate-200 shadow-2xl bg-white overflow-hidden">
              <table className="w-full text-right border-collapse">
                 <thead>
                    <tr className="bg-slate-900 text-white">
                       <th className="px-8 py-6 font-black text-sm uppercase tracking-widest border-l border-slate-800 text-right">الميزة / الباقة</th>
                       <th className="px-8 py-6 font-black text-sm uppercase tracking-widest border-l border-slate-800 text-right">Business Community</th>
                       <th className="px-8 py-6 font-black text-sm uppercase tracking-widest border-l border-slate-800 text-right">Execution</th>
                       <th className="px-8 py-6 font-black text-sm uppercase tracking-widest border-l border-slate-800 text-right">Partnerships</th>
                       <th className="px-8 py-6 font-black text-sm uppercase tracking-widest text-right">Growth Opportunities</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 font-bold text-sm">
                    {PACKAGES.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 text-slate-900 bg-slate-50/50">{pkg.title}</td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <span className={`badge-dot ${pkg.suitability.community === 'High' ? 'bg-green-500' : pkg.suitability.community === 'Medium' ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
                              <span className={pkg.suitability.community === 'High' ? 'text-green-600' : 'text-slate-500'}>
                                {pkg.suitability.community === 'High' ? 'وصول كامل' : pkg.suitability.community === 'Medium' ? 'وصول متوسط' : 'وصول أساسي'}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <span className={`badge-dot ${pkg.suitability.execution === 'High' ? 'bg-green-500' : pkg.suitability.execution === 'Medium' ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
                              <span className={pkg.suitability.execution === 'High' ? 'text-green-600' : 'text-slate-500'}>
                                {pkg.suitability.execution === 'High' ? 'دعم مباشر' : pkg.suitability.execution === 'Medium' ? 'دعم استشاري' : 'خدمة ذاتية'}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <span className={`badge-dot ${pkg.suitability.partnerships === 'Full' ? 'bg-green-500' : pkg.suitability.partnerships === 'Limited' ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
                              <span className={pkg.suitability.partnerships === 'Full' ? 'text-green-600' : 'text-slate-500'}>
                                {pkg.suitability.partnerships === 'Full' ? 'شراكات مفعلة' : pkg.suitability.partnerships === 'Limited' ? 'فرص محدودة' : 'لا تشمل'}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <span className={`badge-dot ${pkg.suitability.growth === 'Priority' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                              <span className={pkg.suitability.growth === 'Priority' ? 'text-green-600' : 'text-slate-500'}>
                                {pkg.suitability.growth === 'Priority' ? 'أولوية قصوى' : 'فرص قياسية'}
                              </span>
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

        {/* Closing CTA */}
        <section className="pb-24">
           <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
              <div className="relative z-10 space-y-10">
                 <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">جاهز لرفع مستوى مشروعك؟</h3>
                 <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">انضم إلى مجتمعنا اليوم وابدأ في تحويل التحديات إلى فرص نمو حقيقية.</p>
                 <button onClick={() => { playPositiveSound(); onBack(); }} className="px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95">العودة للرئيسية</button>
              </div>
           </div>
        </section>

      </main>

      <footer className="py-12 border-t border-slate-200 text-center bg-white/50">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Business Developers Global Network • 2024</p>
      </footer>
    </div>
  );
};
