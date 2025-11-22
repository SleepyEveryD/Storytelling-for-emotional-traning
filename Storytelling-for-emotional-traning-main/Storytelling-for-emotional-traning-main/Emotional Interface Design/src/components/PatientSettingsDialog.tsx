import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings, Save, Loader2, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../supabase_client';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  email?: string;
  patient_user_id?: string;
  login_configured?: boolean;
  notes?: string;
}

interface PatientSettingsDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientUpdated: () => void;
}

export function PatientSettingsDialog({ 
  patient, 
  open, 
  onOpenChange, 
  onPatientUpdated 
}: PatientSettingsDialogProps) {
  const { signUpAsUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // 当患者数据变化时更新表单
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        age: patient.age?.toString() || '',
        gender: patient.gender || '',
        email: patient.email || '',
        password: '', // 密码不预填充
        notes: patient.notes || ''
      });
    }
  }, [patient]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 创建患者账户
  const createPatientAccount = async () => {
    if (!patient || !formData.email || !formData.password) {
      toast.error('Email and password are required to create account');
      return null;
    }

    try {
      setIsCreatingAccount(true);
      
      // 使用 AuthContext 的注册函数创建患者账户
      const { data, error } = await signUpAsUser(
        formData.email,
        formData.password,
        {
          patient_id: patient.id,
          patient_name: formData.name,
          therapist_id: (await supabase.auth.getUser()).data.user?.id
        }
      );

      if (error) {
        throw error;
      }

      if (data?.user) {
        return data.user.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating patient account:', error);
      toast.error(`Failed to create patient account: ${error.message}`);
      return null;
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleSave = async () => {
    if (!patient) return;

    try {
      setIsLoading(true);

      // 验证必填字段
      if (!formData.name.trim()) {
        toast.error('Name is required');
        return;
      }

      // 检查是否需要创建账户
      let patientUserId = patient.patient_user_id;
      let shouldUpdateLoginInfo = false;

      // 如果提供了邮箱和密码，且患者还没有账户，则创建账户
      if (formData.email && formData.password && !patient.login_configured) {
        if (!formData.email.includes('@')) {
          toast.error('Please enter a valid email');
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return;
        }

        patientUserId = await createPatientAccount();
        if (!patientUserId) {
          return; // 账户创建失败
        }
        shouldUpdateLoginInfo = true;
        toast.success('Patient account created successfully!');
      }

      // 准备更新数据
      const updateData: any = {
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        notes: formData.notes.trim() || null,
        updated_at: new Date().toISOString()
      };

      // 如果创建了账户，更新患者记录
      if (shouldUpdateLoginInfo) {
        updateData.patient_user_id = patientUserId;
        updateData.email = formData.email.trim();
        updateData.login_configured = true;
      } else if (formData.email && patient.login_configured) {
        // 如果已经配置过登录信息，只更新邮箱
        updateData.email = formData.email.trim();
      }

      // 更新患者信息
      const { error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', patient.id);

      if (error) {
        console.error('Error updating patient:', error);
        toast.error('Failed to update patient information');
        return;
      }

      toast.success('Patient information updated successfully');
      onPatientUpdated();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('An error occurred while updating patient information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCredentials = () => {
    const randomPassword = Math.random().toString(36).slice(-8) + 'A1!'; // 添加复杂度
    const suggestedEmail = `${formData.name.toLowerCase().replace(/\s+/g, '.')}@therapy.app`;
    
    setFormData(prev => ({
      ...prev,
      email: prev.email || suggestedEmail,
      password: randomPassword
    }));
  };

  const canCreateAccount = formData.email && formData.password && formData.password.length >= 6;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Patient Settings
          </DialogTitle>
          <DialogDescription>
            Update patient information and configure login credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter patient's full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Login Credentials Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-base">Login Account</Label>
                {patient?.login_configured ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Account configured</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 text-sm mt-1">
                    <XCircle className="w-4 h-4" />
                    <span>No account configured</span>
                  </div>
                )}
              </div>
              {!patient?.login_configured && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateCredentials}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Generate
                </Button>
              )}
            </div>
            
            {!patient?.login_configured ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="patient@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="text"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {formData.password 
                    ? `Password: ${formData.password} - Patient will use this to login`
                    : 'Set email and password to create patient login account'
                  }
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="patient@example.com"
                />
                <p className="text-xs text-gray-500">
                  Patient account is already configured. Changing email will update their login.
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add clinical notes or observations..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || isCreatingAccount || !formData.name.trim()}
              className="flex-1 gap-2"
            >
              {isLoading || isCreatingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isCreatingAccount ? 'Creating Account...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {!patient?.login_configured && formData.email && formData.password ? 'Save & Create Account' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}