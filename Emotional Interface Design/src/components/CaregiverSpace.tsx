import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ArrowLeft, 
  UserPlus, 
  User, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Shield
} from 'lucide-react';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { supabase } from "../supabase_client";

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
  patient_user_id?: string;
  login_configured?: boolean;
  notes?: string;
}

interface CaregiverSpaceProps {
  onBack: () => void;
  onSelectUser: (userId: string, userName: string, patientId: string, patientName: string) => void;
}

export function CaregiverSpace({ onBack, onSelectUser }: CaregiverSpaceProps) {
  const { user, isTherapist, loading } = useAuth();
  
  const [users, setUsers] = useState<UserSession[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [currentPatientName, setCurrentPatientName] = useState<string | null>(null);
  const [searchText, setSearchText] = useState(''); // ⭐ 添加这一行

  // Therapist authentication and protection
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('User not logged in, cannot access therapist space');
        return;
      } else if (!isTherapist) {
        console.log('User is not a therapist, cannot access therapist space');
        return;
      } else {
        // If user is therapist, load patient data
        fetchPatients();
      }
    }
  }, [user, isTherapist, loading]);

  // Fetch patient data from Supabase
  const fetchPatients = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Starting to fetch patient data...');
      
      // Get therapist's patients (including all fields)
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .eq('therapist_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (patientsError) {
        console.error('Error fetching patient data:', patientsError);
        return;
      }

      console.log('Fetched patient data:', patientsData);

      if (!patientsData || patientsData.length === 0) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      // Get progress data for each patient
      const patientsWithProgress = await Promise.all(
        patientsData.map(async (patient) => {
          console.log(`Processing progress data for patient ${patient.name}...`);
          
          // Get number of completed scenarios for patient
          const { data: progressData, error: progressError } = await supabase
            .from('scenario_progress')
            .select('scenario_id, completed, last_attempted')
            .eq('patient_id', patient.id)
            .eq('completed', true);

          if (progressError) {
            console.error(`Error fetching progress data for patient ${patient.name}:`, progressError);
          }

          // Get total number of scenarios
          const { data: scenariosData, error: scenariosError } = await supabase
            .from('scenarios')
            .select('id');

          if (scenariosError) {
            console.error('Error fetching scenario data:', scenariosError);
          }

          const completedScenarios = progressData?.length || 0;
          const totalScenarios = scenariosData?.length || 6;

          // Get last activity time
          let lastActive = patient.created_at;
          if (progressData && progressData.length > 0) {
            // Find the most recent activity time
            const latestAttempt = progressData.reduce((latest, current) => {
              if (!current.last_attempted) return latest;
              return new Date(current.last_attempted) > new Date(latest) ? current.last_attempted : latest;
            }, progressData[0].last_attempted || patient.created_at);
            lastActive = latestAttempt;
          }

          console.log(`Patient ${patient.name} completed scenarios: ${completedScenarios}/${totalScenarios}`);

          return {
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            email: patient.email,
            patient_user_id: patient.patient_user_id,
            login_configured: patient.login_configured,
            notes: patient.notes,
            createdDate: patient.created_at,
            lastActive: lastActive,
            completedScenarios,
            totalScenarios,
          };
        })
      );

      console.log('Final patient data:', patientsWithProgress);
      setUsers(patientsWithProgress);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new patient
  const handleCreateUser = async (e: React.FormEvent) => {
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
        console.error('Error creating patient:', error);
        alert('Failed to create patient: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        const newPatient = data[0];
        
        // Refetch data to ensure latest state is displayed
        await fetchPatients();
        
        setNewUserName('');
        setIsDialogOpen(false);
        console.log('Successfully created patient:', newPatient);
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Error creating patient');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle patient selection
  const handleSelectUser = (userId: string, userName: string) => {
    setCurrentPatientId(userId);
    setCurrentPatientName(userName);
    // Call parent component callback with patient information
    onSelectUser(userId, userName, userId, userName);
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
    return date.toLocaleDateString('en-US');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking therapist permissions...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h1>
          <p className="text-gray-600 mb-6">Please log in to access therapist space</p>
          <Button onClick={onBack} variant="outline">
            Back to Home
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-2">You do not have therapist permissions</p>
          <p className="text-gray-500 text-sm mb-6">Current role: {user.user_metadata?.role || 'user'}</p>
          <Button onClick={onBack} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Data loading state
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
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Therapist Dashboard
            </h1>
          </div>
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patient data...</p>
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Therapist Dashboard
                </h1>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 gap-1">
                  <Shield className="w-3 h-3" />
                  Therapist Mode
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>Welcome,</span>
                <span className="font-semibold text-purple-600">
                  {user.user_metadata?.name || user.user_metadata?.full_name || 'Therapist'}
                </span>
                <span>!</span>
              </div>
              <p className="text-gray-600 mt-1">
                Manage patient sessions and track their progress
              </p>
            </div>

            {/* Create New Session Dialog */}
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

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Connect Existing User */}
                      <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-2">Connect Existing User</h3>

                        <div>
                          <Label htmlFor="searchUser">Search User</Label>
                          <Input
                            id="searchUser"
                            type="text"
                            placeholder="Search by patient ID"
                        
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="mt-2"
                          />
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          onClick={() => {
                            const matchedUser = users.find(user =>
                              user.name.toLowerCase().includes(searchText.toLowerCase())
                            );
                            if (matchedUser) {
                              onSelectUser(matchedUser.id, matchedUser.name);
                              setIsDialogOpen(false);
                            } else {
                              alert('User not found.');
                            }
                          }}
                          disabled={!searchText.trim()}
                        >
                          Connect Existing User
                        </Button>
                      </div>

                      {/* Right: Create New Session */}
                      <form onSubmit={handleCreateUser} className="space-y-4 p-4 border rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-2">Create New Session</h3>

                        <div>
                          <Label htmlFor="userName">Patient Name</Label>
                          <Input
                            id="userName"
                            type="text"
                            placeholder="Enter patient name"
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
                          {isCreating ? 'Creating...' : 'Create Session'}
                        </Button>
                      </form>
                    </div>
              </DialogContent>

            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((sum, user) => sum + user.completedScenarios, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Completed</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length > 0 
                    ? Math.round(
                        (users.reduce((sum, user) => sum + user.completedScenarios, 0) /
                          (users.reduce((sum, user) => sum + user.totalScenarios, 0))) *
                          100
                      )
                    : 0}%
                </p>
                <p className="text-sm text-gray-600">Average Progress</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Session Cards */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Session Management</h2>
          
          {users.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-600">No Sessions Yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first session to start managing patients
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
                    onClick={() => handleSelectUser(user.id, user.name)}
                  >
                    <div className="flex items-center gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl font-semibold">{getInitials(user.name)}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                          {/* Additional Information */}
                          {(user.age || user.gender) && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {user.age && <span>{user.age} years</span>}
                              {user.gender && <span>• {user.gender}</span>}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Last Active: {formatDate(user.lastActive)}</span>
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
                              <span className="text-sm font-medium">{progressPercentage}%</span>
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
                          <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
                            <CheckCircle2 className="w-4 h-4" />
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

        {/* Currently Selected Patient Information */}
        {currentPatientId && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Currently Selected Patient: {currentPatientName}
              </span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Now select scenarios, patient progress will be recorded in the database
            </p>
          </div>
        )}
      </div>
    </div>
  );
}