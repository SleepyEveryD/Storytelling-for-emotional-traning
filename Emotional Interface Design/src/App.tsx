import { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { AIConversation } from './components/AIConversation';
import { CaregiverSpace } from './components/CaregiverSpace';
import { ScenarioSelection } from './components/ScenarioSelection';
import { StoryViewer } from './components/StoryViewer';
import { Login } from './components/Login';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Home } from 'lucide-react';
import { toast } from 'sonner';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import { LogoutButton } from './components/LogoutButton';

// ⭐ 内置静态场景库
import { scenarioData } from './components/scenarios/scenarioData';

type AppView =
  | 'login'
  | 'welcome'
  | 'ai-conversation'
  | 'caregiver-space'
  | 'scenarios'
  | 'story';

function AppContent() {
  const { isTherapist, user, loading: authLoading } = useAuth();

  // ⭐ 动态可写场景库（方案 A 核心）
  const [scenarioStore, setScenarioStore] = useState<any>(scenarioData);

  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [userProgress, setUserProgress] = useState<{ [key: string]: number }>(
    {}
  );
  const [showWelcome, setShowWelcome] = useState(true);

  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(
    null
  );

  const [userProblem, setUserProblem] = useState<string>('');
  const [scenarioLoading, setScenarioLoading] = useState(false);

  /* ------------------------------
      WelcomePage → 进入 AI 对话
  -------------------------------*/
  const handleProblemSubmit = async (problem: string) => {
    setUserProblem(problem);
    setCurrentView('ai-conversation');
  };

  /* -------------------------------------
      AIConversation 完成故事 → 收下故事
  --------------------------------------*/
  const handleAcceptPractice = async (storyJsonString: string) => {
    try {
      setScenarioLoading(true);

      const parsed = JSON.parse(storyJsonString);

      if (!parsed || !parsed.title || !Array.isArray(parsed.story)) {
        toast.error('Story format invalid.');
        return;
      }

      // 生成唯一 id
      const scenarioId = `ai-generated-${Date.now()}`;

      // ⭐ 动态写入新的 AI 场景（方案 A 核心）
      setScenarioStore(prev => ({
        ...prev,
        [scenarioId]: parsed,
      }));

      toast.success('AI practice story is ready!');

      setSelectedScenario(scenarioId);
      setCurrentView('story');
    } catch (err) {
      console.error(err);
      toast.error('Invalid story JSON.');
    } finally {
      setScenarioLoading(false);
    }
  };

  const handleDeclinePractice = () => {
    toast.info("That's okay. Come back anytime.");
    setCurrentView('welcome');
    setUserProblem('');
  };

  /* ------------------------------
      Story 完成一个场景
  -------------------------------*/
  const handleScenarioComplete = (scenarioId: string, score: number) => {
    setUserProgress(prev => ({
      ...prev,
      [scenarioId]: score,
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

  const handleLogin = () => {
    navigateToWelcome();
  };

  const handleNavigateToCaregiverSpace = () => {
    if (!user) return navigateToLogin();
    if (!isTherapist) return navigateToLogin();
    navigateToCaregiverSpace();
  };

  const handleSelectUser = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setCurrentPatientId(userId);
    setCurrentPatientName(userName);
    navigateToScenarios();
  };

  const handleStartJourney = () => setShowWelcome(false);

  const handleSelectScenario = (scenarioId: string) =>
    navigateToStory(scenarioId);

  /* ------------------------------
      登录状态处理
  -------------------------------*/
  useEffect(() => {
    if (authLoading) return;
    if (!user) return setCurrentView('login');
    if (isTherapist) return setCurrentView('caregiver-space');
    setCurrentView('welcome');
  }, [user, isTherapist, authLoading]);

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen">

      {/* 加载指示器 */}
      {scenarioLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow">
            Preparing your practice story...
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <div className="absolute top-4 right-4 flex gap-2">
        {user && (
          <>
            <Button onClick={backToWelcome} variant="outline">
              <Home className="w-4 h-4" />
              Home
            </Button>
            <LogoutButton />
          </>
        )}
      </div>

      {/* 路由切换 */}
      {currentView === 'login' && <Login onLogin={handleLogin} />}

      {currentView === 'welcome' && (
        <WelcomePage
          onProblemSubmit={handleProblemSubmit}
          onMicrophoneClick={() => navigateToStory('random')}
          onNavigateToCaregiverSpace={handleNavigateToCaregiverSpace}
        />
      )}

      {currentView === 'ai-conversation' && (
        <AIConversation
          userProblem={userProblem}
          onAcceptPractice={handleAcceptPractice}
          onDeclinePractice={handleDeclinePractice}
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

      {/* ⭐ StoryViewer 现在从 "scenarioStore" 读取数据 */}
      {currentView === 'story' && selectedScenario && (
        <StoryViewer
          scenarioId={selectedScenario}
          scenarioStore={scenarioStore}
          onComplete={handleScenarioComplete}
          onBack={backToMenu}
          patientId={currentPatientId || selectedUserId || user?.id}
          patientName={
            currentPatientName || selectedUserName || user?.user_metadata?.name
          }
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
