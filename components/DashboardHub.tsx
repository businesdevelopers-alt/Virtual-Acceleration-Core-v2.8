
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserRole, UserProfile, LevelData, TaskRecord, ProgramRating, ACADEMY_BADGES, SECTORS, Notification } from '../types';
import { playPositiveSound, playCelebrationSound } from '../services/audioService';
import { storageService } from '../services/storageService';
import { suggestIconsForLevels, reviewDeliverableAI } from '../services/geminiService';
import { LevelView } from './LevelView';
import { ProgramEvaluation } from './ProgramEvaluation';
import { Certificate } from './Certificate';
import { DocumentsPortal } from './DocumentsPortal';
import { CodeEditor } from './CodeEditor';
import { NotificationCenter } from './NotificationCenter';

interface DashboardHubProps {
  user: UserProfile & { uid: string; role: UserRole; startupId?: string };
  onLogout: () => void;
  lang: any;
  onNavigateToStage: (stage: any) => void;
}

const DEFAULT_DEV_CODE = `/**
 * Startup Logic Engine v1.0
 * Sector: AI & Fintech
 * Core logic for the automated acceleration protocol.
 */

interface Startup {
  id: string;
  name: string;
  stage: 'Discovery' | 'Prototype' | 'MVP' | 'Scaling';
  metrics: {
    readiness: number;
    marketFit: number;
  };
}

class AcceleratorCore {
  private startups: Startup[] = [];

  constructor(private api_key: string) {}

  public async evaluateProject(project: Startup): Promise<number> {
    console.log(\`Analyzing project: \${project.name}\`);
    
    // AI Decision Logic
    if (project.metrics.readiness > 85) {
       return 100; // Ready for Investment
    }
    
    return project.metrics.readiness * 1.1;
  }
}

const bizDev = new AcceleratorCore("BIZ_DEV_SECURE_TOKEN");
export default bizDev;`;

// خريطة أيقونات مستويات خارطة الطريق لضمان الفرادة والارتباط بالمعنى
const LEVEL_ICON_MAP: Record<number, string> = {
  1: '🔎', // Strategic Verification
  2: '📐', // Business Model Structuring
  3: '🏗️', // MVP Engineering
  4: '📊', // Feasibility & Growth
  5: '🏦', // Financial Modeling
  6: '🚀'  // Investment Readiness
};

export const DashboardHub: React.FC<DashboardHubProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'tasks' | 'profile' | 'documents' | 'evaluation' | 'lab'>('roadmap');
  const [roadmap, setRoadmap] = useState<LevelData[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [existingRating, setExistingRating] = useState<ProgramRating | null>(null);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [showFullCert, setShowFullCert] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifCenter, setShowNotifCenter] = useState(false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  const [profileData, setProfileData] = useState<UserProfile>(user);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAllData = () => {
    const currentRoadmap = storageService.getCurrentRoadmap(user.uid);
    setRoadmap(currentRoadmap);
    setTasks(storageService.getUserTasks(user.uid));
    setExistingRating(storageService.getProgramRating(user.uid));
    setNotifications(storageService.getNotifications(user.uid));
    
    const users = storageService.getAllUsers();
    const currentUser = users.find((u: any) => u.uid === user.uid) as any;
    if (currentUser) {
      setEarnedBadgeIds(currentUser.earnedBadges || []);
    }

    const startups = storageService.getAllStartups();
    const startup = startups.find(s => s.projectId === user.startupId);
    if (startup && currentUser) {
      setProfileData({
        ...currentUser,
        startupName: startup.name,
        startupDescription: startup.description,
        industry: startup.industry || 'AI',
        startupStage: (startup as any).currentTrack || 'Idea',
        website: startup.website,
        linkedin: startup.linkedin,
        startupBio: startup.startupBio,
        logo: localStorage.getItem(`logo_${user.uid}`) || undefined
      });
    }
  };

  useEffect(() => {
    loadAllData();

    // Listen for new notifications to show toast
    const handleNewNotif = (e: any) => {
      const newNotif = e.detail as Notification;
      if (newNotif.uid === user.uid) {
        setActiveToast(newNotif);
        loadAllData();
        setTimeout(() => setActiveToast(null), 5000);
      }
    };

    window.addEventListener('new-notification', handleNewNotif);
    return () => window.removeEventListener('new-notification', handleNewNotif);
  }, [user.uid]);

  // Simulated Deadline Check
  useEffect(() => {
    const checkDeadlines = () => {
      const assignedTasks = tasks.filter(t => t.status === 'ASSIGNED');
      if (assignedTasks.length > 0) {
        const lastWarning = notifications.find(n => n.type === 'WARNING' && n.title.includes('موعد'));
        const isOldWarning = lastWarning ? (Date.now() - new Date(lastWarning.createdAt).getTime() > 3600000) : true;

        if (isOldWarning) {
          storageService.addNotification(user.uid, {
            title: 'اقتراب موعد التسليم النهائي',
            message: `تنبيه استراتيجي: لديك ${assignedTasks.length} مهام نشطة تتطلب التسليم خلال الساعات القادمة لضمان بقاء نقاط الجاهزية مرتفعة.`,
            type: 'WARNING'
          });
        }
      }
    };

    const interval = setInterval(checkDeadlines, 300000);
    checkDeadlines();
    return () => clearInterval(interval);
  }, [tasks, notifications]);

  const stats = useMemo(() => {
    const completed = roadmap.filter(l => l.isCompleted).length;
    const progress = Math.round((completed / roadmap.length) * 100);
    const scoredTasks = tasks.filter(t => t.status === 'APPROVED' && t.aiReview?.score);
    const totalScore = scoredTasks.reduce((sum, t) => sum + (t.aiReview?.score || 0), 0);
    const avgScore = scoredTasks.length > 0 ? Math.round(totalScore / scoredTasks.length) : 0;
    return { progress, avgScore, completedCount: completed };
  }, [roadmap, tasks]);

  const handleOptimizeUI = async () => {
    setIsOptimizing(true);
    playPositiveSound();
    try {
      const result = await suggestIconsForLevels({ 
        name: profileData.startupName, 
        industry: profileData.industry 
      });
      
      const updatedRoadmap = roadmap.map(level => {
        const suggestion = result.suggestions.find((s: any) => s.levelId === level.id);
        if (suggestion) {
          return { ...level, icon: suggestion.icon, customColor: suggestion.color };
        }
        return level;
      });

      setRoadmap(updatedRoadmap);
      localStorage.setItem(`db_roadmap_${user.uid}`, JSON.stringify(updatedRoadmap));
      playCelebrationSound();
    } catch (e) {
      console.error("Optimization failed", e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAIGenerateSubmission = async (task: TaskRecord) => {
    if (user.isDemo) {
      alert("عذراً، لا يمكن استخدام ميزة التوليد الذكي في نمط الحساب التجريبي.");
      return;
    }
    setIsGeneratingAI(true);
    playPositiveSound();
    
    try {
      const context = `Startup: ${profileData.startupName}, Industry: ${profileData.industry}, Mission: ${profileData.startupBio}`;
      const review = await reviewDeliverableAI(task.title, task.description, context);
      
      const fileName = `AI_Generated_${task.title.replace(/\s+/g, '_')}.pdf`;
      const dummyContent = `AI Generated Content for ${task.title}\n\nStrategic Depth Score: ${review.readinessScore}%\nReview Feedback: ${review.criticalFeedback}`;
      
      storageService.submitTask(user.uid, task.id, {
        fileData: `data:application/pdf;base64,${btoa(unescape(encodeURIComponent(dummyContent)))}`,
        fileName
      }, { ...review, score: review.readinessScore });
      
      playCelebrationSound();
      loadAllData();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء التوليد الذكي للمخرج.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getGradientForColor = (color?: string) => {
    switch(color) {
      case 'blue': return 'from-blue-500 to-blue-700';
      case 'emerald': return 'from-emerald-500 to-emerald-700';
      case 'indigo': return 'from-indigo-500 to-indigo-700';
      case 'amber': return 'from-amber-500 to-amber-700';
      case 'rose': return 'from-rose-500 to-rose-700';
      case 'slate': return 'from-slate-700 to-slate-900';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getTailwindBgColor = (color?: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-500';
      case 'emerald': return 'bg-emerald-500';
      case 'indigo': return 'bg-indigo-500';
      case 'amber': return 'bg-amber-500';
      case 'rose': return 'bg-rose-500';
      case 'slate': return 'bg-slate-700';
      default: return 'bg-blue-600';
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileData(prev => ({ ...prev, logo: base64 }));
        localStorage.setItem(`logo_${user.uid}`, base64);
        playPositiveSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (user.isDemo) {
      alert("عذراً، لا يمكن حفظ التغييرات الدائمة في نمط الحساب التجريبي.");
      return;
    }
    setIsSaving(true);
    storageService.updateUser(user.uid, {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      phone: profileData.phone
    });
    storageService.updateStartup(user.startupId!, {
      name: profileData.startupName,
      description: profileData.startupDescription,
      industry: profileData.industry,
      website: profileData.website,
      linkedin: profileData.linkedin,
      startupBio: profileData.startupBio
    });
    
    setTimeout(() => {
      setIsSaving(false);
      playCelebrationSound();
    }, 800);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (selectedLevel) {
    return (
      <LevelView 
        level={selectedLevel} 
        user={user} 
        tasks={tasks}
        onBack={() => setSelectedLevel(null)} 
        onComplete={() => { setSelectedLevel(null); playCelebrationSound(); }}
      />
    );
  }

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-sm text-slate-900";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-2";

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Live Notification Toast */}
      {activeToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md animate-fade-in-down px-4">
           <div className={`p-6 rounded-[2rem] shadow-3xl border-4 flex items-center gap-5 transition-all
              ${activeToast.type === 'SUCCESS' ? 'bg-emerald-600 border-emerald-400 text-white' : 
                activeToast.type === 'WARNING' ? 'bg-amber-500 border-amber-300 text-white' : 
                'bg-blue-600 border-blue-400 text-white'}
           `}>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                {activeToast.type === 'SUCCESS' ? '✅' : activeToast.type === 'WARNING' ? '⚠️' : 'ℹ️'}
              </div>
              <div>
                 <p className="font-black text-sm uppercase tracking-wider">{activeToast.title}</p>
                 <p className="text-xs font-medium opacity-90 leading-relaxed mt-1">{activeToast.message}</p>
              </div>
              <button onClick={() => setActiveToast(null)} className="ml-auto p-2 hover:bg-white/10 rounded-lg">✕</button>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shadow-sm sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">BD</div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">بيزنس ديفلوبرز</h1>
           </div>
           <div className="p-5 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-[40px]"></div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">إجمالي الإنجاز {user.isDemo && '(Demo)'}</p>
              <div className="flex items-end gap-2 mb-3">
                 <span className="text-4xl font-black">{stats.progress}%</span>
                 <span className="text-[9px] font-bold text-slate-500 mb-1">PRO</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full transition-all duration-1000 ease-out" style={{width: `${stats.progress}%`}}></div>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
           {[
             { id: 'roadmap', label: 'خارطة الطريق', icon: '🛣️' },
             { id: 'tasks', label: 'مركز المخرجات', icon: '📥' },
             { id: 'lab', label: 'المختبر التقني', icon: '💻' },
             { id: 'profile', label: 'ملف الشركة', icon: '🏢' },
             { id: 'documents', label: 'الوثائق الرسمية', icon: '📜' },
             { id: 'evaluation', label: 'تقييم البرنامج', icon: '⭐' }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => { setActiveTab(item.id as any); playPositiveSound(); }}
               className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all
                 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
               `}
             >
               <span className="text-xl">{item.icon}</span>
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
           <button onClick={onLogout} className="w-full p-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose 50 rounded-2xl transition-all">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-10 overflow-y-auto relative">
        {user.isDemo && (
          <div className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-between animate-pulse">
             <div className="flex items-center gap-4">
                <span className="text-2xl">🚧</span>
                <div>
                   <p className="text-sm font-black text-amber-900">نمط الحساب التجريبي نشط</p>
                   <p className="text-[10px] font-bold text-amber-700">يمكنك استكشاف جميع الميزات، ولكن لن يتم حفظ التغييرات بشكل دائم.</p>
                </div>
             </div>
             <button onClick={onLogout} className="px-6 py-2 bg-amber-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-800 transition-all">سجل حسابك الحقيقي</button>
          </div>
        )}

        <header className="flex justify-between items-center mb-12 relative">
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {activeTab === 'roadmap' ? 'منهج التسريع المكثف' : 
                 activeTab === 'tasks' ? 'تسليم المخرجات' : 
                 activeTab === 'lab' ? 'المختبر التقني الذكي' :
                 activeTab === 'profile' ? 'ملف الشركة' :
                 activeTab === 'documents' ? 'مركز الوثائق الرسمية' :
                 activeTab === 'evaluation' ? 'تقييم التجربة الريادية' : 'إعدادات الحساب'}
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                {activeTab === 'roadmap' ? 'تتبع رحلتك نحو الجاهزية الاستثمارية من خلال المحطات الست' : `أهلاً بك، ${user.firstName}.`}
              </p>
           </div>
           
           <div className="flex gap-4 items-center">
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifCenter(!showNotifCenter); playPositiveSound(); }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all relative
                    ${unreadCount > 0 ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}
                  `}
                >
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifCenter && (
                  <NotificationCenter 
                    notifications={notifications} 
                    onUpdate={loadAllData} 
                    onClose={() => setShowNotifCenter(false)} 
                  />
                )}
              </div>

              {activeTab === 'roadmap' && (
                <button 
                  onClick={handleOptimizeUI} 
                  disabled={isOptimizing}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isOptimizing ? 'جاري التحسين...' : '✨ تحسين بصري بالذكاء اصطناعي'}
                </button>
              )}
              <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">المحطات المكتملة</p>
                 <p className="text-2xl font-black text-blue-600">{stats.completedCount} / {roadmap.length}</p>
              </div>
           </div>
        </header>

        {activeTab === 'roadmap' && (
          <div className="space-y-12 animate-fade-up">
            {/* Roadmap Progress Bar */}
            <div className="relative pt-8 pb-12 px-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                  <div className="h-full bg-blue-600 transition-all duration-1000 ease-out" style={{width: `${stats.progress}%`}}></div>
               </div>
               <div className="flex justify-between relative">
                  {roadmap.map((l, i) => (
                    <div key={l.id} className="flex flex-col items-center gap-3">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500
                         ${l.isCompleted ? 'bg-emerald-500 border-emerald-100 text-white shadow-lg' : l.isLocked ? 'bg-slate-100 border-slate-200 text-slate-300' : 'bg-white border-blue-600 text-blue-600 shadow-xl'}
                       `}>
                         {l.isCompleted ? '✓' : i + 1}
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${l.isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                         {l.title.split(' ')[0]}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
              {roadmap.map((level) => {
                const isCurrent = !level.isCompleted && !level.isLocked;
                const activeColorClass = getTailwindBgColor(level.customColor);
                const levelIcon = LEVEL_ICON_MAP[level.id] || level.icon;
                const levelTask = tasks.find(t => t.levelId === level.id);
                const canGenerate = levelTask && levelTask.status === 'ASSIGNED' && !level.isLocked && !level.isCompleted;

                return (
                  <div 
                    key={level.id}
                    onClick={() => !level.isLocked && setSelectedLevel(level)}
                    className={`group relative bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-sm transition-all duration-500 
                      ${level.isLocked ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-4 hover:shadow-3xl hover:border-blue-200'}
                    `}
                  >
                    <div className="aspect-[16/10] relative overflow-hidden">
                       <img src={level.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                       <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent transition-opacity ${level.isLocked ? 'opacity-80' : 'opacity-60'}`}></div>
                       <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                          <div className={`w-16 h-16 bg-gradient-to-br ${getGradientForColor(level.customColor)} rounded-[1.8rem] flex items-center justify-center text-4xl shadow-2xl text-white transform group-hover:rotate-6 transition-transform`}>
                            {level.isCompleted ? '✓' : levelIcon}
                          </div>
                       </div>
                       <div className="absolute bottom-8 left-8 right-8 text-right">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1"> المحطة 0{level.id}</p>
                          <h3 className="text-2xl font-black text-white leading-tight">{level.title}</h3>
                       </div>
                    </div>
                    <div className="p-10 space-y-8">
                       <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">{level.description}</p>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <span>حالة التقدم</span>
                             <span className={isCurrent ? 'text-blue-600 font-black' : ''}>{level.isCompleted ? '100%' : 'نشط'}</span>
                          </div>
                          <div className={`h-3 rounded-full overflow-hidden bg-slate-100`}>
                             <div className={`h-full transition-all duration-1000 ${level.isCompleted ? 'bg-emerald-500 w-full' : isCurrent ? `${activeColorClass} w-1/3 animate-pulse` : 'w-0'}`}></div>
                          </div>
                       </div>
                       
                       {canGenerate && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAIGenerateSubmission(levelTask); }}
                            disabled={isGeneratingAI}
                            className="w-full py-4 bg-blue-50 text-blue-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                          >
                             {isGeneratingAI ? (
                               <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                             ) : (
                               <>
                                 <span className="text-lg">✨</span>
                                 <span>توليد المخرج آلياً (AI)</span>
                               </>
                             )}
                          </button>
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="max-w-5xl mx-auto space-y-10 animate-fade-up pb-20 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {tasks.map(task => (
                 <div key={task.id} className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-8">
                         <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">المحطة 0{task.levelId}</span>
                         <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border ${task.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-600 border-blue-100' : task.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                           {task.status === 'APPROVED' ? 'مكتمل' : task.status === 'SUBMITTED' ? 'قيد المراجعة' : 'بانتظار التسليم'}
                         </span>
                      </div>
                      <h4 className="text-2xl font-black mb-4 leading-tight text-slate-900">{task.title}</h4>
                      <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">{task.description}</p>
                    </div>

                    {task.status === 'ASSIGNED' && (
                       <div className="space-y-3">
                          <button 
                            onClick={() => handleAIGenerateSubmission(task)}
                            disabled={isGeneratingAI}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                          >
                            {isGeneratingAI ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <span className="text-xl">✨</span>
                                <span>توليد المخرج بواسطة AI</span>
                              </>
                            )}
                          </button>
                       </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="space-y-10 animate-fade-up">
            <div className="bg-slate-900 p-8 md:p-12 rounded-[4rem] border border-white/5 shadow-3xl text-right relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-4xl shadow-2xl">🧑‍💻</div>
                    <div>
                       <h3 className="text-3xl font-black text-white">بيئة تطوير المشروع (Dev Studio)</h3>
                       <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mt-1">Advanced Startup Architecture</p>
                    </div>
                 </div>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl mb-12">
                   استخدم مختبر الأكواد لمراجعة البنية التقنية لمشروعك، أو صياغة العقود الذكية، أو حتى تجربة منطق عمل الـ MVP الخاص بك.
                 </p>
                 <CodeEditor 
                   code={DEFAULT_DEV_CODE} 
                   language="typescript" 
                   theme="vs-dark" 
                   height="600px"
                 />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto w-full space-y-10 animate-fade-up pb-20">
             <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">🏢</div>
                  <h3 className="text-2xl font-black text-slate-900">تفاصيل الشركة</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-1 flex flex-col items-center gap-6">
                     <label className={labelClass}>شعار الشركة</label>
                     <div onClick={() => !user.isDemo && fileInputRef.current?.click()} className={`w-48 h-48 rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center ${user.isDemo ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-300 hover:bg-blue-50'} transition-all group relative overflow-hidden`}>
                        {profileData.logo ? <img src={profileData.logo} className="w-full h-full object-cover" alt="Logo" /> : <span className="text-4xl opacity-20">🖼️</span>}
                        {!user.isDemo && <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />}
                     </div>
                  </div>
                  <div className="md:col-span-2 space-y-8">
                     <div className="space-y-2">
                        <label className={labelClass}>اسم الشركة</label>
                        <input className={inputClass} value={profileData.startupName} onChange={e => setProfileData({...profileData, startupName: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className={labelClass}>القطاع</label>
                           <select className={inputClass} value={profileData.industry} onChange={e => setProfileData({...profileData, industry: e.target.value})}>
                              {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className={labelClass}>البريد الإلكتروني</label>
                           <input type="email" className={inputClass} value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                        </div>
                     </div>
                  </div>
               </div>
               <div className="pt-6">
                  <button onClick={handleSaveProfile} disabled={isSaving} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                    {isSaving ? 'جاري المزامنة...' : 'حفظ التعديلات 🚀'}
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-10 animate-fade-up">
            <DocumentsPortal 
              user={profileData} 
              progress={stats.progress} 
              onShowCertificate={() => setShowFullCert(true)} 
            />
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="max-w-2xl mx-auto w-full py-10 animate-fade-up">
            <ProgramEvaluation onClose={() => setActiveTab('roadmap')} onSubmit={(r) => { storageService.saveProgramRating(user.uid, r); setExistingRating(r); setActiveTab('roadmap'); }} />
          </div>
        )}

        {showFullCert && (
          <Certificate user={profileData} onClose={() => setShowFullCert(false)} />
        )}
      </main>
    </div>
  );
};
