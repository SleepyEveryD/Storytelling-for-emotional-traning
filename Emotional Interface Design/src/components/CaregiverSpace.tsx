import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ArrowLeft, UserPlus, User, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface UserSession {
  id: string;
  name: string;
  createdDate: string;
  lastActive: string;
  completedScenarios: number;
  totalScenarios: number;
}

interface CaregiverSpaceProps {
  onBack: () => void;
  onSelectUser: (userId: string, userName: string) => void;
}

export function CaregiverSpace({ onBack, onSelectUser }: CaregiverSpaceProps) {
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
  
  const [newUserName, setNewUserName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: UserSession = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      createdDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      completedScenarios: 0,
      totalScenarios: 6,
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setIsDialogOpen(false);
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
                    disabled={!newUserName.trim()}
                  >
                    Create Session
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
                          (users.length * 6)) *
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
                    className="p-6 border-2 hover:shadow-xl transition-all duration-300 hover:border-purple-300 cursor-pointer group"
                    onClick={() => onSelectUser(user.id, user.name)}
                  >
                    <div className="flex items-center gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">{getInitials(user.name)}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-2">{user.name}</h3>
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
      </div>
    </div>
  );
}
