import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  loginUser: boolean;
  setLoginUser: (value: boolean) => void;
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

  return (
    <AuthContext.Provider value={{ loginUser, setLoginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
