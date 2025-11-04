import { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { CaregiverSpace } from './components/CaregiverSpace';
import { ScenarioSelection } from './components/ScenarioSelection';
import { StoryViewer } from './components/StoryViewer';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Home } from 'lucide-react';

type AppView = 'welcome' | 'caregiver-space' | 'scenarios' | 'story';

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

  const handleStartJourney = () => {
    setShowWelcome(false);
  };

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
          onBack={handleBackFromCaregiverSpace}
          onSelectUser={handleSelectUserFromCaregiver}
        />
      )}

      {currentView === 'scenarios' && (
        <ScenarioSelection 
          onSelectScenario={handleScenarioSelect}
          progress={progress}
          showWelcome={showWelcome}
          onStartJourney={handleStartJourney}
          userRole="user"
          userName={selectedUser?.name || 'User'}
        />
      )}

      {currentView === 'story' && selectedScenario && (
        <StoryViewer 
          scenarioId={selectedScenario}
          onComplete={handleScenarioComplete}
          onBack={handleBackToMenu}
        />
      )}

      <Toaster />
    </div>
  );
}
