import { useGetMyProfileQuery } from '@/app/redux/services/userApis';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  loginUser: boolean;
  setLoginUser: (value: boolean) => void;
  isLoading: boolean;
  error: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loginUser, setLoginUser] = useState(false);
  const { data, isLoading, error } = useGetMyProfileQuery(undefined)

  useEffect(() => {
    if (data?.success) {
      setLoginUser(true)
    } else {
      setLoginUser(false)
    }
  }, [data])

  return (
    <AuthContext.Provider value={{ loginUser, setLoginUser, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
