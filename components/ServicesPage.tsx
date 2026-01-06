import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface ServicesPageProps {
  onBack: () => void;
}

const SERVICE_CATEGORIES = [
  {
    id: 'admin',
    title: 'خدمات إدارية',
    icon: '🏢',
    desc: 'تأسيس الكيانات، إدارة المكاتب الافتراضية، واستشارات الموارد البشرية المتخصصة.',
    features: ['تأسيس شركات', 'إدارة عمليات', 'استشارات HR'],
    color: 'blue'
  },
  {
    id: 'tech',
    title: 'خدمات تقنية',
    icon: '💻',
    desc: 'تطوير المواقع والتطبيقات، بناء الـ MVP، ودمج حلول الذكاء الاصطناعي المتطورة.',
    features: ['تطوير MVP', 'استشارات AI', 'بنية سحابية'],
    color: 'indigo'
  },
  {
    id: 'legal',
    title: 'خدمات قانونية',
    icon: '⚖️',
    desc: 'صياغة العقود، حماية الملكية الفكرية، وتسهيل تراخيص وزارة الاستثمار (MISA).',
    features: ['رخص MISA', 'حماية الملكية', 'صياغة عقود'],
    color: 'emerald'
  },
  {
    id: 'acc',
    title: 'خدمات محاسبية',
    icon: '📊',
    desc: 'مسك الدفاتر، تقديم إقرارات الزكاة والضريبة، وبناء النماذج المالية الاستثمارية.',
    features: ['زكاة وضريبة', 'نماذج مالية', 'مسك دفاتر'],
    color: 'rose'
  }
];

export const ServicesPage: React.FC<ServicesPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <style>{`
        .service-card { transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1); }
        .service-card:hover { transform: translateY(-10px); }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-8 py-6 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group">
            <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">مركز الخدمات المساندة</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Professional Execution Services</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* Intro */}
        <section className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
             Executive Support Core
           </div>
           <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">حلول متكاملة لنمو مشروعك</h2>
           <p className="text-slate-500 text-xl font-medium leading-relaxed">
             نوفر لك نخبة من الخبراء في المجالات الحيوية لضمان تركيزك على الرؤية، بينما نتولى نحن تفاصيل التنفيذ الاحترافي.
           </p>
        </section>

        {/* Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {SERVICE_CATEGORIES.map((service, idx) => (
             <div key={service.id} className="service-card bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="space-y-8">
                   <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
                      {service.icon}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                        {service.desc}
                      </p>
                   </div>
                   <div className="space-y-3">
                      {service.features.map(f => (
                        <div key={f} className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                           <span className="text-xs font-black text-slate-700">{f}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <button 
                  onClick={() => { playPositiveSound(); alert('سيتم تحويلك لمستشار الخدمة قريباً...'); }}
                  className="w-full mt-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
                >
                  طلب استشارة الخدمة
                </button>
             </div>
           ))}
        </section>

        {/* MISA Focus Box */}
        <section className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-3xl animate-fade-in">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h3 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">تراخيص MISA <br/> للمستثمرين الأجانب</h3>
                 <p className="text-slate-400 text-xl leading-relaxed font-medium">
                   نحن متخصصون في تسهيل رحلة المستثمر الأجنبي في المملكة، بدءاً من إصدار رخصة وزارة الاستثمار وحتى الاستقرار الكامل.
                 </p>
                 <div className="flex gap-4">
                    <button onClick={() => { playPositiveSound(); alert('فتح بوابة MISA...'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all">ابدأ الآن</button>
                    <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-black transition-all">دليل المتطلبات</button>
                 </div>
              </div>
              <div className="hidden lg:block relative">
                 <div className="w-full aspect-square bg-blue-500/5 rounded-full flex items-center justify-center border-4 border-dashed border-white/5 animate-spin-slow">
                    <div className="w-3/4 aspect-square bg-blue-600/10 rounded-full flex items-center justify-center border-2 border-white/10">
                       <span className="text-8xl">🏛️</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </main>

      <footer className="py-20 border-t border-slate-200 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900">Support Ecosystem • Business Developers • 2024</p>
      </footer>
    </div>
  );
};