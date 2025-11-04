import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, BookOpen, Heart, ArrowRight, Trophy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { scenarioData } from './scenarios/scenarioData';
import { EmotionWheel } from './EmotionWheel';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StoryViewerProps {
  scenarioId: string;
  onComplete: (scenarioId: string, score: number) => void;
  onBack: () => void;
}

interface Choice {
  text: string;
  emotionalResponse: string;
  isHealthy: boolean;
  feedback: string;
}

interface StorySegment {
  id: number;
  narrative: string;
  characterEmotion?: string;
  emotionRecognitionQuestion?: string;
  emotionOptions?: string[];
  correctEmotion?: string;
  choices?: Choice[];
  emotionExplanation?: string;
  imageUrl?: string;
}

export function StoryViewer({ scenarioId, onComplete, onBack }: StoryViewerProps) {
  const scenario = scenarioData[scenarioId];
  const [currentSegment, setCurrentSegment] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (!scenario) {
    return <div>Scenario not found</div>;
  }

  const segment: StorySegment = scenario.story[currentSegment];
  const progress = ((currentSegment + 1) / scenario.story.length) * 100;

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);

    if (emotion === segment.correctEmotion) {
      setCorrectAnswers(prev => prev + 1);
      toast.success('Correct! Well recognized.');
    } else {
      toast.error(`Not quite. The emotion was ${segment.correctEmotion}.`);
    }
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
    setTotalQuestions(prev => prev + 1);

    if (choice.isHealthy) {
      setCorrectAnswers(prev => prev + 1);
      toast.success('Healthy emotional response!');
    } else {
      toast.error('Consider a more constructive approach.');
    }
  };

  const handleContinue = () => {
    if (currentSegment < scenario.story.length - 1) {
      setCurrentSegment(prev => prev + 1);
      setSelectedEmotion(null);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      const finalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      setIsComplete(true);
      onComplete(scenarioId, finalScore);
    }
  };

  const handleFinish = () => {
    onBack();
    toast.success('Great work! Continue practicing with more scenarios.');
  };

  const canContinue = 
    !segment.emotionRecognitionQuestion || 
    (segment.emotionRecognitionQuestion && selectedEmotion) ||
    (segment.choices && selectedChoice);

  if (isComplete) {
    const finalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="p-8 md:p-12 text-center border-2 shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Scenario Complete! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            You've completed <strong>{scenario.title}</strong>
          </p>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 mb-8 border-2 border-green-200">
            <div className="text-6xl mb-4">{finalScore}%</div>
            <p className="text-gray-700 mb-2">Recognition Accuracy</p>
            <p className="text-sm text-gray-600">
              You answered {correctAnswers} out of {totalQuestions} questions correctly
            </p>
          </div>

          <Alert className="bg-blue-50 border-blue-200 mb-8 text-left">
            <Heart className="h-5 w-5 text-blue-600" />
            <AlertDescription>
              <strong>Remember:</strong> Emotional intelligence is a journey, not a destination. 
              Each practice session helps you build stronger emotional awareness and regulation skills.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleFinish}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Scenarios
            </Button>
            <Button 
              onClick={() => {
                setCurrentSegment(0);
                setSelectedEmotion(null);
                setSelectedChoice(null);
                setShowFeedback(false);
                setCorrectAnswers(0);
                setTotalQuestions(0);
                setIsComplete(false);
              }}
              size="lg"
              variant="outline"
              className="flex-1"
            >
              Practice Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <BookOpen className="w-3 h-3" />
            {currentSegment + 1} of {scenario.story.length}
          </Badge>
          {totalQuestions > 0 && (
            <Badge variant="outline" className="gap-1 bg-green-50 border-green-200 text-green-700">
              <CheckCircle2 className="w-3 h-3" />
              {Math.round((correctAnswers / totalQuestions) * 100)}% accuracy
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{scenario.title}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      <Card className="p-0 mb-6 border-2 shadow-lg overflow-hidden">
        {segment.imageUrl && (
          <div className="relative h-64 md:h-80 overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={segment.imageUrl}
              alt="Story scene"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                {segment.narrative}
              </p>
            </div>
          </div>

          {segment.characterEmotion && !segment.emotionRecognitionQuestion && (
            <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 border-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-base">
                <strong className="block mb-1">Emotional Insight:</strong>
                <span className="text-gray-700">{segment.characterEmotion}</span>
                {segment.emotionExplanation && (
                  <span className="block mt-3 text-sm text-gray-600 leading-relaxed">
                    {segment.emotionExplanation}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {segment.emotionRecognitionQuestion && (
            <div className="mt-8">
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <h3 className="text-purple-900">{segment.emotionRecognitionQuestion}</h3>
                <p className="text-sm text-purple-700 mt-2">Select the emotion you think best matches:</p>
              </div>
              
              <div className="mb-6">
                <EmotionWheel 
                  emotions={segment.emotionOptions || []}
                  selectedEmotion={selectedEmotion}
                  onSelectEmotion={handleEmotionSelect}
                  disabled={showFeedback}
                />
              </div>

              {showFeedback && (
                <Alert className={selectedEmotion === segment.correctEmotion 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 border-2' 
                  : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300 border-2'
                }>
                  {selectedEmotion === segment.correctEmotion ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                  )}
                  <AlertDescription className="text-base">
                    {selectedEmotion === segment.correctEmotion ? (
                      <>
                        <strong className="text-green-800 block mb-2">Excellent recognition! ✨</strong>
                        <span className="text-gray-700 leading-relaxed">{segment.emotionExplanation}</span>
                      </>
                    ) : (
                      <>
                        <strong className="text-orange-800 block mb-2">The emotion was: {segment.correctEmotion}</strong>
                        <span className="text-gray-700 leading-relaxed block mt-2">{segment.emotionExplanation}</span>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {segment.choices && (
            <div className="mt-8">
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <h3 className="text-purple-900">How would you respond?</h3>
                <p className="text-sm text-purple-700 mt-2">Consider how each response might affect the situation:</p>
              </div>
              <div className="space-y-4">
                {segment.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={showFeedback}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                      selectedChoice === choice
                        ? choice.isHealthy
                          ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg scale-[1.02]'
                          : 'border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-[1.01]'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <p className="mb-2 leading-relaxed">{choice.text}</p>
                    <p className="text-sm text-gray-600">
                      <em>Emotional response: {choice.emotionalResponse}</em>
                    </p>
                  </button>
                ))}
              </div>

              {showFeedback && selectedChoice && (
                <Alert className={selectedChoice.isHealthy 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 border-2 mt-6' 
                  : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300 border-2 mt-6'
                }>
                  {selectedChoice.isHealthy ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                  )}
                  <AlertDescription className="text-base">
                    <span className="text-gray-700 leading-relaxed">{selectedChoice.feedback}</span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {currentSegment < scenario.story.length - 1 ? (
            <>
              Continue Story
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Complete Scenario
              <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
