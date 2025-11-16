import { useState, useEffect } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { AIConversation } from './components/AIConversation';
import { CaregiverSpace } from './components/CaregiverSpace';
import { ScenarioSelection } from './components/ScenarioSelection';
import { StoryViewer } from './components/StoryViewer';
import { Login } from './components/Login';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Home, Users } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeWithFallback, getRecommendedScenarioFromDB } from './geminiService';
import { supabase } from './supabase_client';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import { LogoutButton } from './components/LogoutButton';

type AppView = 'login' | 'welcome' | 'ai-conversation' | 'caregiver-space' | 'scenarios' | 'story';

function AppContent() {
  const { isTherapist, user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [userProgress, setUserProgress] = useState<{ [key: string]: number }>({});
  const [showWelcome, setShowWelcome] = useState(true);

  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(null);

  // AI related states
  const [userProblem, setUserProblem] = useState<string>('');
  const [scenarioLoading, setScenarioLoading] = useState(false);

  const handleProblemSubmit = async (problem: string) => {
    setUserProblem(problem);
    setCurrentView('ai-conversation');
  };

  const handleAcceptPractice = async (fullContext: string) => {
    try {
      setScenarioLoading(true);
      const scenarioId = await getRecommendedScenarioFromDB(fullContext);

      const { data: scenario, error } = await supabase
        .from('scenarios')
        .select('title, description, difficulty')
        .eq('id', scenarioId)
        .single();

      if (error) {
        console.error('Error fetching scenario details:', error);
        const fallbackScenarioId = analyzeWithFallback(fullContext);
        toast.success(`Let's practice with: ${fallbackScenarioId}`);
        setSelectedScenario(fallbackScenarioId);
      } else {
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

  const handleDeclinePractice = () => {
    toast.info("That's okay! You can come back anytime you're ready.");
    setCurrentView('welcome');
    setUserProblem('');
  };

  const handleScenarioComplete = (scenarioId: string, score: number) => {
    setUserProgress(prev => ({
      ...prev,
      [scenarioId]: score,
    }));
    setSelectedScenario(null);
    setCurrentView('scenarios');
  };

  // Navigation helpers
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
    navigateToWelcome();
  };

  const handleNavigateToCaregiverSpace = () => {
    if (!user) {
      toast.warning('Please log in first');
      navigateToLogin();
      return;
    }
    if (!isTherapist) {
      toast.error('Unauthorized: Only therapists can enter this space');
      return;
    }
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

  const handleSelectScenario = (scenarioId: string) => navigateToStory(scenarioId);

  useEffect(() => {
    setUserProgress({
      'family-conflict': 85,
      'workplace-feedback': 60,
    });
  }, [selectedUserId]);

  // Redirect user based on role
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setCurrentView('login');
      return;
    }
    if (isTherapist) {
      setCurrentView('caregiver-space');
    } else {
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
      {/* Navigate buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          onClick={backToWelcome}
          variant="outline"
          className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <Home className="w-4 h-4" />
          Home
        </Button>

        <Button
          onClick={handleNavigateToCaregiverSpace}
          variant="outline"
          className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
        >
          <Users className="w-4 h-4" />
          Caregiver Space
        </Button>

        <LogoutButton />
      </div>

      {/* Loading indicator during scenario matching */}
      {scenarioLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Finding the perfect story for you...</span>
          </div>
        </div>
      )}

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
