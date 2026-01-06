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
import { ToastContainer } from './Toast';

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
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);

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
        setActiveToasts(prev => [newNotif, ...prev]);
        loadAllData();
      }
    };

    window.addEventListener('new-notification', handleNewNotif);
    return () => window.removeEventListener('new-notification', handleNewNotif);
  }, [user.uid]);

  const removeToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

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
