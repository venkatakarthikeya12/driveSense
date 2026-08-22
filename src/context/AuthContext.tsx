import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfileData } from '../models/types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserProfileData | null;
  isLoggedIn: boolean;
  login: (e: string, p: string, r?: boolean) => Promise<UserProfileData>;
  signUp: (n: string, e: string, p: string) => Promise<UserProfileData>;
  resetPassword: (e: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfileData>) => Promise<UserProfileData>;
  changePassword: (o: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileData | null>(authService.getCurrentUser());

  useEffect(() => {
    const unsubscribe = authService.subscribe((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const login = (e: string, p: string, r = true) => authService.login(e, p, r);
  const signUp = (n: string, e: string, p: string) => authService.signUp(n, e, p);
  const resetPassword = (e: string) => authService.resetPassword(e);
  const updateProfile = (data: Partial<UserProfileData>) => authService.updateProfile(data);
  const changePassword = (o: string, n: string) => authService.changePassword(o, n);
  const logout = () => authService.logout();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signUp,
        resetPassword,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
