// components/AIConversation.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Send, Bot, User, ThumbsUp, ThumbsDown, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          
          setUserInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

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

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Function to speak text
  const speakText = (text: string, messageIndex: number) => {
    if (!speechSynthesisRef.current) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // If already speaking, stop
    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to select a pleasant voice
    const voices = speechSynthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingIndex(messageIndex);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
    };

    speechSynthesisRef.current.speak(utterance);
  };

  // Function to stop speaking
  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
    }
  };

  // Function to toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

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

      // Automatically speak the AI response
      setTimeout(() => {
        speakText(aiResponse.content, conversation.length + 1);
      }, 300);

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
                  <div className="flex flex-col gap-2">
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {/* Add TTS button for assistant messages */}
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (currentSpeakingIndex === index) {
                            stopSpeaking();
                          } else {
                            speakText(message.content, index);
                          }
                        }}
                        className={`self-start h-8 px-2 ${
                          currentSpeakingIndex === index 
                            ? 'text-purple-600 bg-purple-50' 
                            : 'text-gray-500 hover:text-purple-600'
                        }`}
                      >
                        {currentSpeakingIndex === index ? (
                          <>
                            <VolumeX className="w-4 h-4 mr-1" />
                            <span className="text-xs">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 mr-1" />
                            <span className="text-xs">Listen</span>
                          </>
                        )}
                      </Button>
                    )}
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
              placeholder="Type your message here or click the microphone to speak..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={toggleListening}
                disabled={isLoading}
                className={`${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {isListening && (
            <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Listening... Speak now
            </div>
          )}
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