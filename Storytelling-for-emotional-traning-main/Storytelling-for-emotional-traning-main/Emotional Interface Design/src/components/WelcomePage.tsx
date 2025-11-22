import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mic, Users, MessageCircle, MicOff } from 'lucide-react';
import { toast } from 'sonner';

interface WelcomePageProps {
  onProblemSubmit: (problem: string) => Promise<void>;
  onMicrophoneClick: () => void;
  onNavigateToCaregiverSpace: () => void;
}

export function WelcomePage({ onProblemSubmit, onMicrophoneClick, onNavigateToCaregiverSpace }: WelcomePageProps) {
  const [problem, setProblem] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
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
          
          setProblem(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error !== 'no-speech') {
            toast.error('Speech recognition error. Please try again.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Open dialog if not already open
      if (!showDialog) {
        setShowDialog(true);
        // Delay starting recognition to allow dialog to open
        setTimeout(() => {
          recognitionRef.current.start();
        }, 300);
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problem.trim()) {
      toast.error('Please describe your situation first');
      return;
    }

    await onProblemSubmit(problem);
    setShowDialog(false);
    setProblem('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">

      {/* Caregiver Space Button - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-10">
        <Button
          onClick={onNavigateToCaregiverSpace}
          variant="outline"
          className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          size="lg"
        >
          <Users className="w-5 h-5" />
          Caregiver Space
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Robot Image */}
          <div className="mb-12 animate-in fade-in duration-700">
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-purple-200 shadow-2xl mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1655923570951-fd93db1152e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcm9ib3QlMjBhc3Npc3RhbnR8ZW58MXx8fHwxNzYyMjMzNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Your AI Companion"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Emotional Training
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Hi! I'm your companion on this journey. Press the microphone to start your story adventure!
            </p>
          </div>

          {/* Microphone Button */}
          <div className="animate-in slide-in-from-bottom duration-500 mb-8">
            <Button
              size="lg"
              onClick={toggleListening}
              className={`rounded-full w-24 h-24 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 animate-pulse' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              {isListening ? 'Listening... Speak now' : 'Click to speak your concern'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border-2 border-purple-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Share your concerns with AI
            </h3>
            <p className="text-gray-600 mb-4">
              Tell me what's on your mind, and I'll recommend the best story practice for you.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="relative mb-2">
                <Textarea
                  placeholder="Type or click the microphone to speak your concern..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="min-h-[120px] resize-none text-base pr-14"
                  autoFocus
                />
                <Button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute top-3 right-3 h-10 w-10 p-0 ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>
              {isListening && (
                <div className="mb-3 text-sm text-red-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  Listening... Speak now
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (isListening && recognitionRef.current) {
                      recognitionRef.current.stop();
                    }
                    setShowDialog(false);
                    setProblem('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!problem.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Start Conversation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
