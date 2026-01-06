import React, { useState, useEffect, useCallback } from 'react';
import { FiltrationStage, UserProfile, UserRole } from './types';
import { storageService } from './services/storageService';
import { Language, getTranslation } from './services/i18nService';
import { Registration } from './components/Registration';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { DashboardHub } from './components/DashboardHub';
import { LegalPortal, LegalType } from './components/LegalPortal';
import { AchievementsPage } from './components/AchievementsPage';
import { MentorshipPage } from './components/MentorshipPage';
import { IncubationProgram } from './components/IncubationProgram';
import { MembershipsPage } from './components/MembershipsPage';
import { PartnerConceptPage } from './components/PartnerConceptPage';
import { AIMentorConceptPage } from './components/AIMentorConceptPage';
import { CoFounderPortal } from './components/CoFounderPortal';
import { ForeignInvestmentPage } from './components/ForeignInvestmentPage';
import { IncubationApply } from './components/IncubationApply';
import { ScreeningPortal } from './components/ScreeningPortal';
import { RoadmapPage } from './components/RoadmapPage';
import { ToolsPage } from './components/ToolsPage';
import { ServicesPage } from './components/ServicesPage';

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  const [currentUser, setCurrentUser] = useState<(UserProfile & { uid: string; role: UserRole; startupId?: string }) | null>(null);
  const [registrationRole, setRegistrationRole] = useState<UserRole>('STARTUP');
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);
  
  const [currentLang, setCurrentLang] = useState<Language>(() => 
    (localStorage.getItem('preferred_language') as Language) || 'ar'
  );

  const t = getTranslation(currentLang);

  const hydrateSession = useCallback(() => {
    const session = storageService.getCurrentSession();
    if (session) {
      const usersList = storageService.getAllUsers();
      const userRec = usersList.find(u => u.uid === session.uid);
      const startups = storageService.getAllStartups();
      const startup = startups.find(s => s.ownerId === session.uid);

      if (userRec) {
        setCurrentUser({
          uid: userRec.uid,
          firstName: userRec.firstName,
          lastName: userRec.lastName,
          email: userRec.email,
          phone: userRec.phone,
          role: (userRec.role as UserRole) || 'STARTUP',
          startupId: startup?.projectId,
          startupName: startup?.name || '',
          name: `${userRec.firstName} ${userRec.lastName}`,
          startupDescription: startup?.description || '',
          industry: startup?.industry || '',
          isDemo: userRec.isDemo,
          agreedToTerms: true,
          agreedToContract: true
        });
        
        setStage(FiltrationStage.DASHBOARD);
      }
    }
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    hydrateSession();
  };

  const handleRegister = (profile: UserProfile) => {
    storageService.registerUser({ ...profile }); 
    hydrateSession();
  };

  const handleQuickDemo = () => {
    storageService.createDemoSession();
    hydrateSession();
  };

  return (
    <div className={`antialiased ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={t.dir}>
      {stage === FiltrationStage.LANDING && (
        <LandingPage 
          onStart={() => { setRegistrationRole('STARTUP'); setStage(FiltrationStage.WELCOME); }} 
          onQuickDemo={handleQuickDemo}
          onPathFinder={() => setStage(FiltrationStage.AI_MENTOR_CONCEPT)} 
          onSmartFeatures={() => {}} 
          onGovDashboard={() => {}} 
          onRoadmap={() => setStage(FiltrationStage.ROADMAP)} 
          onTools={() => setStage(FiltrationStage.TOOLS)} 
          onLegalClick={(type) => setActiveLegal(type)} 
          onLogin={() => setStage(FiltrationStage.LOGIN)}
          onAchievements={() => setStage(FiltrationStage.ACHIEVEMENTS)}
          onMentorship={() => setStage(FiltrationStage.MENTORSHIP)}
          onIncubation={() => setStage(FiltrationStage.INCUBATION_PROGRAM)}
          onMemberships={() => setStage(FiltrationStage.MEMBERSHIPS)}
          onPartnerConcept={() => setStage(FiltrationStage.PARTNER_CONCEPT)}
          onAIMentorConcept={() => setStage(FiltrationStage.AI_MENTOR_CONCEPT)}
          onForeignInvestment={() => setStage(FiltrationStage.FOREIGN_INVESTMENT)}
          onServices={() => setStage(FiltrationStage.SERVICES)}
          lang={currentLang}
          onLanguageChange={setCurrentLang}
        />
      )}

      {stage === FiltrationStage.SERVICES && <ServicesPage onBack={() => setStage(FiltrationStage.LANDING)} />}

      {stage === FiltrationStage.INCUBATION_APPLY && currentUser && (
        <IncubationApply user={currentUser} onSubmitted={hydrateSession} />
      )}

      {stage === FiltrationStage.LOGIN && (
        <Login 
          lang={currentLang} 
          onLoginSuccess={handleLoginSuccess} 
          onBack={() => setStage(FiltrationStage.LANDING)} 
        />
      )}
      
      {stage === FiltrationStage.WELCOME && (
        <Registration 
          lang={currentLang}
          role={registrationRole}
          onRegister={handleRegister} 
        />
      )}

      {stage === FiltrationStage.DASHBOARD && currentUser && (
        currentUser.role === 'PARTNER' ? (
          <CoFounderPortal user={currentUser} onBack={() => { localStorage.removeItem('db_current_session'); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} />
        ) : (
          <DashboardHub 
            lang={currentLang}
            user={currentUser} 
            onLogout={() => { localStorage.removeItem('db_current_session'); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} 
            onNavigateToStage={setStage} 
          />
        )
      )}

      {stage === FiltrationStage.ROADMAP && <RoadmapPage onBack={() => setStage(FiltrationStage.LANDING)} onStart={() => setStage(FiltrationStage.WELCOME)} />}
      {stage === FiltrationStage.TOOLS && <ToolsPage onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.ACHIEVEMENTS && <AchievementsPage onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.MENTORSHIP && <MentorshipPage onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.INCUBATION_PROGRAM && <IncubationProgram onBack={() => setStage(FiltrationStage.LANDING)} onApply={() => setStage(FiltrationStage.WELCOME)} />}
      {stage === FiltrationStage.MEMBERSHIPS && <MembershipsPage onBack={() => setStage(FiltrationStage.LANDING)} onSelect={() => setStage(FiltrationStage.WELCOME)} />}
      {stage === FiltrationStage.PARTNER_CONCEPT && <PartnerConceptPage onBack={() => setStage(FiltrationStage.LANDING)} onRegister={() => setStage(FiltrationStage.WELCOME)} />}
      {stage === FiltrationStage.AI_MENTOR_CONCEPT && <AIMentorConceptPage onBack={() => setStage(FiltrationStage.LANDING)} onStart={() => setStage(FiltrationStage.WELCOME)} />}
      {stage === FiltrationStage.FOREIGN_INVESTMENT && <ForeignInvestmentPage onBack={() => setStage(FiltrationStage.LANDING)} onApply={() => setStage(FiltrationStage.WELCOME)} />}
      
      <LegalPortal type={activeLegal} onClose={() => setActiveLegal(null)} />
    </div>
  );
}

export default App;