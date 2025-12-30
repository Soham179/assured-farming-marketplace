// App.tsx
import React, { useState, createContext, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import PricePredictionPage from './pages/PricePredictionPage';
import ContractManagementPage from './pages/ContractManagementPage';
import { type UserRole } from './types';
import api from './api';

interface AuthContextType {
  userRole: UserRole | null;
  token: string | null;
  login: (role: UserRole, token: string) => void;
  logout: () => void;
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  userRole: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

const App: React.FC = () => {
  const location = useLocation();
  
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    // Initialize from localStorage - normalize to lowercase
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      return savedRole.toLowerCase() as UserRole;
    }
    return null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from localStorage
    return api.getAuthToken();
  });
  
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDark(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#1f2937';
      document.documentElement.style.color = '#f9fafb';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.color = '#1f2937';
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const login = (role: UserRole, token: string) => {
    console.log('🔐 Login called with role:', role, 'token:', token.substring(0, 20) + '...');
    
    // Normalize role to lowercase
    const normalizedRole = role.toLowerCase() as UserRole;
    
    setUserRole(normalizedRole);
    setToken(token);
    api.setAuthToken(token);
    localStorage.setItem('userRole', normalizedRole);
    console.log('✅ localStorage userRole set to:', localStorage.getItem('userRole'));
  };

  const logout = () => {
    console.log('🚪 Logout called');
    setUserRole(null);
    setToken(null);
    api.removeAuthToken();
    localStorage.removeItem('userRole');
  };

  const authContextValue = useMemo(() => ({
    userRole,
    token,
    login,
    logout,
  }), [userRole, token]);

  const themeContextValue = useMemo(() => ({
    isDark,
    toggleTheme,
  }), [isDark]);

  // Debug: Log current state
  useEffect(() => {
    console.log('📊 App State - userRole:', userRole, 'token:', token ? 'exists' : 'null', 'path:', location.pathname);
  }, [userRole, token, location.pathname]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <AuthContext.Provider value={authContextValue}>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                userRole ? (
                  <Navigate to={`/${userRole}/dashboard`} replace />
                ) : (
                  <LandingPage />
                )
              } 
            />
            
            <Route 
              path="/login" 
              element={
                userRole ? (
                  <Navigate to={`/${userRole}/dashboard`} replace />
                ) : (
                  <LoginPage />
                )
              } 
            />
            
            <Route 
              path="/register" 
              element={
                userRole ? (
                  <Navigate to={`/${userRole}/dashboard`} replace />
                ) : (
                  <RegistrationPage />
                )
              } 
            />

            {/* Farmer routes */}
            <Route 
              path="/farmer/dashboard" 
              element={
                userRole === 'farmer' ? (
                  <FarmerDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/farmer/contracts" 
              element={
                userRole === 'farmer' ? (
                  <ContractManagementPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/farmer/price-prediction" 
              element={
                userRole === 'farmer' ? (
                  <PricePredictionPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Buyer routes */}
            <Route 
              path="/buyer/dashboard" 
              element={
                userRole === 'buyer' ? (
                  <BuyerDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            <Route 
              path="/buyer/contracts" 
              element={
                userRole === 'buyer' ? (
                  <ContractManagementPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;