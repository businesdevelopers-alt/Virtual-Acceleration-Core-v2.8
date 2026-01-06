
import React, { useState, useEffect } from 'react';
import { PartnerProfile, StartupRecord, UserRole, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { runPartnerMatchAI } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface CoFounderPortalProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onBack: () => void;
}

export const CoFounderPortal: React.FC<CoFounderPortalProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'register' | 'algorithm'>('browse');
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  
  const [partnerForm, setPartnerForm] = useState<Partial<PartnerProfile>>({
    primaryRole: 'CTO',
    experienceYears: 5,
    availabilityHours: 20,
    commitmentType: 'Part-time',
    city: 'الرياض',
    isRemote: true,
    workStyle: 'Fast',
    goals: 'Long-term',
    bio: '',
    linkedin: ''
  });

  useEffect(() => {
    setPartners(storageService.getAllPartners());
  }, []);

  const handleMatchRequest = async () => {
    setIsMatching(true);
    playPositiveSound();
    try {
      // Simulate fetch startup data for matching
      const startups = storageService.getAllStartups();
      const currentStartup = startups.find(s => s.ownerId === user.uid);
      
      if (!currentStartup) {
        alert("يجب أن تملك مشروعاً مسجلاً لتفعيل محرك المطابقة.");
        setIsMatching(false);
        return;
      }

      const results = await runPartnerMatchAI(currentStartup, partners);
      setMatches(results);
      playCelebrationSound();
    } catch (e) {
      playErrorSound();
      console.error(e);
    } finally {
      setIsMatching(false);
    }
  };

  // Fix: Added handleRegisterPartner to process partner registration form
  const handleRegisterPartner = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: PartnerProfile = {
      uid: user.uid,
      name: user.name || `${user.firstName} ${user.lastName}`,
      email: user.email,
      primaryRole: partnerForm.primaryRole || 'CTO',
      experienceYears: partnerForm.experienceYears || 0,
      bio: partnerForm.bio || '',
      linkedin: partnerForm.linkedin || '',
      skills: [],
      availabilityHours: partnerForm.availabilityHours || 20,
      commitmentType: partnerForm.commitmentType || 'Part-time',
      city: partnerForm.city || 'الرياض',
      isRemote: partnerForm.isRemote ?? true,
      workStyle: partnerForm.workStyle || 'Fast',
      goals: partnerForm.goals || 'Long-term',
      isVerified: false,
      profileCompletion: 100
    };

    storageService.registerAsPartner(profile);
    setPartners(storageService.getAllPartners());
    playCelebrationSound();
    setActiveTab('browse');
    alert('تم تحديث بروفايل الشريك بنجاح!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-all duration-700" dir="rtl">
      <style>{`
        .emerald-glow { box-shadow: 0 20px 50px -15px rgba(16, 185, 129, 0.2); }
        .text-emerald-gradient { background: linear-gradient(135deg, #10b981, #059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* Luxury Header */}
      <header className="h-24 glass border-b border-black/5 dark:border-white/5 flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 active:scale-90 transition-all">
             <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight">بوابة الشركاء الاستراتيجيين</h2>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Smart Co-Founder Ecosystem</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-[1.5rem] border border-black/5 dark:border-white/10">
           {[
             { id: 'browse', label: 'استكشاف', icon: '🌍' },
             { id: 'algorithm', label: 'نظام المطابقة', icon: '🧠' },
             { id: 'register', label: 'ملف الشريك', icon: '👤' }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => { setActiveTab(tab.id as any); playPositiveSound(); }}
               className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-2
                 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}
               `}
             >
               <span>{tab.icon}</span>
               {tab.label}
             </button>
           ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-12">

          {activeTab === 'browse' && (
            <div className="space-y-12 animate-fade-up">
               <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="space-y-4">
                     <h3 className="text-5xl font-black dark:text-white text-slate-900 tracking-tighter">جد "القطعة المفقودة" <br/> <span className="text-emerald-500">في مشروعك.</span></h3>
                     <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                        لا تكتفِ بمجرد موظف، ابحث عن شريك يشاطرك الرؤية ويملك المهارات التي تنقص فريقك. خوارزميتنا تضمن لك التوافق المهني والشخصي.
                     </p>
                  </div>
                  <button 
                    onClick={handleMatchRequest}
                    disabled={isMatching}
                    className="btn-primary !bg-emerald-600 !shadow-emerald-500/20 hover:!bg-emerald-700 active:scale-95 group"
                  >
                     {isMatching ? (
                       <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : (
                       <>
                         <span className="text-lg">تفعيل رادار المطابقة الذكي</span>
                         <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                       </>
                     )}
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {matches.length > 0 ? matches.map((m, i) => {
                    const p = partners.find(part => part.uid === m.partnerUid);
                    if (!p) return null;
                    return (
                      <div key={i} className="card-premium p-10 group relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/30">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[5rem] group-hover:scale-110 transition-transform"></div>
                         <div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                               <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.2rem] flex items-center justify-center text-4xl shadow-inner border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                                  👤
                               </div>
                               <div className="text-left">
                                  <p className="text-4xl font-black text-emerald-500 leading-none">{m.score}%</p>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Alignment</p>
                               </div>
                            </div>
                            
                            <h3 className="text-2xl font-black dark:text-white text-slate-900 mb-1">{p.name}</h3>
                            <p className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-6">{p.primaryRole} • {p.experienceYears} Years Exp</p>

                            <div className="space-y-4 mb-10 relative z-10">
                               {m.reasoning.map((reason: string, idx: number) => (
                                 <div key={idx} className="flex gap-3 items-center text-xs font-bold text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    {reason}
                                 </div>
                               ))}
                               <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-black/5 dark:border-white/5">
                                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">نقاط الحذر (AI Alert)</p>
                                  <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">"{m.risk}"</p>
                               </div>
                            </div>
                         </div>

                         <button className="w-full py-5 bg-slate-900 dark:bg-emerald-600/10 text-slate-100 dark:text-emerald-400 rounded-2xl font-black text-sm transition-all hover:bg-emerald-600 hover:text-white active:scale-95 border border-black/5 dark:border-emerald-500/20">
                            بدء تجربة شراكة (14 يوم)
                         </button>
                      </div>
                    );
                  }) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                       <div className="w-32 h-32 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-7xl animate-pulse">🤝</div>
                       <div>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white">بانتظار المسح الاستراتيجي</h3>
                          <p className="max-w-md mx-auto text-lg font-medium mt-4 leading-relaxed text-slate-500">
                             اضغط على "تفعيل الرادار" ليقوم الذكاء الاصطناعي بتحليل احتياجات مشروعك ومطابقتها مع نخبة الشركاء المتاحين.
                          </p>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'algorithm' && (
            <div className="animate-fade-up space-y-16">
               <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 dark:border-emerald-500/20">
                     Smart Matching Logic
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">خوارزمية Gemini <br/> <span className="text-emerald-500">للمطابقة الاستراتيجية</span></h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'تحليل الفجوات (Gap Analysis)', desc: 'نحن لا نطابقك مع من يشبهك، بل مع من يكملك. إذا كنت مؤسساً تسويقياً، سيبحث المحرك عن العبقرية التقنية التي تفتقدها.', icon: '🧩' },
                    { title: 'التوافق السلوكي (Work Style)', desc: 'هل تفضل السرعة (Fast Iterations) أم الهيكلة (Structured)؟ الخوارزمية تحلل نمط عملك لتجنب الصدامات المستقبلية.', icon: '⚖️' },
                    { title: 'التحقق من الموثوقية', desc: 'كل شريك يمر عبر نظام تدقيق ذكي يتأكد من صحة روابط LinkedIn وسنوات الخبرة لضمان جودة المجتمع.', icon: '🛡️' }
                  ].map((benefit, i) => (
                    <div key={i} className="card-premium p-12 space-y-8 relative overflow-hidden group">
                       <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{benefit.icon}</div>
                       <h4 className="text-2xl font-black leading-tight text-slate-900 dark:text-white">{benefit.title}</h4>
                       <p className="text-slate-500 text-lg leading-relaxed font-medium">{benefit.desc}</p>
                    </div>
                  ))}
               </div>

               <div className="card-premium p-16 dark:bg-emerald-950/20 border-emerald-500/20 relative overflow-hidden group">
                  <div className="absolute top-[-50px] left-[-50px] text-9xl opacity-5 group-hover:rotate-12 transition-transform duration-1000">💡</div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                     <div className="flex-1 space-y-6">
                        <h4 className="text-3xl font-black">نظام الـ 14 يوماً (The Trial Protocol)</h4>
                        <p className="text-slate-500 text-xl leading-relaxed font-medium">
                           نؤمن أن الشراكة "زواج مهني". لذلك، تتيح المنصة فترة تجربة ذكية تمتد لأسبوعين، يعمل فيها الطرفان على مهمة حقيقية. في نهاية الفترة، يصدر الـ AI تقريراً عن "ديناميكية الفريق" لمساعدتكم في قرار الاستمرار.
                        </p>
                        <div className="flex gap-4">
                           <div className="px-5 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">تجنب الصدامات</div>
                           <div className="px-5 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">اختبار الكفاءة</div>
                        </div>
                     </div>
                     <div className="w-full md:w-1/3 p-10 bg-slate-950 rounded-[3rem] shadow-2xl space-y-6">
                        <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                        <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                        <div className="pt-6">
                           <div className="flex justify-between text-[10px] font-black text-emerald-500 mb-2 uppercase">Trial Progress</div>
                           <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[65%] animate-pulse"></div>
                           </div>
                        </div>
                        <p className="text-xs text-slate-500 font-bold text-center">بانتظار مراجعة الـ AI لنهاية الفترة</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="max-w-4xl mx-auto animate-fade-up">
               <div className="card-premium p-12 md:p-20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -z-0"></div>
                  
                  <div className="relative z-10 space-y-12">
                     <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-2xl mb-6">📝</div>
                        <h2 className="text-4xl font-black dark:text-white text-slate-900">سجل كشريك للنخبة</h2>
                        <p className="text-slate-500 text-xl font-medium max-w-lg mx-auto">أدخل بصمتك المهنية لنقوم بربطك بأفضل المشاريع التي تحتاج مهاراتك.</p>
                     </div>

                     <form onSubmit={handleRegisterPartner} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">الدور القيادي</label>
                              <select className="w-full p-6 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl font-black text-lg outline-none focus:border-emerald-500 transition-all" onChange={e => setPartnerForm({...partnerForm, primaryRole: e.target.value as any})}>
                                 <option value="CTO">CTO (تقني)</option>
                                 <option value="COO">COO (تشغيلي)</option>
                                 <option value="CMO">CMO (تسويقي)</option>
                                 <option value="CPO">CPO (منتج)</option>
                                 <option value="Finance">Finance (مالي)</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">سنوات الخبرة</label>
                              <input type="number" className="w-full p-6 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl font-black text-lg outline-none focus:border-emerald-500 transition-all" placeholder="5" onChange={e => setPartnerForm({...partnerForm, experienceYears: parseInt(e.target.value)})} />
                           </div>
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">أبرز إنجاز مهني (Bio)</label>
                              <textarea className="w-full h-40 p-6 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] font-medium text-lg outline-none focus:border-emerald-500 transition-all resize-none leading-relaxed" placeholder="تحدث عن نجاح قمت به، نظام بنيته، أو فريق قدته..." onChange={e => setPartnerForm({...partnerForm, bio: e.target.value})} required />
                           </div>
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">الرابط المهني (LinkedIn)</label>
                              <input className="w-full p-6 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl font-black text-lg outline-none focus:border-emerald-500 transition-all" placeholder="https://linkedin.com/in/yourname" onChange={e => setPartnerForm({...partnerForm, linkedin: e.target.value})} required />
                           </div>
                        </div>
                        
                        <button type="submit" className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-2xl shadow-3xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4">
                           تفعيل بروفايل الشريك 🚀
                        </button>
                     </form>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>

      <footer className="py-12 border-t border-black/5 dark:border-white/5 text-center opacity-30">
         <p className="text-[11px] font-black uppercase tracking-[0.6em] dark:text-white text-slate-900">Elite Co-Founder Matching System • 2024</p>
      </footer>
    </div>
  );
};
