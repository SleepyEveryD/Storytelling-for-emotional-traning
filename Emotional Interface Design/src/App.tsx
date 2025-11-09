<<<<<<< Updated upstream
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import { WelcomePage } from './components/WelcomePage';
import { CaregiverSpace } from './components/CaregiverSpace';
import { ScenarioSelection } from './components/ScenarioSelection';
import { StoryViewer } from './components/StoryViewer';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Home } from 'lucide-react';

type AppView = 'welcome' | 'caregiver-space' | 'scenarios' | 'story';

<<<<<<< Updated upstream
const SCENARIO_IDS = [
  'family-conflict',
  'workplace-feedback',
  'friendship-betrayal',
  'social-anxiety',
  'romantic-miscommunication',
  'academic-pressure'
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [showWelcome, setShowWelcome] = useState(true);
=======
function AppContent() {
  const { isTherapist, user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [userProgress, setUserProgress] = useState<{ [key: string]: number }>({});
  const [showWelcome, setShowWelcome] = useState(true);

  // 添加缺失的状态变量
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(null);

  // 添加缺失的函数
  const handleScenarioComplete = (scenarioId: string, score: number) => {
    console.log(`Scenario ${scenarioId} completed with score: ${score}`);
    // 更新用户进度
    setUserProgress(prev => ({
      ...prev,
      [scenarioId]: score
    }));
    // 返回场景选择页面
    setSelectedScenario(null);
    setCurrentView('scenarios');
  };
>>>>>>> Stashed changes

  const getRandomScenario = () => {
    const randomIndex = Math.floor(Math.random() * SCENARIO_IDS.length);
    return SCENARIO_IDS[randomIndex];
  };

  const handleMicrophoneClick = () => {
    const randomScenario = getRandomScenario();
    setSelectedScenario(randomScenario);
    setCurrentView('story');
  };

  const handleNavigateToCaregiverSpace = () => {
    setCurrentView('caregiver-space');
  };

  const handleBackFromCaregiverSpace = () => {
    setCurrentView('welcome');
  };

  const handleSelectUserFromCaregiver = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setCurrentView('scenarios');
    setShowWelcome(false);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentView('story');
  };

  const handleScenarioComplete = (scenarioId: string, score: number) => {
    setProgress(prev => ({ ...prev, [scenarioId]: score }));
    setSelectedScenario(null);
    setCurrentView('scenarios');
  };

  const handleBackToMenu = () => {
    setSelectedScenario(null);
    setCurrentView('scenarios');
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
    setSelectedUser(null);
    setShowWelcome(true);
  };

<<<<<<< Updated upstream
  const handleStartJourney = () => {
    setShowWelcome(false);
=======
  const handleLogin = (role: 'user' | 'therapist', name: string, userId: string) => {
    console.log('User logged in:', { role, name, userId });
    navigateToWelcome();
  };

  // 处理导航到治疗师空间的函数
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
>>>>>>> Stashed changes
  };

  // 处理用户选择（从治疗师空间）
  const handleSelectUser = (userId: string, userName: string) => {
    console.log('选择用户:', userId, userName);
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    // 同时设置当前患者信息
    setCurrentPatientId(userId);
    setCurrentPatientName(userName);
    setShowWelcome(true);
    navigateToScenarios();
  };

  // 处理开始旅程（隐藏欢迎页面）
  const handleStartJourney = () => {
    setShowWelcome(false);
  };

  // 处理场景选择
  const handleSelectScenario = (scenarioId: string) => {
    console.log('选择场景:', scenarioId);
    navigateToStory(scenarioId);
  };

  // 模拟获取用户进度数据
  useEffect(() => {
    const mockProgress = {
      'family-conflict': 85,
      'workplace-feedback': 60,
    };
    setUserProgress(mockProgress);
  }, [selectedUserId]);

  // 显示加载状态
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
      {/* Back to Home Button - shown in scenarios and story views */}
      {(currentView === 'scenarios' || currentView === 'story') && (
        <div className="absolute top-4 left-4 z-10">
          <Button 
            onClick={handleBackToWelcome}
            variant="outline"
            className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Home className="w-4 h-4" />
            Home
          </Button>
        </div>
      )}
      
      {currentView === 'welcome' && (
        <WelcomePage
          onMicrophoneClick={handleMicrophoneClick}
          onNavigateToCaregiverSpace={handleNavigateToCaregiverSpace}
        />
      )}

      {currentView === 'caregiver-space' && (
        <CaregiverSpace
<<<<<<< Updated upstream
          onBack={handleBackFromCaregiverSpace}
          onSelectUser={handleSelectUserFromCaregiver}
=======
          onBack={backToWelcome}
          onSelectUser={handleSelectUser}
>>>>>>> Stashed changes
        />
      )}

      {currentView === 'scenarios' && (
        <ScenarioSelection 
<<<<<<< Updated upstream
          onSelectScenario={handleScenarioSelect}
          progress={progress}
          showWelcome={showWelcome}
          onStartJourney={handleStartJourney}
          userRole="user"
          userName={selectedUser?.name || 'User'}
=======
          onSelectScenario={handleSelectScenario}
          progress={userProgress}
          showWelcome={showWelcome}
          onStartJourney={handleStartJourney}
          userRole={isTherapist ? 'therapist' : 'user'}
          userName={selectedUserName || user?.user_metadata?.name || 'User'}
          userId={selectedUserId || user?.id || ''}
>>>>>>> Stashed changes
        />
      )}

      {currentView === 'story' && selectedScenario && (
        <StoryViewer
          scenarioId={selectedScenario}
          onComplete={handleScenarioComplete}
<<<<<<< Updated upstream
          onBack={handleBackToMenu}
=======
          onBack={backToMenu}
          patientId={currentPatientId || selectedUserId || user?.id} // 修复：使用正确的患者ID
          patientName={currentPatientName || selectedUserName || user?.user_metadata?.name} // 修复：使用正确的患者姓名
>>>>>>> Stashed changes
        />
      )}

      <Toaster />
    </div>
  );
}
