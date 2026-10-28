import React, { useState, useEffect } from 'react';
import {
  Scale,
  DollarSign,
  Zap,
  ShieldAlert,
  TreePine,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { ComparisonItem } from '../types';

export const ComparisonPage: React.FC = () => {
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCrop, setSelectedCrop] = useState<string>('');

  useEffect(() => {
    loadComparisons();
  }, [selectedCrop]);

  const loadComparisons = async () => {
    setLoading(true);
    try {
      const data = await api.getComparisons(selectedCrop || undefined);
      setComparisons(data);
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
          <Scale className="w-4 h-4 text-amber-700" />
          <span>Feature 5: Chemical vs Organic Comparison</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">
          Side-by-Side Agronomic Decision Matrix
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Transparent, evidence-based comparative evaluation between conventional synthetic chemical interventions and biological organic alternatives.
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter Crop Scenario:</span>
        </div>

        <div className="w-64">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">All Crop Scenarios</option>
            <option value="Tomato">Tomato (Early & Late Blight)</option>
            <option value="Cotton">Cotton (Bollworm & Caterpillars)</option>
            <option value="Chilli">Chilli (Thrips & Murda Complex)</option>
            <option value="Rice">Rice / Paddy (Blast & Stem Borer)</option>
          </select>
        </div>
      </div>

      {/* Comparison Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading agronomic comparison matrices...</p>
        </div>
      ) : comparisons.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700 mb-1">No scenarios match your filter</h3>
        </div>
      ) : (
        <div className="space-y-10">
          {comparisons.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Header */}
              <div className="bg-gray-50 p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
                    Crop Scenario: {item.crop}
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    {item.pest_disease}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 max-w-md italic">
                  {item.scenario}
                </p>
              </div>

              {/* Side-by-Side Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 text-xs">
                {/* Chemical Option */}
                <div className="p-6 bg-blue-50/20 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                      Synthetic Chemical
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">CIBRC Registered</span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900">
                    {item.chemical.title}
                  </h4>

                  <div className="space-y-3 text-gray-700">
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                        <span>Input Cost per Acre:</span>
                      </div>
                      <div className="text-blue-900 font-medium pl-5">{item.chemical.cost}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        <span>Speed & Knock-Down Effectiveness:</span>
                      </div>
                      <div className="pl-5">{item.chemical.effectiveness}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Operator Safety & PPE:</span>
                      </div>
                      <div className="pl-5 text-rose-900">{item.chemical.safety_precautions}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <TreePine className="w-3.5 h-3.5 text-blue-600" />
                        <span>Environmental Considerations:</span>
                      </div>
                      <div className="pl-5">{item.chemical.environmental_considerations}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pre-Harvest Interval (Waiting Period):</span>
                      </div>
                      <div className="pl-5 font-bold text-amber-900">{item.chemical.pre_harvest_interval}</div>
                    </div>

                    <div className="pt-2 border-t border-blue-100/70">
                      <div className="font-bold text-gray-900 mb-1">Optimal Suitability:</div>
                      <div className="bg-white p-2.5 rounded-xl border border-blue-200 text-blue-950 font-medium">
                        {item.chemical.suitability}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organic Option */}
                <div className="p-6 bg-emerald-50/20 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                      Organic / Bio-Control
                    </span>
                    <span className="text-[11px] text-emerald-700 font-mono">NCOF Verified</span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900">
                    {item.organic.title}
                  </h4>

                  <div className="space-y-3 text-gray-700">
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Input Cost per Acre:</span>
                      </div>
                      <div className="text-emerald-900 font-medium pl-5">{item.organic.cost}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Long-Term Efficacy & Immunity:</span>
                      </div>
                      <div className="pl-5">{item.organic.effectiveness}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Operator Safety & PPE:</span>
                      </div>
                      <div className="pl-5 text-emerald-900">{item.organic.safety_precautions}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <TreePine className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Environmental Considerations:</span>
                      </div>
                      <div className="pl-5">{item.organic.environmental_considerations}</div>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pre-Harvest Interval (Waiting Period):</span>
                      </div>
                      <div className="pl-5 font-bold text-emerald-900">{item.organic.pre_harvest_interval}</div>
                    </div>

                    <div className="pt-2 border-t border-emerald-100/70">
                      <div className="font-bold text-gray-900 mb-1">Optimal Suitability:</div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
                        {item.organic.suitability}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
