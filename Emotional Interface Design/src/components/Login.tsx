import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sparkles, User, Stethoscope, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

interface LoginProps {
  onLogin: (role: 'user' | 'therapist', name: string, userId: string) => void;
  onBack?: () => void;
}

type AuthMode = 'select-role' | 'login' | 'register';

export function Login({ onLogin, onBack }: LoginProps) {
  const { signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('select-role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'therapist' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
  };

  const handleRoleSelect = (role: 'user' | 'therapist') => {
    setSelectedRole(role);
    setAuthMode('login');
  };

  const handleSwitchToRegister = () => {
    resetForm();
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    resetForm();
    setAuthMode('login');
  };

  const handleBackToRoleSelect = () => {
    resetForm();
    setSelectedRole(null);
    setAuthMode('select-role');
  };

  const validateForm = () => {
    setError('');
    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (!name.trim()) {
        setError('Please enter your name');
        return false;
      }
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return false;
    }
    if (!selectedRole) {
      setError('Please select a role');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await signUp(email, password, {
        name: name.trim(),
        role: selectedRole,
      });
      if (error) throw error;

      if (data?.user) {
        const loginResult = await signIn(email, password);
        if (loginResult.error) throw loginResult.error;

        onLogin(selectedRole!, name.trim(), data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;

      if (data?.user) {
        const role = data.user.user_metadata?.role || 'user';
        const name = data.user.user_metadata?.name || 'User';
        onLogin(role, name, data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 角色选择界面
  if (authMode === 'select-role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        {onBack && (
          <div className="absolute top-6 left-6 z-10">
            <Button
              onClick={onBack}
              variant="outline"
              className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
              size="lg"
            >
              ← Back
            </Button>
          </div>
        )}
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8 animate-in fade-in duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Emotional Training
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Please select your role to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => handleRoleSelect('user')}
              className="p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">I'm a User</h2>
                <p className="text-gray-600">
                  Practice emotional recognition and regulation through interactive stories
                </p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('therapist')}
              className="p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Stethoscope className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">I'm a Therapist/Caregiver</h2>
                <p className="text-gray-600">
                  Monitor progress, customize scenarios, and support patients' emotional growth
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 登录/注册表单界面
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={handleBackToRoleSelect}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-colors mb-6"
          >
            <Sparkles className="w-6 h-6 text-purple-600" />
          </button>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {authMode === 'register' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {authMode === 'register'
              ? `Sign up as ${selectedRole === 'user' ? 'User' : 'Therapist'}`
              : `Sign in as ${selectedRole === 'user' ? 'User' : 'Therapist'}`}
          </p>
        </div>

        <Card className="p-6 border-2 shadow-lg">
          <form onSubmit={authMode === 'register' ? handleRegister : handleLogin}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Full Name - 注册时才显示 */}
            {authMode === 'register' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {authMode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password - 仅注册时显示 */}
            {authMode === 'register' && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                </div>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : authMode === 'register' ? 'Create Account' : 'Sign In'}
            </Button>

            {/* Back to role selection button */}
            <Button
              type="button"
              onClick={handleBackToRoleSelect}
              variant="ghost"
              className="w-full mt-3 text-purple-600 hover:text-purple-800 transition-all hover:bg-purple-50"
            >
              ← Back to role selection
            </Button>

            {/* Switch between login & register */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={authMode === 'register' ? handleSwitchToLogin : handleSwitchToRegister}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {authMode === 'register'
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
