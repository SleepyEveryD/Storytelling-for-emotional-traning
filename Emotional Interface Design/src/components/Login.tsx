import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sparkles, User, Stethoscope, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
    userRole, 
    isTherapist, 
    isUser,
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

  // 重置表单状态
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
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
        setError('密码不匹配');
        return false;
      }
      if (password.length < 6) {
        setError('密码至少需要6位字符');
        return false;
      }
      if (!name.trim()) {
        setError('请输入您的姓名');
        return false;
      }
    }
    
    if (!email.trim()) {
      setError('请输入邮箱地址');
      return false;
    }

    if (!password.trim()) {
      setError('请输入密码');
      return false;
    }

    if (!selectedRole) {
      setError('请选择角色');
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
      setError(err.message || '注册失败，请重试');
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
        const userName = userMetadata?.name || userMetadata?.full_name || '用户';
        
        // 确保角色是 'user' 或 'therapist'
        const finalRole: 'user' | 'therapist' = 
          userRoleFromMeta === ALLOWED_ROLES.THERAPIST ? 'therapist' : 'user';
        
        // 登录成功，调用 onLogin 回调
        onLogin(finalRole, userName, result.data.user.id);
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请检查您的凭据');
    } finally {
      setLoading(false);
    }
  };

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
              欢迎来到情感训练平台
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              请选择您的角色继续
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
                <h2 className="text-xl font-semibold mb-2">我是用户</h2>
                <p className="text-gray-600">
                  通过互动故事练习情感识别和调节能力
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
                <h2 className="text-xl font-semibold mb-2">我是治疗师/护理人员</h2>
                <p className="text-gray-600">
                  监控进度、定制场景并支持患者的情感成长
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
            {authMode === 'register' ? '创建账户' : '欢迎回来'}
          </h1>
          <p className="text-gray-600">
            {authMode === 'register' 
              ? `注册为 ${selectedRole === ALLOWED_ROLES.USER ? '用户' : '治疗师'}`
              : `登录为 ${selectedRole === ALLOWED_ROLES.USER ? '用户' : '治疗师'}`
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
              更改角色 ({selectedRole === ALLOWED_ROLES.USER ? '用户' : '治疗师'})
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
                <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  姓名
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="请输入您的姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 focus:border-purple-500 transition-colors"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                邮箱地址
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 focus:border-purple-500 transition-colors"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                密码
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 focus:border-purple-500 transition-colors"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authMode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">
                  密码至少需要6位字符
                </p>
              )}
            </div>

            {authMode === 'register' && (
              <div className="mb-6">
                <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                  确认密码
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 focus:border-purple-500 transition-colors"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
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
                  {authMode === 'register' ? '创建账户中...' : '登录中...'}
                </div>
              ) : (
                authMode === 'register' ? '创建账户' : '登录'
              )}
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={authMode === 'register' ? handleSwitchToLogin : handleSwitchToRegister}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
              >
                {authMode === 'register' 
                  ? '已有账户？立即登录' 
                  : '没有账户？立即注册'
                }
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}