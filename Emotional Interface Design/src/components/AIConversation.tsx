// components/AIConversation.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Send, Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { getAIChatResponse, generateStoryFromConversation } from '../services/geminiService';

interface AIConversationProps {
  userProblem: string;
  onAcceptPractice: (storyJson: string) => void;
  onDeclinePractice: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIConversation({
  userProblem,
  onAcceptPractice,
  onDeclinePractice
}: AIConversationProps) {
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPracticePrompt, setShowPracticePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* -------------------------------
        清理 AI 返回的 JSON
  --------------------------------*/
  function cleanJsonFromModel(raw: string): string {
    if (!raw) return raw;
    let cleaned = raw.trim();

    // 移除前缀
    cleaned = cleaned.replace(/^```json/i, '');
    cleaned = cleaned.replace(/^```/, '');
    // 移除后缀
    cleaned = cleaned.replace(/```$/, '');

    return cleaned.trim();
  }

  /* -------------------------------
        初始化对话
  --------------------------------*/
  useEffect(() => {
    setConversation([
      {
        role: 'assistant',
        content: `I understand you're dealing with: "${userProblem}". Can you tell me more about how this situation makes you feel and what specific challenges you're facing?`
      }
    ]);
  }, [userProblem]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  /* -------------------------------
        发送用户消息
  --------------------------------*/
  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput.trim()
    };

    setConversation(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const aiReply = await getAIChatResponse([...conversation, userMessage]);
      setConversation(prev => [...prev, { role: 'assistant', content: aiReply }]);

      if (conversation.length >= 4 && !showPracticePrompt) {
        setShowPracticePrompt(true);
      }
    } catch (err) {
      console.error('AI error:', err);
      setConversation(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Want to continue?' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------
        点击 Yes → 生成 StoryViewer 格式故事
  --------------------------------*/
  const handleAcceptPractice = async () => {
    const fullContext = `
      You are an AI that creates INTERACTIVE emotional training stories for children ages 8–12.
  
      The story MUST be split into multiple segments (3–5).  
      Each segment must be an object inside the "story" array.
  
      STRICT FORMAT FOR EACH SEGMENT:
      ------------------------------------------
      Each segment MUST have **ONLY ONE** type of interaction:
        A) EITHER an emotion recognition question  
        B) OR a set of behavioral choices
  
      NEVER include both in the same segment.
  
      Segment structure:
  
      {
        "id": number,
        "narrative": "string, 80–150 characters",
  
        // Option A: Emotion Recognition (ONLY if no choices)
        "emotionRecognitionQuestion": "string or null",
        "emotionOptions": ["string", "string", "string"],
        "correctEmotion": "string",
        "emotionExplanation": "string",
  
        // Option B: Choices (ONLY if no emotional question)
        "choices": [
          {
            "text": "string",
            "emotionalResponse": "string",
            "isHealthy": boolean,
            "feedback": "string"
          }
        ],
  
        // ALWAYS INCLUDED
        "imageUrl": "https://source.unsplash.com/featured/?kids,emotion,illustration"
      }
  
      HARD RULES:
      - For each segment, IF "emotionRecognitionQuestion" is present, THEN "choices" MUST be null.
      - If "choices" is present, THEN all emotionRecognitionQuestion fields MUST be null.
      - NEVER include both.
      - The story array must contain 3–5 segments.
      - The entire output MUST be valid JSON. No markdown. No comments.
      - All writing must be warm, simple, encouraging, child-safe.
  
      Context from conversation:
      ${userProblem}
  
      Conversation messages:
      ${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}
  
      RETURN ONLY JSON IN THIS EXACT FORM:
      {
        "title": "string",
        "story": [ ...segments... ]
      }
    `;
  
    try {
      const raw = await generateStoryFromConversation(fullContext);
  
      if (!raw) {
        alert('Story generation failed.');
        return;
      }
  
      console.log('RAW OUTPUT FROM AI:', raw);
  
      const cleaned = cleanJsonFromModel(raw);
      console.log('CLEANED:', cleaned);
  
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error('JSON PARSE ERROR:', err);
        alert('AI returned invalid JSON. Please retry.');
        return;
      }
  
      const pretty = JSON.stringify(parsed, null, 2);
      setGeneratedStory(pretty);
  
      onAcceptPractice(pretty);
  
    } catch (err) {
      console.error('Error generating story:', err);
      alert('Something went wrong.');
    }
  };
  

  /* -------------------------------
        Enter 发送
  --------------------------------*/
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* -------------------------------
        UI
  --------------------------------*/
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Conversation
          </h1>
          <p className="text-gray-600">Share your thoughts. I'm here to help.</p>
        </div>

        {/* 对话框 */}
        <Card className="p-6 mb-6 h-96 overflow-y-auto">
          <div className="space-y-4">
            {conversation.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                    }`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'
                    }`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* 输入框 */}
        <Card className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* 练习提示 */}
        {showPracticePrompt && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-center">
            <h3 className="text-lg font-bold mb-2">Ready to Practice?</h3>
            <p className="text-gray-600 mb-4">
              I can generate a personalized emotional learning story for you.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleAcceptPractice} className="bg-green-600 hover:bg-green-700 gap-2">
                <ThumbsUp className="w-4 h-4" />
                Yes, Let's Practice
              </Button>
              <Button onClick={onDeclinePractice} variant="outline" className="gap-2">
                <ThumbsDown className="w-4 h-4" />
                Not Now
              </Button>
            </div>
          </Card>
        )}

        {/* Debug 用故事预览 */}
        {generatedStory && (
          <pre className="mt-6 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
            {generatedStory}
          </pre>
        )}
      </div>
    </div>
  );
}
