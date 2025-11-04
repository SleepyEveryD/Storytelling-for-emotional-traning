import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Mic, Users } from 'lucide-react';

interface WelcomePageProps {
  onMicrophoneClick: () => void;
  onNavigateToCaregiverSpace: () => void;
}

export function WelcomePage({ onMicrophoneClick, onNavigateToCaregiverSpace }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      {/* Caregiver Space Button - Top Right */}
      <div className="absolute top-6 right-6 z-10">
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

      {/* Main Content - Centered */}
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Robot Image */}
          <div className="mb-12 animate-in fade-in duration-700">
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-purple-200 shadow-2xl mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1655923570951-fd93db1152e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcm9ib3QlMjBhc3Npc3RhbnR8ZW58MXx8fHwxNzYyMjMzNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
          <div className="animate-in slide-in-from-bottom duration-500">
            <Button
              size="lg"
              onClick={onMicrophoneClick}
              className="rounded-full w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            >
              <Mic className="w-12 h-12" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">Click to start a story</p>
          </div>
        </div>
      </div>
    </div>
  );
}
