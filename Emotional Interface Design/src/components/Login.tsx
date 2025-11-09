import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sparkles, User, Stethoscope, Mail, Lock, Eye, EyeOff, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onLogin: (role: 'user' | 'therapist', name: string, userId: string) => void;
}

type AuthMode = 'select-role' | 'login' | 'register';

export function Login({ onLogin }: LoginProps) {
  const { 
    signIn, 
    signUpAsUser, 
    signUpAsTherapist, 
    user,
    loading: authLoading,
    isAuthenticated,
    signOut,
    ALLOWED_ROLES 
  } = useAuth();
  
  const [authMode, setAuthMode] = useState<AuthMode>('select-role');
  const [selectedRole, setSelectedRole] = useState<'user' | 'therapist' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoggedInScreen, setShowLoggedInScreen] = useState(false);

  // 检查用户是否已经有有效的会话
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      setShowLoggedInScreen(true);
    }
  }, [authLoading, isAuthenticated, user]);

  // 处理继续登录（使用已保存的会话）
  const handleContinueLogin = () => {
    if (user) {
      const userMetadata = user.user_metadata;
      const userRoleFromMeta = userMetadata?.role || ALLOWED_ROLES.USER;
      const userName = userMetadata?.name || userMetadata?.full_name || 'User';
      
      const finalRole: 'user' | 'therapist' = 
        userRoleFromMeta === ALLOWED_ROLES.THERAPIST ? 'therapist' : 'user';
      
      onLogin(finalRole, userName, user.id);
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await signOut();
      setShowLoggedInScreen(false);
      resetForm();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 重置表单状态
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
    setSelectedRole(null);
    setAuthMode('select-role');
  };

  // 处理角色选择
  const handleRoleSelect = (role: 'user' | 'therapist') => {
    setSelectedRole(role);
    setAuthMode('login');
  };

  // 切换到注册模式
  const handleSwitchToRegister = () => {
    resetForm();
    setAuthMode('register');
  };

  // 切换到登录模式
  const handleSwitchToLogin = () => {
    resetForm();
    setAuthMode('login');
  };

  // 返回角色选择
  const handleBackToRoleSelect = () => {
    resetForm();
    setSelectedRole(null);
    setAuthMode('select-role');
  };

  // 验证表单
  const validateForm = (): boolean => {
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
      setError('Please enter email address');
      return false;
    }

    if (!password.trim()) {
      setError('Please enter password');
      return false;
    }

    if (!selectedRole) {
      setError('Please select a role');
      return false;
    }

    return true;
  };

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      let result;
      
      // 根据选择的角色调用不同的注册函数
      if (selectedRole === ALLOWED_ROLES.USER) {
        result = await signUpAsUser(email, password, {
          name: name.trim(),
          full_name: name.trim(),
        });
      } else {
        result = await signUpAsTherapist(email, password, {
          name: name.trim(),
          full_name: name.trim(),
          specialization: '', // 可以在表单中添加更多字段
        });
      }

      if (result.error) throw result.error;

      if (result.data?.user) {
        // 注册成功，自动登录
        const loginResult = await signIn(email, password);
        
        if (loginResult.error) {
          throw loginResult.error;
        }

        // 登录成功，调用 onLogin 回调
        onLogin(selectedRole, name.trim(), result.data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) throw result.error;

      if (result.data?.user) {
        // 从用户元数据中获取角色和姓名
        const userMetadata = result.data.user.user_metadata;
        const userRoleFromMeta = userMetadata?.role || ALLOWED_ROLES.USER;
        const userName = userMetadata?.name || userMetadata?.full_name || 'User';
        
        // 确保角色是 'user' 或 'therapist'
        const finalRole: 'user' | 'therapist' = 
          userRoleFromMeta === ALLOWED_ROLES.THERAPIST ? 'therapist' : 'user';
        
        // 登录成功，调用 onLogin 回调
        onLogin(finalRole, userName, result.data.user.id);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed, please check your credentials');
    } finally {
      setLoading(false);
    }
  };

  // 显示加载状态
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Checking authentication...
          </h1>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // 显示已登录界面（让用户选择继续或登出）
  if (showLoggedInScreen && user) {
    const userMetadata = user.user_metadata;
    const userRoleFromMeta = userMetadata?.role || ALLOWED_ROLES.USER;
    const userName = userMetadata?.name || userMetadata?.full_name || 'User';
    const userRole = userRoleFromMeta === ALLOWED_ROLES.THERAPIST ? 'Therapist' : 'User';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-gray-600 mb-6">
              You're already logged in as {userName}
            </p>
          </div>

          <Card className="p-6 border-2 shadow-lg backdrop-blur-sm bg-white/90">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold mb-1">{userName}</h2>
              <p className="text-gray-600 text-sm mb-4">{userRole}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleContinueLogin}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300"
              >
                Continue as {userName}
              </Button>

              <Button 
                onClick={handleLogout}
                variant="outline"
                size="lg"
                className="w-full gap-2 text-gray-600 hover:text-gray-700 border-gray-300 hover:border-gray-400"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Not {userName}? Sign out to use a different account.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 角色选择界面
  if (authMode === 'select-role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8 animate-in fade-in duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Emotional Training Platform
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Please select your role to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => handleRoleSelect(ALLOWED_ROLES.USER)}
              className="p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <User className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">I am a User</h2>
                <p className="text-gray-600">
                  Practice emotion recognition and regulation through interactive stories
                </p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect(ALLOWED_ROLES.THERAPIST)}
              className="p-8 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Stethoscope className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">I am a Therapist/Caregiver</h2>
                <p className="text-gray-600">
                  Monitor progress, customize scenarios, and support emotional growth
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
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-colors mb-6 group"
          >
            <Sparkles className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
          </button>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {authMode === 'register' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {authMode === 'register' 
              ? `Register as ${selectedRole === ALLOWED_ROLES.USER ? 'User' : 'Therapist'}`
              : `Login as ${selectedRole === ALLOWED_ROLES.USER ? 'User' : 'Therapist'}`
            }
          </p>
        </div>

        <Card className="p-6 border-2 shadow-lg backdrop-blur-sm bg-white/90">
          {/* 更改角色按钮 - 添加到卡片顶部 */}
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBackToRoleSelect}
              className="w-full gap-2 text-gray-600 hover:text-gray-700 border-gray-300 hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Role ({selectedRole === ALLOWED_ROLES.USER ? 'User' : 'Therapist'})
            </Button>
          </div>

          <form onSubmit={authMode === 'register' ? handleRegister : handleLogin}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {authMode === 'register' && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Lock className="w-4 h-4 text-gray-400 mr-2" />
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 focus:border-purple-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {authMode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {authMode === 'register' && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Lock className="w-4 h-4 text-gray-400 mr-2" />
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                </div>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            )}

            <Button 
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {authMode === 'register' ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                authMode === 'register' ? 'Create Account' : 'Sign In'
              )}
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={authMode === 'register' ? handleSwitchToLogin : handleSwitchToRegister}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
              >
                {authMode === 'register' 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}