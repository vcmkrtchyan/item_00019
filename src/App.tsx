import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckCircle, User, Plus, Edit, Trash2, Save, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Define types for health data
interface HealthData {
  id: string;
  disease: string;
  symptoms: string;
  treatment: string;
  progress: string;
  date: string; // Added date for tracking
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Add other profile properties as needed
}

const MedicalTreatmentTracker = () => {
  // State for user profiles and current user
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const savedProfiles = localStorage.getItem('userProfiles');
      return savedProfiles ? JSON.parse(savedProfiles) : [];
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  // State for health data, new entry, and edit mode
  const [healthData, setHealthData] = useState<HealthData[]>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(`healthData_${currentUser?.id}`);
      return savedData ? JSON.parse(savedData) : [];
    }
    return [];
  });
  const [newEntry, setNewEntry] = useState<HealthData>({
    id: '',
    disease: '',
    symptoms: '',
    treatment: '',
    progress: '',
    date: new Date().toISOString().split('T')[0], // Initialize with current date
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfile, setNewProfile] = useState<UserProfile>({ id: '', name: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  // Load and save data when currentUser changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [userProfiles, currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem(`healthData_${currentUser.id}`);
        setHealthData(savedData ? JSON.parse(savedData) : []);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`healthData_${currentUser.id}`, JSON.stringify(healthData));
      }
    }
  }, [healthData, currentUser]);

  // Handlers for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfile({
      ...newProfile,
      [e.target.name]: e.target.value,
    });
  };

  // Function to add a new entry
  const addEntry = () => {
    if (!newEntry.disease.trim() || !newEntry.symptoms.trim() || !newEntry.treatment.trim() || !newEntry.progress.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);

    const entryToAdd: HealthData = {
      ...newEntry,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0], // Ensure date is captured on add
    };

    setHealthData([...healthData, entryToAdd]);
    setNewEntry({
      id: '',
      disease: '',
      symptoms: '',
      treatment: '',
      progress: '',
      date: new Date().toISOString().split('T')[0], // Reset date to current for next entry
    });
  };

  // Function to start editing an entry
  const startEdit = (id: string) => {
    const entryToEdit = healthData.find((entry) => entry.id === id);
    if (entryToEdit) {
      setNewEntry(entryToEdit);
      setIsEditMode(true);
      setEditingId(id);
    }
  };

  // Function to save edited entry
  const saveEdit = () => {
    if (!newEntry.disease.trim() || !newEntry.symptoms.trim() || !newEntry.treatment.trim() || !newEntry.progress.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);

    setHealthData(
        healthData.map((entry) => (entry.id === editingId ? { ...newEntry, date: newEntry.date } : entry))
    );
    setIsEditMode(false);
    setEditingId(null);
    setNewEntry({
      id: '',
      disease: '',
      symptoms: '',
      treatment: '',
      progress: '',
      date: new Date().toISOString().split('T')[0], // Reset date after edit
    });
  };

  // Function to delete an entry
  const deleteEntry = (id: string) => {
    setHealthData(healthData.filter((entry) => entry.id !== id));
  };

  // Function to handle profile creation
  const handleCreateProfile = () => {
    if (!newProfile.name.trim() || !newProfile.email.trim()) {
      setError("Please fill in all profile fields.");
      return;
    }
    setError(null);

    const profileToAdd: UserProfile = { ...newProfile, id: crypto.randomUUID() };
    setUserProfiles([...userProfiles, profileToAdd]);
    setCurrentUser(profileToAdd); // Auto-login new user
    setNewProfile({ id: '', name: '', email: '' }); // Reset
    setIsCreatingProfile(false);
  };

  // Function to handle login
  const handleLogin = (profileId: string) => {
    const profile = userProfiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentUser(profile);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setHealthData([]); // Clear data on logout
  };

  // Function to switch user
  const handleSwitchUser = () => {
    handleLogout(); // For simplicity, log out and show profile selection
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            Medical Treatment Tracker
          </h1>

          {/* Profile Management Section */}
          <div className="mb-8">
            {currentUser ? (
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                  <div className="flex items-center gap-4">
                    <User className="w-6 h-6 text-gray-500" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Welcome, {currentUser.name}!
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email: {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSwitchUser} className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                      Switch User
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600">
                      Logout
                    </Button>
                  </div>
                </div>
            ) : (
                <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>
                      {isCreatingProfile ? 'Create a new profile' : 'Login to your existing profile'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isCreatingProfile ? (
                        <>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                  id="name"
                                  name="name"
                                  value={newProfile.name}
                                  onChange={handleProfileInputChange}
                                  className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={newProfile.email}
                                  onChange={handleProfileInputChange}
                                  className="col-span-3"
                              />
                            </div>
                          </div>
                        </>
                    ) : (
                        <div className="grid gap-4 py-4">
                          {userProfiles.length > 0 ? (
                              userProfiles.map((profile) => (
                                  <Button
                                      key={profile.id}
                                      variant="outline"
                                      className="w-full justify-start bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                      onClick={() => handleLogin(profile.id)}
                                  >
                                    {profile.name} ({profile.email})
                                  </Button>
                              ))
                          ) : (
                              <p className="text-gray-500 dark:text-gray-400">No profiles found. Create a new one.</p>
                          )}
                        </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {isCreatingProfile ? (
                        <>
                          <Button type="button" variant="secondary" onClick={() => setIsCreatingProfile(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" onClick={handleCreateProfile} className="bg-green-500 text-white hover:bg-green-600">
                            Create Profile
                          </Button>
                        </>
                    ) : (
                        <Button type="button" variant="secondary" onClick={() => setIsCreatingProfile(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Profile
                        </Button>
                    )}
                  </CardFooter>
                </Card>
            )}
          </div>

          {/* Health Data Input Section */}
          {currentUser && (
              <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Add New Entry</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="disease" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Disease</Label>
                    <Input
                        type="text"
                        name="disease"
                        id="disease"
                        value={newEntry.disease}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Symptoms</Label>
                    <Input
                        type="text"
                        name="symptoms"
                        id="symptoms"
                        value={newEntry.symptoms}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="treatment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Treatment</Label>
                    <Input
                        type="text"
                        name="treatment"
                        id="treatment"
                        value={newEntry.treatment}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Progress</Label>
                    <Input
                        type="text"
                        name="progress"
                        id="progress"
                        value={newEntry.progress}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</Label>
                    <Input
                        type="date"
                        name="date"
                        id="date"
                        value={newEntry.date}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditMode ? (
                      <Button onClick={saveEdit} className="bg-blue-500 text-white hover:bg-blue-600">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                  ) : (
                      <Button onClick={addEntry} className="bg-green-500 text-white hover:bg-green-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Entry
                      </Button>
                  )}
                  {isEditMode && (
                      <Button onClick={() => {
                        setIsEditMode(false);
                        setEditingId(null);
                        setNewEntry({ id: '', disease: '', symptoms: '', treatment: '', progress: '', date: new Date().toISOString().split('T')[0] }); // Reset form
                      }} variant="outline" className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                  )}
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
          )}

          {/* Health Data Table */}
          {currentUser && (
              <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <Table>
                  <TableCaption>A list of your medical treatment entries.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead>Symptoms</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthData.length > 0 ? (
                        healthData.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium">{entry.date}</TableCell>
                              <TableCell>{entry.disease}</TableCell>
                              <TableCell>{entry.symptoms}</TableCell>
                              <TableCell>{entry.treatment}</TableCell>
                              <TableCell>{entry.progress}</TableCell>
                              <TableCell className="text-right flex gap-2 justify-end">
                                <Button variant="outline" size="icon" onClick={() => startEdit(entry.id)} className="bg-yellow-500 text-white hover:bg-yellow-600">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => deleteEntry(entry.id)} className="bg-red-500 text-white hover:bg-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">No entries yet.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
          )}
        </div>
      </div>
  );
};

export default MedicalTreatmentTracker;