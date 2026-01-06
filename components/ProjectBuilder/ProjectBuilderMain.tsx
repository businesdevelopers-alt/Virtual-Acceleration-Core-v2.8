
import React, { useState } from 'react';
import { AVAILABLE_AGENTS, ProjectBuildData, AIAgent, AgentCategory } from '../../types';
import { runProjectAgents, generatePitchDeck } from '../../services/geminiService';
import { playPositiveSound, playCelebrationSound } from '../../services/audioService';

interface ProjectBuilderProps {
  onComplete: (data: ProjectBuildData) => void;
  onBack: () => void;
}

export const ProjectBuilderMain: React.FC<ProjectBuilderProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
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
  };

  const getAgentsByCategory = (category: AgentCategory) => {
    return AVAILABLE_AGENTS.filter(a => a.category === category);
  };

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
          <h2 className="font-black text-slate-800">سير عمل بناء المشروع</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 1, label: 'بناء مشروع', sub: 'أنشئ مشروعك باستخدام وكلاء الذكاء الاصطناعي', icon: '🏗️' },
            { id: 2, label: 'الفرضيات الخمس', sub: 'توليد فرضيات العمل الأساسية', icon: '🔬' },
            { id: 3, label: 'إنشاء العرض التقديمي', sub: 'إنشاء عرض تقديمي ديناميكي (Pitch Deck)', icon: '📽️' },
            { id: 4, label: 'الاكتمال', sub: 'حفظ المشروع ومشاركته', icon: '✅' }
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
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          
          {step === 1 && (
            <div className="space-y-10 animate-fade-in-up">
              <div className="flex justify-between items-center">
                <div>
                   <h1 className="text-3xl font-black text-slate-900 mb-2">الخطوة 1: بناء مشروعك</h1>
                   <p className="text-slate-500">الإحصاءات • مشروع جديد</p>
                </div>
                <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  إلغاء التأسيس
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-3">اسم المشروع</label>
                    <input 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      placeholder="أدخل اسم مشروعك..."
                      value={formData.projectName}
                      onChange={e => setFormData({...formData, projectName: e.target.value})}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-3">وصف المشروع</label>
                    <textarea 
                      className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                      placeholder="صف فكرة مشروعك وتحدياتها..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-4">جودة التوليد</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {qualityOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setFormData({...formData, quality: opt.id as any})}
                          className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${formData.quality === opt.id ? 'border-blue-600 bg-blue-50' : 'border-slate-50 hover:bg-slate-50'}`}
                        >
                          <span className="text-[10px] font-bold text-slate-800">{opt.label}</span>
                          <span className="text-[8px] text-slate-400">{opt.tokens}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
                    <h3 className="font-bold text-slate-800 mb-6 flex justify-between items-center">
                      اختر وكلاء الذكاء الاصطناعي 
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-500">9 متاحين</span>
                    </h3>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                       {(['Vision', 'Market', 'User', 'Opportunity'] as AgentCategory[]).map(cat => (
                         <div key={cat} className="space-y-3">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                             {cat === 'Vision' ? 'الرؤية' : cat === 'Market' ? 'السوق' : cat === 'User' ? 'المستخدم' : 'الفرصة'}
                           </p>
                           <div className="space-y-2">
                              {getAgentsByCategory(cat).map(agent => (
                                <button
                                  key={agent.id}
                                  onClick={() => toggleAgent(agent.id)}
                                  className={`w-full text-right p-3 rounded-2xl border-2 transition-all group flex items-start gap-3
                                    ${formData.selectedAgents.includes(agent.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-50 hover:border-slate-200'}
                                  `}
                                >
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                     ${formData.selectedAgents.includes(agent.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}
                                   `}>
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                   </div>
                                   <div className="flex-1">
                                      <p className="font-bold text-xs text-slate-800">{agent.name}</p>
                                      <p className="text-[9px] text-slate-500 leading-relaxed">{agent.description}</p>
                                   </div>
                                </button>
                              ))}
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <button 
                  onClick={handleNextStep}
                  disabled={isGenerating || formData.selectedAgents.length === 0 || !formData.projectName}
                  className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'إنشاء المشروع والفرضيات 🚀'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up space-y-10">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-blue-100">🔬</div>
                  <h1 className="text-3xl font-black text-slate-900">الخطوة 2: الفرضيات الخمس الأساسية</h1>
                  <p className="text-slate-500 text-lg">بناءً على تحليل الوكلاء، إليك أهم 5 فرضيات يجب اختبارها لمشروع "{formData.projectName}"</p>
               </div>

               <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                  <div className="space-y-6">
                    {formData.results?.hypotheses?.map((h, i) => (
                      <div key={i} className="flex gap-6 items-start p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-400 transition-all group">
                        <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">{i+1}</span>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">فرضية التحقق</p>
                           <p className="text-slate-700 text-lg leading-relaxed font-bold">{h}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-8 bg-blue-900 text-white rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                  <h4 className="text-blue-300 font-black text-xs uppercase tracking-widest mb-2">توصية الوكيل الذكي 💡</h4>
                  <p className="text-xl font-medium leading-relaxed italic">"اختبار هذه الفرضيات هو الفارق بين مجرد "فكرة" وبين "نموذج عمل" ناجح. نوصي ببدء اختبار الفرضية رقم ١ الأسبوع القادم."</p>
               </div>

               <button 
                onClick={handleNextStep} 
                disabled={isGenerating}
                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-700 flex items-center justify-center gap-4 transition-all"
               >
                  {isGenerating ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : 'إنشاء العرض التقديمي الاستثماري'}
               </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up space-y-8 h-full flex flex-col">
               <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-black text-slate-900">الخطوة 3: العرض التقديمي الاستثماري</h1>
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                    شريحة {currentSlideIndex + 1} من {formData.results?.pitchDeck?.length}
                  </span>
               </div>
               
               <div className="bg-slate-900 aspect-video rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col p-12 text-right text-white relative border border-white/5 group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                    <h2 className="text-5xl font-black mb-10 text-blue-400 leading-tight">
                      {formData.results?.pitchDeck?.[currentSlideIndex].title}
                    </h2>
                    <div className="prose prose-invert max-w-none">
                       <p className="text-2xl text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                          {formData.results?.pitchDeck?.[currentSlideIndex].content}
                       </p>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-8">
                     <div className="flex gap-4">
                        <button 
                          disabled={currentSlideIndex === 0} 
                          onClick={() => { setCurrentSlideIndex(prev => prev - 1); playPositiveSound(); }} 
                          className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-20 transition-all active:scale-90 border border-white/5"
                        >
                          <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button 
                          disabled={currentSlideIndex === (formData.results?.pitchDeck?.length || 1) - 1} 
                          onClick={() => { setCurrentSlideIndex(prev => prev + 1); playPositiveSound(); }} 
                          className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-20 transition-all active:scale-90 border border-white/5"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
                        </button>
                     </div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Investment Ready v2.0</p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={() => setStep(2)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all">العودة للفرضيات</button>
                  <button onClick={handleNextStep} className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
                    <span>حفظ المشروع وإكمال المسار التدريبي</span>
                    <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up text-center space-y-12 py-12 flex-1 flex flex-col justify-center">
               <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-emerald-100 animate-bounce">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
               </div>
               <div className="space-y-4">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight">إنجاز عظيم!</h1>
                  <p className="text-slate-500 text-xl max-w-md mx-auto leading-relaxed">
                    تم بناء أصول مشروع "{formData.projectName}" بنجاح. ملفك الاستثماري جاهز الآن للمراجعة النهائية من قبل اللجنة.
                  </p>
               </div>
               <div className="pt-8">
                  <button onClick={() => onComplete(formData)} className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-3xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">العودة للوحة تحكم المسرعة 🚀</button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
