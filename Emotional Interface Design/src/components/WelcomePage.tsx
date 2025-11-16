import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mic, Users, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WelcomePageProps {
  onProblemSubmit: (problem: string) => Promise<void>;
  onMicrophoneClick: () => void;
  onNavigateToCaregiverSpace: () => void;
}

export function WelcomePage({ onProblemSubmit, onMicrophoneClick, onNavigateToCaregiverSpace }: WelcomePageProps) {
  const [problem, setProblem] = useState('');
  const [showDialog, setShowDialog] = useState(false);

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
              onClick={onMicrophoneClick}
              className="rounded-full w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            >
              <Mic className="w-12 h-12" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">Click to start a story</p>
          </div>

          {/* AI Dialog Button */}
          <div className="animate-in fade-in duration-700 delay-300">
            <Button
              onClick={() => setShowDialog(true)}
              variant="outline"
              className="gap-2 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
              size="lg"
            >
              <MessageCircle className="w-5 h-5" />
              Talk with AI about your concerns
            </Button>
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
              <Textarea
                placeholder="For example: 'I feel anxious in social situations' or 'I had an argument with a friend'..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="min-h-[120px] resize-none text-base mb-4"
                autoFocus
              />
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
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
