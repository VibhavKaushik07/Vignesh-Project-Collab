import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Building,
  PhoneCall,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { RegionalAdvisory } from '../types';

export const RegionalAdvisoryPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<RegionalAdvisory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');

  useEffect(() => {
    loadAdvisories();
  }, [selectedState, selectedSeason]);

  const loadAdvisories = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedState) params.state = selectedState;
      if (selectedSeason) params.season = selectedSeason;
      const data = await api.getRegionalAdvisories(params);
      setAdvisories(data);
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>Feature 7: Location & Season Based Advisory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">
          Agro-Climatic Zone Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Tailored seasonal guidelines for Kharif, Rabi, and Zaid cultivation cycles, specific to state micro-climates and verified by regional Krishi Vigyan Kendras (KVK).
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter Zone & Season:</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full sm:w-48 text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">All States</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Punjab">Punjab</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
          </select>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full sm:w-48 text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">All Seasons</option>
            <option value="Kharif">Kharif (Monsoon)</option>
            <option value="Rabi">Rabi (Winter)</option>
            <option value="Zaid">Zaid (Summer)</option>
          </select>
        </div>
      </div>

      {/* Advisories Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Fetching regional agricultural advisories...</p>
        </div>
      ) : advisories.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700 mb-1">No regional advisories found</h3>
          <p className="text-xs text-gray-500">Try broadening your state and season selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advisories.map((adv) => (
            <div
              key={adv.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{adv.district}, {adv.state}</span>
                  </span>
                  <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    <span>{adv.season} Season</span>
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                  Target Crop: {adv.crop}
                </h3>

                {/* Recommendations */}
                <div className="space-y-3 text-xs text-gray-700 mb-4">
                  <div>
                    <h4 className="font-bold text-emerald-950 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Agronomic Guidance & Varieties:</span>
                    </h4>
                    <p className="leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                      {adv.recommendation}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-rose-950 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Known Regional Pest & Disease Threats:</span>
                    </h4>
                    <p className="leading-relaxed bg-rose-50/40 p-2.5 rounded-xl border border-rose-100 text-rose-900">
                      {adv.pest_risks}
                    </p>
                  </div>
                </div>
              </div>

              {/* Govt Resources / KVK */}
              {adv.govt_resources && (
                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-600 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Resource Centre:</strong> {adv.govt_resources}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
