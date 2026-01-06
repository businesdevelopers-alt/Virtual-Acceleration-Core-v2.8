import React, { useState, useMemo, useRef } from 'react';
import { AVAILABLE_AGENTS, ProjectBuildData, AIAgent, AgentCategory } from '../../types';
import { runProjectAgents, generatePitchDeck } from '../../services/geminiService';
import { playPositiveSound, playCelebrationSound } from '../../services/audioService';

interface ProjectBuilderProps {
  onComplete: (data: ProjectBuildData) => void;
  onBack: () => void;
}

const CATEGORY_MAP: Record<AgentCategory, { label: string; icon: string; color: string; desc: string }> = {
  Vision: { label: 'الرؤية', icon: '🔭', color: 'blue', desc: 'تحديد الرؤية طويلة المدى والمبادئ التوجيهية للمشروع.' },
  Market: { label: 'السوق', icon: '📊', color: 'emerald', desc: 'تحليل حجم السوق، المنافسين، واتجاهات الصناعة.' },
  User: { label: 'المستخدم', icon: '👥', color: 'purple', desc: 'بناء ملفات العملاء وتصميم رحلات المستخدم المثالية.' },
  Opportunity: { label: 'الفرصة', icon: '💎', color: 'amber', desc: 'اكتشاف ثغرات السوق ونقاط القوة التنافسية.' }
};

export const ProjectBuilderMain: React.FC<ProjectBuilderProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState<AgentCategory | 'All'>('All');
  const [formData, setFormData] = useState<ProjectBuildData>({
    projectName: '',
    description: '',
    quality: 'Balanced',
    selectedAgents: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAgent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.includes(id) 
        ? prev.selectedAgents.filter(a => a !== id)
        : [...prev.selectedAgents, id]
    }));
    playPositiveSound();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          projectFile: { data: reader.result as string, name: file.name, type: file.type }
        }));
        playPositiveSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredAgents = useMemo(() => {
    if (activeCategory === 'All') return AVAILABLE_AGENTS;
    return AVAILABLE_AGENTS.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  const handleNextStep = async () => {
    if (step === 1) {
      if (!formData.projectName || !formData.description || formData.selectedAgents.length === 0) return;
      setIsGenerating(true);
      try {
        const results = await runProjectAgents(formData.projectName, formData.description, formData.selectedAgents);
        setFormData(prev => ({
          ...prev,
          results: {
            ...prev.results,
            vision: results.vision,
            marketAnalysis: results.market,
            userPersonas: results.users,
            hypotheses: results.hypotheses,
          }
        }));
        setStep(2);
      } catch (e) {
        alert("خطأ في التحليل.");
      } finally {
        setIsGenerating(false);
      }
    } else if (step === 2) {
      setIsGenerating(true);
      try {
        const deck = await generatePitchDeck(formData.projectName, formData.description, formData.results);
        setFormData(prev => ({ ...prev, results: { ...prev.results, pitchDeck: deck } }));
        playCelebrationSound();
        setStep(3);
      } catch (e) {
        alert("فشل توليد العرض.");
      } finally {
        setIsGenerating(false);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row" dir="rtl">
      <aside className="w-full md:w-80 bg-white border-l border-slate-200 p-8 flex flex-col gap-10 shadow-xl z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 transform rotate-3">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-xl tracking-tight">منشئ المشاريع</h2>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Smart Builder Core</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          {[
            { id: 1, label: 'تكوين الفريق', icon: '👥' },
            { id: 2, label: 'صياغة الفرضيات', icon: '🔬' },
            { id: 3, label: 'العرض التقديمي', icon: '🚀' },
            { id: 4, label: 'الاعتماد النهائي', icon: '✅' }
          ].map((s) => (
            <div key={s.id} className={`p-5 rounded-[1.8rem] border-2 transition-all flex items-center gap-4 ${step === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-50 border-transparent opacity-40'}`}>
               <span className="text-xl">{s.icon}</span>
               <div>
                 <p className="text-[10px] font-black uppercase opacity-60">Phase 0{s.id}</p>
                 <p className="font-black text-sm">{s.label}</p>
               </div>
            </div>
          ))}
        </nav>

        <button onClick={onBack} className="p-4 bg-slate-100 text-slate-400 hover:text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">إلغاء العملية</button>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {step === 1 && (
            <div className="space-y-12 animate-fade-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">تكوين النواة الرقمية</h1>
                  <p className="text-slate-500 text-xl font-medium">اختر الوكلاء الأنسب لتفكيك وتطوير رؤية مشروعك.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الفريق المختار:</span>
                  <span className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">{formData.selectedAgents.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Inputs Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                   <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-8 sticky top-0">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">اسم المبادرة / الشركة</label>
                         <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-lg outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" placeholder="مشروعك الجديد" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">جوهر الفكرة (وصف معمق)</label>
                         <textarea className="w-full h-48 p-6 bg-slate-50 border border-slate-200 rounded-[2.2rem] font-medium text-lg resize-none outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner leading-relaxed" placeholder="اشرح المشكلة، الحل، والقيمة المضافة..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                      <div onClick={() => fileInputRef.current?.click()} className="group p-8 border-4 border-dashed border-slate-100 rounded-[2.2rem] text-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                         <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">📄</span>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-tighter group-hover:text-blue-600">{formData.projectFile ? formData.projectFile.name : 'ارفق مستند المشروع (PDF)'}</p>
                         <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                      </div>
                   </div>
                </div>

                {/* Agents Grid */}
                <div className="lg:col-span-8 space-y-8">
                   <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
                      <button onClick={() => setActiveCategory('All')} className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeCategory === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>الكل</button>
                      {Object.keys(CATEGORY_MAP).map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>{CATEGORY_MAP[cat as AgentCategory].label}</button>
                      ))}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                      {filteredAgents.map(agent => {
                        const isSelected = formData.selectedAgents.includes(agent.id);
                        return (
                          <button 
                            key={agent.id}
                            onClick={() => toggleAgent(agent.id)}
                            className={`p-8 rounded-[3.5rem] border-4 text-right transition-all group relative overflow-hidden flex flex-col gap-4 min-h-[340px]
                              ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-8 ring-blue-500/5' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/50'}
                            `}
                          >
                            <div className="flex justify-between items-start">
                               <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-4xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6 ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                                  {CATEGORY_MAP[agent.category].icon}
                               </div>
                               <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white text-blue-600' : 'border-slate-100 bg-white group-hover:border-blue-200'}`}>
                                  {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                               </div>
                            </div>
                            
                            <div>
                               <h4 className="text-2xl font-black">{agent.name}</h4>
                               <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-2 ${isSelected ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                  <span className="w-1 h-1 rounded-full bg-current"></span>
                                  {CATEGORY_MAP[agent.category].label}
                               </div>
                            </div>

                            <p className={`text-sm leading-relaxed font-medium mt-2 flex-1 ${isSelected ? 'text-blue-50' : 'text-slate-500'}`}>
                               {agent.description}
                            </p>
                            
                            {/* Capabilities Preview Section */}
                            <div className="pt-6 mt-2 border-t border-current border-opacity-10 space-y-4">
                               <p className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>المهام التخصصية:</p>
                               <div className="flex flex-wrap gap-2">
                                  {agent.capabilities.map((cap, ci) => (
                                    <span key={ci} className={`text-[9px] font-black px-3 py-1.5 rounded-xl border transition-all ${isSelected ? 'bg-white/5 border-white/10 text-white hover:bg-white/20' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-200'}`}>
                                      {cap}
                                    </span>
                                  ))}
                               </div>
                            </div>

                            {isSelected && (
                              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                            )}
                          </button>
                        );
                      })}
                   </div>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 lg:right-80 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-8 flex justify-center z-30">
                <button 
                  onClick={handleNextStep}
                  disabled={isGenerating || !formData.projectName || !formData.description || formData.selectedAgents.length === 0}
                  className="px-24 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-[1.035] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-6"
                >
                  {isGenerating ? (
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>بدء جلسة البناء الرقمي</span>
                      <span className="text-3xl animate-float">✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up space-y-12 text-center py-10 pb-32">
               <div className="w-28 h-28 bg-blue-50 text-blue-600 rounded-[3rem] flex items-center justify-center text-6xl mx-auto shadow-inner border-2 border-blue-100 animate-pulse">🔬</div>
               <div className="space-y-3">
                 <h1 className="text-5xl font-black text-slate-900 tracking-tight">الفرضيات الاستراتيجية</h1>
                 <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">قام فريقك الرقمي بتحليل معطيات المشروع واستخلاص أهم الفرضيات التي تتطلب التحقق الفوري لضمان نجاح النموذج.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {formData.results?.hypotheses?.map((h, i) => (
                    <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 text-right flex gap-8 items-start group hover:border-blue-500 transition-all hover:-translate-y-2">
                       <span className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-2xl shadow-blue-500/30 group-hover:rotate-12 transition-transform">{i+1}</span>
                       <p className="font-bold text-slate-700 text-xl leading-relaxed italic pr-4 border-r-4 border-blue-100 group-hover:border-blue-500 transition-colors">"{h}"</p>
                    </div>
                  ))}
               </div>
               
               <div className="fixed bottom-0 left-0 right-0 lg:right-80 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-8 flex justify-center z-30">
                  <button onClick={handleNextStep} disabled={isGenerating} className="px-24 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl hover:bg-black transition-all transform hover:scale-[1.035] active:scale-95 flex items-center gap-6">
                    {isGenerating ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : 'توليد العرض الاستثماري (Pitch Deck)'}
                  </button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up h-full flex flex-col items-center py-10 pb-32">
               <div className="w-full max-w-5xl bg-slate-900 aspect-video rounded-[4rem] shadow-4xl p-16 text-right text-white relative overflow-hidden flex flex-col justify-between border-8 border-white/5">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                  <div className="relative z-10">
                     <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4 block">Slide 0{currentSlideIndex+1} Perspective</span>
                     <h2 className="text-6xl font-black text-blue-400 tracking-tighter leading-tight">{formData.results?.pitchDeck?.[currentSlideIndex]?.title}</h2>
                  </div>
                  
                  <div className="relative z-10 bg-white/5 p-10 rounded-[3rem] border border-white/10 backdrop-blur-md">
                     <p className="text-3xl text-slate-100 leading-relaxed whitespace-pre-wrap font-medium">{formData.results?.pitchDeck?.[currentSlideIndex]?.content}</p>
                  </div>

                  <div className="relative z-10 flex justify-between items-center border-t border-white/10 pt-8">
                     <div className="flex gap-4">
                        <button onClick={() => { setCurrentSlideIndex(prev => Math.max(0, prev - 1)); playPositiveSound(); }} className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-all active:scale-90 border border-white/5 shadow-xl">
                           <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                        <button onClick={() => { setCurrentSlideIndex(prev => Math.min((formData.results?.pitchDeck?.length || 1) - 1, prev + 1)); playPositiveSound(); }} className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-all active:scale-90 border border-white/5 shadow-xl">
                           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="flex gap-1">
                           {formData.results?.pitchDeck?.map((_, i) => (
                             <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlideIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}></div>
                           ))}
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Deck Page {currentSlideIndex+1} / {formData.results?.pitchDeck?.length}</span>
                     </div>
                  </div>
               </div>
               
               <div className="fixed bottom-0 left-0 right-0 lg:right-80 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-8 flex justify-center z-30">
                  <button onClick={handleNextStep} className="px-24 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-[1.035] active:scale-95 flex items-center gap-6">
                     إنهاء الجلسة وحفظ المخرجات 💾
                  </button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-fade-in py-20">
               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="w-40 h-40 bg-emerald-50 text-emerald-600 rounded-[3.5rem] flex items-center justify-center text-8xl shadow-inner relative border-4 border-emerald-100">✓</div>
               </div>
               <div className="space-y-4">
                  <h2 className="text-6xl font-black text-slate-900 tracking-tighter">تم بناء أصول المشروع!</h2>
                  <p className="text-slate-500 text-2xl font-medium max-w-xl mx-auto leading-relaxed">ملفك التأسيسي والاستراتيجي جاهز الآن للمراجعة النهائية وبدء مرحلة الجذب الفعلي للمستخدمين والمستثمرين.</p>
               </div>
               <button onClick={() => onComplete(formData)} className="px-20 py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-4xl hover:bg-black transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4">
                  <span>العودة لمركز القيادة الاستراتيجي</span>
                  <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
