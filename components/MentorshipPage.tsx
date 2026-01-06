
import React, { useState, useMemo } from 'react';
import { MentorProfile, UserProfile } from '../types';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface MentorshipPageProps {
  user?: UserProfile;
  onBack: () => void;
}

const SPECIALTIES = [
  { id: 'all', label: 'الكل', icon: '🎯' },
  { id: 'Tech', label: 'تقني', icon: '💻' },
  { id: 'Finance', label: 'مالي', icon: '💰' },
  { id: 'Growth', label: 'نمو وتسويق', icon: '📈' },
  { id: 'Legal', label: 'قانوني', icon: '⚖️' },
  { id: 'Strategy', label: 'استراتيجية', icon: '🧩' },
];

const MOCK_MENTORS: MentorProfile[] = [
  {
    id: 'm1',
    name: 'د. خالد العمري',
    role: 'خبير نمو الشركات الناشئة',
    company: 'GrowthOps Global',
    specialty: 'Growth',
    bio: 'أكثر من ١٥ عاماً في مساعدة الشركات الناشئة على التوسع في الأسواق الخليجية وجذب الاستثمارات العالمية. خبير في استراتيجيات Go-to-Market وبناء مسارات الجذب (Traction). ساهم في نضج أكثر من ٢٠ شركة تقنية في المنطقة.',
    experience: 15,
    avatar: '👨‍💼',
    rating: 4.9,
    tags: ['التوسع', 'التسويق الرقمي', 'SaaS']
  },
  {
    id: 'm2',
    name: 'م. سارة القحطاني',
    role: 'كبير مهندسي البرمجيات',
    company: 'TechFlow',
    specialty: 'Tech',
    bio: 'متخصصة في بناء البنية التحتية القابلة للتوسع وتطوير المنتجات الأولية (MVP) باستخدام أحدث تقنيات الـ AI. تملك خبرة واسعة في بنية السحابة (Cloud Architecture) وإدارة الفرق التقنية الرشيقة.',
    experience: 10,
    avatar: '👩‍💻',
    rating: 4.8,
    tags: ['Cloud', 'AI', 'Full Stack']
  },
  {
    id: 'm3',
    name: 'أ. فهد السديري',
    role: 'مستشار مالي واستثماري',
    company: 'Capital Bridges',
    specialty: 'Finance',
    bio: 'ساعدت أكثر من ٥٠ شركة ناشئة في إغلاق جولات تمويلية ناجحة (Seed & Series A). خبير في التقييم المالي، النمذجة المالية، وإعداد ملفات المستثمرين باحترافية عالية.',
    experience: 12,
    avatar: '🏦',
    rating: 5.0,
    tags: ['VC', 'Valuation', 'Fintech']
  },
  {
    id: 'm4',
    name: 'أ. نورة التميمي',
    role: 'مستشارة قانونية ريادية',
    company: 'Legalize Hub',
    specialty: 'Legal',
    bio: 'خبيرة في هيكلة الشركات الناشئة، اتفاقيات المساهمين، وحماية الملكية الفكرية. تملك باعاً طويلاً في حل النزاعات التأسيسية وضمان الامتثال للأنظمة المحلية والدولية.',
    experience: 8,
    avatar: '👩‍⚖️',
    rating: 4.7,
    tags: ['IP', 'Contracts', 'Compliance']
  },
  {
    id: 'm5',
    name: 'م. عمر بن علي',
    role: 'محلل استراتيجيات أعمال',
    company: 'Vision Strategy',
    specialty: 'Strategy',
    bio: 'شغوف بمساعدة المؤسسين على بناء نماذج عمل مستدامة وتحديد الميزة التنافسية في الأسواق المزدحمة. تخصص في منهجيات Lean Startup والتحول الرقمي للشركات التقليدية.',
    experience: 9,
    avatar: '🧩',
    rating: 4.8,
    tags: ['Lean Startup', 'BMC', 'Pivot']
  }
];

export const MentorshipPage: React.FC<MentorshipPageProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'register'>('browse');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [detailedMentor, setDetailedMentor] = useState<MentorProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [mentorFormData, setMentorFormData] = useState({
    name: '',
    role: '',
    specialty: 'Strategy',
    bio: '',
    linkedin: ''
  });

  const filteredMentors = useMemo(() => {
    return MOCK_MENTORS.filter(mentor => {
      const matchSpecialty = filterSpecialty === 'all' || mentor.specialty === filterSpecialty;
      const matchSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mentor.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSpecialty && matchSearch;
    });
  }, [filterSpecialty, searchQuery]);

  const handleMentorRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      playCelebrationSound();
      alert('تم استلام طلبك للانضمام كمرشد بنجاح. سيقوم فريقنا بمراجعته والتواصل معك.');
      setIsSubmitting(false);
      setActiveTab('browse');
    }, 1500);
  };

  const handleMentorshipRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      playPositiveSound();
      alert(`تم إرسال طلب الإرشاد لـ ${selectedMentor?.name}. سيتم الرد عليك عبر البريد الإلكتروني.`);
      setIsSubmitting(false);
      setShowRequestModal(false);
      setSelectedMentor(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <style>{`
        .mentor-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .mentor-card:hover { transform: translateY(-8px); border-color: #3b82f6; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-8 py-5 flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <button onClick={onBack} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-slate-100 group shrink-0">
            <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none">منصة الإرشاد الذكي</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Smart Mentorship Hub</p>
          </div>
        </div>

        {activeTab === 'browse' && (
          <div className="relative w-full md:w-96">
             <input 
              type="text" 
              placeholder="ابحث عن مرشد بالاسم أو الوظيفة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all text-sm font-bold"
             />
             <span className="absolute left-3 top-3 opacity-30">🔍</span>
          </div>
        )}

        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
           <button onClick={() => { setActiveTab('browse'); playPositiveSound(); }} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'browse' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>تصفح المرشدين</button>
           <button onClick={() => { setActiveTab('register'); playPositiveSound(); }} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>سجل كمرشد</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'browse' ? (
          <div className="space-y-12 animate-fade-in">
             <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  Expert Network
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">ابحث عن موجهك القادم</h2>
                <p className="text-slate-500 font-medium">نخبة من الخبراء جاهزون لنقل مشروعك إلى آفاق جديدة. اختر التخصص المناسب لتحدياتك الحالية.</p>
             </div>

             {/* Specialty Filters */}
             <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar justify-center">
                {SPECIALTIES.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => { setFilterSpecialty(s.id); playPositiveSound(); }}
                    className={`px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-3 border-2 shrink-0
                      ${filterSpecialty === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-white text-slate-500 hover:border-slate-200 shadow-sm'}
                    `}
                  >
                    <span className="text-lg">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
             </div>

             {filteredMentors.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMentors.map(mentor => (
                    <div key={mentor.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 mentor-card flex flex-col justify-between relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div>
                          <div className="flex justify-between items-start mb-6">
                             <div className="relative">
                               <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-slate-50">
                                  {mentor.avatar}
                               </div>
                               <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Verified Expert">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                               </div>
                             </div>
                             <div className="text-left">
                                <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                                   <span className="text-lg">★</span>
                                   <span>{mentor.rating.toFixed(1)}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Expert Rating</p>
                             </div>
                          </div>
                          
                          <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{mentor.name}</h3>
                          <div className="flex items-center gap-2 mb-4">
                             <p className="text-sm font-bold text-slate-600">{mentor.role}</p>
                             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                             <p className="text-xs font-black text-blue-500">{mentor.company}</p>
                          </div>
                          
                          <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3 font-medium">{mentor.bio}</p>
                          
                          <button 
                            onClick={() => { setDetailedMentor(mentor); playPositiveSound(); }}
                            className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 hover:underline flex items-center gap-2"
                          >
                             عرض المزيد من التفاصيل
                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={3} /></svg>
                          </button>
                          
                          <div className="flex flex-wrap gap-2 mb-8">
                             {mentor.tags.map(tag => (
                               <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg border border-slate-100">{tag}</span>
                             ))}
                          </div>
                       </div>

                       <button 
                        onClick={() => { setSelectedMentor(mentor); setShowRequestModal(true); playPositiveSound(); }}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
                       >
                          <span>طلب جلسة إرشادية</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                       </button>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <div className="text-6xl mb-6 opacity-20">🔎</div>
                  <h3 className="text-xl font-black text-slate-400">لم نجد مرشدين يطابقون بحثك حالياً</h3>
                  <button onClick={() => { setFilterSpecialty('all'); setSearchQuery(''); }} className="mt-4 text-blue-600 font-bold hover:underline">عرض جميع المرشدين</button>
               </div>
             )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
             <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full opacity-50 -z-0"></div>
                
                <div className="relative z-10 space-y-10">
                   <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl text-3xl">🤝</div>
                      <h2 className="text-4xl font-black text-slate-900">انضم لمجتمع مرشدينا</h2>
                      <p className="text-slate-500 font-medium leading-relaxed">شارك خبراتك، ساهم في بناء الجيل القادم من الشركات الناشئة، وكن جزءاً من قصة نجاح المبتكرين في المنطقة.</p>
                   </div>

                   <form onSubmit={handleMentorRegistration} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">الاسم الكامل</label>
                         <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" placeholder="د. محمد ..." value={mentorFormData.name} onChange={e => setMentorFormData({...mentorFormData, name: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">المسمى الوظيفي الحالي</label>
                         <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" placeholder="مثال: مدير تقني" value={mentorFormData.role} onChange={e => setMentorFormData({...mentorFormData, role: e.target.value})} required />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">التخصص الأساسي</label>
                         <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" value={mentorFormData.specialty} onChange={e => setMentorFormData({...mentorFormData, specialty: e.target.value as any})}>
                            <option value="Strategy">استراتيجية الأعمال</option>
                            <option value="Tech">التطوير التقني</option>
                            <option value="Finance">المالية والاستثمار</option>
                            <option value="Growth">النمو والتسويق</option>
                            <option value="Legal">القانون والتشريعات</option>
                         </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">نبذة مختصرة عن الخبرة</label>
                         <textarea className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium resize-none" placeholder="حدثنا عن أبرز إنجازاتك وكيف يمكنك مساعدة رواد الأعمال..." value={mentorFormData.bio} onChange={e => setMentorFormData({...mentorFormData, bio: e.target.value})} required />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">رابط LinkedIn</label>
                         <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" placeholder="https://linkedin.com/in/..." value={mentorFormData.linkedin} onChange={e => setMentorFormData({...mentorFormData, linkedin: e.target.value})} required />
                      </div>
                      
                      <div className="md:col-span-2 pt-6">
                         <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                         >
                            {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب الانضمام'}
                         </button>
                      </div>
                   </form>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Detailed Mentor Profile Modal (The "Show More" functionality) */}
      {detailedMentor && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in text-right">
           <div className="bg-white rounded-[4rem] w-full max-w-3xl shadow-3xl border border-slate-100 animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1 space-y-12">
                 <div className="flex justify-between items-start">
                    <button onClick={() => setDetailedMentor(null)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-500 transition-all active:scale-90">✕</button>
                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">Verified Mentor</div>
                          <h2 className="text-4xl font-black text-slate-900 mb-2">{detailedMentor.name}</h2>
                          <p className="text-lg font-bold text-blue-600">{detailedMentor.role} @ {detailedMentor.company}</p>
                       </div>
                       <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-7xl shadow-inner border border-slate-100 shrink-0">
                          {detailedMentor.avatar}
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                       <p className="text-2xl font-black text-slate-900">{detailedMentor.experience}+</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">سنوات الخبرة</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                       <p className="text-2xl font-black text-slate-900">{detailedMentor.rating}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">متوسط التقييم</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                       <p className="text-2xl font-black text-slate-900">{detailedMentor.specialty}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">التخصص</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                       <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                       السيرة المهنية الكاملة
                    </h3>
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                       <p className="text-xl text-slate-700 leading-relaxed font-medium">
                         {detailedMentor.bio}
                       </p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                       <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                       مجالات الإرشاد (Expertise)
                    </h3>
                    <div className="flex flex-wrap gap-4">
                       {detailedMentor.tags.map(tag => (
                         <div key={tag} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-700 font-bold text-sm shadow-sm">
                            #{tag}
                         </div>
                       ))}
                       {detailedMentor.specialty === 'Growth' && <span className="px-6 py-3 bg-blue-50 border-2 border-blue-100 text-blue-700 rounded-2xl font-bold text-sm">استراتيجيات التوسع</span>}
                       {detailedMentor.specialty === 'Tech' && <span className="px-6 py-3 bg-emerald-50 border-2 border-emerald-100 text-emerald-700 rounded-2xl font-bold text-sm">هندسة البرمجيات</span>}
                    </div>
                 </div>
              </div>
              
              <div className="p-8 md:p-12 border-t border-slate-100 bg-slate-50 flex gap-6">
                 <button onClick={() => setDetailedMentor(null)} className="flex-1 py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all">إغلاق الملف</button>
                 <button 
                  onClick={() => { setDetailedMentor(null); setSelectedMentor(detailedMentor); setShowRequestModal(true); playPositiveSound(); }} 
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
                 >
                    حجز جلسة إرشادية الآن 🚀
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Mentorship Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in text-right">
           <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl border border-slate-100 animate-fade-in-up overflow-hidden">
              <div className="p-8 md:p-12 space-y-8">
                 <div className="flex justify-between items-start">
                    <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">✕</button>
                    <div className="flex items-center gap-4">
                       <div className="text-right">
                          <h3 className="text-xl font-black text-slate-900">طلب جلسة مع {selectedMentor.name}</h3>
                          <p className="text-xs font-bold text-blue-600">{selectedMentor.role}</p>
                       </div>
                       <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl shadow-inner border border-slate-100">
                          {selectedMentor.avatar}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">عنوان التحدي / الجلسة</label>
                       <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" placeholder="مثال: تحسين نموذج الربح" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">اشرح ما تحتاجه بدقة</label>
                       <textarea className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-medium resize-none" placeholder="نواجه تحديات في ..." required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">الوقت المفضل (تقريبي)</label>
                       <input type="datetime-local" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" />
                    </div>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button onClick={() => setShowRequestModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">إلغاء</button>
                    <button 
                      onClick={handleMentorshipRequest}
                      disabled={isSubmitting}
                      className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                       {isSubmitting ? 'جاري الإرسال...' : 'تأكيد طلب الجلسة'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <footer className="py-12 border-t border-slate-200 text-center bg-white/50">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Business Developers Mentorship Program • 2024</p>
      </footer>
    </div>
  );
};
