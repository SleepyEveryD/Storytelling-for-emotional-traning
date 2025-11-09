<<<<<<< Updated upstream
import { useState } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> Stashed changes
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
<<<<<<< Updated upstream
import { ArrowLeft, UserPlus, User, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';
=======
import { ArrowLeft, UserPlus, User, Clock, Activity, CheckCircle2, Shield,Settings } from 'lucide-react';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { supabase } from "../supabase_client";
import { PatientSettingsDialog } from './PatientSettingsDialog';
>>>>>>> Stashed changes

interface UserSession {
  id: string;
  name: string;
  createdDate: string;
  lastActive: string;
  completedScenarios: number;
  totalScenarios: number;
  age?: number;
  gender?: string;
  email?: string;
  notes?: string;
}

interface CaregiverSpaceProps {
  onBack: () => void;
  onSelectUser: (userId: string, userName: string, patientId: string, patientName: string) => void;
}

export function CaregiverSpace({ onBack, onSelectUser }: CaregiverSpaceProps) {
<<<<<<< Updated upstream
  const [users, setUsers] = useState<UserSession[]>([
    {
      id: '1',
      name: 'Emma',
      createdDate: '2025-10-15',
      lastActive: '2025-11-03',
      completedScenarios: 4,
      totalScenarios: 6,
    },
    {
      id: '2',
      name: 'Oliver',
      createdDate: '2025-10-20',
      lastActive: '2025-11-02',
      completedScenarios: 2,
      totalScenarios: 6,
    },
    {
      id: '3',
      name: 'Sophia',
      createdDate: '2025-10-28',
      lastActive: '2025-11-04',
      completedScenarios: 6,
      totalScenarios: 6,
    },
  ]);
=======
  const { user, isTherapist, loading } = useAuth();
>>>>>>> Stashed changes
  
  const [users, setUsers] = useState<UserSession[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(null);
  
  // 患者设置相关状态
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<UserSession | null>(null);

<<<<<<< Updated upstream
  const handleCreateUser = (e: React.FormEvent) => {
=======
  // 治疗师身份验证和保护
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('用户未登录，无法访问治疗师空间');
        return;
      } else if (!isTherapist) {
        console.log('用户不是治疗师，无法访问治疗师空间');
        return;
      } else {
        // 如果是治疗师，加载患者数据
        fetchPatients();
      }
    }
  }, [user, isTherapist, loading]);

  // 从 Supabase 获取患者数据
  const fetchPatients = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('开始获取患者数据...');
      
      // 获取治疗师的患者（包含所有字段）
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .eq('therapist_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (patientsError) {
        console.error('获取患者数据错误:', patientsError);
        return;
      }

      console.log('获取到的患者数据:', patientsData);

      if (!patientsData || patientsData.length === 0) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      // 为每个患者获取进度数据
      const patientsWithProgress = await Promise.all(
        patientsData.map(async (patient) => {
          console.log(`处理患者 ${patient.name} 的进度数据...`);
          
          // 获取患者完成的场景数量
          const { data: progressData, error: progressError } = await supabase
            .from('scenario_progress')
            .select('scenario_id, completed, last_attempted')
            .eq('patient_id', patient.id)
            .eq('completed', true);

          if (progressError) {
            console.error(`获取患者 ${patient.name} 进度数据错误:`, progressError);
          }

          // 获取总场景数量
          const { data: scenariosData, error: scenariosError } = await supabase
            .from('scenarios')
            .select('id');

          if (scenariosError) {
            console.error('获取场景数据错误:', scenariosError);
          }

          const completedScenarios = progressData?.length || 0;
          const totalScenarios = scenariosData?.length || 6;

          // 获取最后活动时间
          let lastActive = patient.created_at;
          if (progressData && progressData.length > 0) {
            // 找到最新的活动时间
            const latestAttempt = progressData.reduce((latest, current) => {
              if (!current.last_attempted) return latest;
              return new Date(current.last_attempted) > new Date(latest) ? current.last_attempted : latest;
            }, progressData[0].last_attempted || patient.created_at);
            lastActive = latestAttempt;
          }

          console.log(`患者 ${patient.name} 完成场景: ${completedScenarios}/${totalScenarios}`);

          return {
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            email: patient.email,
            notes: patient.notes,
            createdDate: patient.created_at,
            lastActive: lastActive,
            completedScenarios,
            totalScenarios,
          };
        })
      );

      console.log('最终的患者数据:', patientsWithProgress);
      setUsers(patientsWithProgress);
    } catch (error) {
      console.error('获取数据时发生错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新患者
  const handleCreateUser = async (e: React.FormEvent) => {
>>>>>>> Stashed changes
    e.preventDefault();
    if (!newUserName.trim() || !user) return;

    try {
      setIsCreating(true);

      const { data, error } = await supabase
        .from('patients')
        .insert([
          {
            name: newUserName.trim(),
            therapist_id: user.id,
            status: 'active',
          }
        ])
        .select();

      if (error) {
        console.error('创建患者错误:', error);
        alert('创建患者失败: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        const newPatient = data[0];
        
        // 重新获取数据以确保显示最新状态
        await fetchPatients();
        
        setNewUserName('');
        setIsDialogOpen(false);
        console.log('成功创建患者:', newPatient);
      }
    } catch (error) {
      console.error('创建患者时发生错误:', error);
      alert('创建患者时发生错误');
    } finally {
      setIsCreating(false);
    }
  };

  // 处理选择患者
  const handleSelectUser = (userId: string, userName: string) => {
    setCurrentPatientId(userId);
    setCurrentPatientName(userName);
    // 调用父组件的回调函数，传递患者信息
    onSelectUser(userId, userName, userId, userName);
  };

  // 打开设置对话框
  const handleOpenSettings = (user: UserSession, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片点击事件
    setSelectedPatient(user);
    setSettingsOpen(true);
  };

  // 患者信息更新后的回调
  const handlePatientUpdated = () => {
    fetchPatients(); // 重新加载患者数据
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">检查治疗师权限中...</p>
        </div>
      </div>
    );
  }

  // 如果未通过验证，显示无权限信息
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">未登录</h1>
          <p className="text-gray-600 mb-6">请先登录以访问治疗师空间</p>
          <Button onClick={onBack} variant="outline">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  if (!isTherapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">无权限访问</h1>
          <p className="text-gray-600 mb-2">您没有治疗师权限</p>
          <p className="text-gray-500 text-sm mb-6">当前角色: {user.user_metadata?.role || 'user'}</p>
          <Button onClick={onBack} variant="outline">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  // 数据加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="mb-8">
            <Button
              onClick={onBack}
              variant="outline"
              className="mb-6 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              治疗师工作台
            </h1>
          </div>
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载患者数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Caregiver Space
              </h1>
              <p className="text-gray-600">
                Manage sessions for children and track their progress
              </p>
            </div>

            {/* 创建新会话对话框 */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <UserPlus className="w-5 h-5" />
                  Create New Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Session</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="userName">Child's Name</Label>
                    <Input
                      id="userName"
                      type="text"
                      placeholder="Enter child's name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="mt-2"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={!newUserName.trim() || isCreating}
                  >
<<<<<<< Updated upstream
                    Create Session
=======
                    {isCreating ? '创建中...' : '创建会话'}
>>>>>>> Stashed changes
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl">{users.length}</p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl">
                  {users.reduce((sum, user) => sum + user.completedScenarios, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Completions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl">
                  {users.length > 0 
                    ? Math.round(
                        (users.reduce((sum, user) => sum + user.completedScenarios, 0) /
                          (users.reduce((sum, user) => sum + user.totalScenarios, 0))) *
                          100
                      )
                    : 0}%
                </p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Session Cards */}
        <div>
          <h2 className="mb-6">Sessions</h2>
          
          {users.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-gray-600">No sessions yet</h3>
              <p className="text-gray-500 mb-6">
                Create a new session to get started
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <UserPlus className="w-5 h-5" />
                Create First Session
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                const progressPercentage = Math.round(
                  (user.completedScenarios / user.totalScenarios) * 100
                );
                
                return (
                  <Card
                    key={user.id}
                    className="p-6 border-2 hover:shadow-xl transition-all duration-300 hover:border-purple-300 cursor-pointer group relative"
                    onClick={() => handleSelectUser(user.id, user.name)}
                  >
                    {/* 设置按钮 - 添加到右上角 */}
                    <button
                      onClick={(e) => handleOpenSettings(user, e)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Patient Settings"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </button>

                    <div className="flex items-center gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">{getInitials(user.name)}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
<<<<<<< Updated upstream
                        <h3 className="mb-2">{user.name}</h3>
=======
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                          {/* 显示额外信息 */}
                          {(user.age || user.gender) && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {user.age && <span>{user.age} years</span>}
                              {user.gender && <span>• {user.gender}</span>}
                              {user.email && (
                                <Badge variant="outline" className="text-xs">
                                  {user.email}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
>>>>>>> Stashed changes
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Last active: {formatDate(user.lastActive)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Created: {formatDate(user.createdDate)}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {user.completedScenarios}/{user.totalScenarios} scenarios
                          </Badge>
                        </div>
                      </div>

                      {/* Completion Badge */}
                      {user.completedScenarios === user.totalScenarios && (
                        <div className="flex-shrink-0">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* 当前选择的患者信息 */}
        {currentPatientId && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                当前选择患者: {currentPatientName}
              </span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              现在选择场景，患者的进度将被记录到数据库中
            </p>
          </div>
        )}
      </div>

      {/* 患者设置对话框 */}
      <PatientSettingsDialog
        patient={selectedPatient}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onPatientUpdated={handlePatientUpdated}
      />
    </div>
  );
}
