
import React, { useState, useEffect, useRef } from 'react';
import { LevelData, UserProfile, TaskRecord, ACADEMY_BADGES } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { reviewDeliverableAI, generateLevelMaterial, generateLevelQuiz, askMentorAboutLevel } from '../services/geminiService';
import { BadgeCelebration } from './BadgeCelebration';

interface LevelViewProps {
  level: LevelData;
  user: UserProfile & { uid: string };
  tasks: TaskRecord[];
  onBack: () => void;
  onComplete: () => void;
}

export const LevelView: React.FC<LevelViewProps> = ({ level, user, tasks, onBack, onComplete }) => {
  const [step, setStep] = useState<'CONTENT' | 'QUIZ' | 'DELIVERABLE' | 'FEEDBACK'>('CONTENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [showBadge, setShowBadge] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  // Mentor Chat States
  const [mentorQuestion, setMentorQuestion] = useState('');
  const [mentorResponse, setMentorResponse] = useState<string | null>(null);
  const [isAskingMentor, setIsAskingMentor] = useState(false);

  const [aiMaterial, setAiMaterial] = useState<{
    philosophy: string;
    insight: string;
    axes: { title: string; description: string; icon: string }[];
    tactical_steps: string[];
    expertTip: string;
  } | null>(null);

  const [aiQuiz, setAiQuiz] = useState<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[]>([]);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const fetchAIContent = async () => {
    setIsLoadingContent(true);
    setQuizSubmitted(false);
    setQuizAnswers({});
    setMentorResponse(null);
    try {
      const [material, quiz] = await Promise.all([
        generateLevelMaterial(level.id, level.title, { startupName: user.startupName, industry: user.industry }),
        generateLevelQuiz(level.id, level.title)
      ]);
      setAiMaterial(material);
      setAiQuiz(quiz);
    } catch (err) {
      console.error("AI Fetch error", err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchAIContent();
  }, [level.id, level.title]);

  const handleAskMentor = async () => {
    if (!mentorQuestion.trim() || isAskingMentor) return;
    setIsAskingMentor(true);
    playPositiveSound();
    try {
      const response = await askMentorAboutLevel(mentorQuestion, level.title, aiMaterial);
      setMentorResponse(response);
      setMentorQuestion('');
    } catch (e) {
      alert("حدث خطأ في التواصل مع الموجه.");
    } finally {
      setIsAskingMentor(false);
    }
  };

  const currentTask = tasks.find(t => t.levelId === level.id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTask) return;

    setIsSubmitting(true);
    playPositiveSound();

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result as string;
        const context = `Startup: ${user.startupName}, Industry: ${user.industry}, Level: ${level.title}`;
        const review = await reviewDeliverableAI(currentTask.title, currentTask.description, context);
        
        const finalScore = review.readinessScore || 85;
        const processedReview = { ...review, score: finalScore };

        storageService.submitTask(user.uid, currentTask.id, {
          fileData,
          fileName: file.name
        }, processedReview);

        setAiResult(processedReview);
        setStep('FEEDBACK');
        if (finalScore >= 70) playCelebrationSound();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("حدث خطأ أثناء المراجعة الذكية.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correctCount = aiQuiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length;
    
    if (correctCount === aiQuiz.length) {
      playCelebrationSound();
      setTimeout(() => setStep('DELIVERABLE'), 4000);
    } else {
      playPositiveSound();
    }
  };

  const activeBadge = ACADEMY_BADGES.find(b => b.levelId === level.id);
  if (showBadge && activeBadge) return <BadgeCelebration badge={activeBadge} user={user} onClose={onComplete} />;

  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center" dir="rtl">
        <div className="relative w-32 h-32 mb-10">
           <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
           <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin shadow-2xl shadow-blue-500/20"></div>
           <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">🤖</div>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">جاري صياغة الإيجاز الاستراتيجي...</h2>
        <p className="text-slate-500 mt-4 text-xl font-medium">الموجه الذكي يقوم بتحليل قطاع {user.industry} لمشروعك.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600/10" dir="rtl">
      
      {/* Premium Level Header */}
      <header className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-white/80 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
           <button onClick={onBack} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all group active:scale-90">
              <svg className="w-6 h-6 transform rotate-180 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           </button>
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Level 0{level.id} Strategy</span>
                 <h2 className="text-2xl font-black text-slate-900 leading-none">{level.title}</h2>
              </div>
              <div className="flex gap-2">
                 {['CONTENT', 'QUIZ', 'DELIVERABLE'].map((s, i) => (
                   <div key={i} className={`h-1.5 rounded-full transition-all duration-1000 ${
                     (step === s) || (i === 0 && step === 'QUIZ') || (i <= 1 && step === 'DELIVERABLE') || (i <= 2 && step === 'FEEDBACK')
                     ? 'w-12 bg-blue-600 shadow-lg shadow-blue-500/20' : 'w-4 bg-slate-200'
                   }`}></div>
                 ))}
              </div>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Mentorship</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Gemini 3 Pro AI</span>
           </div>
           <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-white/10">{level.icon}</div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-10 overflow-y-auto custom-scrollbar pb-32">
        
        {step === 'CONTENT' && aiMaterial && (
          <div className="animate-fade-up space-y-12">
             
             {/* Strategic Briefing Layout */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                
                {/* Left: Philosophy & Core Insight */}
                <div className="lg:col-span-2 space-y-10">
                   <div className="p-14 bg-slate-900 rounded-[4rem] text-white relative overflow-hidden group shadow-3xl border border-white/5">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
                      <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">Strategic Philosophy</span>
                      <h3 className="text-4xl font-black leading-tight relative z-10 italic">"{aiMaterial.philosophy}"</h3>
                      <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                         <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">قطاع {user.industry} - رؤية نقدية:</p>
                         <p className="text-xl font-medium leading-relaxed opacity-90 text-blue-100">
                           {aiMaterial.insight}
                         </p>
                      </div>
                   </div>

                   {/* Strategic Axes Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {aiMaterial.axes.map((axis, i) => (
                        <div key={i} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:border-blue-600 transition-all group flex flex-col items-start gap-6 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
                           <span className="text-4xl bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner relative z-10">
                             {axis.icon || '🎯'}
                           </span>
                           <div className="relative z-10">
                              <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{axis.title}</h4>
                              <p className="text-slate-500 text-sm leading-relaxed font-medium">{axis.description}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Right: Tactical Sidebar & Expert Tip */}
                <div className="space-y-10">
                   <div className="p-10 bg-white border border-slate-200 rounded-[3.5rem] shadow-xl space-y-8">
                      <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                         <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                         تكتيكات فورية
                      </h4>
                      <div className="space-y-4">
                         {aiMaterial.tactical_steps.map((step, i) => (
                           <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-300 transition-all">
                              <span className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-1 shadow-lg shadow-blue-500/20">{i+1}</span>
                              <p className="text-sm font-bold text-slate-700 leading-relaxed">{step}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-10 bg-gradient-to-br from-indigo-600 to-blue-800 text-white rounded-[3.5rem] relative overflow-hidden group shadow-2xl">
                      <div className="absolute top-[-30px] left-[-30px] text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-700">💭</div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70 relative z-10">Mentor's Golden Rule</h4>
                      <p className="text-2xl font-bold leading-relaxed relative z-10 italic">"{aiMaterial.expertTip}"</p>
                   </div>
                </div>
             </div>

             {/* Interactive Mentor Chat Section */}
             <div className="pt-12 border-t border-slate-200">
                <div className="max-w-3xl mx-auto space-y-8">
                   <div className="text-center space-y-2">
                      <h4 className="text-2xl font-black text-slate-900">هل لديك استفسار حول هذه المادة؟</h4>
                      <p className="text-slate-500 font-medium italic">اسأل الموجه الذكي مباشرة حول تطبيقات هذه المرحلة لمشروعك.</p>
                   </div>
                   
                   <div className="relative group">
                      <input 
                        type="text" 
                        value={mentorQuestion}
                        onChange={e => setMentorQuestion(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAskMentor()}
                        placeholder="مثال: كيف أطبق المحور الثاني في قطاع التقنية المالية؟"
                        className="w-full p-6 pr-8 pl-40 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-500 shadow-xl transition-all font-bold placeholder-slate-300"
                      />
                      <button 
                        onClick={handleAskMentor}
                        disabled={isAskingMentor || !mentorQuestion.trim()}
                        className="absolute left-3 top-3 bottom-3 bg-slate-900 hover:bg-blue-600 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-30"
                      >
                         {isAskingMentor ? 'جاري التحليل...' : 'اسأل الموجه'}
                      </button>
                   </div>

                   {mentorResponse && (
                     <div className="p-10 bg-blue-50 border border-blue-100 rounded-[3rem] animate-fade-in-up shadow-inner relative group">
                        <div className="absolute -top-4 right-8 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl">🤖</div>
                        <p className="text-lg font-medium leading-relaxed text-blue-900 italic">
                          "{mentorResponse}"
                        </p>
                        <button onClick={() => setMentorResponse(null)} className="mt-6 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-600">إغلاق الرد</button>
                     </div>
                   )}
                </div>
             </div>

             <div className="flex justify-center pt-16">
                <button 
                  onClick={() => { setStep('QUIZ'); playPositiveSound(); window.scrollTo(0,0); }} 
                  className="px-24 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-3xl shadow-blue-600/30 flex items-center gap-6 group"
                >
                  <span>اختبار الجاهزية الذهنية</span>
                  <svg className="w-8 h-8 transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             </div>
          </div>
        )}

        {step === 'QUIZ' && (
           <div className="max-w-3xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="text-center space-y-6">
                 <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-blue-100">🧠</div>
                 <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">تحدي صناعة القرار</h3>
                 <p className="text-slate-500 text-xl font-medium leading-relaxed">أجب على المواقف الاستراتيجية التالية؛ الموجه الذكي يبحث عن "منطقك" وليس فقط المعلومات.</p>
              </div>

              <div className="space-y-10">
                 {aiQuiz.map((q, i) => (
                    <div key={i} className={`p-12 bg-white border border-slate-100 rounded-[4rem] space-y-10 relative overflow-hidden shadow-xl transition-all duration-500 ${quizSubmitted && quizAnswers[i] !== q.correctIndex ? 'border-rose-200' : ''}`}>
                       {quizSubmitted && (
                          <div className={`absolute top-0 left-0 w-full h-2.5 ${quizAnswers[i] === q.correctIndex ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`}></div>
                       )}
                       <h4 className="font-black text-2xl text-slate-800 leading-snug">
                          <span className="text-blue-600 ml-6 font-mono text-3xl opacity-30">#0{i+1}</span>
                          {q.question}
                       </h4>
                       <div className="grid grid-cols-1 gap-5">
                          {q.options.map((o, oi) => {
                            const isSelected = quizAnswers[i] === oi;
                            const isCorrect = q.correctIndex === oi;
                            return (
                              <button 
                                key={oi} 
                                disabled={quizSubmitted}
                                onClick={() => { setQuizAnswers({...quizAnswers, [i]: oi}); playPositiveSound(); }} 
                                className={`w-full text-right p-7 border-4 rounded-[2.5rem] font-bold text-xl transition-all flex justify-between items-center group
                                  ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xl scale-[1.03] z-10' : 'bg-slate-50 border-slate-50 hover:border-slate-300'}
                                  ${quizSubmitted && isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : ''}
                                  ${quizSubmitted && isSelected && !isCorrect ? 'border-rose-500 bg-rose-50 text-rose-800' : ''}
                                `}
                              >
                                 <span className="flex-1">{o}</span>
                                 {quizSubmitted && isCorrect && <span className="text-3xl animate-bounce ml-4">✅</span>}
                                 {quizSubmitted && isSelected && !isCorrect && <span className="text-3xl animate-shake ml-4">❌</span>}
                                 {!quizSubmitted && <div className={`w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-blue-500 ${isSelected ? 'bg-blue-600 border-blue-600' : ''}`}></div>}
                              </button>
                            );
                          })}
                       </div>
                       {quizSubmitted && (
                          <div className={`mt-10 p-10 rounded-[2.5rem] text-lg font-medium leading-relaxed italic border animate-fade-in
                             ${quizAnswers[i] === q.correctIndex ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-inner' : 'bg-slate-100 border-slate-200 text-slate-600 shadow-inner'}
                          `}>
                             💡 <span className="font-black text-blue-600">التحليل الاستراتيجي:</span> {q.explanation}
                          </div>
                       )}
                    </div>
                 ))}
              </div>

              <div className="flex gap-6 pt-10">
                 {quizSubmitted && aiQuiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length < aiQuiz.length && (
                    <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); playPositiveSound(); }} className="flex-1 py-7 bg-white border-4 border-slate-200 text-slate-600 rounded-[2.5rem] font-black text-xl hover:bg-slate-50 transition-all active:scale-95 shadow-lg">إعادة المحاكاة ↺</button>
                 )}
                 <button 
                  onClick={quizSubmitted ? () => { setStep('DELIVERABLE'); playPositiveSound(); } : handleQuizSubmit} 
                  disabled={Object.keys(quizAnswers).length < aiQuiz.length}
                  className="flex-[2] py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-6 group"
                 >
                    <span>{quizSubmitted ? 'المتابعة للتنفيذ العملي' : 'تحليل واختبار قراراتي'}</span>
                    <svg className="w-8 h-8 transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
              </div>
           </div>
        )}

        {step === 'DELIVERABLE' && (
           <div className="max-w-2xl mx-auto space-y-16 animate-fade-up py-10">
              <div className="text-center space-y-6">
                 <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-blue-100">📤</div>
                 <h3 className="text-5xl font-black text-slate-900 tracking-tight">{currentTask?.title}</h3>
                 <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-lg mx-auto">{currentTask?.description}</p>
              </div>

              <div className="relative group">
                 <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isSubmitting}
                 />
                 <div className={`w-full h-80 border-4 border-dashed rounded-[4rem] flex flex-col items-center justify-center transition-all duration-700
                   ${isSubmitting ? 'bg-blue-50 border-blue-300 shadow-2xl shadow-blue-500/10' : 'bg-white border-slate-200 group-hover:border-blue-600 group-hover:bg-blue-50/20 shadow-sm'}
                 `}>
                    {isSubmitting ? (
                      <div className="flex flex-col items-center gap-10">
                        <div className="w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-600 text-2xl font-black animate-pulse uppercase tracking-widest">AI Strategic Audit in progress...</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-8xl mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform opacity-20">📄</div>
                        <p className="font-black text-slate-900 text-3xl mb-2">رفع مخرج المرحلة (PDF)</p>
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">Executive standard PDF required</p>
                      </>
                    )}
                 </div>
              </div>
           </div>
        )}

        {step === 'FEEDBACK' && aiResult && (
           <div className="max-w-3xl mx-auto space-y-12 animate-fade-up py-10">
              <div className="p-14 bg-white border border-slate-100 rounded-[5rem] shadow-4xl text-center space-y-12 relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-4 ${aiResult.score >= 90 ? 'bg-emerald-500 shadow-lg' : 'bg-blue-600 shadow-lg'}`}></div>
                 
                 <div className="space-y-8">
                    <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-7xl mx-auto shadow-inner animate-bounce
                      ${aiResult.score >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}
                    `}>
                      {aiResult.score >= 70 ? '✓' : '!'}
                    </div>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">تحليل المخرج الاستراتيجي</h3>
                    
                    <div className="flex flex-col items-center gap-3 py-10 bg-slate-50 rounded-[4rem] border border-slate-100 max-w-sm mx-auto shadow-inner">
                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Executive Readiness Score</p>
                       <p className={`text-9xl font-black ${aiResult.score >= 90 ? 'text-emerald-500' : 'text-blue-600'} tracking-tighter`}>{aiResult.score}%</p>
                    </div>
                 </div>

                 <div className="p-12 bg-slate-950 rounded-[4rem] border border-white/5 text-right space-y-8 shadow-3xl relative">
                    <div className="absolute top-6 left-6 text-blue-500/20 text-7xl">"</div>
                    <h4 className="font-black text-blue-400 text-xs uppercase tracking-[0.4em] flex items-center gap-4">
                       Expert Review Brief
                    </h4>
                    <p className="text-slate-100 text-2xl font-medium leading-relaxed italic pr-10 border-r-6 border-blue-500/50">
                      {aiResult.criticalFeedback || 'تحليل دقيق ومكتمل المعايير، يظهر المشروع نضجاً كبيراً في التفكير التشغيلي.'}
                    </p>
                 </div>

                 <button 
                  onClick={() => setShowBadge(true)} 
                  className={`w-full py-10 text-white rounded-[3rem] font-black text-3xl shadow-4xl active:scale-[0.98] transition-all transform hover:scale-[1.02]
                    ${aiResult.score >= 70 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-slate-900 hover:bg-black shadow-slate-900/20'}
                  `}
                 >
                   {aiResult.score >= 70 ? 'استلام وسام المرحلة 🎖️' : 'حفظ المخرج والمتابعة'}
                 </button>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};
