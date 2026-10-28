import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  User,
  Tag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  Bookmark
} from 'lucide-react';
import { api } from '../services/api';
import { EducationalResource } from '../types';

const CATEGORIES = [
  'All',
  'Organic Basics',
  'Composting',
  'Vermicomposting',
  'IPM',
  'Soil Health'
];

export const AwarenessHubPage: React.FC = () => {
  const [articles, setArticles] = useState<EducationalResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<EducationalResource | null>(null);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchTerm]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === 'All' ? undefined : selectedCategory;
      const data = await api.getArticles(cat, searchTerm || undefined);
      setArticles(data);
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-900 text-xs font-semibold mb-3">
          <BookOpen className="w-4 h-4 text-lime-700" />
          <span>Feature 11: Organic Farming Awareness Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-950 mb-2">
          Agricultural Knowledge & Practical Guides
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          In-depth technical guides authored by agronomy specialists, covering aerobic composting, earthworm vermiculture, soil organic carbon restoration, and Integrated Pest Management (IPM).
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Retrieving awareness guides...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-700 mb-1">No educational guides found</h3>
          <p className="text-xs text-gray-500">Try selecting 'All' categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-gray-200 hover:border-emerald-400 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{art.read_time}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] text-gray-400 truncate max-w-[150px]">
                  By {art.author}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(art)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  <span>Read Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-lg font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {activeArticle.category}
              </span>
              <span className="text-xs text-gray-400">{activeArticle.read_time}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
              {activeArticle.title}
            </h2>

            <div className="text-xs text-gray-500 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-3.5 h-3.5" />
              <span>{activeArticle.author}</span>
            </div>

            {/* Markdown Content formatted */}
            <div className="prose prose-sm max-w-none text-xs text-gray-800 space-y-4 leading-relaxed whitespace-pre-line font-sans">
              {activeArticle.content_markdown}
            </div>

            {/* Source Reference */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <strong>Reference Authority:</strong> {activeArticle.source_url}
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
