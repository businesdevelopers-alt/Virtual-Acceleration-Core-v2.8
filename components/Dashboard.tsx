import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LevelData, UserProfile, DIGITAL_SHIELDS, SECTORS, TaskRecord, SERVICES_CATALOG, ServiceItem, ServicePackage, ServiceRequest, OpportunityAnalysis, ProgramRating, Partner, AVAILABLE_AGENTS, AIAgent, AgentCategory } from '../types';
import { storageService } from '../services/storageService';
import { discoverOpportunities, suggestIconsForLevels, reviewDeliverableAI } from '../services/geminiService';
import { Language, getTranslation } from '../services/i18nService';
import { LanguageSwitcher } from './LanguageSwitcher';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { ProgramEvaluation } from './ProgramEvaluation';

interface DashboardProps {
  user: UserProfile;
  levels: LevelData[];
  onSelectLevel: (id: number) => void;
  onShowCertificate: () => void;
  onLogout?: () => void;
  onOpenProAnalytics?: () => void;
  onUpdateLevelUI?: (id: number, icon: string, color: string) => void;
  onAISuggestIcons?: () => Promise<void>;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const PRESET_COLORS = [
  { name: 'أزرق', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50', ring: 'ring-blue-500' },
  { name: 'أخضر', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50', ring: 'ring-emerald-500' },
  { name: 'أحمر', bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', light: 'bg-rose-50', ring: 'ring-rose-500' },
  { name: 'بنفسجي', bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', light: 'bg-indigo-50', ring: 'ring-indigo-500' },
  { name: 'برتقالي', bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-50', ring: 'ring-orange-500' },
  { name: 'ذهبي', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', light: 'bg-amber-50', ring: 'ring-amber-500' },
  { name: 'وردي', bg: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-600', light: 'bg-pink-50', ring: 'ring-pink-500' },
  { name: 'سحابي', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-500', light: 'bg-slate-50', ring: 'ring-slate-500' },
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  user: initialUser, levels, onSelectLevel, onShowCertificate, onLogout, 
  onOpenProAnalytics, onUpdateLevelUI, onAISuggestIcons,
  lang, onLanguageChange
}) => {
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('dashboard_theme_mode') as any) || 'light');
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  
  const t = getTranslation(lang);
  
  const NAV_ITEMS = [
    { id: 'home', label: t.dashboard.home, icon: '🏠' },
    { id: 'bootcamp', label: t.dashboard.bootcamp, icon: '📚' },
    { id: 'tasks', label: t.dashboard.tasks, icon: '📝' },
    { id: 'builder', label: t.dashboard.builder, icon: '🏗️' },
    { id: 'opportunity_lab', label: 'مختبر الفرص', icon: '🧭' },
    { id: 'services', label: t.dashboard.services, icon: '🛠️' }, 
    { id: 'startup_profile', label: t.dashboard.profile, icon: '📈' },
  ];

  const [userProfile, setUserProfile] = useState<UserProfile>(initialUser);
  const [userTasks, setUserTasks] = useState<TaskRecord[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    const session = storageService.getCurrentSession();
    if (session) {
      const tasks = storageService.getUserTasks(session.uid);
      setUserTasks(tasks);
    }
  }, [activeNav, levels]);

  const completedCount = levels.filter(l => l.isCompleted).length;
  const progress = (completedCount / levels.length) * 100;

  const handleAIGenerateSubmission = async (task: TaskRecord) => {
    setIsGeneratingAI(true);
    playPositiveSound();
    try {
      const context = `Startup: ${userProfile.startupName}, Industry: ${userProfile.industry}, Description: ${userProfile.startupDescription}`;
      const review = await reviewDeliverableAI(task.title, task.description, context);
      const session = storageService.getCurrentSession();
      if (session) {
        const dummyContent = `مخرج تم توليده آلياً لمهمة: ${task.title}\n\nدرجة العمق الاستراتيجي: ${review.readinessScore}%\nملاحظات المراجعة الذكية: ${review.criticalFeedback}`;
        
        storageService.submitTask(session.uid, task.id, {
          fileData: `data:text/plain;base64,${btoa(unescape(encodeURIComponent(dummyContent)))}`,
          fileName: `AI_Generated_${task.title.replace(/\s+/g, '_')}.pdf`
        }, { ...review, score: review.readinessScore });
        
        storageService.approveTask(session.uid, task.id);
        setUserTasks(storageService.getUserTasks(session.uid));
        playCelebrationSound();
      }
    } catch (e) {
      alert("حدث خطأ أثناء التوليد الذكي.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getLevelColorSet = (colorName?: string) => {
    return PRESET_COLORS.find(c => c.name === colorName) || PRESET_COLORS[0];
  };

  const getRelevantIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('تحقق') || t.includes('validation')) return '🔍';
    if (t.includes('نموذج') || t.includes('model') || t.includes('هيكلة')) return '📐';
    if (t.includes('هندسة') || t.includes('mvp') || t.includes('بناء')) return '🏗️';
    if (t.includes('نمو') || t.includes('سوق') || t.includes('جدوى')) return '📈';
    if (t.includes('مالي') || t.includes('finance') || t.includes('نمذجة')) return '🏦';
    if (t.includes('استثمار') || t.includes('جاهزية') || t.includes('investment')) return '🚀';
    return '🎯';
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-500`} dir={t.dir}>
      <aside className={`fixed inset-y-0 ${t.dir === 'rtl' ? 'right-0' : 'left-0'} z-50 w-72 lg:static transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : (t.dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')} bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/5 flex flex-col shadow-xl`}>
        <div className="p-8 border-b border-slate-100 dark:border-white/5 text-center">
          <div className="w-20 h-20 mx-auto bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-lg mb-4 text-white text-2xl font-black">BD</div>
          <h2 className="font-black truncate">{userProfile.startupName}</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveNav(item.id); setIsMobileMenuOpen(false); playPositiveSound(); }} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${activeNav === item.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100 dark:border-white/5">
           <button onClick={onLogout} className="w-full p-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">خروج</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-10 shrink-0">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400">☰</button>
              <h2 className="text-2xl font-black">{NAV_ITEMS.find(i => i.id === activeNav)?.label}</h2>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">{isDark ? '☀️' : '🌙'}</button>
              <button onClick={onOpenProAnalytics} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">تحليلات PRO</button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
           {activeNav === 'home' && (
             <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                      <p className="text-[10px] font-black uppercase opacity-60 mb-2">إنجاز المسار</p>
                      <h3 className="text-6xl font-black">{Math.round(progress)}%</h3>
                      <div className="mt-8 bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-white h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                      </div>
                   </div>
                   <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الأوسمة</p>
                      <h3 className="text-5xl font-black text-blue-600">{completedCount}</h3>
                   </div>
                   <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المهمات</p>
                      <h3 className="text-5xl font-black text-emerald-500">{userTasks.filter(t => t.status === 'APPROVED').length}</h3>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xl font-black px-2">خارطة التسريع</h3>
                   <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[3rem] overflow-hidden">
                      {levels.map((level) => {
                        const colorSet = getLevelColorSet(level.customColor);
                        const levelTask = userTasks.find(t => t.levelId === level.id);
                        const displayIcon = getRelevantIcon(level.title);
                        const isApproved = levelTask?.status === 'APPROVED';

                        return (
                          <div 
                            key={level.id} 
                            onClick={() => !level.isLocked && onSelectLevel(level.id)} 
                            className={`p-8 flex items-center justify-between border-b last:border-none dark:border-white/5 transition-all ${level.isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5'} group`}
                          >
                             <div className="flex items-center gap-8">
                                <div className="flex flex-col items-center gap-2">
                                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-all ${level.isCompleted ? (colorSet.bg + ' text-white') : (level.isLocked ? 'bg-slate-100 text-slate-400' : colorSet.light + ' ' + colorSet.text)} group-hover:scale-110`}>
                                      {level.isCompleted ? '✓' : displayIcon}
                                   </div>
                                   {isApproved && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); alert('عرض مخرجات ' + level.title); }} 
                                        className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[8px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-xs whitespace-nowrap"
                                      >
                                        عرض المخرجات
                                      </button>
                                   )}
                                </div>
                                <div>
                                   <h4 className="font-black text-lg">{level.title}</h4>
                                   <p className="text-sm text-slate-500 mt-1">{level.description}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                {!level.isLocked && levelTask?.status !== 'APPROVED' && levelTask?.status !== 'SUBMITTED' && (
                                    <button onClick={(e) => { e.stopPropagation(); handleAIGenerateSubmission(levelTask!); }} disabled={isGeneratingAI} className="px-6 py-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">توليد المخرج بواسطة AI</button>
                                )}
                                {level.isLocked && <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">مغلق</span>}
                                {levelTask?.status === 'SUBMITTED' && <span className="text-xs font-bold text-amber-500 uppercase tracking-widest animate-pulse">قيد المراجعة</span>}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
           )}
           {activeNav === 'builder' && <div className="text-center py-20 text-slate-500 font-bold">بوابة بناء المشروع الذكي تظهر هنا...</div>}
        </div>
      </main>
    </div>
  );
};