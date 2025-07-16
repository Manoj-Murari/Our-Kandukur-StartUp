import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    photoURL: string;
    role: 'jobseeker' | 'recruiter' | 'admin';
    location?: string;
    phone?: string;
    gender?: string;
    dob?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    qualification?: string;
    otherQualification?: string;
    stream?: string;
    otherStream?: string;
    branch?: string;
    otherBranch?: string;
    institutionName?: string;
    educationStatus?: string;
}

const isProfileComplete = (profile: UserProfile | null): boolean => {
    if (!profile) return false;
    const requiredFields: (keyof UserProfile)[] = [
        'name', 'phone', 'location', 'dob', 'gender', 
        'institutionName', 'educationStatus', 'qualification'
    ];
    for (const field of requiredFields) {
        if (!profile[field]) return false;
    }
    if (profile.qualification === 'Other' && !profile.otherQualification) return false;
    if (profile.stream === 'Other' && !profile.otherStream) return false;
    if (profile.branch === 'Other' && !profile.otherBranch) return false;
    return true;
};

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    isProfileComplete: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    // NEW: Function to update the profile state from any component
    updateUserProfile: (newProfileData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userProfileData = docSnap.data() as UserProfile;
                    if (!userProfileData.role) {
                        userProfileData.role = 'jobseeker';
                        await setDoc(userRef, { role: 'jobseeker' }, { merge: true });
                    }
                    setUserProfile(userProfileData);
                } else {
                    const newUserProfile: UserProfile = {
                        uid: currentUser.uid,
                        email: currentUser.email || '',
                        name: currentUser.displayName || 'New User',
                        photoURL: currentUser.photoURL || '',
                        role: 'jobseeker',
                    };
                    await setDoc(userRef, newUserProfile);
                    setUserProfile(newUserProfile);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error during sign-out:", error);
        }
    };

    // NEW: This function updates the local userProfile state.
    // Call this after successfully saving data to Firestore on your profile page.
    const updateUserProfile = (newProfileData: Partial<UserProfile>) => {
        setUserProfile(prevProfile => {
            if (!prevProfile) return null; // Should only happen if user is logged out.
            // Merge the old profile with the new data
            return { ...prevProfile, ...newProfileData };
        });
    };

    const value = {
        user,
        userProfile,
        loading,
        isProfileComplete: isProfileComplete(userProfile),
        signIn,
        signOut,
        // NEW: Provide the update function to the rest of the app
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};