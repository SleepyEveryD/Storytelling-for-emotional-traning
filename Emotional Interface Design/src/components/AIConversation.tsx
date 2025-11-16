// components/AIConversation.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Send, Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AIConversationProps {
  userProblem: string;
  onAcceptPractice: (fullContext: string) => void;
  onDeclinePractice: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIConversation({ userProblem, onAcceptPractice, onDeclinePractice }: AIConversationProps) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPracticePrompt, setShowPracticePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化对话
  useEffect(() => {
    const initialMessage: Message = {
      role: 'assistant',
      content: `I understand you're dealing with: "${userProblem}". Can you tell me more about how this situation makes you feel and what specific challenges you're facing?`
    };
    setConversation([initialMessage]);
  }, [userProblem]);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput.trim()
    };

    // 添加用户消息
    setConversation(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // 模拟AI回复（这里可以替换为真实的AI API调用）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        role: 'assistant',
        content: generateAIResponse([...conversation, userMessage])
      };

      setConversation(prev => [...prev, aiResponse]);

      // 检查是否应该提示练习（在3-4轮对话后）
      if (conversation.length >= 4 && !showPracticePrompt) {
        setShowPracticePrompt(true);
      }

    } catch (error) {
      console.error('Error in AI conversation:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Would you like to continue talking about your situation?'
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (currentConversation: Message[]): string => {
    const lastUserMessage = currentConversation[currentConversation.length - 1].content.toLowerCase();
    
    // 简单的响应逻辑 - 可以替换为真实的AI服务
    if (lastUserMessage.includes('feel') || lastUserMessage.includes('emotion')) {
      return "Thank you for sharing your feelings. Understanding emotions is the first step. Can you tell me more about what triggers these feelings?";
    } else if (lastUserMessage.includes('friend') || lastUserMessage.includes('family')) {
      return "Relationships can be challenging. It sounds like this situation is important to you. How do you usually handle similar situations?";
    } else if (lastUserMessage.includes('work') || lastUserMessage.includes('job')) {
      return "Work-related stress is common. It helps to develop coping strategies. What aspects of this situation are most difficult for you?";
    } else if (lastUserMessage.includes('anxious') || lastUserMessage.includes('nervous')) {
      return "Anxiety can be overwhelming. Recognizing triggers is key. What situations typically make you feel this way?";
    } else {
      const responses = [
        "I see, thank you for explaining. How does this affect your daily life?",
        "That's insightful. What do you think would help improve this situation?",
        "I understand. Have you tried any strategies to cope with this?",
        "Thank you for sharing. What would you like to see change in this situation?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  // 这里就是需要添加的函数 - 处理接受练习
  const handleAcceptPractice = () => {
    // 构建完整的对话上下文
    const fullContext = `
      Initial problem: ${userProblem}
      Conversation history: ${conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    `;
    
    onAcceptPractice(fullContext);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI Conversation
          </h1>
          <p className="text-gray-600">
            Share your thoughts and feelings. I'm here to listen and help.
          </p>
        </div>

        {/* 对话区域 */}
        <Card className="p-6 mb-6 h-96 overflow-y-auto">
          <div className="space-y-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
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
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* 输入区域 */}
        <Card className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* 练习提示 */}
        {showPracticePrompt && (
          <Card className="p-6 mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ready to Practice?
              </h3>
              <p className="text-gray-600 mb-4">
                Based on our conversation, I can recommend a personalized story scenario to help you practice emotional skills.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleAcceptPractice}  // 使用这里定义的函数
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes, Let's Practice
                </Button>
                <Button
                  onClick={onDeclinePractice}
                  variant="outline"
                  className="gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Not Now
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}