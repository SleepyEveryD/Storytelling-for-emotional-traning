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
import { analyzeWithFallback, getRecommendedScenarioFromDB } from './services/geminiService';
import { supabase } from './supabase_client';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import { LogoutButton } from './components/LogoutButton';

type AppView = 'login' | 'welcome' | 'ai-conversation' | 'caregiver-space' | 'scenarios' | 'story';

function AppContent() {
  const { isTherapist, user, loading: authLoading } = useAuth(); // 重命名为 authLoading
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [userProgress, setUserProgress] = useState<{ [key: string]: number }>({});
  const [showWelcome, setShowWelcome] = useState(true);

  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(null);

  // AI 相关状态
  const [userProblem, setUserProblem] = useState<string>('');
  const [scenarioLoading, setScenarioLoading] = useState(false); // 重命名为 scenarioLoading

  // Handle problem submission from WelcomePage - go to AI conversation
  const handleProblemSubmit = async (problem: string) => {
    setUserProblem(problem);
    setCurrentView('ai-conversation');
  };

  const handleAcceptPractice = async (fullContext: string) => {
    try {
      setScenarioLoading(true);
      
      // 使用数据库推荐场景
      const scenarioId = await getRecommendedScenarioFromDB(fullContext);
      
      // 获取场景详细信息
      const { data: scenario, error } = await supabase
        .from('scenarios')
        .select('title, description, difficulty')
        .eq('id', scenarioId)
        .single();

      if (error) {
        console.error('Error fetching scenario details:', error);
        // 降级到本地逻辑
        const fallbackScenarioId = analyzeWithFallback(fullContext);
        toast.success(`Let's practice with: ${fallbackScenarioId}`);
        setSelectedScenario(fallbackScenarioId);
      } else {
        console.log(`Selected scenario from DB: ${scenarioId} - ${scenario.title}`);
        
        // 显示推荐的故事详情
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Perfect match found!</span>
            <span>Let's practice: {scenario.title}</span>
            <span className="text-sm text-gray-600">Difficulty: {scenario.difficulty}</span>
          </div>
        );
        
        setSelectedScenario(scenarioId);
      }
      
      setCurrentView('story');
      
    } catch (error) {
      console.error('Error in handleAcceptPractice:', error);
      const scenarioId = analyzeWithFallback(fullContext);
      toast.success(`Let's practice with: ${scenarioId}`);
      setSelectedScenario(scenarioId);
      setCurrentView('story');
    } finally {
      setScenarioLoading(false);
    }
  };

  // Handle when user declines to practice
  const handleDeclinePractice = () => {
    toast.info('That\'s okay! You can come back anytime you\'re ready.');
    setCurrentView('welcome');
    setUserProblem('');
  };

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
    if (authLoading) return; // 使用重命名后的 authLoading
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
  }, [user, isTherapist, authLoading]);

  if (authLoading) {
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
      {/* 场景加载指示器 */}
      {scenarioLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Finding the perfect story for you...</span>
          </div>
        </div>
      )}
   


      {/* 更新导航按钮显示条件，包含 ai-conversation */}
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      {user && (
        <>
          {isTherapist ? (
            <Button
              onClick={backToWelcome}
              variant="outline"
              className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigator.clipboard.writeText(user.id);
                toast.success('User ID copied to clipboard!');
              }}
              variant="outline"
              className="gap-2 bg-green-50 text-green-700 border border-green-300 hover:bg-green-100"
            >
              📋 Copy ID
            </Button>
          )}
          {/* Only show LogoutButton when user is logged in */}
          <LogoutButton />
        </>
      )}
    </div>





      
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      

    {currentView === 'welcome' && (
  <WelcomePage
    onProblemSubmit={handleProblemSubmit}
    onMicrophoneClick={() => navigateToStory('random')}
    onNavigateToCaregiverSpace={handleNavigateToCaregiverSpace}
   
   // ⭐ 加这一行！
  />
)}


      {/* AI conversation */}
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