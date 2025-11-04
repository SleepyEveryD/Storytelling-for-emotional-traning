import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sparkles, User, Stethoscope } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'user' | 'therapist', name: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<'user' | 'therapist' | null>(null);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && name.trim()) {
      onLogin(selectedRole, name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Emotional Training
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Please select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setSelectedRole('user')}
            className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
              selectedRole === 'user'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === 'user' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-purple-100'
              }`}>
                <User className={`w-10 h-10 ${
                  selectedRole === 'user' ? 'text-white' : 'text-purple-600'
                }`} />
              </div>
              <h2 className="mb-2">I'm a User</h2>
              <p className="text-gray-600">
                Practice emotional recognition and regulation through interactive stories
              </p>
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('therapist')}
            className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
              selectedRole === 'therapist'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                selectedRole === 'therapist' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-purple-100'
              }`}>
                <Stethoscope className={`w-10 h-10 ${
                  selectedRole === 'therapist' ? 'text-white' : 'text-purple-600'
                }`} />
              </div>
              <h2 className="mb-2">I'm a Therapist/Caregiver</h2>
              <p className="text-gray-600">
                Monitor progress, customize scenarios, and support patients' emotional growth
              </p>
            </div>
          </button>
        </div>

        {selectedRole && (
          <Card className="p-8 border-2 shadow-lg animate-in slide-in-from-bottom duration-500">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Label htmlFor="name" className="mb-2 block">
                  What's your name?
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg p-6"
                  autoFocus
                />
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={!name.trim()}
              >
                Continue as {selectedRole === 'user' ? 'User' : 'Therapist'}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
