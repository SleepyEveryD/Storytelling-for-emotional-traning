import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function LogoutButton() {
  const { signOut } = useAuth(); // <-- 用 signOut，而不是 logout

  const handleLogout = async () => {
    try {
      const { error } = await signOut(); // 调用 signOut 方法
      if (error) throw error;
      toast.success('You have logged out');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed, please try again');
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}
