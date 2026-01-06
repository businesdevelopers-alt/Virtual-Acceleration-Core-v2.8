
import React, { useState, useMemo } from 'react';
import { storageService } from '../services/storageService';
import { StartupRecord, UserRecord, ActivityLogRecord, ProjectTrack, TASKS_CONFIG } from '../types';
import { playPositiveSound } from '../services/audioService';

interface StaffPortalProps {
  onBack: () => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'funnel' | 'startups' | 'ai_insights'>('funnel');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<StartupRecord | null>(null);

  const startups = useMemo(() => storageService.getAllStartups(), []);
  const users = useMemo(() => storageService.getAllUsers(), []);

  // Funnel Analytics
  const funnelData = useMemo(() => {
    const counts = { Idea: 0, MVP: 0, Growth: 0, 'Investment Ready': 0 };
    startups.forEach(s => {
      const track = (s as any).currentTrack || 'Idea';
      counts[track as ProjectTrack]++;
    });
    return counts;
  }, [startups]);

  // stalled logic: no activity for 7 days (simulated)
  const stalledStartups = startups.filter(s => s.status === 'STALLED' || Math.random() > 0.85);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2024') {
      setIsAuthenticated(true);
      playPositiveSound();
    } else {
      alert('كلمة مرور خاطئة');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'STALLED': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
        <div className="max-w-md w-full p-10 bg-slate-900 rounded-[3rem] border border-white/5 animate-fade-in-up shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl text-4xl">👑</div>
            <h2 className="text-3xl font-black">مدير الحاضنة الذكي</h2>
            <p className="text-slate-500 font-bold mt-2">نظام الإدارة والتحليل المركزي</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 text-white font-bold"
              placeholder="كلمة مرور الإدارة"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">دخول المركز</button>
            <button type="button" onClick={onBack} className="w-full py-2 text-slate-500 font-bold text-sm">العودة للرئيسية</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans" dir="rtl">
      {/* Dashboard Header */}
      <header className="px-10 h-24 border-b border-white/5 flex items-center justify-between sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl font-black italic">BD</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">لوحة القيادة الذكية</h1>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Incubator Management Hub</p>
            </div>
          </div>
          <nav className="hidden lg:flex gap-6">
            {[
              { id: 'funnel', label: 'تحليل المسارات', icon: '🌪️' },
              { id: 'startups', label: 'إدارة الرواد', icon: '👥' },
              { id: 'ai_insights', label: 'ذكاء التخرج', icon: '🧠' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-3
                  ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="bg-red-500/10 text-red-500 px-6 py-2.5 rounded-xl text-xs font-black border border-red-500/20">خروج آمن</button>
      </header>

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'funnel' && (
          <div className="space-y-12 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'Idea Stage', count: funnelData.Idea, color: 'blue' },
                  { label: 'MVP Stage', count: funnelData.MVP, color: 'amber' },
                  { label: 'Growth Stage', count: funnelData.Growth, color: 'emerald' },
                  { label: 'Ready for Invest', count: funnelData['Investment Ready'], color: 'purple' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                     <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color}-500/5 rounded-bl-full`}></div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
                     <h4 className="text-5xl font-black">{item.count}</h4>
                     <div className="mt-6 flex items-center gap-2">
                        <span className={`text-[10px] font-bold text-${item.color}-400`}>+12% من الشهر الماضي</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stall Detector */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-[3rem] p-10">
                   <h3 className="text-xl font-black mb-8 flex items-center gap-4 text-rose-400">
                      <span className="w-3 h-8 bg-rose-500 rounded-full"></span>
                      كاشف التعثر (AI Stall Alert)
                   </h3>
                   <div className="space-y-4">
                      {stalledStartups.length > 0 ? stalledStartups.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[1.8rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center font-black">!</div>
                              <div>
                                 <p className="font-black">{s.name}</p>
                                 <p className="text-[10px] text-slate-500">متوقف في مستوى: {((s as any).currentLevel || 1)}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">توقف عن التسليم (١٢ يوم)</span>
                           </div>
                        </div>
                      )) : (
                        <p className="text-center py-20 text-slate-500 font-bold italic">لا توجد حالات تعثر حرجة حالياً.</p>
                      )}
                   </div>
                </div>

                {/* Investment Readiness Recommendation */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-[-20px] left-[-20px] text-9xl opacity-10">🚀</div>
                   <h3 className="text-xl font-black mb-10 relative z-10">توصيات الاستثمار (AI)</h3>
                   <div className="space-y-6 relative z-10">
                      {startups.filter(s => s.aiClassification === 'Green').slice(0, 3).map((s, i) => (
                        <div key={i} className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-900 font-black">✓</div>
                           <div>
                              <p className="text-sm font-black">{s.name}</p>
                              <p className="text-[10px] text-blue-200">جاهزية تامة للعرض</p>
                           </div>
                        </div>
                      ))}
                      <button className="w-full py-4 bg-white text-blue-900 rounded-2xl font-black text-sm shadow-xl mt-4">إصدار تقرير الجولة الاستثمارية</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'startups' && (
           <div className="space-y-10 animate-fade-in">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black">قاعدة بيانات رواد الأعمال</h2>
                 <div className="flex gap-4">
                    <input 
                      className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl outline-none focus:border-blue-500 text-sm font-bold w-80"
                      placeholder="ابحث عن مشروع أو قطاع..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className="px-6 py-3 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest">فلترة متقدمة</button>
                 </div>
              </div>

              <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 overflow-hidden">
                 <table className="w-full text-right">
                    <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <tr>
                          <th className="px-10 py-6">المشروع</th>
                          <th className="px-10 py-6">القطاع</th>
                          <th className="px-10 py-6">المسار</th>
                          <th className="px-10 py-6">التقييم الذكي</th>
                          <th className="px-10 py-6">الحالة</th>
                          <th className="px-10 py-6">الإجراءات</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {startups.filter(s => s.name.includes(searchTerm)).map((s, i) => (
                         <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="px-10 py-6">
                               <p className="font-black text-sm">{s.name}</p>
                               <p className="text-[10px] text-slate-500">ID: {s.projectId}</p>
                            </td>
                            <td className="px-10 py-6">
                               <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-slate-400">{s.industry}</span>
                            </td>
                            <td className="px-10 py-6">
                               <span className="font-black text-xs text-blue-400">{(s as any).currentTrack || 'Idea'}</span>
                            </td>
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500" style={{ width: `${s.metrics?.readiness || 50}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-black">{s.metrics?.readiness || 50}%</span>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${getStatusColor(s.status)}`}>
                                  {s.status}
                               </span>
                            </td>
                            <td className="px-10 py-6 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => setSelectedStartup(s)} className="p-2.5 bg-white/5 hover:bg-blue-600 rounded-xl transition-all">👁️</button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'ai_insights' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-fade-in py-10">
              <div className="text-center space-y-4">
                 <h2 className="text-4xl font-black text-white tracking-tight">نظام التحليل التنبؤي (AAS)</h2>
                 <p className="text-slate-500 text-xl">تحليل جودة المخرجات وتحديد "الخرجين الذهبيين" الجاهزين للاستثمار.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 space-y-6">
                    <h4 className="text-lg font-black flex items-center gap-3">
                       <span className="text-2xl">📈</span>
                       معدل نمو الجاهزية
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">بناءً على مراجعات الـ AI Mentor لآخر ٥٠ مهمة، يظهر ارتفاع في جودة "نماذج الربح" بنسبة ٢٤٪ هذا الأسبوع.</p>
                 </div>
                 <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 space-y-6">
                    <h4 className="text-lg font-black flex items-center gap-3">
                       <span className="text-2xl">🌍</span>
                       القطاعات الأكثر طلباً
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">أكثر من ٤٠٪ من المشاريع الجديدة تتركز في قطاع "التقنية المالية"، مع وضوح عالي في فهم المتطلبات التشريعية.</p>
                 </div>
              </div>

              <div className="p-12 bg-white/5 border border-blue-500/20 rounded-[4rem] text-center space-y-10">
                 <div className="w-24 h-24 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto text-5xl animate-pulse">🎓</div>
                 <h3 className="text-3xl font-black">الخرجين المؤهلين للجولات القادمة</h3>
                 <div className="flex flex-wrap justify-center gap-4">
                    {['TechLog', 'Eilm Plat', 'FinHub'].map(name => (
                      <span key={name} className="px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-black shadow-lg shadow-blue-900/40">★ {name}</span>
                    ))}
                 </div>
                 <button className="px-10 py-4 bg-white text-blue-900 rounded-2xl font-black text-sm hover:scale-105 transition-all">تصدير قائمة المستثمرين</button>
              </div>
           </div>
        )}
      </main>

      {/* Startup Inspector Panel */}
      {selectedStartup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/80 backdrop-blur-md animate-fade-in">
           <div className="w-full max-w-2xl h-full bg-[#0f172a] border-r border-white/5 p-12 overflow-y-auto animate-fade-in-right">
              <div className="flex justify-between items-start mb-12">
                 <button onClick={() => setSelectedStartup(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400">✕ إغلاق المفتش</button>
                 <div className="text-right">
                    <h3 className="text-3xl font-black">{selectedStartup.name}</h3>
                    <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-1">{selectedStartup.industry}</p>
                 </div>
              </div>

              <div className="space-y-10">
                 <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">خلاصة تقييم Gemini AI</p>
                    <p className="text-xl font-medium leading-relaxed italic">"{selectedStartup.aiOpinion}"</p>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                       <div className="p-4 bg-black/20 rounded-2xl">
                          <p className="text-[9px] text-slate-500 font-bold mb-1">نقاط الجاهزية</p>
                          <p className="text-2xl font-black text-emerald-400">{selectedStartup.metrics.readiness}%</p>
                       </div>
                       <div className="p-4 bg-black/20 rounded-2xl">
                          <p className="text-[9px] text-slate-500 font-bold mb-1">النمط القيادي</p>
                          <p className="text-sm font-black text-blue-400">Visionary Executioner</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-lg font-black flex items-center gap-4">
                       <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                       سجل المخرجات المرفوعة
                    </h4>
                    <div className="space-y-3">
                       {TASKS_CONFIG.map((t, i) => (
                         <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                               <span className="text-2xl opacity-40">📄</span>
                               <span className="text-sm font-bold">{t.title}</span>
                            </div>
                            <button className="text-[10px] font-black text-blue-500 hover:underline">مراجعة AI Feedback</button>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-10 border-t border-white/5 flex gap-4">
                    <button className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition-all">اعتماد ترقية المسار</button>
                    <button className="flex-1 py-5 bg-rose-600 text-white rounded-2xl font-black shadow-lg hover:bg-rose-700 transition-all">تجميد المشروع (Stall)</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
