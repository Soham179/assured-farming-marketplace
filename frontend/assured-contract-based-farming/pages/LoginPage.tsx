// pages/LoginPage.tsx - COMPLETE FIXED VERSION
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { Home, Mail, Lock, UserCircle } from '../components/icons';
import api from '../api';
import { UserRole } from '../types';
import { ThemeContext } from '../App';

// Language translations
const translations = {
  en: {
    title: "User Login",
    farmer: "Farmer",
    buyer: "Buyer",
    loggingInAs: "I am logging in as:",
    email: "Email",
    password: "Password",
    login: "Login",
    loggingIn: "Logging in...",
    dontHaveAccount: "Don't have an account?",
    registerHere: "Register here",
    fillCredentials: "Please enter your email and password.",
    wrongRole: "This account is registered as a {role}. Please select the correct role.",
    loginFailed: "Login failed. Please check your credentials.",
    farmerInfo: "Farmers can create contracts, manage crops, and connect with buyers.",
    buyerInfo: "Buyers can browse products, negotiate contracts, and purchase directly from farmers.",
    backToHome: "Return to Home"
  },
  mr: {
    title: "वापरकर्ता लॉगिन",
    farmer: "शेतकरी",
    buyer: "खरेदीदार",
    loggingInAs: "मी लॉगिन करतोय म्हणून:",
    email: "ईमेल",
    password: "पासवर्ड",
    login: "लॉगिन",
    loggingIn: "लॉगिन केले जात आहे...",
    dontHaveAccount: "खाते नाही?",
    registerHere: "येथे नोंदणी करा",
    fillCredentials: "कृपया तुमचा ईमेल आणि पासवर्ड प्रविष्ट करा.",
    wrongRole: "हे खाते {role} म्हणून नोंदणीकृत आहे. कृपया योग्य भूमिका निवडा.",
    loginFailed: "लॉगिन अयशस्वी. कृपया तुमची प्रमाणे तपासा.",
    farmerInfo: "शेतकरी करार तयार करू शकतात, पिके व्यवस्थापित करू शकतात आणि खरेदीदारांशी संपर्क साधू शकतात.",
    buyerInfo: "खरेदीदार उत्पादने ब्राउझ करू शकतात, करार वाटाघाटी करू शकतात आणि थेट शेतकऱ्यांकडून खरेदी करू शकतात.",
    backToHome: "मुख्यपृष्ठावर परत या"
  }
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  
  // Language state
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const t = translations[language];

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  // ✅ Auto-clear expired token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t.fillCredentials);
      return;
    }

    setLoading(true);

    try {
      // ✅ Clear everything first
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('farmerEmail');
      localStorage.removeItem('loginEmail');

      console.log('📤 Sending login request with email:', formData.email);
      const response = await api.auth.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('📥 Login response:', response);

      if (!response || !response.token) {
        throw new Error('Invalid server response. Please try again.');
      }

      // ✅ FIXED: Extract fields directly (not nested)
      const { token, userId, name, email, role: responseRole } = response;

      // ✅ FIXED: Use email from API response OR from form
      const userEmail = email || formData.email;
      const userName = name || (role === 'farmer' ? t.farmer : t.buyer);
      
      // ✅ FIX: Handle role properly - convert to string safely
      let userRoleStr: string;
      if (typeof responseRole === 'string') {
        userRoleStr = responseRole;
      } else if (responseRole && typeof responseRole === 'object') {
        // If it's an enum object, try to get the string value
        userRoleStr = String(responseRole);
      } else {
        // Fallback based on selected role
        userRoleStr = role === 'farmer' ? 'FARMER' : 'BUYER';
      }
      
      const userRoleLower = userRoleStr.toLowerCase();
      const selectedRoleLower = role.toLowerCase();

      console.log('🔍 Role check:', { 
        userRoleStr, 
        userRoleLower, 
        selectedRoleLower, 
        userId 
      });

      if (userRoleLower !== selectedRoleLower) {
        const roleName = userRoleLower === 'farmer' ? t.farmer.toLowerCase() : t.buyer.toLowerCase();
        setError(t.wrongRole.replace('{role}', roleName));
        setLoading(false);
        return;
      }

      // ✅ Store user data with email
      console.log('✅ Storing user data. User ID:', userId, 'Email:', userEmail);
      const userData = {
        userId: userId,
        name: userName,
        email: userEmail,
        role: userRoleStr.toUpperCase(),
        status: 'ACTIVE'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // ✅ Store email multiple ways as backup
      localStorage.setItem('farmerEmail', userEmail);
      localStorage.setItem('loginEmail', formData.email);

      // ✅ Save fresh token and role
      console.log('✅ Login successful. User ID:', userId, 'Email:', userEmail);
      login(userRoleLower as UserRole, token);

      // ✅ Navigate to correct dashboard
      console.log('🚀 Navigating to dashboard');
      if (userRoleLower === 'farmer') {
        navigate('/farmer-dashboard', { replace: true });
      } else if (userRoleLower === 'buyer') {
        navigate('/buyer-dashboard', { replace: true });
      } else {
        navigate('/admin-dashboard', { replace: true });
      }
      
    } catch (err: any) {
      console.error('❌ Login Error:', err);
      setError(err.message || t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const commonInputClasses =
    'w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all';

  const loginBackground =
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-white flex items-center gap-2 hover:bg-white/20 transition-all"
      >
        <span className="text-sm font-medium">
          {language === 'en' ? 'मराठी' : 'English'}
        </span>
        <span className="text-lg">
          {language === 'en' ? '🇮🇳' : '🇬🇧'}
        </span>
      </button>

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="absolute top-4 left-4 text-white hover:text-green-300 transition-colors z-10"
          aria-label={t.backToHome}
        >
          <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
            <Home className="w-5 h-5" />
          </div>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 text-white"
          style={{ fontFamily: language === 'mr' ? '"Noto Sans Devanagari", Arial, sans-serif' : 'inherit' }}
        >
          <h2 className="text-3xl font-bold text-center">{t.title}</h2>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-2">{t.loggingInAs}</label>
            <div className="flex items-center justify-around p-1 bg-white/10 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`w-1/2 py-3 rounded-md transition-all duration-200 ${
                  role === 'farmer'
                    ? 'bg-green-600 text-white font-bold shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm">{t.farmer}</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`w-1/2 py-3 rounded-md transition-all duration-200 ${
                  role === 'buyer'
                    ? 'bg-yellow-400 text-gray-900 font-bold shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm">{t.buyer}</span>
                </div>
              </button>
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="email"
              name="email"
              placeholder={t.email}
              value={formData.email}
              onChange={handleInputChange}
              className={commonInputClasses}
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="password"
              name="password"
              placeholder={t.password}
              value={formData.password}
              onChange={handleInputChange}
              className={commonInputClasses}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t.loggingIn} {role === 'farmer' ? t.farmer : t.buyer}
              </>
            ) : (
              `${t.login} ${role === 'farmer' ? t.farmer : t.buyer}`
            )}
          </button>

          <p className="text-sm text-center">
            {t.dontHaveAccount}{' '}
            <Link to="/register" className="font-medium text-green-400 hover:underline">
              {t.registerHere}
            </Link>
          </p>

          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-center text-gray-300">
              {role === 'farmer'
                ? t.farmerInfo
                : t.buyerInfo}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;