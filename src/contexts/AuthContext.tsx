import React, { createContext, useContext, useEffect, useState } from 'react';

// A simplified context that doesn't rely on external types
const AuthContext = createContext<any | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The only job of this component now is to report that loading is done.
    setLoading(false);
  }, []);

  // Dummy values to prevent the app from crashing.
  const value = {
    user,
    loading,
    signIn: () => console.log('SignIn disabled'),
    signOut: () => console.log('SignOut disabled'),
    isAdmin: false,
    updateUserTag: () => console.log('updateUserTag disabled'),
    updateUserRole: () => console.log('updateUserRole disabled'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};