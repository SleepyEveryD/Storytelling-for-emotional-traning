import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Heart, Users, Briefcase, Home, School, Coffee, Sparkles, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../supabase_client';

interface ScenarioSelectionProps {
  onSelectScenario: (scenarioId: string) => void;
  progress: { [key: string]: number };
  showWelcome: boolean;
  onStartJourney: () => void;
  userRole: 'user' | 'therapist';
  userName: string;
  userId: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  emotions: string[];
  icon_name: string;
  color: string;
  image_url: string;
}

// Icon mapping
const iconMap = {
  'Home': Home,
  'Briefcase': Briefcase,
  'Users': Users,
  'Coffee': Coffee,
  'Heart': Heart,
  'School': School,
  'Sparkles': Sparkles,
};

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800',
};

export function ScenarioSelection({ 
  onSelectScenario, 
  progress, 
  showWelcome, 
  onStartJourney, 
  userRole, 
  userName,
  userId 
}: ScenarioSelectionProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const completedCount = Object.keys(progress).filter(key => progress[key] > 0).length;
  const totalScenarios = scenarios.length;
  const isTherapist = userRole === 'therapist';

  // Fetch scenarios from database
  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching scenarios:', error);
        setError('Unable to load scenarios');
        return;
      }

      if (data) {
        setScenarios(data);
      }
    } catch (err) {
      console.error('Error fetching scenarios:', err);
      setError('Error loading scenarios');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Sparkles;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to load</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchScenarios} variant="outline">
            Try Again
          </Button>
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

      {scenarios.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-600">No scenarios available</h3>
          <p className="text-gray-500">There are currently no training scenarios available</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {scenarios.map((scenario) => {
              const Icon = getIconComponent(scenario.icon_name);
              const completionScore = progress[scenario.id];
              const isCompleted = completionScore !== undefined && completionScore > 0;
              
              return (
                <Card 
                  key={scenario.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={scenario.image_url}
                      alt={scenario.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`${scenario.color} p-3 rounded-xl text-white shadow-lg backdrop-blur-sm bg-opacity-90`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className={difficultyColors[scenario.difficulty]}>
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

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {scenario.description}
                    </p>

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
        </>
      )}
    </div>
  );
}