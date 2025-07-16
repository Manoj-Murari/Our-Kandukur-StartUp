import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Mail, MapPin, Phone, Save, Loader2, Linkedin, Github, Calendar, VenetianMask, School } from 'lucide-react';

// Data for our dependent dropdowns
const academicData = {
    'Graduate': {
        'B.Tech': ['CSE', 'IT', 'AIML', 'IoT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
        'B.Sc': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Other'],
        'B.Com': ['General', 'Computers', 'Taxation', 'Other'],
        'B.A.': ['History', 'Economics', 'Political Science', 'Literature', 'Other'],
        'Other': []
    },
    'Post-Graduate': {
        'M.Tech': ['CSE', 'IT', 'AI', 'Data Science', 'Other'],
        'M.Sc': ['Computer Science', 'Mathematics', 'Physics', 'Other'],
        'MBA': ['Finance', 'HR', 'Marketing', 'Systems', 'Other'],
        'Other': []
    },
    'Diploma': {
        'Polytechnic': ['DCE', 'DME', 'DEEE', 'DECE', 'Other'],
        'Other': []
    },
    'Other': []
};

const Profile: React.FC = () => {
    // 1. Get the updateUserProfile function from the context
    const { userProfile, loading: authLoading, updateUserProfile } = useAuth();
    
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [nameError, setNameError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                location: userProfile.location || '',
                phone: userProfile.phone || '',
                gender: userProfile.gender || 'Prefer not to say',
                dob: userProfile.dob || '',
                linkedinUrl: userProfile.linkedinUrl || '',
                githubUrl: userProfile.githubUrl || '',
                qualification: userProfile.qualification || '',
                otherQualification: userProfile.otherQualification || '',
                stream: userProfile.stream || '',
                otherStream: userProfile.otherStream || '',
                branch: userProfile.branch || '',
                otherBranch: userProfile.otherBranch || '',
                institutionName: userProfile.institutionName || '',
                educationStatus: userProfile.educationStatus || 'Pursuing',
            });
        }
    }, [userProfile]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;

        if (id === 'name') {
            const formattedName = value.toUpperCase().replace(/[^A-Z\s]/g, '');
            setFormData(prev => ({ ...prev, name: formattedName }));
            if (value !== formattedName) {
                setNameError('Name can only contain letters and will be converted to uppercase.');
            } else {
                setNameError('');
            }
        } else if (id === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            const truncatedValue = numericValue.slice(0, 10);
            setFormData(prev => ({ ...prev, phone: truncatedValue }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile || nameError) return;
        setIsSaving(true);
        setSaveMessage('');
        try {
            const userRef = doc(db, 'users', userProfile.uid);
            await setDoc(userRef, formData, { merge: true });

            // 2. THIS IS THE FIX: Update the local state in AuthContext
            // This makes the new data available everywhere immediately.
            if (updateUserProfile) {
                updateUserProfile(formData);
            }
            
            setSaveMessage('✅ Profile saved successfully!');
        } catch (error) {
            console.error("Error saving profile:", error);
            setSaveMessage('❌ Failed to save profile.');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    if (authLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>;
    if (!userProfile) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Please sign in to view your profile.</h2></div>;

    const qualification = formData.qualification || '';
    const stream = formData.stream || '';

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <img src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.name}&background=random`} alt="Profile" className="h-24 w-24 rounded-full object-cover border-4 border-blue-200" referrerPolicy="no-referrer" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
                            <p className="text-md text-gray-500 flex items-center mt-1"><Mail className="h-4 w-4 mr-2" />{userProfile.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2">Personal Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" value={formData.name} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md"/>{nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}</div>
                                <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label><div className="relative mt-1"><Phone className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="tel" id="phone" value={formData.phone} onChange={handleFormChange} className="w-full pl-10 p-2 border rounded-md"/></div></div>
                                <div><label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label><div className="relative mt-1"><MapPin className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="text" id="location" value={formData.location} onChange={handleFormChange} className="w-full pl-10 p-2 border rounded-md"/></div></div>
                                <div><label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label><div className="relative mt-1"><Calendar className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="date" id="dob" value={formData.dob} onChange={handleFormChange} className="w-full pl-10 p-2 border rounded-md"/></div></div>
                                <div><label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label><div className="relative mt-1"><VenetianMask className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><select id="gender" value={formData.gender} onChange={handleFormChange} className="w-full pl-10 p-2 border rounded-md"><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select></div></div>
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2">Academic Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">Institution Name</label><div className="relative mt-1"><School className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="text" id="institutionName" value={formData.institutionName} onChange={handleFormChange} className="w-full pl-10 p-2 border rounded-md"/></div></div>
                                <div><label htmlFor="educationStatus" className="block text-sm font-medium text-gray-700">Status</label><select id="educationStatus" value={formData.educationStatus} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md"><option>Pursuing</option><option>Completed</option></select></div>
                                
                                <div><label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Qualification</label><select id="qualification" value={qualification} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md"><option value="">Select...</option>{Object.keys(academicData).map(q => <option key={q}>{q}</option>)}</select></div>
                                {qualification === 'Other' && <div><label htmlFor="otherQualification" className="block text-sm font-medium text-gray-700">Please Specify Qualification</label><input type="text" id="otherQualification" value={formData.otherQualification} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md"/></div>}
                                
                                {qualification && qualification !== 'Other' && <div><label htmlFor="stream" className="block text-sm font-medium text-gray-700">Stream</label><select id="stream" value={stream} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" disabled={!qualification}><option value="">Select...</option>{Object.keys(academicData[qualification as keyof typeof academicData] || {}).map(s => <option key={s}>{s}</option>)}</select></div>}
                                {stream === 'Other' && <div><label htmlFor="otherStream" className="block text-sm font-medium text-gray-700">Please Specify Stream</label><input type="text" id="otherStream" value={formData.otherStream} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md"/></div>}

                                {stream && stream !== 'Other' && <div><label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label><select id="branch" value={formData.branch} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md" disabled={!stream}><option value="">Select...</option>{(academicData[qualification as keyof typeof academicData]?.[stream as keyof typeof academicData[keyof typeof academicData]] || []).map(b => <option key={b}>{b}</option>)}</select></div>}
                                {formData.branch === 'Other' && <div><label htmlFor="otherBranch" className="block text-sm font-medium text-gray-700">Please Specify Branch</label><input type="text" id="otherBranch" value={formData.otherBranch} onChange={handleFormChange} className="mt-1 w-full p-2 border rounded-md"/></div>}
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2">Professional Links (Optional)</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label><div className="relative mt-1"><Linkedin className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="linkedinUrl" value={formData.linkedinUrl} onChange={handleFormChange} className="w-full pl-10 p-2 border rounded-md"/></div></div>
                                <div><label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">GitHub Profile URL</label><div className="relative mt-1"><Github className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" /><input type="url" id="githubUrl" value={formData.githubUrl} onChange={handleFormChange} className="w-full pl-10 p-2 border rounded-md"/></div></div>
                            </div>
                        </fieldset>

                        <div className="mt-8 flex justify-end items-center">
                            {saveMessage && <p className="text-sm text-gray-600 mr-4">{saveMessage}</p>}
                            <button type="submit" disabled={isSaving || !!nameError} className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                                {isSaving ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Save className="h-5 w-5 mr-2" />}
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
