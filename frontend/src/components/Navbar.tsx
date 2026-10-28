import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Sprout,
  ScanLine,
  Leaf,
  Scale,
  CloudSun,
  MapPin,
  Bot,
  CalendarCheck,
  BookOpen,
  LayoutDashboard,
  Globe,
  User as UserIcon,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  const navLinks = [
    { path: '/', label: t('nav_home'), icon: Sprout },
    { path: '/crops', label: t('nav_crop_advisory'), icon: ShieldAlert },
    { path: '/disease-detection', label: t('nav_disease_detect'), icon: ScanLine },
    { path: '/organic', label: t('nav_organic'), icon: Leaf },
    { path: '/comparison', label: t('nav_comparison'), icon: Scale },
    { path: '/weather', label: t('nav_weather'), icon: CloudSun },
    { path: '/regional', label: t('nav_regional'), icon: MapPin },
    { path: '/ai-assistant', label: t('nav_ai_assistant'), icon: Bot },
    { path: '/tracker', label: t('nav_tracker'), icon: CalendarCheck },
    { path: '/awareness', label: t('nav_awareness'), icon: BookOpen },
    { path: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-800 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <span className="hidden sm:inline">🌱 {t('tagline')}</span>
          <span className="sm:hidden">🌱 KrishiRakshak AgriTech</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-200 text-[11px] hidden md:inline">ICAR & CIBRC Safety Verified</span>
            <div className="flex items-center gap-1 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
              <Globe className="w-3 h-3 text-emerald-300" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white text-xs outline-none cursor-pointer"
                aria-label="Language selector"
              >
                <option value="en" className="text-gray-900">English</option>
                <option value="kn" className="text-gray-900">ಕನ್ನಡ (Kannada)</option>
                <option value="hi" className="text-gray-900">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-emerald-950 flex items-center gap-1.5 font-sans">
              <span>Krishi<span className="text-emerald-600">Rakshak</span></span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">AI</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide -mt-0.5 hidden sm:block">
              {t('secondary_tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.slice(0, 8).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/tracker"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('nav_tracker')}</span>
          </Link>

          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('nav_dashboard')}</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-gray-200">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition"
                title={`Logged in as ${user.full_name}`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline max-w-[100px] truncate">{user.full_name}</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{t('nav_login')}</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-5 space-y-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
