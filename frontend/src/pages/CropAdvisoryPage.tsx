import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  BookOpen,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { Pesticide } from '../types';
import { ToxicityBadge } from '../components/ToxicityBadge';

export const CropAdvisoryPage: React.FC = () => {
  const [pesticides, setPesticides] = useState<Pesticide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedToxicity, setSelectedToxicity] = useState<string>('');

  const [activeModal, setActiveModal] = useState<Pesticide | null>(null);

  useEffect(() => {
    loadPesticides();
  }, [searchTerm, selectedCrop, selectedCategory, selectedToxicity]);

  const loadPesticides = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCrop) params.crop = selectedCrop;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedToxicity) params.toxicity = selectedToxicity;

      const data = await api.getPesticides(params);
      setPesticides(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Title */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Feature 3: Smart Pesticide Advisory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">
          Verified CIBRC Pesticide Directory
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Official statutory label information registered with the Central Insecticides Board & Registration Committee (Govt. of India). Always verify dilution ratios and Pre-Harvest Intervals before foliar application.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand or chemical..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">All Registered Crops</option>
              <option value="Rice">Rice / Paddy</option>
              <option value="Tomato">Tomato</option>
              <option value="Cotton">Cotton</option>
              <option value="Chilli">Chilli</option>
              <option value="Potato">Potato</option>
              <option value="Wheat">Wheat</option>
              <option value="Sugarcane">Sugarcane</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">All Categories</option>
              <option value="Insecticide">Insecticide</option>
              <option value="Fungicide">Fungicide</option>
              <option value="Herbicide">Herbicide</option>
            </select>
          </div>

          {/* Toxicity Filter */}
          <div>
            <select
              value={selectedToxicity}
              onChange={(e) => setSelectedToxicity(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">All Toxicity Bands</option>
              <option value="Green">Green (Slightly Toxic)</option>
              <option value="Blue">Blue (Moderately Toxic)</option>
              <option value="Yellow">Yellow (Highly Toxic)</option>
              <option value="Red">Red (Extremely Toxic)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pesticides Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Querying verified CIBRC safety registry...</p>
        </div>
      ) : pesticides.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700 mb-1">No matching pesticide formulations</h3>
          <p className="text-xs text-gray-500">Try loosening your search filters or check alternative crops.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pesticides.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {p.category}
                  </span>
                  <ToxicityBadge band={p.toxicity_band} />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {p.brand_name}
                </h3>
                <p className="text-xs text-emerald-800 font-medium mb-3">
                  Technical: {p.technical_name}
                </p>

                {/* Target & Crops */}
                <div className="space-y-2 text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="font-semibold text-gray-800">Target Pests: </span>
                    <span>{p.target_pests}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Registered Crops: </span>
                    <span>{p.registered_crops}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60 text-emerald-900 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PHI (Waiting Period): <strong>{p.pre_harvest_interval_days} days</strong></span>
                  </div>
                </div>
              </div>

              {/* View Full Label button */}
              <button
                type="button"
                onClick={() => setActiveModal(p)}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition text-center"
              >
                View Full Label & Safety Instructions
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {activeModal.category}
              </span>
              <ToxicityBadge band={activeModal.toxicity_band} showDetails />
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              {activeModal.brand_name}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Chemical Formulation: {activeModal.technical_name} ({activeModal.chemical_family || 'Standard'})
            </p>

            <div className="space-y-4 text-xs text-gray-700">
              {/* Dosage and Dilution */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <div className="font-bold text-emerald-900">Recommended Dosage:</div>
                  <div className="text-emerald-800 mt-0.5">{activeModal.label_dosage}</div>
                </div>
                <div>
                  <div className="font-bold text-emerald-900">Dilution Ratio:</div>
                  <div className="text-emerald-800 mt-0.5">{activeModal.dilution_ratio}</div>
                </div>
              </div>

              {/* Guidance */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-1">Application Guidance:</h4>
                <p className="leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {activeModal.application_guidance}
                </p>
              </div>

              {/* PPE */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Mandatory PPE (Personal Protective Equipment):</span>
                </h4>
                <p className="leading-relaxed bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-blue-900">
                  {activeModal.ppe_required}
                </p>
              </div>

              {/* Safety & Environment */}
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-rose-900">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Operator Safety & Environmental Precautions:</span>
                </div>
                <p className="mb-2 leading-relaxed">{activeModal.safety_precautions}</p>
                {activeModal.environmental_hazard && (
                  <p className="text-[11px] text-rose-800/90 font-medium">
                    Hazard: {activeModal.environmental_hazard}
                  </p>
                )}
              </div>

              {/* Source */}
              <div className="text-[11px] text-gray-500 text-right pt-2 border-t border-gray-200">
                Data Source: {activeModal.source_reference}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Close Label Information
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
