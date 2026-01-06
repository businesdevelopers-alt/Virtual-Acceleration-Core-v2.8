
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

const LEVEL_ICON_MAP: Record<number, string> = {
  1: '🔎', // Strategic Verification
  2: '📐', // Business Model Structuring
  3: '🏗️', // MVP Engineering
  4: '📈', // Growth Analysis
  5: '🏦', // Financial Modeling
  6: '🚀'  // Investment Readiness
};

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
    { id: 'opportunity_lab', label: t.dashboard.lab, icon: '🧭' },
    { id: 'services', label: t.dashboard.services, icon: '🛠️' }, 
    { id: 'startup_profile', label: t.dashboard.profile, icon: '📈' },
  ];

  const [userProfile, setUserProfile] = useState<UserProfile>(initialUser);
  const [userTasks, setUserTasks] = useState<TaskRecord[]>([]);
  const [userRequests, setUserRequests] = useState<ServiceRequest[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [submissionFile, setSubmissionFile] = useState<{data: string, name: string} | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [serviceDetails, setServiceDetails] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzingOpp, setIsAnalyzingOpp] = useState(false);
  const [oppResult, setOppResult] = useState<OpportunityAnalysis | null>(null);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskFileRef = useRef<HTMLInputElement>(null);

  // Profile Specific State
  const [newPartner, setNewPartner] = useState<Partner>({ name: '', role: '' });

  const completedCount = levels.filter(l => l.isCompleted).length;
  const progress = (completedCount / levels.length) * 100;
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
      const requests = storageService.getUserServiceRequests(session.uid);
      setUserRequests(requests);

      const startups = storageService.getAllStartups();
      const currentStartup = startups.find(s => s.projectId === session.projectId);
      const usersList = storageService.getAllUsers();
      const currentUserRecord = usersList.find(u => u.uid === session.uid);

      if (currentStartup && currentUserRecord) {
        setUserProfile(prev => ({
          ...prev,
          firstName: currentUserRecord.firstName,
          lastName: currentUserRecord.lastName,
          email: currentUserRecord.email,
          phone: currentUserRecord.phone,
          founderBio: currentUserRecord.founderBio || '',
          startupName: currentStartup.name,
          startupDescription: currentStartup.description,
          startupBio: currentStartup.startupBio || '',
          industry: currentStartup.industry,
          website: currentStartup.website || '',
          linkedin: currentStartup.linkedin || '',
          partners: currentStartup.partners || [],
          logo: localStorage.getItem(`logo_${session.uid}`) || undefined
        }));
      }
    }
  }, [activeNav, levels]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUserProfile(prev => ({ ...prev, logo: base64 }));
        const session = storageService.getCurrentSession();
        if (session) localStorage.setItem(`logo_${session.uid}`, base64);
        playPositiveSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaskSubmit = () => {
    if (!selectedTask || !submissionFile) return;
    const session = storageService.getCurrentSession();
    storageService.submitTask(session.uid, selectedTask.id, {
      fileData: submissionFile.data,
      fileName: submissionFile.name
    });
    setUserTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'SUBMITTED' } : t));
    setSelectedTask(null);
    setSubmissionFile(null);
    playCelebrationSound();
  };

  const handleAIGenerateSubmission = async (taskToUse?: TaskRecord) => {
    const targetTask = taskToUse || selectedTask;
    if (!targetTask) return;
    setIsGeneratingAI(true);
    playPositiveSound();
    
    try {
      const context = `Startup: ${userProfile.startupName}, Industry: ${userProfile.industry}, Mission: ${userProfile.startupBio}`;
      const review = await reviewDeliverableAI(targetTask.title, targetTask.description, context);
      
      const session = storageService.getCurrentSession();
      if (session) {
        storageService.submitTask(session.uid, targetTask.id, {
          fileData: `data:text/plain;base64,${btoa("AI Generated deliverable for " + targetTask.title + ". Review score: " + review.readinessScore)}`,
          fileName: `AI_Generated_${targetTask.title.replace(/\s+/g, '_')}.pdf`
        }, review);
        
        setUserTasks(prev => prev.map(t => t.id === targetTask.id ? { ...t, status: 'SUBMITTED' } : t));
        playCelebrationSound();
        setSelectedTask(null);
      }
    } catch (e) {
      alert("حدث خطأ أثناء التوليد الذكي للمخرج.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    const session = storageService.getCurrentSession();
    if (session) {
      storageService.updateUser(session.uid, {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        founderBio: userProfile.founderBio
      });
      storageService.updateStartup(session.projectId, {
        name: userProfile.startupName,
        description: userProfile.startupDescription,
        startupBio: userProfile.startupBio,
        industry: userProfile.industry,
        website: userProfile.website,
        linkedin: userProfile.linkedin,
        partners: userProfile.partners
      });
    }
    setTimeout(() => {
      setIsSaving(false);
      playCelebrationSound();
    }, 1000);
  };

  const addPartner = () => {
    if (!newPartner.name.trim() || !newPartner.role.trim()) return;
    setUserProfile(prev => ({
      ...prev,
      partners: [...(prev.partners || []), newPartner]
    }));
    setNewPartner({ name: '', role: '' });
    playPositiveSound();
  };

  const removePartner = (index: number) => {
    setUserProfile(prev => ({
      ...prev,
      partners: prev.partners?.filter((_, i) => i !== index)
    }));
  };

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
    playPositiveSound();
  };

  const handleServiceRequestSubmit = () => {
    if (!selectedService || !selectedPackageId) return;
    const session = storageService.getCurrentSession();
    if (session) {
      storageService.requestService(session.uid, selectedService.id, selectedPackageId, serviceDetails);
      const requests = storageService.getUserServiceRequests(session.uid);
      setUserRequests(requests);
      setSelectedService(null);
      setSelectedPackageId(null);
      setServiceDetails('');
      playCelebrationSound();
      alert('تم إرسال طلب الخدمة بنجاح!');
    }
  };

  const handleRunOppAnalysis = async () => {
    setIsAnalyzingOpp(true);
    try {
      const result = await discoverOpportunities(userProfile.startupName, userProfile.startupDescription, userProfile.industry);
      setOppResult(result);
      playCelebrationSound();
    } catch (e) { alert("Failed."); } finally { setIsAnalyzingOpp(false); }
  };

  const handleAISuggest = async () => {
    if (!onAISuggestIcons) return;
    setIsAISuggesting(true);
    try {
      await onAISuggestIcons();
      playCelebrationSound();
    } catch (e) { alert('Failed.'); } finally { setIsAISuggesting(false); }
  };

  const getLevelColorSet = (colorName?: string) => {
    return PRESET_COLORS.find(c => c.name === colorName) || PRESET_COLORS[0];
  };

  const getTaskForLevel = (levelId: number) => {
    return userTasks.find(t => t.levelId === levelId);
  };

  const getStatusBadge = (task?: TaskRecord) => {
    if (!task) return null;
    switch (task.status) {
      case 'SUBMITTED': return <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded-md border border-amber-200">قيد المراجعة</span>;
      case 'APPROVED': return <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-200">مكتمل ✓</span>;
      case 'ASSIGNED': return <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md border border-blue-200">بانتظار التسليم</span>;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-500`} dir={t.dir}>
      <style>{`
        .sidebar-neo { backdrop-filter: blur(40px); background: ${isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.7)'}; border-left: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .dashboard-header { backdrop-filter: blur(20px); background: ${isDark ? 'rgba(2, 6, 23, 0.6)' : 'rgba(248, 250, 252, 0.6)'}; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; }
        .active-nav { background: #2563eb; color: white; box-shadow: 0 12px 30px -10px rgba(37, 99, 235, 0.5); transform: ${t.dir === 'rtl' ? 'translateX(-6px)' : 'translateX(6px)'}; }
        .card-neo { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); border: 1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}; background: ${isDark ? 'rgba(30, 41, 59, 0.25)' : 'rgba(255, 255, 255, 0.9)'}; }
        .card-neo:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
        .input-profile { width: 100%; padding: 1rem; border-radius: 1rem; border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}; outline: none; transition: all 0.3s; font-weight: bold; }
        .input-profile:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); background: ${isDark ? 'rgba(255,255,255,0.05)' : 'white'}; }
      `}</style>

      {/* Floating Modern Sidebar */}
      <aside className={`fixed inset-y-0 ${t.dir === 'rtl' ? 'right-0' : 'left-0'} z-50 w-72 lg:static transition-transform duration-700 ${isMobileMenuOpen ? 'translate-x-0' : (t.dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')} sidebar-neo flex flex-col m-4 rounded-[3rem] shadow-premium`}>
        <div className="p-10 text-center space-y-6">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] blur-[30px] opacity-10 group-hover:opacity-40 transition-opacity"></div>
            <div className="w-24 h-24 mx-auto relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.2rem] flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/20 transform group-hover:rotate-12 transition-transform duration-500">
              {userProfile.logo ? <img src={userProfile.logo} className="w-full h-full object-cover" alt="logo" /> : <span className="text-white text-4xl font-black">BD</span>}
            </div>
          </div>
          <div>
            <h2 className={`font-black text-xl truncate tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{userProfile.startupName}</h2>
            <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-emerald-500/10 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Growth Phase</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-6">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveNav(item.id); setIsMobileMenuOpen(false); playPositiveSound(); }} 
              className={`w-full flex items-center justify-between p-4 rounded-[1.8rem] font-bold text-sm transition-all duration-300 group ${activeNav === item.id ? 'active-nav' : `text-slate-400 hover:bg-blue-600/5 hover:text-blue-500`}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl transition-all duration-300 group-hover:scale-125 ${activeNav === item.id ? '' : 'grayscale opacity-50'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {activeNav === item.id && <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4">
          <div className="px-4 mb-4">
             <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} variant="minimal" />
          </div>
          <button onClick={() => { const n = isDark ? 'light' : 'dark'; setThemeMode(n); localStorage.setItem('dashboard_theme_mode', n); }} className={`w-full p-4 rounded-2xl border transition-all duration-300 ${isDark ? 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-amber-400' : 'border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-500'} text-[10px] font-black uppercase tracking-widest`}>
             {isDark ? '☀️ Switch Theme' : '🌙 Switch Theme'}
          </button>
          <button onClick={onLogout} className="w-full p-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/5 rounded-2xl transition-colors">{t.dashboard.logout}</button>
        </div>
      </aside>

      {/* Main Experience Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 dashboard-header flex items-center justify-between px-10 z-40">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 glass rounded-2xl text-blue-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <h2 className={`text-3xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{NAV_ITEMS.find(i => i.id === activeNav)?.label}</h2>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 opacity-80">AI Accelerator v2.8</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              {activeNav === 'startup_profile' && (
                <button onClick={handleSaveProfile} disabled={isSaving} className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 active:scale-95 transition-all hover:bg-blue-700">
                  {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              )}
              {activeNav === 'home' && (
                 <>
                   <button onClick={handleAISuggest} disabled={isAISuggesting} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50">
                    {isAISuggesting ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '✨'}
                    <span>تحديث الأيقونات (AI)</span>
                  </button>
                  <button onClick={onOpenProAnalytics} className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-blue-700">تحليلات PRO</button>
                 </>
              )}
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 relative">
           {activeNav === 'home' && (
             <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up pb-20">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3.5rem] text-white premium-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
                      <p className="text-[11px] font-black uppercase opacity-60 mb-2 tracking-[0.2em]">إنجاز المسار التدريبي</p>
                      <h3 className="text-6xl font-black tracking-tighter">{Math.round(progress)}%</h3>
                      <div className="mt-10 bg-white/20 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-white h-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                      </div>
                   </div>
                   <div className={`p-10 rounded-[3.5rem] card-neo flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>الأوسمة المحققة</p>
                        <span className="text-3xl">🛡️</span>
                      </div>
                      <h3 className={`text-6xl font-black mt-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{completedCount}</h3>
                   </div>
                   <div className={`p-10 rounded-[3.5rem] card-neo flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>المهام المكتملة</p>
                        <span className="text-3xl">📝</span>
                      </div>
                      <h3 className={`text-6xl font-black mt-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{userTasks.filter(t => t.status === 'SUBMITTED' || t.status === 'APPROVED').length}</h3>
                   </div>
                </div>

                {/* Roadmap List */}
                <div className="space-y-8">
                   <div className="flex justify-between items-center px-4">
                      <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>تفاصيل محطات التسريع والمخرجات</h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{completedCount} من {levels.length} محطات مكتملة</span>
                   </div>
                   <div className={`rounded-[3.5rem] card-neo overflow-hidden`}>
                      <div className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                        {levels.map((level) => {
                          const colorSet = getLevelColorSet(level.customColor);
                          const levelTask = getTaskForLevel(level.id);
                          const levelIcon = LEVEL_ICON_MAP[level.id] || level.icon;
                          return (
                            <div 
                              key={level.id} 
                              onClick={() => !level.isLocked && onSelectLevel(level.id)} 
                              className={`p-8 flex items-center justify-between transition-all duration-300 ${level.isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600/[0.03]'} group`}
                            >
                               <div className="flex items-center gap-8 flex-1 min-w-0">
                                  <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-4xl shrink-0 transition-all premium-shadow ${level.isCompleted ? (colorSet.bg) + ' text-white' : (level.isLocked ? (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300') : colorSet.light + ' ' + colorSet.text)} group-hover:scale-110 group-hover:rotate-3`}>
                                     {level.isCompleted ? '✓' : levelIcon}
                                  </div>
                                  <div className="truncate">
                                    <div className="flex items-center gap-3">
                                      <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>LEVEL 0{level.id}</span>
                                      <h4 className={`font-black text-xl transition-colors ${!level.isLocked ? 'group-hover:' + colorSet.text : ''}`}>
                                        {level.title}
                                      </h4>
                                      {getStatusBadge(levelTask)}
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium truncate mt-1 opacity-80">{level.description}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-6 shrink-0 px-6">
                                  {level.isLocked ? (
                                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${isDark ? 'bg-slate-900 border-white/5 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                        <span className="text-xs">🔒</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">مغلق حالياً</span>
                                    </div>
                                  ) : (
                                    <div className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl border transition-all duration-300 ${level.isCompleted ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1'}`}>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{level.isCompleted ? 'مكتمل' : 'دخول المحطة'}</span>
                                        <span className="text-xl leading-none">{level.isCompleted ? '✓' : '→'}</span>
                                    </div>
                                  )}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeNav === 'builder' && (
             <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up pb-20">
                <div className="text-center space-y-4">
                   <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 mx-auto">
                      AI Co-Founder Squad
                   </div>
                   <h3 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">بناء الفريق الرقمي</h3>
                   <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">اختر الوكلاء الأنسب لمساعدتك في بناء مخرجات مشروعك وتجاوز التحديات الاستراتيجية.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {(['Vision', 'Market', 'User', 'Opportunity'] as AgentCategory[]).map(category => (
                     <div key={category} className="space-y-6">
                        <h4 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] px-4 flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                           {category === 'Vision' ? 'الرؤية والاستراتيجية' : 
                            category === 'Market' ? 'تحليل السوق' : 
                            category === 'User' ? 'تجربة المستخدم' : 'فرص النمو'}
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                           {AVAILABLE_AGENTS.filter(a => a.category === category).map(agent => (
                             <button 
                               key={agent.id}
                               onClick={() => toggleAgent(agent.id)}
                               className={`p-8 rounded-[2.5rem] card-neo text-right transition-all duration-300 relative group border-2
                                 ${selectedAgents.includes(agent.id) ? 'border-blue-600 ring-4 ring-blue-500/10' : 'border-transparent'}
                               `}
                             >
                                <div className="flex justify-between items-start mb-4">
                                   <h5 className="text-xl font-black dark:text-white">{agent.name}</h5>
                                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedAgents.includes(agent.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                                      {selectedAgents.includes(agent.id) && '✓'}
                                   </div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{agent.description}</p>
                                {selectedAgents.includes(agent.id) && (
                                   <div className="absolute top-0 right-0 w-16 h-1 bg-blue-600 rounded-bl-full"></div>
                                )}
                             </button>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex justify-center pt-10">
                   <button 
                     disabled={selectedAgents.length === 0}
                     onClick={() => { playCelebrationSound(); alert('جاري تحضير جلسة البناء مع الوكلاء المختارين...'); }}
                     className="px-20 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30"
                   >
                      بدء جلسة البناء الذكية 🚀
                   </button>
                </div>
             </div>
           )}

           {activeNav === 'tasks' && (
             <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {userTasks.map(task => (
                     <div key={task.id} className="p-10 rounded-[3.5rem] card-neo">
                        <div className="flex justify-between items-center mb-8">
                           <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Milestone 0{task.levelId}</span>
                           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${task.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-600 border-blue-100' : task.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{task.status === 'APPROVED' ? 'مقبول' : task.status}</span>
                        </div>
                        <h4 className="text-2xl font-black mb-4 leading-tight">{task.title}</h4>
                        <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">{task.description}</p>
                        {task.status === 'ASSIGNED' && (
                           <div className="space-y-3">
                              <button onClick={() => setSelectedTask(task)} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm hover:brightness-110 transition-all shadow-xl shadow-blue-600/20 active:scale-95">تسليم المخرج (PDF)</button>
                              <button 
                                onClick={() => handleAIGenerateSubmission(task)}
                                disabled={isGeneratingAI}
                                className="w-full py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
                              >
                                {isGeneratingAI ? (
                                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-indigo-600 rounded-full animate-spin"></div>
                                ) : (
                                  <>
                                    <span className="text-lg group-hover:rotate-12 transition-transform">✨</span>
                                    <span>توليد المخرج فوراً (AI)</span>
                                  </>
                                )}
                              </button>
                           </div>
                        )}
                        {task.status === 'SUBMITTED' && (
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تم الرفع: {task.submission?.fileName}</p>
                              <p className="text-[10px] text-amber-500 font-bold mt-1">جاري المراجعة الاستراتيجية</p>
                           </div>
                        )}
                        {task.status === 'APPROVED' && (
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                             <p className="text-[10px] text-emerald-600 font-black uppercase">تم قبول المخرج بنجاح ✓</p>
                          </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeNav === 'opportunity_lab' && (
             <div className="max-w-6xl mx-auto space-y-14 animate-fade-in-up pb-20">
                <div className="text-center space-y-6">
                   <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 mx-auto">
                      AI Deep Analysis Engine
                   </div>
                   <h3 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">مختبر الفرص والنمو</h3>
                   <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">استخدم وكلاء Gemini المتطورين لاكتشاف أسواق جديدة غير مخدومة لمشروعك.</p>
                </div>
                {!oppResult && (
                  <div className="flex flex-col items-center py-24 space-y-10">
                     <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-5xl animate-bounce">🧭</div>
                     <button onClick={handleRunOppAnalysis} disabled={isAnalyzingOpp} className="px-16 py-6 bg-slate-900 text-white rounded-[2.2rem] font-black text-xl shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-5">
                        {isAnalyzingOpp ? (
                          <>
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>جاري المسح الاستراتيجي...</span>
                          </>
                        ) : 'تفعيل محرك المسح الاستراتيجي'}
                     </button>
                  </div>
                )}
                {oppResult && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in-up">
                    <div className="lg:col-span-2 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {oppResult.newMarkets.map((m, i) => (
                            <div key={i} className={`p-10 rounded-[3.5rem] card-neo relative overflow-hidden`}>
                               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[4rem]"></div>
                               <h5 className="text-2xl font-black text-blue-600 mb-6">{m.region}</h5>
                               <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{m.reasoning}</p>
                               <div className="mt-8 flex items-center gap-4">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ROI Potential:</span>
                                  <span className="text-sm font-black text-emerald-500">{m.potentialROI}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className="p-12 bg-gradient-to-br from-indigo-600 to-blue-800 text-white rounded-[4rem] premium-shadow relative overflow-hidden group">
                          <div className="absolute top-[-20px] left-[-20px] text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-700">💭</div>
                          <h4 className="text-xl font-black mb-8 relative z-10 flex items-center gap-4">
                             <span className="w-1.5 h-6 bg-white/40 rounded-full"></span>
                             استراتيجية المحيط الأزرق
                          </h4>
                          <p className="italic font-medium text-xl leading-relaxed opacity-95 relative z-10">"{oppResult.blueOceanIdea}"</p>
                       </div>
                    </div>
                  </div>
                )}
             </div>
           )}

           {activeNav === 'services' && (
             <div className="max-w-6xl mx-auto space-y-14 animate-fade-in pb-20">
                <div className="text-center space-y-4">
                   <h3 className="text-5xl font-black tracking-tight">خدمات التنفيذ المتميزة</h3>
                   <p className="text-slate-500 text-lg font-medium">فريق متخصص لنمذجة مخرجاتك الريادية بجودة استثمارية عالمية.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {SERVICES_CATALOG.map(svc => (
                     <div key={svc.id} className={`p-12 rounded-[3.5rem] card-neo flex flex-col justify-between`}>
                        <div>
                          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-inner">{svc.icon}</div>
                          <h4 className="text-2xl font-black mb-4 leading-tight">{svc.title}</h4>
                          <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium line-clamp-3">{svc.description}</p>
                        </div>
                        <button onClick={() => { setSelectedService(svc); playPositiveSound(); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-lg">اكتشف الباقات المتاحة</button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeNav === 'startup_profile' && (
             <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-20">
                {/* Founder Info Card */}
                <div className="p-10 rounded-[3rem] card-neo space-y-10 relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">👤</div>
                      <h3 className="text-2xl font-black">بيانات المؤسس</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">الاسم الأول</label>
                        <input className="input-profile" value={userProfile.firstName} onChange={e => setUserProfile({...userProfile, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">اللقب</label>
                        <input className="input-profile" value={userProfile.lastName} onChange={e => setUserProfile({...userProfile, lastName: e.target.value})} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">النبذة الشخصية (Bio)</label>
                        <textarea className="input-profile h-32 resize-none leading-relaxed" placeholder="تحدث عن خبراتك ومهاراتك الريادية..." value={userProfile.founderBio} onChange={e => setUserProfile({...userProfile, founderBio: e.target.value})} />
                      </div>
                   </div>
                </div>

                {/* Company Info Card */}
                <div className="p-10 rounded-[3rem] card-neo space-y-10">
                   <div className="flex flex-col md:flex-row gap-12">
                      <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                           <div className="w-48 h-48 rounded-[3.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 overflow-hidden shadow-inner group-hover:border-blue-500 transition-colors">
                              {userProfile.logo ? <img src={userProfile.logo} className="w-full h-full object-cover" alt="logo" /> : <span className="text-6xl opacity-30">📁</span>}
                           </div>
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-[3.5rem] transition-opacity font-black text-[10px] uppercase tracking-widest">رفع الشعار</div>
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">شعار المشروع الرسمي</p>
                      </div>

                      <div className="flex-1 space-y-8">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">اسم المشروع</label>
                               <input className="input-profile" value={userProfile.startupName} onChange={e => setUserProfile({...userProfile, startupName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">القطاع</label>
                               <select className="input-profile" value={userProfile.industry} onChange={e => setUserProfile({...userProfile, industry: e.target.value})}>
                                  {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">الموقع الإلكتروني</label>
                               <input className="input-profile font-mono text-sm" placeholder="https://..." value={userProfile.website} onChange={e => setUserProfile({...userProfile, website: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">LinkedIn الشركة</label>
                               <input className="input-profile font-mono text-sm" placeholder="https://linkedin.com/company/..." value={userProfile.linkedin} onChange={e => setUserProfile({...userProfile, linkedin: e.target.value})} />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">نبذة عن الشركة (Mission)</label>
                            <textarea className="input-profile h-40 resize-none leading-relaxed" placeholder="ما هي رؤيتكم والهدف الجوهري للمشروع؟" value={userProfile.startupBio} onChange={e => setUserProfile({...userProfile, startupBio: e.target.value})} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Team / Partners Card */}
                <div className="p-10 rounded-[3rem] card-neo space-y-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">👥</div>
                      <h3 className="text-2xl font-black">الشركاء المؤسسين (Team)</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إضافة شريك جديد</p>
                           <div className="space-y-3">
                              <input className="input-profile bg-white dark:bg-slate-900 shadow-sm" placeholder="اسم الشريك" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} />
                              <input className="input-profile bg-white dark:bg-slate-900 shadow-sm" placeholder="الدور (مثال: شريك تقني)" value={newPartner.role} onChange={e => setNewPartner({...newPartner, role: e.target.value})} />
                              <button onClick={addPartner} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">إضافة الشريك للقائمة</button>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                         {userProfile.partners && userProfile.partners.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                               {userProfile.partners.map((p, i) => (
                                 <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 flex justify-between items-center group animate-fade-in">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black">{p.name.charAt(0)}</div>
                                       <div>
                                          <p className="font-black text-sm">{p.name}</p>
                                          <p className="text-[10px] text-slate-500 font-bold uppercase">{p.role}</p>
                                       </div>
                                    </div>
                                    <button onClick={() => removePartner(i)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2">✕</button>
                                 </div>
                               ))}
                            </div>
                         ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-center opacity-30">
                               <p className="text-5xl mb-4">🤝</p>
                               <p className="font-bold text-sm">لا يوجد شركاء مسجلين حتى الآن</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="flex justify-center pt-10">
                   <button onClick={handleSaveProfile} disabled={isSaving} className="px-20 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50">
                      {isSaving ? 'جاري مزامنة البيانات...' : 'حفظ الملف التعريفي 🚀'}
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* Task Submission Modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in" dir="rtl">
            <div className={`max-w-2xl w-full p-12 rounded-[4rem] ${isDark ? 'bg-slate-900 border border-white/5 text-white' : 'bg-white shadow-2xl text-slate-900'} animate-fade-in-up`}>
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-3xl font-black tracking-tight">تسليم: {selectedTask.title}</h3>
                    <p className="text-blue-50 text-[10px] font-black uppercase tracking-widest mt-1">Deliverable Submission Portal (PDF Only)</p>
                 </div>
                 <button onClick={() => { setSelectedTask(null); setSubmissionFile(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">✕</button>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 mb-8">
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{selectedTask.description}</p>
              </div>
              
              <div className="space-y-6">
                <div onClick={() => !isGeneratingAI && taskFileRef.current?.click()} className={`w-full h-56 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${submissionFile ? 'bg-emerald-500/5 border-emerald-500' : (isDark ? 'bg-slate-800 border-white/5 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:border-blue-500/50')}`}>
                   <input type="file" ref={taskFileRef} className="hidden" accept="application/pdf" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type === 'application/pdf') {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSubmissionFile({ data: reader.result as string, name: file.name });
                          playPositiveSound();
                        };
                        reader.readAsDataURL(file);
                      }
                   }} />
                   {submissionFile ? (
                     <>
                        <span className="text-4xl mb-2">📄</span>
                        <p className="font-black text-emerald-500 text-lg">{submissionFile.name}</p>
                        <p className="text-xs text-slate-400 mt-2">انقر لتغيير الملف</p>
                     </>
                   ) : (
                     <>
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-4 transform group-hover:scale-110 transition-transform">📁</div>
                        <p className="font-black text-slate-400">انقر هنا لرفع مخرجك النهائي بصيغة PDF</p>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Maximum Size: 5MB</p>
                     </>
                   )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm font-bold">
                    <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 uppercase tracking-widest text-[9px]">أو التوليد الفوري</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleAIGenerateSubmission()}
                  disabled={isGeneratingAI || submissionFile !== null}
                  className={`w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-[2rem] font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 group
                    ${(isGeneratingAI || submissionFile !== null) ? 'opacity-30' : 'hover:brightness-110 shadow-blue-500/20'}
                  `}
                >
                  {isGeneratingAI ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-xl group-hover:rotate-12 transition-transform">✨</span>
                      <span>توليد المخرج آلياً بواسطة الذكاء الاصطناعي</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => { setSelectedTask(null); setSubmissionFile(null); }} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 transition-colors">إغلاق</button>
                <button 
                  onClick={handleTaskSubmit} 
                  disabled={!submissionFile || isGeneratingAI} 
                  className="flex-[2] py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-3xl shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  إرسال المخرج للمراجعة 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* selectedService Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in" dir="rtl">
            <div className={`max-w-4xl w-full p-10 md:p-14 rounded-[4rem] ${isDark ? 'bg-slate-900 border border-white/5 text-white' : 'bg-white shadow-2xl text-slate-900'} animate-fade-in-up overflow-y-auto max-h-[90vh]`}>
               <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-xl text-white">{selectedService.icon}</div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">{selectedService.title}</h3>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-1">Premium Execution Services</p>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedService(null); setSelectedPackageId(null); setServiceDetails(''); }} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-2xl">✕</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {selectedService.packages.map(pkg => (
                    <button 
                      key={pkg.id} 
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-8 rounded-[2.5rem] border-4 text-right transition-all duration-300 relative group
                        ${selectedPackageId === pkg.id 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/20' 
                          : (isDark ? 'bg-white/5 border-white/5 hover:border-blue-500/50' : 'bg-slate-50 border-slate-100 hover:border-blue-500/50')}
                      `}
                    >
                      <div className="flex justify-between items-start mb-6">
                         <h4 className="text-2xl font-black">{pkg.name}</h4>
                         <span className={`text-xl font-black ${selectedPackageId === pkg.id ? 'text-white' : 'text-blue-600'}`}>{pkg.price}</span>
                      </div>
                      <ul className="space-y-3 mb-4">
                         {pkg.features.map((f, i) => (
                           <li key={i} className={`text-sm font-bold flex items-center gap-3 ${selectedPackageId === pkg.id ? 'text-blue-50' : 'text-slate-500'}`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${selectedPackageId === pkg.id ? 'bg-white' : 'bg-blue-50'}`}></span>
                             {f}
                           </li>
                         ))}
                      </ul>
                      {selectedPackageId === pkg.id && (
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center text-lg shadow-lg">✓</div>
                      )}
                    </button>
                  ))}
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">تفاصيل إضافية أو متطلبات خاصة:</label>
                  <textarea 
                    className={`w-full h-32 p-6 rounded-[2rem] border outline-none font-medium resize-none transition-all
                      ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-slate-50 border-slate-100 focus:border-blue-500'}
                    `}
                    placeholder="اكتب هنا أي تفاصيل تود مشاركتها مع فريق التنفيذ..."
                    value={serviceDetails}
                    onChange={e => setServiceDetails(e.target.value)}
                  />
               </div>

               <div className="flex gap-4 mt-12">
                  <button onClick={() => { setSelectedService(null); setSelectedPackageId(null); setServiceDetails(''); }} className="flex-1 py-6 font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest text-xs">إلغاء الطلب</button>
                  <button 
                    onClick={handleServiceRequestSubmit} 
                    disabled={!selectedPackageId} 
                    className="flex-[2] py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-blue-500/30 disabled:opacity-30 active:scale-95 transition-all hover:bg-blue-700"
                  >
                    تأكيد وإرسال طلب التنفيذ 🚀
                  </button>
               </div>
            </div>
          </div>
        )}

        {showRatingModal && <ProgramEvaluation onClose={() => setShowRatingModal(false)} onSubmit={() => {}} />}
      </main>
    </div>
  );
};
