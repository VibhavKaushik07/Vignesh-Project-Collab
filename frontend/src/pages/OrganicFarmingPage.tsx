import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';
import { OrganicAlternative } from '../types';

export const OrganicFarmingPage: React.FC = () => {
  const [items, setItems] = useState<OrganicAlternative[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadOrganic();
  }, [searchTerm, selectedCategory]);

  const loadOrganic = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      const data = await api.getOrganicAlternatives(params);
      setItems(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Title */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Feature 4: Organic Alternatives & Bio-Control</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">
          Evidence-Based Organic Formulations
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Sustainable biological controls, botanical extracts, beneficial microbes, and natural soil enhancers verified by the National Centre for Organic and Natural Farming (NCOF) and ICAR.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search organic solutions (e.g. Neem, Jeevamrutha, Trichoderma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">All Categories</option>
            <option value="Botanical">Botanical Extracts (Neem, Dashaparni)</option>
            <option value="Bio-pesticide">Bio-Pesticides (Trichoderma, Beauveria)</option>
            <option value="Soil Health">Soil Health & Inoculants (Jeevamrutha)</option>
            <option value="Cultural">Physical & Traps (Sticky, Pheromone)</option>
            <option value="Bio-Stimulant">Bio-Stimulants (Panchagavya)</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading organic agronomy database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700 mb-1">No organic alternatives found</h3>
          <p className="text-xs text-gray-500">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs transition hover:border-emerald-300"
              >
                {/* Header Strip */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-gray-50/70 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          Cost: <strong className="text-emerald-700">{item.cost_level}</strong>
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        <span className="font-semibold text-gray-700">Targets:</span> {item.target_pests}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-semibold text-emerald-700 hidden sm:inline">
                      {isExpanded ? 'Hide Recipe' : 'View Recipe & Method'}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-6 bg-emerald-50/20 border-t border-gray-100 space-y-4 text-xs text-gray-700 animate-in fade-in duration-200">
                    {/* Suitable Crops */}
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-1">Suitable Crops:</h4>
                      <p className="bg-white p-2.5 rounded-xl border border-gray-200">
                        {item.suitable_crops}
                      </p>
                    </div>

                    {/* Preparation Recipe */}
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1.5 text-emerald-800">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Preparation Method / Formulation Recipe:</span>
                      </h4>
                      <p className="leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-200 text-gray-800 font-sans">
                        {item.preparation_method}
                      </p>
                    </div>

                    {/* Application Instructions */}
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-1">Application Instructions:</h4>
                      <p className="leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
                        {item.application_method}
                      </p>
                    </div>

                    {/* Benefits vs Limitations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900">
                        <div className="font-bold mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Key Advantages:</span>
                        </div>
                        <p className="leading-relaxed">{item.benefits}</p>
                      </div>

                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                        <div className="font-bold mb-1 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Limitations & Watchpoints:</span>
                        </div>
                        <p className="leading-relaxed">{item.limitations}</p>
                      </div>
                    </div>

                    {/* Citation */}
                    <div className="text-[11px] text-gray-500 text-right pt-2 border-t border-gray-200">
                      Standardized Reference: {item.source_reference}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
