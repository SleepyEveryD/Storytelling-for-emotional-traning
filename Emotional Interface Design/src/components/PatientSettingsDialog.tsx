import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings, Save, Loader2 } from 'lucide-react';
import { supabase } from '../supabase_client';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  email?: string;
  password?: string;
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
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    if (!patient) return;

    try {
      setIsLoading(true);

      // 验证必填字段
      if (!formData.name.trim()) {
        toast.error('Name is required');
        return;
      }

      if (formData.email && !formData.email.includes('@')) {
        toast.error('Please enter a valid email');
        return;
      }

      // 准备更新数据
      const updateData: any = {
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        email: formData.email.trim() || null,
        notes: formData.notes.trim() || null,
        updated_at: new Date().toISOString()
      };

      // 只有在密码字段有内容时才更新密码
      if (formData.password.trim()) {
        updateData.password = formData.password.trim();
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
    const randomPassword = Math.random().toString(36).slice(-8);
    const suggestedEmail = `${formData.name.toLowerCase().replace(/\s+/g, '.')}@therapy.app`;
    
    setFormData(prev => ({
      ...prev,
      email: prev.email || suggestedEmail,
      password: randomPassword
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Patient Settings
          </DialogTitle>
          <DialogDescription>
            Update patient information and login credentials.
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

          {/* Login Credentials */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="email">Login Credentials</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleGenerateCredentials}
              >
                Generate
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="patient@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>
            <p className="text-xs text-gray-500">
              {formData.password ? `Generated password: ${formData.password}` : 'Leave blank to keep current password'}
            </p>
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
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}