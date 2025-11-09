import { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { CaregiverSpace } from './components/CaregiverSpace';
import { ScenarioSelection } from './components/ScenarioSelection';
import { StoryViewer } from './components/StoryViewer';
import { Login } from './components/Login';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Home } from 'lucide-react';
import { AuthContextProvider, useAuth } from './context/AuthContext';

type AppView = 'login' | 'welcome' | 'caregiver-space' | 'scenarios' | 'story';

function AppContent() {
  const { isTherapist, user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [userProgress, setUserProgress] = useState<{ [key: string]: number }>({});
  const [showWelcome, setShowWelcome] = useState(true);

  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(null);

  const handleScenarioComplete = (scenarioId: string, score: number) => {
    console.log(`Scenario ${scenarioId} completed with score: ${score}`);
    setUserProgress(prev => ({
      ...prev,
      [scenarioId]: score
    }));
    setSelectedScenario(null);
    setCurrentView('scenarios');
  };

  const navigateToLogin = () => setCurrentView('login');
  const navigateToWelcome = () => setCurrentView('welcome');
  const navigateToCaregiverSpace = () => setCurrentView('caregiver-space');
  const navigateToScenarios = () => setCurrentView('scenarios');
  const navigateToStory = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentView('story');
  };

  const backToMenu = () => {
    setSelectedScenario(null);
    setCurrentView('scenarios');
  };

  const backToWelcome = () => {
    setSelectedScenario(null);
    setCurrentView('welcome');
  };

  const handleLogin = (role: 'user' | 'therapist', name: string, userId: string) => {
    console.log('User logged in:', { role, name, userId });
    navigateToWelcome();
  };

  const handleNavigateToCaregiverSpace = () => {
    if (!user) {
      console.log('用户未登录，跳转到登录页面');
      navigateToLogin();
      return;
    }

    if (!isTherapist) {
      console.log('用户不是治疗师，跳转到登录页面');
      navigateToLogin();
      return;
    }

    console.log('用户是治疗师，跳转到治疗师空间');
    navigateToCaregiverSpace();
  };

  const handleSelectUser = (userId: string, userName: string) => {
    console.log('选择用户:', userId, userName);
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setCurrentPatientId(userId);
    setCurrentPatientName(userName);
    setShowWelcome(true);
    navigateToScenarios();
  };

  const handleStartJourney = () => {
    setShowWelcome(false);
  };

  const handleSelectScenario = (scenarioId: string) => {
    console.log('选择场景:', scenarioId);
    navigateToStory(scenarioId);
  };

  useEffect(() => {
    const mockProgress = {
      'family-conflict': 85,
      'workplace-feedback': 60,
    };
    setUserProgress(mockProgress);
  }, [selectedUserId]);

  // ✅ 新增逻辑：刷新后根据用户状态自动跳转
  useEffect(() => {
    if (loading) return; // 等待加载完成再判断
    if (!user) {
      setCurrentView('login');
      return;
    }

    // 如果用户已登录，根据角色跳转
    if (isTherapist) {
      console.log('已登录治疗师，跳转到治疗师空间');
      setCurrentView('caregiver-space');
    } else {
      console.log('已登录普通用户，跳转到欢迎页');
      setCurrentView('welcome');
    }
  }, [user, isTherapist, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {(currentView === 'scenarios' || currentView === 'story') && (
        <div className="absolute top-4 left-4 z-10">
          <Button 
            onClick={backToWelcome}
            variant="outline"
            className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      )}
      
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {currentView === 'welcome' && (
        <WelcomePage
          onMicrophoneClick={() => navigateToStory('random')}
          onNavigateToCaregiverSpace={handleNavigateToCaregiverSpace}
        />
      )}

      {currentView === 'caregiver-space' && (
        <CaregiverSpace
          onBack={backToWelcome}
          onSelectUser={handleSelectUser}
        />
      )}

      {currentView === 'scenarios' && (
        <ScenarioSelection 
          onSelectScenario={handleSelectScenario}
          progress={userProgress}
          showWelcome={showWelcome}
          onStartJourney={handleStartJourney}
          userRole={isTherapist ? 'therapist' : 'user'}
          userName={selectedUserName || user?.user_metadata?.name || 'User'}
          userId={selectedUserId || user?.id || ''}
        />
      )}

      {currentView === 'story' && selectedScenario && (
        <StoryViewer
          scenarioId={selectedScenario}
          onComplete={handleScenarioComplete}
          onBack={backToMenu}
          patientId={currentPatientId || selectedUserId || user?.id}
          patientName={currentPatientName || selectedUserName || user?.user_metadata?.name}
        />
      )}

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <AppContent />
    </AuthContextProvider>
  );
}
