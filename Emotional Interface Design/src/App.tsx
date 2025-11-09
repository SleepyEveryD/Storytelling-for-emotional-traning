// App.tsx
import { useState } from 'react';
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

// 将 AppContent 移出，以便使用 useAuth Hook
function AppContent() {
  const { isTherapist, user } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // 纯页面跳转函数
  const navigateToLogin = () => setCurrentView('login');
  const navigateToWelcome = () => setCurrentView('welcome');
  const navigateToCaregiverSpace = () => setCurrentView('caregiver-space');
  const navigateToScenarios = () => setCurrentView('scenarios');
  const navigateToStory = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentView('story');
  };

  // 返回函数
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

  // 处理导航到治疗师空间的函数
  const handleNavigateToCaregiverSpace = () => {
    if (!user) {
      // 用户未登录，跳转到登录页面
      console.log('用户未登录，跳转到登录页面');
      navigateToLogin();
      return;
    }

    if (!isTherapist) {
      // 用户已登录但不是治疗师，显示提示并跳转到登录页面
      console.log('用户不是治疗师，跳转到登录页面');
      // 可以在这里添加一个提示消息
      navigateToLogin();
      return;
    }

    // 用户是治疗师，正常跳转
    console.log('用户是治疗师，跳转到治疗师空间');
    navigateToCaregiverSpace();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 返回首页按钮 */}
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
      
      {/* 页面路由 */}
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
          onSelectUser={navigateToScenarios}
        />
      )}

      {currentView === 'scenarios' && (
        <ScenarioSelection 
          onSelectScenario={navigateToStory}
          onBack={backToWelcome}
        />
      )}

      {currentView === 'story' && selectedScenario && (
        <StoryViewer 
          scenarioId={selectedScenario}
          onComplete={backToMenu}
          onBack={backToMenu}
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