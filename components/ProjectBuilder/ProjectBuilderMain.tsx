
import React, { useState, useMemo } from 'react';
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

  const toggleAgent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAgents: prev.selectedAgents.includes(id) 
        ? prev.selectedAgents.filter(a => a !== id)
        : [...prev.selectedAgents, id]
    }));
    playPositiveSound();
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
        playPositiveSound();
        setStep(2);
      } catch (e) {
        console.error(e);
        alert("حدث خطأ أثناء تحليل المشروع، يرجى المحاولة مرة أخرى.");
      } finally {
        setIsGenerating(false);
      }
    } else if (step === 2) {
      setIsGenerating(true);
      try {
        const deck = await generatePitchDeck(formData.projectName, formData.description, formData.results);
        setFormData(prev => ({
          ...prev,
          results: {
            ...prev.results,
            pitchDeck: deck
          }
        }));
        playCelebrationSound();
        setStep(3);
      } catch (e) {
        console.error(e);
        alert("فشل توليد العرض التقديمي. يرجى المحاولة لاحقاً.");
      } finally {
        setIsGenerating(false);
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  const qualityOptions = [
    { id: 'Quick', label: 'سريع', tokens: '500T', color: 'bg-green-500' },
    { id: 'Balanced', label: 'متوازن', tokens: '750T', color: 'bg-blue-500' },
    { id: 'Enhanced', label: 'محسّن', tokens: '1250T', color: 'bg-purple-500' },
    { id: 'Professional', label: 'احترافي', tokens: '2000T', color: 'bg-indigo-600' },
    { id: 'Max', label: 'أقصى حد', tokens: '2500T', color: 'bg-slate-900' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-l border-slate-200 p-6 flex flex-col gap-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="font-black text-slate-800">بناء المشروع الذكي</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 1, label: 'تكوين الفريق', sub: 'اختيار وكلاء الذكاء الاصطناعي', icon: '🏗️' },
            { id: 2, label: 'الفرضيات', sub: 'توليد منطق العمل الأساسي', icon: '🔬' },
            { id: 3, label: 'العرض الاستثماري', sub: 'Pitch Deck احترافي', icon: '📽️' },
            { id: 4, label: 'جاهزية العرض', sub: 'اكتمال ملف المشروع', icon: '✅' }
          ].map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl transition-all border-2 ${step === item.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent opacity-60'}`}>
               <div className="flex items-center gap-3 mb-1">
                 <span className="text-xl">{item.icon}</span>
                 <p className="font-bold text-sm text-slate-800">{item.label}</p>
               </div>
               <p className="text-[10px] text-slate-500 mr-8">{item.sub}</p>
            </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
           <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
             <span>الخطوة {step} من 4</span>
             <span>{Math.round((step / 4) * 100)}%</span>
           </div>
           <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
             <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          
          {step === 1 && (
            <div className="space-y-12 animate-fade-in-up">
              <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-4xl font-black text-slate-900 mb-3">تكوين فريق الوكلاء الذكي</h1>
                   <p className="text-slate-500 text-lg font-medium">اختر الوكلاء الذين سيقومون بصياغة أصول مشروعك وتدقيق استراتيجيتك.</p>
                </div>
                <button onClick={onBack} className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm text-slate-400 hover:text-rose-500 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Inputs Column */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-2">معلومات الهوية</label>
                      <input 
                        className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold"
                        placeholder="اسم المشروع..."
                        value={formData.projectName}
                        onChange={e => setFormData({...formData, projectName: e.target.value})}
                      />
                      <textarea 
                        className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none leading-relaxed font-medium"
                        placeholder="صف فكرة مشروعك، المشكلة، والحل المقترح..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-2">عمق المعالجة (AI Depth)</label>
                      <div className="grid grid-cols-5 gap-2">
                        {qualityOptions.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setFormData({...formData, quality: opt.id as any})}
                            className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formData.quality === opt.id ? 'border-blue-600 bg-blue-50' : 'border-slate-50 hover:bg-slate-50'}`}
                          >
                            <span className="text-[10px] font-bold text-slate-800">{opt.label}</span>
                            <span className="text-[8px] text-slate-400">{opt.tokens}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agents Selection Grid */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col h-full">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                         <button onClick={() => setActiveCategory('All')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeCategory === 'All' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>الكل</button>
                         {Object.entries(CATEGORY_MAP).map(([key, meta]) => (
                           <button 
                            key={key} 
                            onClick={() => setActiveCategory(key as AgentCategory)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeCategory === key ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                           >
                            {meta.label}
                           </button>
                         ))}
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase">مختار:</span>
                         <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg">{formData.selectedAgents.length}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                       {filteredAgents.map(agent => (
                         <button
                           key={agent.id}
                           onClick={() => toggleAgent(agent.id)}
                           className={`p-8 rounded-[2.5rem] border-4 text-right transition-all group relative overflow-hidden flex flex-col gap-4
                             ${formData.selectedAgents.includes(agent.id) 
                               ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/20' 
                               : 'bg-slate-50 border-slate-50 hover:border-blue-200 hover:bg-white'}
                           `}
                         >
                            <div className="flex justify-between items-start">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6
                                 ${formData.selectedAgents.includes(agent.id) ? 'bg-white/20' : 'bg-white'}
                               `}>
                                  {CATEGORY_MAP[agent.category].icon}
                               </div>
                               <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.selectedAgents.includes(agent.id) ? 'bg-white border-white text-blue-600' : 'border-slate-300'}`}>
                                  {formData.selectedAgents.includes(agent.id) && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                               </div>
                            </div>
                            
                            {/* Standard Content */}
                            <div className={`transition-all duration-500 ${formData.selectedAgents.includes(agent.id) ? 'opacity-100' : 'group-hover:opacity-0 group-hover:translate-y-4'}`}>
                               <h4 className={`text-xl font-black mb-1 ${formData.selectedAgents.includes(agent.id) ? 'text-white' : 'text-slate-900'}`}>{agent.name}</h4>
                               <p className={`text-xs font-bold uppercase tracking-widest ${formData.selectedAgents.includes(agent.id) ? 'text-blue-100' : 'text-blue-500'}`}>{CATEGORY_MAP[agent.category].label}</p>
                               <p className={`text-sm leading-relaxed font-medium mt-3 ${formData.selectedAgents.includes(agent.id) ? 'text-blue-50' : 'text-slate-500'}`}>
                                  {agent.description}
                               </p>
                            </div>

                            {/* Hover Preview Content (Capabilities) */}
                            {!formData.selectedAgents.includes(agent.id) && (
                              <div className="absolute inset-x-8 bottom-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-8 transition-all duration-500 text-right">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">نطاق العمليات والمهارات:</p>
                                <div className="space-y-2">
                                  {agent.capabilities.map((cap, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 justify-end">
                                      <span>{cap}</span>
                                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {formData.selectedAgents.includes(agent.id) && (
                              <div className="absolute top-0 left-0 w-2 h-full bg-white/20"></div>
                            )}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-center items-center gap-6">
                <button 
                  onClick={handleNextStep}
                  disabled={isGenerating || formData.selectedAgents.length === 0 || !formData.projectName || !formData.description}
                  className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-[2rem] font-black text-xl shadow-3xl shadow-purple-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 px-20 py-8"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="animate-fade-in">جاري تشغيل الوكلاء...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl animate-fade-in">⚡</span>
                      <span className="animate-fade-in">بدء جلسة بناء المشروع</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up space-y-10">
               <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-blue-100 animate-float">🔬</div>
                  <h1 className="text-4xl font-black text-slate-900">الفرضيات الجوهرية (Business Hypotheses)</h1>
                  <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">قام الوكلاء بتحليل مدخلاتك واستخراج ٥ فرضيات أساسية يجب اختبارها لضمان نجاح مشروع "{formData.projectName}".</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.results?.hypotheses?.map((h, i) => (
                    <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/30 hover:border-blue-600 transition-all group flex flex-col justify-between">
                       <div className="space-y-6">
                          <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg group-hover:rotate-6 transition-transform">0{i+1}</span>
                          <p className="text-slate-700 text-lg leading-relaxed font-bold italic">"{h}"</p>
                       </div>
                       <div className="pt-8 border-t border-slate-50 mt-8">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">المستهدف: التحقق الميداني</span>
                       </div>
                    </div>
                  ))}
                  <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                     <span className="text-5xl mb-4 relative z-10">💡</span>
                     <p className="font-black text-xl leading-snug relative z-10">هذه الفرضيات هي حجر الزاوية في الـ Pitch Deck القادم.</p>
                  </div>
               </div>

               <button 
                onClick={handleNextStep} 
                disabled={isGenerating}
                className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl hover:bg-black flex items-center justify-center gap-6 transition-all transform active:scale-[0.98]"
               >
                  {isGenerating ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : 'المتابعة لتوليد العرض التقديمي (Pitch Deck)'}
                  {!isGenerating && <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
               </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up space-y-8 h-full flex flex-col">
               <div className="flex justify-between items-center px-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 leading-none">محتوى العرض الاستثماري</h1>
                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-2">Executive Series v2.0</p>
                  </div>
                  <span className="px-6 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100">
                    شريحة {currentSlideIndex + 1} من {formData.results?.pitchDeck?.length}
                  </span>
               </div>
               
               <div className="bg-slate-900 aspect-video rounded-[4rem] shadow-4xl overflow-hidden flex flex-col p-16 text-right text-white relative border-8 border-white/5 group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-6 relative z-10">
                    <h2 className="text-6xl font-black mb-12 text-blue-400 leading-[1.1] tracking-tight">
                      {formData.results?.pitchDeck?.[currentSlideIndex].title}
                    </h2>
                    <div className="prose prose-2xl prose-invert max-w-none">
                       <p className="text-3xl text-slate-200 leading-relaxed font-medium whitespace-pre-wrap italic">
                          {formData.results?.pitchDeck?.[currentSlideIndex].content}
                       </p>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-10 relative z-10">
                     <div className="flex gap-6">
                        <button 
                          disabled={currentSlideIndex === 0} 
                          onClick={() => { setCurrentSlideIndex(prev => prev - 1); playPositiveSound(); }} 
                          className="w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-10 transition-all active:scale-90 border border-white/5"
                        >
                          <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button 
                          disabled={currentSlideIndex === (formData.results?.pitchDeck?.length || 1) - 1} 
                          onClick={() => { setCurrentSlideIndex(prev => prev + 1); playPositiveSound(); }} 
                          className="w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-10 transition-all active:scale-90 border border-white/5"
                        >
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2">Investment Ready Protocol</p>
                        <div className="flex gap-1 justify-end">
                           {[...Array(formData.results?.pitchDeck?.length)].map((_, i) => (
                             <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlideIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/10'}`}></div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={() => setStep(2)} className="flex-1 py-6 bg-white border-4 border-slate-100 text-slate-500 rounded-[2.5rem] font-black text-xl hover:bg-slate-50 transition-all active:scale-95">العودة للفرضيات</button>
                  <button onClick={handleNextStep} className="flex-[2] py-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-[2.5rem] font-black text-xl shadow-3xl shadow-purple-500/30 transition-all active:scale-95 flex items-center justify-center gap-4">
                    <span className="animate-fade-in">حفظ واعتماد المخرج الاستثماري</span>
                    <svg className="w-8 h-8 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up text-center space-y-12 py-12 flex-1 flex flex-col justify-center items-center">
               <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[60px] animate-pulse"></div>
                  <div className="relative w-full h-full bg-emerald-50 text-emerald-600 rounded-[4rem] flex items-center justify-center shadow-inner border-4 border-emerald-100 animate-bounce">
                     <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
               </div>
               <div className="space-y-6 max-w-2xl">
                  <h1 className="text-6xl font-black text-slate-900 tracking-tighter">رائع! مشروعك نضج.</h1>
                  <p className="text-slate-500 text-2xl font-medium leading-relaxed">
                    تم بناء أصول مشروع "{formData.projectName}" بجودة استثمارية. ملفك الآن جاهز للمراجعة النهائية وفتح آفاق التمويل.
                  </p>
               </div>
               <div className="pt-10">
                  <button onClick={() => onComplete(formData)} className="px-24 py-8 bg-slate-900 text-white rounded-[3rem] font-black text-2xl shadow-4xl hover:bg-black transition-all transform hover:scale-105 active:scale-95 flex items-center gap-6">
                     <span className="animate-fade-in">العودة لمركز القيادة</span>
                     <span className="text-4xl">🚀</span>
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};