import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Heart, Users, Briefcase, Home, School, Coffee, Sparkles, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ScenarioSelectionProps {
  onSelectScenario: (scenarioId: string) => void;
  progress: { [key: string]: number };
  showWelcome: boolean;
  onStartJourney: () => void;
  userRole: 'user' | 'therapist';
  userName: string;
}

const scenarios = [
  {
    id: 'family-conflict',
    title: 'Family Dinner Disagreement',
    description: 'Practice recognizing and managing emotions during a family disagreement about responsibilities.',
    difficulty: 'Beginner',
    emotions: ['Frustration', 'Empathy', 'Disappointment'],
    icon: Home,
    color: 'bg-blue-500',
    imageUrl: 'https://images.unsplash.com/photo-1578496780896-7081cc23c111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBkaW5uZXIlMjB0YWJsZXxlbnwxfHx8fDE3NjEzMTE5NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'workplace-feedback',
    title: 'Receiving Critical Feedback',
    description: 'Learn to interpret and respond to constructive criticism from a supervisor.',
    difficulty: 'Intermediate',
    emotions: ['Defensiveness', 'Anxiety', 'Pride'],
    icon: Briefcase,
    color: 'bg-purple-500',
    imageUrl: 'https://images.unsplash.com/photo-1676276374429-3902f2666824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JrcGxhY2UlMjBtZWV0aW5nJTIwZmVlZGJhY2t8ZW58MXx8fHwxNzYxMzExOTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'friendship-betrayal',
    title: 'Friend Breaks a Promise',
    description: 'Navigate complex emotions when a close friend cancels important plans last minute.',
    difficulty: 'Intermediate',
    emotions: ['Hurt', 'Anger', 'Understanding'],
    icon: Users,
    color: 'bg-pink-500',
    imageUrl: 'https://images.unsplash.com/photo-1572265378468-61882cf551f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwY29uY2VydCUyMGV2ZW50fGVufDF8fHx8MTc2MTMxMTk2MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'social-anxiety',
    title: 'Meeting New People',
    description: 'Practice managing social anxiety at a community event.',
    difficulty: 'Beginner',
    emotions: ['Nervousness', 'Excitement', 'Insecurity'],
    icon: Coffee,
    color: 'bg-green-500',
    imageUrl: 'https://images.unsplash.com/photo-1760275496441-2e6b427d7be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzYxMzAzODA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'romantic-miscommunication',
    title: 'Relationship Misunderstanding',
    description: 'Work through a miscommunication with a romantic partner.',
    difficulty: 'Advanced',
    emotions: ['Confusion', 'Hurt', 'Love', 'Fear'],
    icon: Heart,
    color: 'bg-red-500',
    imageUrl: 'https://images.unsplash.com/photo-1758524054106-06b11aec385c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjByZWxhdGlvbnNoaXAlMjB0YWxrfGVufDF8fHx8MTc2MTMxMTk2MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'academic-pressure',
    title: 'Exam Day Stress',
    description: 'Manage overwhelming emotions before an important exam.',
    difficulty: 'Beginner',
    emotions: ['Stress', 'Self-doubt', 'Determination'],
    icon: School,
    color: 'bg-indigo-500',
    imageUrl: 'https://images.unsplash.com/photo-1756032433560-56547efed550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZXhhbSUyMHN0cmVzc3xlbnwxfHx8fDE3NjEzMTE5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800',
};

export function ScenarioSelection({ onSelectScenario, progress, showWelcome, onStartJourney, userRole, userName }: ScenarioSelectionProps) {
  const completedCount = Object.keys(progress).length;
  const totalScenarios = scenarios.length;
  const isTherapist = userRole === 'therapist';

  if (showWelcome) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
            {isTherapist 
              ? 'Monitor progress and guide your patients through their emotional training journey'
              : 'A safe space to practice recognizing, expressing, and managing emotions through interactive stories'
            }
          </p>
        </div>

        <Card className="p-8 mb-8 border-2 shadow-lg">
          <h2 className="mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="mb-2">Choose a Scenario</h3>
              <p className="text-gray-600 text-sm">
                Select from real-life situations you might encounter daily
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="mb-2">Practice Recognition</h3>
              <p className="text-gray-600 text-sm">
                Identify emotions in yourself and others through the story
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="mb-2">Get Feedback</h3>
              <p className="text-gray-600 text-sm">
                Receive immediate, supportive guidance on your choices
              </p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong>Remember:</strong> There's no "perfect" score. This is a judgment-free space to learn and grow at your own pace.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={onStartJourney}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Designed for individuals, caregivers, and therapists</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {isTherapist ? 'Scenario Library' : 'Choose Your Story'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4">
          {isTherapist 
            ? 'View all available scenarios and track patient progress'
            : 'Each scenario helps you practice different emotional skills'
          }
        </p>
        {completedCount > 0 && (
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">
              {completedCount} of {totalScenarios} completed
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const completionScore = progress[scenario.id];
          const isCompleted = completionScore !== undefined;
          
          return (
            <Card 
              key={scenario.id} 
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={scenario.imageUrl}
                  alt={scenario.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <div className={`${scenario.color} p-3 rounded-xl text-white shadow-lg backdrop-blur-sm bg-opacity-90`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={difficultyColors[scenario.difficulty as keyof typeof difficultyColors]}>
                    {scenario.difficulty}
                  </Badge>
                </div>
                {isCompleted && (
                  <div className="absolute top-3 left-0 right-0 flex justify-center">
                    <Badge className="bg-green-500 text-white border-none shadow-lg">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${scenario.color}`} />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="flex-1">{scenario.title}</h3>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Focus emotions:</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.emotions.map((emotion) => (
                      <Badge key={emotion} variant="outline" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isCompleted && (
                  <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                      <span className="text-sm text-green-700">{completionScore}%</span>
                    </div>
                    <Progress value={completionScore} className="h-2 bg-green-100" />
                  </div>
                )}

                <Button 
                  onClick={() => onSelectScenario(scenario.id)}
                  className="w-full"
                  variant={isCompleted ? "outline" : "default"}
                >
                  {isCompleted ? (
                    <>
                      <span>Practice Again</span>
                    </>
                  ) : (
                    <>
                      <span>Start Scenario</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {isTherapist && (
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2>Therapist Tools & Resources</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h4 className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Track Progress
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Monitor completion rates and emotional recognition accuracy across scenarios.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h4 className="mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Customizable Scenarios
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Adapt scenarios to specific triggers or situations relevant to each individual.
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h4 className="mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600" />
                Discussion Points
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Use completed scenarios as conversation starters in therapy sessions.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
