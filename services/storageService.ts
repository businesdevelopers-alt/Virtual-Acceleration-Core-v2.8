import { UserRecord, StartupRecord, UserProfile, TaskRecord, INITIAL_ROADMAP, LevelData, ACADEMY_BADGES, ServiceRequest, ProgramRating, PartnerProfile, SudokuStats, Notification } from '../types';

const DB_KEYS = {
  USERS: 'db_users',
  STARTUPS: 'db_startups',
  TASKS: 'db_tasks',
  ROADMAP: 'db_roadmap',
  SESSION: 'db_current_session',
  SUDOKU_STATS: 'db_sudoku_stats',
  NOTIFICATIONS: 'db_notifications'
};

const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError')) {
      console.warn(`Storage quota exceeded for key: ${key}. Attempting recovery...`);
      return false;
    }
    throw e;
  }
};

export const storageService = {
  registerUser: (profile: UserProfile): { user: UserRecord; startup?: StartupRecord } => {
    const uid = profile.uid || `u_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const role = profile.role || 'STARTUP';

    const newUser: UserRecord = {
      uid,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      role: role,
      phone: profile.phone,
      isDemo: profile.isDemo
    };

    let newStartup: StartupRecord | undefined;
    if (role === 'STARTUP') {
      newStartup = {
        projectId: `p_${Date.now()}`,
        ownerId: uid,
        ownerName: `${profile.firstName} ${profile.lastName}`,
        name: profile.startupName || '',
        description: profile.startupDescription || '',
        industry: profile.industry || '',
        status: 'PENDING',
        metrics: { readiness: 10, tech: 0, market: 0 },
        aiOpinion: 'قيد التقييم الأولي',
        lastActivity: new Date().toISOString(),
        partners: [],
        isDemo: profile.isDemo
      };
      const startups = JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]');
      safeSetItem(DB_KEYS.STARTUPS, JSON.stringify([...startups, newStartup]));
      
      safeSetItem(`${DB_KEYS.ROADMAP}_${uid}`, JSON.stringify(INITIAL_ROADMAP));
      const initialTasks: TaskRecord[] = INITIAL_ROADMAP.map(l => ({
        id: `t_${l.id}_${uid}`,
        levelId: l.id,
        uid,
        title: `مخرج: ${l.title}`,
        description: l.id === 2 
          ? 'تجهيز وثيقة نموذج العمل التجاري (BMC) متضمنة القيمة المقترحة، شرائح العملاء، ومصادر الدخل المتوقعة.'
          : `يرجى رفع ملف PDF يحتوي على مخرجات المرحلة: ${l.title}`,
        status: l.id === 1 ? 'ASSIGNED' : 'LOCKED'
      }));
      const allTasks = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
      safeSetItem(DB_KEYS.TASKS, JSON.stringify([...allTasks, ...initialTasks]));

      // Welcome Notification
      storageService.addNotification(uid, {
        title: 'أهلاً بك في المسرعة!',
        message: 'تم تفعيل مسارك التدريبي بنجاح. ابدأ بمرحلة التحقق الاستراتيجي.',
        type: 'SUCCESS'
      });
    }

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    safeSetItem(DB_KEYS.USERS, JSON.stringify([...users, { ...newUser, earnedBadges: [] }]));
    
    if (!profile.uid?.startsWith('seed_')) {
      safeSetItem(DB_KEYS.SESSION, JSON.stringify({ uid, projectId: newStartup?.projectId }));
    }

    return { user: newUser, startup: newStartup };
  },

  createDemoSession: (): { uid: string; projectId: string } => {
    const demoProfile: UserProfile = {
      firstName: 'مستكشف',
      lastName: 'المنصة',
      email: `demo_${Date.now()}@virtual.ai`,
      phone: '0500000000',
      startupName: 'مشروع افتراضي ذكي',
      startupDescription: 'هذا حساب تجريبي لاستكشاف ميزات المسرعة الذكية.',
      industry: 'Artificial Intelligence (AI)',
      agreedToTerms: true,
      agreedToContract: true,
      isDemo: true,
      role: 'STARTUP'
    };
    
    const { user, startup } = storageService.registerUser(demoProfile);
    return { uid: user.uid, projectId: startup?.projectId || '' };
  },

  addNotification: (uid: string, data: Partial<Notification>) => {
    const all = JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
    const newNotif: Notification = {
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      uid,
      title: data.title || 'تنبيه جديد',
      message: data.message || '',
      type: data.type || 'INFO',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    safeSetItem(DB_KEYS.NOTIFICATIONS, JSON.stringify([newNotif, ...all]));
    // Dispatch custom event for live toast updates
    window.dispatchEvent(new CustomEvent('new-notification', { detail: newNotif }));
  },

  getNotifications: (uid: string): Notification[] => {
    const all = JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
    return all.filter((n: Notification) => n.uid === uid);
  },

  markNotificationAsRead: (id: string) => {
    const all = JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
    const updated = all.map((n: Notification) => n.id === id ? { ...n, isRead: true } : n);
    safeSetItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  },

  updateUserBadges: (uid: string, badgeId: string) => {
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.uid === uid) {
        const badges = u.earnedBadges || [];
        if (!badges.includes(badgeId)) {
          return { ...u, earnedBadges: [...badges, badgeId] };
        }
      }
      return u;
    });
    safeSetItem(DB_KEYS.USERS, JSON.stringify(updatedUsers));
  },

  submitTask: (uid: string, taskId: string, submission: { fileData: string; fileName: string }, aiReview?: any) => {
    const allTasks: TaskRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    const updatedTasks = allTasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'SUBMITTED' as const,
          submission: {
            ...submission,
            submittedAt: new Date().toISOString()
          },
          aiReview
        };
      }
      return t;
    });
    safeSetItem(DB_KEYS.TASKS, JSON.stringify(updatedTasks));
    
    storageService.addNotification(uid, {
      title: 'تم استلام المخرج',
      message: `تم رفع مخرج المهمة "${updatedTasks.find(t => t.id === taskId)?.title}" للمراجعة الاستراتيجية.`,
      type: 'INFO'
    });
  },

  updateUser: (uid: string, data: Partial<UserRecord>) => {
    const users = storageService.getAllUsers();
    const updated = users.map(u => u.uid === uid ? { ...u, ...data } : u);
    safeSetItem(DB_KEYS.USERS, JSON.stringify(updated));
  },

  updateStartup: (projectId: string, data: Partial<StartupRecord>) => {
    const startups = storageService.getAllStartups();
    const updated = startups.map(s => s.projectId === projectId ? { ...s, ...data } : s);
    safeSetItem(DB_KEYS.STARTUPS, JSON.stringify(updated));
  },

  requestService: (uid: string, serviceId: string, packageId: string, details: string) => {
    const requests = JSON.parse(localStorage.getItem('db_service_requests') || '[]');
    const newRequest: ServiceRequest = {
      id: `sr_${Date.now()}`,
      uid,
      serviceId,
      packageId,
      details,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    safeSetItem('db_service_requests', JSON.stringify([...requests, newRequest]));
  },

  getUserServiceRequests: (uid: string): ServiceRequest[] => {
    const requests = JSON.parse(localStorage.getItem('db_service_requests') || '[]');
    return requests.filter((r: any) => r.uid === uid);
  },

  loginUser: (email: string): { user: UserRecord; startup?: StartupRecord } | null => {
    const users = storageService.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    
    const startups = storageService.getAllStartups();
    const startup = startups.find(s => s.ownerId === user.uid);
    
    safeSetItem(DB_KEYS.SESSION, JSON.stringify({ uid: user.uid, projectId: startup?.projectId }));
    return { user, startup };
  },

  getProgramRating: (uid: string): ProgramRating | null => {
    const ratings = JSON.parse(localStorage.getItem('db_program_ratings') || '{}');
    return ratings[uid] || null;
  },

  saveProgramRating: (uid: string, rating: ProgramRating) => {
    const ratings = JSON.parse(localStorage.getItem('db_program_ratings') || '{}');
    ratings[uid] = rating;
    safeSetItem('db_program_ratings', JSON.stringify(ratings));
  },

  getAllPartners: (): PartnerProfile[] => JSON.parse(localStorage.getItem('db_partners') || '[]'),
  
  registerAsPartner: (profile: PartnerProfile) => {
    const partners = storageService.getAllPartners();
    const exists = partners.findIndex(p => p.uid === profile.uid);
    if (exists > -1) {
      partners[exists] = profile;
    } else {
      partners.push(profile);
    }
    safeSetItem('db_partners', JSON.stringify(partners));
  },

  approveTask: (uid: string, taskId: string) => {
    const allTasks: TaskRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    const currentTask = allTasks.find(t => t.id === taskId);
    if (!currentTask) return;

    const updatedTasks = allTasks.map(t => {
      if (t.id === taskId) return { ...t, status: 'APPROVED' as const };
      if (t.uid === uid && t.levelId === currentTask.levelId + 1) return { ...t, status: 'ASSIGNED' as const };
      return t;
    });
    safeSetItem(DB_KEYS.TASKS, JSON.stringify(updatedTasks));

    const badge = ACADEMY_BADGES.find(b => b.levelId === currentTask.levelId);
    if (badge) {
      storageService.updateUserBadges(uid, badge.id);
    }

    const roadmap = storageService.getCurrentRoadmap(uid);
    const updatedRoadmap = roadmap.map(l => {
      if (l.id === currentTask.levelId) return { ...l, isCompleted: true };
      if (l.id === currentTask.levelId + 1) return { ...l, isLocked: false };
      return l;
    });
    safeSetItem(`${DB_KEYS.ROADMAP}_${uid}`, JSON.stringify(updatedRoadmap));

    storageService.addNotification(uid, {
      title: 'تمت الموافقة على المخرج!',
      message: `مبروك! تم قبول مخرج المهمة "${currentTask.title}". تم فتح المحطة التالية لك الآن.`,
      type: 'SUCCESS'
    });
  },

  rejectTask: (uid: string, taskId: string, feedback: string) => {
    const allTasks: TaskRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    const currentTask = allTasks.find(t => t.id === taskId);
    if (!currentTask) return;

    const updatedTasks = allTasks.map(t => {
      if (t.id === taskId) return { ...t, status: 'REJECTED' as const };
      return t;
    });
    safeSetItem(DB_KEYS.TASKS, JSON.stringify(updatedTasks));

    storageService.addNotification(uid, {
      title: 'ملاحظات على المخرج',
      message: `تمت مراجعة المهمة "${currentTask.title}" وبحاجة لبعض التعديلات: ${feedback}`,
      type: 'WARNING'
    });
  },

  getCurrentRoadmap: (uid: string): LevelData[] => {
    const data = localStorage.getItem(`${DB_KEYS.ROADMAP}_${uid}`);
    return data ? JSON.parse(data) : INITIAL_ROADMAP;
  },

  getUserTasks: (uid: string): TaskRecord[] => {
    const tasks = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    return tasks.filter((t: any) => t.uid === uid);
  },

  getCurrentSession: () => {
    const session = localStorage.getItem(DB_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  getAllUsers: (): UserRecord[] => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
  getAllStartups: (): StartupRecord[] => JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]'),

  getSudokuStats: (uid: string): SudokuStats => {
    const allStats = JSON.parse(localStorage.getItem(DB_KEYS.SUDOKU_STATS) || '{}');
    return allStats[uid] || { gamesPlayed: 0, gamesWon: 0, totalTimeSeconds: 0, bestTimeSeconds: null };
  },

  updateSudokuStats: (uid: string, win: boolean, timeSeconds?: number) => {
    const allStats = JSON.parse(localStorage.getItem(DB_KEYS.SUDOKU_STATS) || '{}');
    const current = allStats[uid] || { gamesPlayed: 0, gamesWon: 0, totalTimeSeconds: 0, bestTimeSeconds: null };
    
    current.gamesPlayed += 1;
    if (win && timeSeconds !== undefined) {
      current.gamesWon += 1;
      current.totalTimeSeconds += timeSeconds;
      if (current.bestTimeSeconds === null || timeSeconds < current.bestTimeSeconds) {
        current.bestTimeSeconds = timeSeconds;
      }
    }
    
    allStats[uid] = current;
    safeSetItem(DB_KEYS.SUDOKU_STATS, JSON.stringify(allStats));
  },
  
  seedDemoAccounts: () => {
    if (localStorage.getItem(DB_KEYS.USERS)) return;

    storageService.registerUser({
       uid: 'seed_startup_1',
       firstName: 'فيصل', lastName: 'المؤسس', email: 'startup@demo.com', phone: '0500000000',
       agreedToTerms: true, agreedToContract: true, startupName: 'تيك-لوجيك (Demo)', 
       industry: 'Technology', startupDescription: 'منصة ذكية لإدارة اللوجستيات الذكية باستخدام AI.',
       role: 'STARTUP'
    });

    const partnerInfo = storageService.registerUser({
       uid: 'seed_partner_1',
       firstName: 'عبدالرحمن', lastName: 'التقني', email: 'partner@demo.com', phone: '0511111111',
       agreedToTerms: true, agreedToContract: true, role: 'PARTNER'
    });
    storageService.registerAsPartner({
      uid: partnerInfo.user.uid,
      name: 'عبدالرحمن التقني',
      email: 'partner@demo.com',
      primaryRole: 'CTO',
      experienceYears: 12,
      bio: 'خبير في بناء الأنظمة الموزعة وتطبيقات الويب عالية الأداء.',
      linkedin: 'https://linkedin.com/in/demo-partner',
      skills: ['React', 'Node.js'],
      availabilityHours: 25,
      commitmentType: 'Part-time',
      city: 'الرياض',
      isRemote: true,
      workStyle: 'Fast',
      goals: 'Long-term',
      isVerified: true,
      profileCompletion: 100
    });

    storageService.registerUser({
       uid: 'seed_mentor_1',
       firstName: 'د. ليلى', lastName: 'الاستشارية', email: 'mentor@demo.com', phone: '0522222222',
       agreedToTerms: true, agreedToContract: true, role: 'MENTOR'
    });

    storageService.registerUser({
       uid: 'seed_admin_1',
       firstName: 'مدير', lastName: 'المنصة', email: 'admin@demo.com', phone: '0533333333',
       agreedToTerms: true, agreedToContract: true, role: 'ADMIN'
    });

    localStorage.removeItem(DB_KEYS.SESSION);
  }
};