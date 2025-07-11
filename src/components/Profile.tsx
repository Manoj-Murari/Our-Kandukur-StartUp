import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Mail, MapPin, Phone, BookOpen, Save, Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { userProfile, loading: authLoading } = useAuth();
  
  // State for the form fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [academics, setAcademics] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // When the userProfile data loads, populate the form
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setLocation(userProfile.location || '');
      setPhone(userProfile.phone || '');
      setAcademics(userProfile.academics || '');
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setIsSaving(true);
    setSaveMessage('');

    const updatedProfile: Partial<UserProfile> = {
      name,
      location,
      phone,
      academics,
    };

    try {
      const userRef = doc(db, 'users', userProfile.uid);
      // Use { merge: true } to only update the fields we provide
      await setDoc(userRef, updatedProfile, { merge: true });
      setSaveMessage('✅ Profile saved successfully!');
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage('❌ Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!userProfile) {
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Please sign in to view your profile.</h2>
        </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-8">
              <img
                src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.name}&background=random`}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-4 border-blue-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-md text-gray-500 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {userProfile.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <User className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"/>
                  </div>
                </div>
                <div className="col-span-1">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <MapPin className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"/>
                  </div>
                </div>
                <div className="col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <Phone className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
                    <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"/>
                  </div>
                </div>
                <div className="col-span-1">
                  <label htmlFor="academics" className="block text-sm font-medium text-gray-700">Academic Details</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <BookOpen className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
                    <input type="text" id="academics" value={academics} onChange={(e) => setAcademics(e.target.value)} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"/>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end items-center">
                {saveMessage && <p className="text-sm text-gray-600 mr-4">{saveMessage}</p>}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {isSaving ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Save className="h-5 w-5 mr-2" />}
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
