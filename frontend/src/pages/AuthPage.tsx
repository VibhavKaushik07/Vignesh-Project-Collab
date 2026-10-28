import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Globe,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { login, register } = useAuth();
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Login form
  const [loginEmail, setLoginEmail] = useState<string>('farmer@krishirakshak.in');
  const [loginPassword, setLoginPassword] = useState<string>('Kisan@2026');

  // Register form
  const [regData, setRegData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    preferred_language: 'en'
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(regData);
      setLanguage(regData.preferred_language as any);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('farmer@krishirakshak.in', 'Kisan@2026');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-700/20">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-emerald-950">
            {isRegister ? 'Register Farmer Profile' : 'Sign in to KrishiRakshak'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isRegister
              ? 'Join our sustainable agricultural network'
              : 'Access your farm crops, spray logs, and advisories'}
          </p>
        </div>

        {/* Demo Login Button */}
        {!isRegister && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-xs text-emerald-900 font-semibold mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Demonstration Access</span>
            </div>
            <button
              type="button"
              onClick={quickDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
            >
              1-Click Demo Login (Vignesh)
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Toggle Tabs */}
        <div className="flex border-b border-gray-200 mb-6 text-xs">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
              !isRegister
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition ${
              isRegister
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Register New Farmer
          </button>
        </div>

        {/* Login Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@krishirakshak.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name:</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={regData.full_name}
                  onChange={(e) => setRegData({ ...regData, full_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@gmail.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile:</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={regData.mobile}
                  onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password:</label>
              <input
                type="password"
                required
                placeholder="Choose strong password"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">State:</label>
                <select
                  value={regData.state}
                  onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">District:</label>
                <input
                  type="text"
                  value={regData.district}
                  onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Preferred Language:</label>
              <select
                value={regData.preferred_language}
                onChange={(e) => setRegData({ ...regData, preferred_language: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
