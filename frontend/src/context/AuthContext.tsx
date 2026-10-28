import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  profiles: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  createProfile: (profileData: any) => Promise<void>;
  switchProfile: (profileId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  profiles: [],
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
  refreshUser: async () => {},
  fetchProfiles: async () => {},
  createProfile: async () => {},
  switchProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('krishi_token'));
  const [profiles, setProfiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const data = await api.getMe();
      setUser(data);
      await fetchProfiles();
    } catch {
      // If token invalid or no token, clear
      localStorage.removeItem('krishi_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const list = await api.getProfiles();
      setProfiles(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    localStorage.setItem('krishi_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    await fetchProfiles();
  };

  const register = async (userData: any) => {
    const res = await api.register(userData);
    localStorage.setItem('krishi_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    await fetchProfiles();
  };

  const logout = () => {
    localStorage.removeItem('krishi_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
    await fetchProfiles();
  };

  const createProfile = async (profileData: any) => {
    const res = await api.createProfile(profileData);
    localStorage.setItem('krishi_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    await fetchProfiles();
  };

  const switchProfile = async (profileId: number) => {
    const res = await api.switchProfile(profileId);
    localStorage.setItem('krishi_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    await fetchProfiles();
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        profiles,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        fetchProfiles,
        createProfile,
        switchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
