import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Plus,
  Trash2,
  ScanLine,
  CloudSun,
  Bell,
  ArrowRight,
  Leaf,
  Clock,
  Sparkles,
  User as UserIcon,
  Edit3,
  Users,
  CheckCircle,
  MapPin,
  Globe
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { SprayingStatusBadge } from '../components/SprayingStatusBadge';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const DashboardPage: React.FC = () => {
  const { user, profiles, updateUser, createProfile, switchProfile, fetchProfiles } = useAuth();
  const { setLanguage } = useLanguage();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [showAddCropModal, setShowAddCropModal] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [showAddProfileModal, setShowAddProfileModal] = useState<boolean>(false);

  // Edit Profile form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    mobile: '',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    preferred_language: 'en'
  });

  // Add Profile form state
  const [newProfileForm, setNewProfileForm] = useState({
    full_name: '',
    mobile: '',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    preferred_language: 'en'
  });

  // New crop form state
  const [cropForm, setCropForm] = useState({
    crop_name: 'Tomato',
    variety: 'Arka Rakshak',
    farming_type: 'IPM',
    farm_area_acres: 1.0,
    sowing_date: new Date().toISOString().split('T')[0],
    stage: 'Vegetative',
    notes: ''
  });

  useEffect(() => {
    loadDashboard();
    fetchProfiles();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboard();
      setDashboard(data);
      if (data?.farmer) {
        setEditForm({
          full_name: data.farmer.full_name,
          mobile: data.farmer.mobile || '',
          state: data.farmer.state || 'Karnataka',
          district: data.farmer.district || 'Bengaluru Rural',
          preferred_language: data.farmer.preferred_language || 'en'
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.full_name.trim()) {
      alert('Please enter a valid name.');
      return;
    }
    try {
      await updateUser(editForm);
      setLanguage(editForm.preferred_language as any);
      setShowEditProfileModal(false);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleAddProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileForm.full_name.trim()) {
      alert('Please enter profile name.');
      return;
    }
    try {
      await createProfile(newProfileForm);
      setLanguage(newProfileForm.preferred_language as any);
      setShowAddProfileModal(false);
      setNewProfileForm({
        full_name: '',
        mobile: '',
        state: 'Karnataka',
        district: 'Bengaluru Rural',
        preferred_language: 'en'
      });
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to create profile');
    }
  };

  const handleSwitch = async (profileId: number) => {
    try {
      await switchProfile(profileId);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to switch profile');
    }
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addCrop(cropForm);
      setShowAddCropModal(false);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to add crop');
    }
  };

  const handleDeleteCrop = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this crop from your farm?')) {
      try {
        await api.deleteCrop(id);
        loadDashboard();
      } catch (err: any) {
        alert(err.message || 'Failed to delete crop');
      }
    }
  };

  const handleMarkNotificationRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      loadDashboard();
    } catch {
      // ignore
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading farmer dashboard...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-sm text-gray-600 mb-4">Unable to load dashboard data. Please log in or refresh.</p>
        <Link to="/auth" className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kisan Dashboard: {dashboard.farmer.district}, {dashboard.farmer.state}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {dashboard.farmer.full_name}!
            </h1>
            <button
              onClick={() => {
                setEditForm({
                  full_name: dashboard.farmer.full_name,
                  mobile: dashboard.farmer.mobile || '',
                  state: dashboard.farmer.state || 'Karnataka',
                  district: dashboard.farmer.district || 'Bengaluru Rural',
                  preferred_language: dashboard.farmer.preferred_language || 'en'
                });
                setShowEditProfileModal(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition"
              title="Edit Profile Name and Details"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Name</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Managing {dashboard.stats.total_crops} standing crops across {dashboard.stats.total_acres} acres. Keep your crops healthy with verified pest protection and weather forecasts.
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setShowAddProfileModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-emerald-200" />
            <span>+ Add Profile</span>
          </button>
          <Link
            to="/disease-detection"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 transition shadow-xs flex items-center gap-1.5"
          >
            <ScanLine className="w-4 h-4 text-emerald-600" />
            <span>Diagnose Crop</span>
          </Link>
          <Link
            to="/ai-assistant"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-900/80 text-white hover:bg-emerald-950 transition border border-emerald-600/50 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Ask AI</span>
          </Link>
          <button
            onClick={() => setShowAddCropModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition border border-emerald-400 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Crop</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
            Registered Crops
          </div>
          <div className="text-2xl font-black text-gray-900 flex items-baseline gap-2">
            <span>{dashboard.stats.total_crops}</span>
            <span className="text-xs font-normal text-gray-400">({dashboard.stats.total_acres} Acres)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
            Organic Treatments
          </div>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span>{dashboard.stats.organic_treatments}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
            Chemical Treatments
          </div>
          <div className="text-2xl font-black text-blue-600">
            {dashboard.stats.chemical_treatments}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
            Total Input Expense
          </div>
          <div className="text-2xl font-black text-emerald-900">
            ₹{dashboard.stats.total_expenditure.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Main Grid: My Crops + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Crops Manager & Reminders */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>My Farm Standing Crops</span>
              </h2>

              <button
                onClick={() => setShowAddCropModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Crop</span>
              </button>
            </div>

            {dashboard.crops.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                No crops registered yet. Click 'Add Crop' to register your standing field crops.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboard.crops.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-emerald-50/20 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {c.farming_type}
                        </span>
                        <button
                          onClick={() => handleDeleteCrop(c.id)}
                          className="text-gray-400 hover:text-rose-600 transition"
                          title="Remove crop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                        {c.crop_name}
                      </h3>
                      {c.variety && (
                        <p className="text-xs text-gray-500 mb-2">
                          Variety: {c.variety}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 pt-2 border-t border-gray-200">
                        <div>
                          <span>Area: </span>
                          <strong className="text-gray-900">{c.farm_area_acres} Acres</strong>
                        </div>
                        <div>
                          <span>Stage: </span>
                          <strong className="text-gray-900">{c.stage}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 text-right">
                      <Link
                        to={`/crops?crop=${encodeURIComponent(c.crop_name)}`}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center justify-end gap-1"
                      >
                        <span>Check Advisories</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Upcoming Field Reminders & Follow-Ups</span>
            </h2>

            {dashboard.reminders.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No scheduled follow-up activities pending.</p>
            ) : (
              <div className="space-y-3">
                {dashboard.reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-950">{rem.crop}: </span>
                      <span className="text-amber-900">{rem.treatment}</span>
                    </div>
                    <div className="font-bold text-amber-800 bg-white px-2.5 py-1 rounded-md border border-amber-200">
                      Due: {rem.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profiles Switcher, Local Weather & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Farmer Profiles Switcher Widget */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Farmer Profiles</span>
              </h2>

              <button
                onClick={() => setShowAddProfileModal(true)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {profiles.map((p) => {
                const isActive = dashboard.farmer.id === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-300'
                        : 'bg-gray-50 hover:bg-gray-100/70 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {p.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{p.full_name}</span>
                          {isActive && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {p.district}, {p.state}
                        </div>
                      </div>
                    </div>

                    {!isActive && (
                      <button
                        onClick={() => handleSwitch(p.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-emerald-600 hover:text-white text-gray-700 border border-gray-200 transition"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weather Widget */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-sky-600" />
                <span>Field Weather</span>
              </h2>
              <Link to="/weather" className="text-xs text-emerald-700 font-semibold hover:underline">
                5-Day Outlook →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100/60 p-4 rounded-2xl border border-emerald-200 mb-4">
              <div className="text-xs text-gray-500 font-medium">
                {dashboard.weather.district}, {dashboard.weather.state}
              </div>
              <div className="text-3xl font-extrabold text-emerald-950 my-1">
                {dashboard.weather.current.temperature}°C
              </div>
              <div className="text-xs text-emerald-800 font-medium">
                {dashboard.weather.current.condition}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mt-3 pt-3 border-t border-emerald-200">
                <div>Humidity: <strong>{dashboard.weather.current.humidity}%</strong></div>
                <div>Wind: <strong>{dashboard.weather.current.wind_speed} km/h</strong></div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-gray-700 mb-1.5">Spraying Suitability:</div>
              <SprayingStatusBadge status={dashboard.weather.spraying_advisory.status} size="sm" />
            </div>
          </div>

          {/* In-App Notifications Widget */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <span>In-App Alerts ({dashboard.notifications.length})</span>
            </h2>

            {dashboard.notifications.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No unread notifications.</p>
            ) : (
              <div className="space-y-3">
                {dashboard.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-200 text-xs transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">{notif.title}</span>
                      <button
                        onClick={() => handleMarkNotificationRead(notif.id)}
                        className="text-[10px] text-emerald-700 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-[11px]">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-600" />
              <span>Edit Farmer Profile</span>
            </h3>

            <form onSubmit={handleEditProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Farmer Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vignesh"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile Number:</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State:</label>
                  <select
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">District:</label>
                  <input
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preferred Language:</label>
                <select
                  value={editForm.preferred_language}
                  onChange={(e) => setEditForm({ ...editForm, preferred_language: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Profile Modal */}
      {showAddProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Create New Farmer Profile</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Add a secondary farmer profile, family member account, or separate farm plot profile.
            </p>

            <form onSubmit={handleAddProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Farmer / Plot Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vignesh - Orchard Plot or Ramesh"
                  value={newProfileForm.full_name}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, full_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile Number (Optional):</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={newProfileForm.mobile}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">State:</label>
                  <select
                    value={newProfileForm.state}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">District:</label>
                  <input
                    type="text"
                    value={newProfileForm.district}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preferred Language:</label>
                <select
                  value={newProfileForm.preferred_language}
                  onChange={(e) => setNewProfileForm({ ...newProfileForm, preferred_language: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Create & Switch Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddCropModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span>Add Standing Crop to Farm</span>
            </h3>

            <form onSubmit={handleAddCrop} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Crop Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato, Rice, Cotton, Chilli"
                  value={cropForm.crop_name}
                  onChange={(e) => setCropForm({ ...cropForm, crop_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Variety / Hybrid (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Arka Rakshak, ML-365"
                  value={cropForm.variety}
                  onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Farming Type:</label>
                  <select
                    value={cropForm.farming_type}
                    onChange={(e) => setCropForm({ ...cropForm, farming_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Organic">Certified Organic</option>
                    <option value="IPM">IPM (Integrated)</option>
                    <option value="Natural">Natural (SPNF / ZBNF)</option>
                    <option value="Conventional">Conventional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Area (Acres):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={cropForm.farm_area_acres}
                    onChange={(e) => setCropForm({ ...cropForm, farm_area_acres: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sowing Date:</label>
                  <input
                    type="date"
                    value={cropForm.sowing_date}
                    onChange={(e) => setCropForm({ ...cropForm, sowing_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Growth Stage:</label>
                  <select
                    value={cropForm.stage}
                    onChange={(e) => setCropForm({ ...cropForm, stage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting / Podding</option>
                    <option value="Harvesting">Harvesting</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Save Crop Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
