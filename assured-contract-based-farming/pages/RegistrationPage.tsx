// pages/RegistrationPage.tsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, UserCircle, Mail, Lock, Phone, MapPin } from '../components/icons';
import { AuthContext } from '../App';
import { type UserRole } from '../types';
import { ThemeContext } from '../App';

// English translations only
const translations = {
  en: {
    title: "Create Account",
    farmer: "Farmer",
    buyer: "Buyer",
    fullName: "Full Name",
    email: "Email",
    password: "Password (min. 6 characters)",
    phone: "Phone Number (optional)",
    address: "Address (optional)",
    farmSize: "Farm Size in acres (optional)",
    companyName: "Company Name (optional)",
    createAccount: "Create Account",
    creatingAccount: "Creating Account...",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    requiredFields: "Please fill out all required fields.",
    passwordLength: "Password must be at least 6 characters long.",
    registrationSuccess: "Registration successful! Please log in.",
    registrationFailed: "Registration failed. Please try again.",
    iAm: "I am a:",
    backToHome: "Return to Home"
  }
};

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  
  // Fixed language to English only
  const t = translations.en;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    farmSize: '',
    companyName: '',
  });
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fixed handleSubmit to match backend requirements
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError(t.requiredFields);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.passwordLength);
      return;
    }

    setLoading(true);

    try {
      // ✅ Create user object matching backend model
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role.toUpperCase(), // Must match backend enum (FARMER/BUYER)
        phone: formData.phone || "",
        address: formData.address || ""
      };

      console.log("📤 Sending registration data:", userData);

      // ✅ API call
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.registrationFailed);
      }

      const savedUser = await response.json();
      console.log("✅ Registration success:", savedUser);

      alert(t.registrationSuccess);
      navigate("/login");

    } catch (err: any) {
      console.error("❌ Registration error:", err.message);
      setError(err.message || t.registrationFailed);
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
    "w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-golden-400 transition-all";

  // Background image for registration page
  const registerBackground =
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${registerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="absolute top-4 left-4 text-white hover:text-golden-300 transition-colors z-10"
          aria-label={t.backToHome}
        >
          <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
            <Home className="w-5 h-5" />
          </div>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 text-white"
        >
          <h2 className="text-3xl font-bold text-center">{t.title}</h2>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">{t.iAm}</label>
            <div className="flex items-center justify-around mt-2 p-1 bg-white/10 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`w-1/2 py-2 rounded-md transition-colors ${
                  role === 'farmer'
                    ? 'bg-green-600 font-bold'
                    : 'hover:bg-white/10'
                }`}
              >
                {t.farmer}
              </button>
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`w-1/2 py-2 rounded-md transition-colors ${
                  role === 'buyer'
                    ? 'bg-golden-500 font-bold'
                    : 'hover:bg-white/10'
                }`}
              >
                {t.buyer}
              </button>
            </div>
          </div>

          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="text"
              name="name"
              placeholder={t.fullName}
              value={formData.name}
              onChange={handleInputChange}
              className={commonInputClasses}
              required
              disabled={loading}
            />
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
              minLength={6}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="tel"
              name="phone"
              placeholder={t.phone}
              value={formData.phone}
              onChange={handleInputChange}
              className={commonInputClasses}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="text"
              name="address"
              placeholder={t.address}
              value={formData.address}
              onChange={handleInputChange}
              className={commonInputClasses}
              disabled={loading}
            />
          </div>

          {role === 'farmer' && (
            <input
              type="number"
              name="farmSize"
              placeholder={t.farmSize}
              value={formData.farmSize}
              onChange={handleInputChange}
              className={commonInputClasses}
              disabled={loading}
              step="0.1"
              min="0"
            />
          )}

          {role === 'buyer' && (
            <input
              type="text"
              name="companyName"
              placeholder={t.companyName}
              value={formData.companyName}
              onChange={handleInputChange}
              className={commonInputClasses}
              disabled={loading}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 font-bold bg-gradient-to-r from-golden-400 to-golden-500 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t.creatingAccount}
              </>
            ) : (
              t.createAccount
            )}
          </button>

          <p className="text-sm text-center !mt-6">
            {t.alreadyHaveAccount}{' '}
            <Link
              to="/login"
              className="font-medium text-golden-300 hover:underline"
            >
              {t.loginHere}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;