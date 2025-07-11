import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Define the shape of our custom user profile data
export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    photoURL: string;
    role: 'jobseeker' | 'recruiter' | 'admin'; // Add the role field
    location?: string;
    phone?: string;
    academics?: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
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
                    // User profile exists, load it
                    const userProfileData = docSnap.data() as UserProfile;
                    
                    // FIXED: Check if the existing profile is missing a role. If so, add it.
                    if (!userProfileData.role) {
                        userProfileData.role = 'jobseeker'; // Assign default role
                        await setDoc(userRef, { role: 'jobseeker' }, { merge: true }); // Merge to avoid overwriting
                    }
                    
                    setUserProfile(userProfileData);
                } else {
                    // New user: create their profile with a default role
                    const newUserProfile: UserProfile = {
                        uid: currentUser.uid,
                        email: currentUser.email || '',
                        name: currentUser.displayName || 'New User',
                        photoURL: currentUser.photoURL || '',
                        role: 'jobseeker', // Assign default role
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

    const value = { user, userProfile, loading, signIn, signOut };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
