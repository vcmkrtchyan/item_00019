import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Plus, Edit, Trash2, Save, XCircle } from 'lucide-react';

interface HealthData {
  id: string;
  disease: string;
  symptoms: string;
  treatment: string;
  progress: string;
  date: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const MedicalTreatmentTracker = () => {
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

  const [healthData, setHealthData] = useState<HealthData[]>(() => {
    if (typeof window !== 'undefined' && currentUser) {
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
    date: new Date().toISOString().split('T')[0],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfile, setNewProfile] = useState<UserProfile>({ id: '', name: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [userProfiles, currentUser]);

  useEffect(() => {
    if (currentUser && typeof window !== 'undefined') {
      const savedData = localStorage.getItem(`healthData_${currentUser.id}`);
      setHealthData(savedData ? JSON.parse(savedData) : []);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && typeof window !== 'undefined') {
      localStorage.setItem(`healthData_${currentUser.id}`, JSON.stringify(healthData));
    }
  }, [healthData, currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
  };

  const addEntry = () => {
    if (
        !newEntry.disease.trim() ||
        !newEntry.symptoms.trim() ||
        !newEntry.treatment.trim() ||
        !newEntry.progress.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);

    const entryToAdd: HealthData = {
      ...newEntry,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
    };

    setHealthData([...healthData, entryToAdd]);
    setNewEntry({
      id: '',
      disease: '',
      symptoms: '',
      treatment: '',
      progress: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const startEdit = (id: string) => {
    const entryToEdit = healthData.find((entry) => entry.id === id);
    if (entryToEdit) {
      setNewEntry(entryToEdit);
      setIsEditMode(true);
      setEditingId(id);
    }
  };

  const saveEdit = () => {
    if (
        !newEntry.disease.trim() ||
        !newEntry.symptoms.trim() ||
        !newEntry.treatment.trim() ||
        !newEntry.progress.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);

    setHealthData(
        healthData.map((entry) => (entry.id === editingId ? { ...newEntry } : entry))
    );
    setIsEditMode(false);
    setEditingId(null);
    setNewEntry({
      id: '',
      disease: '',
      symptoms: '',
      treatment: '',
      progress: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const deleteEntry = (id: string) => {
    setHealthData(healthData.filter((entry) => entry.id !== id));
  };

  const handleCreateProfile = () => {
    if (!newProfile.name.trim() || !newProfile.email.trim()) {
      setError("Please fill in all profile fields.");
      return;
    }
    setError(null);
    const profileToAdd: UserProfile = { ...newProfile, id: crypto.randomUUID() };
    setUserProfiles([...userProfiles, profileToAdd]);
    setCurrentUser(profileToAdd);
    setNewProfile({ id: '', name: '', email: '' });
    setIsCreatingProfile(false);
  };

  const handleLogin = (profileId: string) => {
    const profile = userProfiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentUser(profile);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setHealthData([]);
  };

  const handleSwitchUser = () => {
    handleLogout();
  };

  return (
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              Medical Treatment Tracker
            </h1>
          </header>

          {/* Profile Management Section */}
          <section className="mb-8">
            {currentUser ? (
                <div className="flex justify-between items-center p-4 bg-[#132152] border border-[#183182] rounded-lg shadow-lg">
                  <div className="flex items-center gap-4">
                    <User className="w-8 h-8 text-gray-300" />
                    <div>
                      <h2 className="text-xl font-semibold">{`Welcome, ${currentUser.name}!`}</h2>
                      <p className="text-sm text-gray-300">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                        onClick={handleSwitchUser}
                        className="px-4 py-2 bg-[#9000FF] hover:bg-[#9000FF] rounded cursor-pointer"
                    >
                      Switch User
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-[#9000FF] text-[#9000FF] rounded cursor-pointer hover:bg-[#9000FF] hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
            ) : (
                <div className="bg-[#132152] border border-[#183182] rounded-lg shadow-lg p-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold">
                      {isCreatingProfile ? 'Create Profile' : 'Login'}
                    </h2>
                    <p className="text-sm text-gray-300">
                      {isCreatingProfile
                          ? 'Fill out your details to create a new profile.'
                          : 'Select a profile to login.'}
                    </p>
                  </div>
                  {isCreatingProfile ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium">
                            Name
                          </label>
                          <input
                              id="name"
                              name="name"
                              value={newProfile.name}
                              onChange={handleProfileInputChange}
                              className="mt-1 h-8 pl-2 block w-full rounded-md bg-[#141E42] border border-[#253876] text-white placeholder-gray-400 focus:border-[#253876] focus:ring-[#253876]"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium">
                            Email
                          </label>
                          <input
                              id="email"
                              name="email"
                              type="email"
                              value={newProfile.email}
                              onChange={handleProfileInputChange}
                              className="mt-1 h-8 pl-2 block w-full rounded-md bg-[#141E42] border border-[#253876] text-white placeholder-gray-400 focus:border-[#253876] focus:ring-[#253876]"
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                              onClick={() => setIsCreatingProfile(false)}
                              className="px-4 py-2 bg-[#9000FF] hover:bg-[#9000FF] rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                              onClick={handleCreateProfile}
                              className="px-4 py-2 bg-[#9000FF] hover:bg-[#9000FF] rounded cursor-pointer"
                          >
                            Create Profile
                          </button>
                        </div>
                      </div>
                  ) : (
                      <div className="space-y-3">
                        {userProfiles.length > 0 ? (
                            userProfiles.map((profile) => (
                                <button
                                    key={profile.id}
                                    onClick={() => handleLogin(profile.id)}
                                    className="w-full text-left px-4 py-2 border border-[#253876] rounded hover:bg-[#253876] cursor-pointer"
                                >
                                  <span className="font-medium">{profile.name}</span> -{' '}
                                  <span className="text-sm">{profile.email}</span>
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-300">
                              No profiles found. Please create a new one.
                            </p>
                        )}
                        <button
                            onClick={() => setIsCreatingProfile(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#9000FF] hover:bg-[#9000FF] rounded cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Create New Profile
                        </button>
                      </div>
                  )}
                </div>
            )}
          </section>

          {/* Health Data Input Section */}
          {currentUser && (
              <>
                <section className="mb-8 p-6 bg-[#132152] border border-[#183182] rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4">
                    {isEditMode ? 'Edit Entry' : 'Add New Entry'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="disease" className="block text-sm font-medium">
                        Disease
                      </label>
                      <input
                          type="text"
                          name="disease"
                          id="disease"
                          value={newEntry.disease}
                          onChange={handleInputChange}
                          className="mt-1 h-8 pl-2 block w-full rounded-md bg-[#141E42] border border-[#253876] text-white placeholder-gray-400 focus:border-[#253876] focus:ring-[#253876]"
                      />
                    </div>
                    <div>
                      <label htmlFor="symptoms" className="block text-sm font-medium">
                        Symptoms
                      </label>
                      <input
                          type="text"
                          name="symptoms"
                          id="symptoms"
                          value={newEntry.symptoms}
                          onChange={handleInputChange}
                          className="mt-1 h-8 pl-2 block w-full rounded-md bg-[#141E42] border border-[#253876] text-white placeholder-gray-400 focus:border-[#253876] focus:ring-[#253876]"
                      />
                    </div>
                    <div>
                      <label htmlFor="treatment" className="block text-sm font-medium">
                        Treatment
                      </label>
                      <input
                          type="text"
                          name="treatment"
                          id="treatment"
                          value={newEntry.treatment}
                          onChange={handleInputChange}
                          className="mt-1 h-8 pl-2 block w-full rounded-md bg-[#141E42] border border-[#253876] text-white placeholder-gray-400 focus:border-[#253876] focus:ring-[#253876]"
                      />
                    </div>
                    <div>
                      <label htmlFor="progress" className="block text-sm font-medium">
                        Progress
                      </label>
                      <input
                          type="text"
                          name="progress"
                          id="progress"
                          value={newEntry.progress}
                          onChange={handleInputChange}
                          className="mt-1 h-8 pl-2 block w-full rounded-md bg-[#141E42] border border-[#253876] text-white placeholder-gray-400 focus:border-[#253876] focus:ring-[#253876]"
                      />
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium">
                        Date
                      </label>
                      <input
                          type="date"
                          name="date"
                          id="date"
                          value={newEntry.date}
                          onChange={handleInputChange}
                          className="mt-1 h-8 pl-2 block w-full rounded-md bg-[#141E42] border border-[#253876] text-white placeholder-gray-400 focus:border-[#253876] focus:ring-[#253876]"
                      />
                    </div>
                  </div>
                  {error && <p className="mt-2 text-red-500">{error}</p>}
                  <div className="mt-4 flex gap-3">
                    {isEditMode ? (
                        <>
                          <button
                              onClick={saveEdit}
                              className="px-4 py-2 bg-[#9000FF] hover:bg-[#9000FF] rounded flex items-center gap-2 cursor-pointer"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                          <button
                              onClick={() => {
                                setIsEditMode(false);
                                setEditingId(null);
                                setNewEntry({
                                  id: '',
                                  disease: '',
                                  symptoms: '',
                                  treatment: '',
                                  progress: '',
                                  date: new Date().toISOString().split('T')[0],
                                });
                              }}
                              className="px-4 py-2 bg-[#9000FF] hover:bg-[#9000FF] rounded flex items-center gap-2 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" /> Cancel
                          </button>
                        </>
                    ) : (
                        <button
                            onClick={addEntry}
                            className="px-4 py-2 bg-[#9000FF] hover:bg-[#9000FF] rounded flex items-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Entry
                        </button>
                    )}
                  </div>
                </section>

                {/* Health Data Table */}
                <section className="bg-[#132152] border border-[#183182] rounded-lg shadow-lg overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <caption className="p-4 text-left text-sm text-gray-300">
                      A list of your medical treatment entries.
                    </caption>
                    <thead className="bg-[#141E42]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Disease
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Symptoms
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Treatment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {healthData.length > 0 ? (
                        healthData.map((entry) => (
                            <tr key={entry.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{entry.disease}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{entry.symptoms}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{entry.treatment}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{entry.progress}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                      onClick={() => startEdit(entry.id)}
                                      className="px-3 py-1 bg-[#9000FF] hover:bg-[#9000FF] rounded flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                      onClick={() => deleteEntry(entry.id)}
                                      className="px-3 py-1 bg-red-900 hover:bg-red-800 rounded flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-300">
                            No entries yet.
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </section>
              </>
          )}
        </div>
      </div>
  );
};

export default MedicalTreatmentTracker;
