import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Heart,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import { EmotionWheel } from './EmotionWheel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../supabase_client';

interface StoryViewerProps {
  scenarioId: string;
  scenarioStore: any; // ⭐ 从 App 传入动态场景库
  onComplete: (scenarioId: string, score: number) => void;
  onBack: () => void;
  patientId?: string;
  patientName?: string;
  onProgressUpdate?: () => void;
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

export function StoryViewer({
  scenarioId,
  scenarioStore, // ⭐ 使用动态场景库
  onComplete,
  onBack,
  patientId,
  patientName,
  onProgressUpdate,
}: StoryViewerProps) {
  // ⭐ 从动态库 scenarioStore 读取，不再用 scenarioData
  const scenario = scenarioStore[scenarioId];

  const [currentSegment, setCurrentSegment] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);

  // ---------------------------
  // ❗ 场景不存在（例如未加载）
  // ---------------------------
  if (!scenario) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Scenario Not Found</h2>
          <p className="text-gray-600 mb-4">
            The requested scenario could not be found.
          </p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scenarios
          </Button>
        </Card>
      </div>
    );
  }

  // ---------------------------
  // ⭐ 保存进度到 Supabase
  // ---------------------------
  const saveProgressToDatabase = async (
    score: number,
    completed: boolean = true
  ) => {
    if (!patientId) return;

    try {
      setIsSavingProgress(true);

      // 是否已有记录
      const { data: existing, error: checkErr } = await supabase
        .from('scenario_progress')
        .select('*')
        .eq('patient_id', patientId)
        .eq('scenario_id', scenarioId)
        .single();

      if (checkErr && checkErr.code !== 'PGRST116') {
        console.error(checkErr);
      }

      let result;

      if (existing) {
        // 更新
        result = await supabase
          .from('scenario_progress')
          .update({
            score: Math.max(existing.score || 0, score),
            completed: completed || existing.completed,
            last_attempted: new Date().toISOString(),
            attempts: (existing.attempts || 0) + 1,
          })
          .eq('id', existing.id);
      } else {
        // 插入
        result = await supabase.from('scenario_progress').insert([
          {
            patient_id: patientId,
            scenario_id: scenarioId,
            scenario_title: scenario.title,
            score,
            completed,
            last_attempted: new Date().toISOString(),
            attempts: 1,
          },
        ]);
      }

      if (result.error) throw result.error;

      setHasUnsavedProgress(false);
      toast.success('Progress saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save progress');
    } finally {
      setIsSavingProgress(false);
    }
  };

  const savePartialProgress = async () => {
    if (!patientId || totalQuestions === 0) return;

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setHasUnsavedProgress(true);
    await saveProgressToDatabase(score, false);
  };

  // ---------------------------
  // 处理当前故事段
  // ---------------------------
  const segment: StorySegment = scenario.story[currentSegment];
  const progress = ((currentSegment + 1) / scenario.story.length) * 100;

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowFeedback(true);
    setTotalQuestions((prev) => prev + 1);

    if (emotion === segment.correctEmotion) {
      setCorrectAnswers((p) => p + 1);
      toast.success('Correct!');
    } else {
      toast.error(`The correct emotion was ${segment.correctEmotion}`);
    }

    setTimeout(savePartialProgress, 600);
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
    setTotalQuestions((prev) => prev + 1);

    if (choice.isHealthy) {
      setCorrectAnswers((p) => p + 1);
      toast.success('Good choice!');
    } else {
      toast.error('Consider a healthier response.');
    }

    setTimeout(savePartialProgress, 600);
  };

  const handleContinue = async () => {
    if (currentSegment < scenario.story.length - 1) {
      setCurrentSegment((p) => p + 1);
      setSelectedEmotion(null);
      setSelectedChoice(null);
      setShowFeedback(false);
      return;
    }

    // 完成场景
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setIsComplete(true);
    await saveProgressToDatabase(finalScore, true);
  };

  const handleFinish = async () => {
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);

    if (hasUnsavedProgress) {
      await saveProgressToDatabase(finalScore, true);
    }

    onComplete(scenarioId, finalScore);
  };

  const canContinue =
    !segment.emotionRecognitionQuestion ||
    selectedEmotion ||
    (segment.choices && selectedChoice);

  // ---------------------------
  // ⭐ 完成页面
  // ---------------------------
  if (isComplete) {
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="p-8 text-center">
          <Trophy className="w-10 h-10 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Scenario Complete!</h1>
          <p className="text-lg mb-2">{scenario.title}</p>
          <p className="text-5xl font-bold text-green-600">{finalScore}%</p>

          <div className="mt-6 flex gap-4 justify-center">
            <Button onClick={handleFinish}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Scenarios
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ---------------------------
  // ⭐ 故事页面
  // ---------------------------
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">

      <div className="flex justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Badge>
          <BookOpen className="w-3 h-3 mr-1" />
          {currentSegment + 1}/{scenario.story.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-2 mb-4" />

      <Card className="p-0 mb-6 border-2">
        {segment.imageUrl && (
          <div className="h-64 bg-gray-200 overflow-hidden">
            <ImageWithFallback
              src={segment.imageUrl}
              alt="scene"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <p className="text-lg whitespace-pre-line text-gray-800">
            {segment.narrative}
          </p>

          {/* 情绪识别题 */}
          {segment.emotionRecognitionQuestion && (
            <>
              <div className="p-4 bg-purple-50 border mt-6 rounded">
                <h3 className="font-bold mb-2">
                  {segment.emotionRecognitionQuestion}
                </h3>
              </div>

              <EmotionWheel
                emotions={segment.emotionOptions || []}
                selectedEmotion={selectedEmotion}
                onSelectEmotion={handleEmotionSelect}
                disabled={showFeedback}
              />

              {showFeedback && (
                <Alert
                  className={`mt-4 ${
                    selectedEmotion === segment.correctEmotion
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}
                >
                  <AlertDescription>
                    {segment.emotionExplanation}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {/* 选择题 */}
          {segment.choices && (
            <div className="mt-6 space-y-4">
              {segment.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoiceSelect(choice)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left border rounded-xl ${
                    selectedChoice === choice
                      ? choice.isHealthy
                        ? 'border-green-500 bg-green-50'
                        : 'border-orange-500 bg-orange-50'
                      : 'bg-white hover:border-purple-300'
                  }`}
                >
                  <p className="text-gray-800">{choice.text}</p>
                  <p className="text-sm text-gray-600 italic">
                    Emotional response: {choice.emotionalResponse}
                  </p>
                </button>
              ))}

              {showFeedback && selectedChoice && (
                <Alert className="mt-4">
                  <AlertDescription>
                    {selectedChoice.feedback}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </Card>

      <Button
        size="lg"
        disabled={!canContinue}
        onClick={handleContinue}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
