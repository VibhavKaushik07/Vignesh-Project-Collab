import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ScanLine,
  Leaf,
  Scale,
  CloudSun,
  MapPin,
  Bot,
  CalendarCheck,
  BookOpen,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Droplet,
  Sun,
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { WeatherData } from '../types';
import { SprayingStatusBadge } from '../components/SprayingStatusBadge';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    api.getWeather('Bengaluru Rural')
      .then(setWeather)
      .catch(() => {});
  }, []);

  const featureCards = [
    {
      title: 'AI Crop Disease Detection',
      desc: 'Upload leaf photos to identify fungal, bacterial, or viral diseases with organic & chemical guidance.',
      icon: ScanLine,
      link: '/disease-detection',
      color: 'from-emerald-500 to-green-600',
      badge: 'Vision AI'
    },
    {
      title: 'Smart Pesticide Advisory',
      desc: 'Access verified CIBRC approved label dosages, Pre-Harvest Intervals (PHI), PPE and dilution ratios.',
      icon: ShieldAlert,
      link: '/crops',
      color: 'from-blue-500 to-indigo-600',
      badge: 'CIBRC Verified'
    },
    {
      title: 'Organic Alternatives',
      desc: 'Discover evidence-based bio-pesticides, botanical extracts (Neem, Dashaparni), and Jeevamrutha recipes.',
      icon: Leaf,
      link: '/organic',
      color: 'from-green-600 to-emerald-700',
      badge: 'Eco-Friendly'
    },
    {
      title: 'Chemical vs Organic Comparison',
      desc: 'Side-by-side cost, safety, environmental footprint, and efficacy breakdown for informed decisions.',
      icon: Scale,
      link: '/comparison',
      color: 'from-amber-500 to-orange-600',
      badge: 'Decision Tool'
    },
    {
      title: 'Weather & Spraying Advisory',
      desc: 'Live Open-Meteo forecasts with smart alerts preventing chemical wash-off and dangerous drift.',
      icon: CloudSun,
      link: '/weather',
      color: 'from-sky-500 to-blue-600',
      badge: 'Live Forecast'
    },
    {
      title: 'AI Farming Assistant',
      desc: 'Multilingual conversational chatbot providing instant grounded agronomy guidance with voice support.',
      icon: Bot,
      link: '/ai-assistant',
      color: 'from-teal-500 to-emerald-600',
      badge: 'Voice & Multilingual'
    },
    {
      title: 'Farming Activity Tracker',
      desc: 'Log spraying dates, products, costs, and set automated follow-up reminders to track field health.',
      icon: CalendarCheck,
      link: '/tracker',
      color: 'from-purple-500 to-indigo-600',
      badge: 'Farm Logbook'
    },
    {
      title: 'Organic Awareness Hub',
      desc: 'Comprehensive educational articles on composting, vermicomposting, soil organic carbon, and IPM.',
      icon: BookOpen,
      link: '/awareness',
      color: 'from-lime-600 to-green-700',
      badge: 'ICAR Knowledge'
    },
    {
      title: 'Location-Based Advisory',
      desc: 'Customized seasonal advisories tailored to your State, District, and specific crop cycles.',
      icon: MapPin,
      link: '/regional',
      color: 'from-amber-600 to-yellow-700',
      badge: 'Regional KVK'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-16 pb-24 px-4">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dcfce7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 mb-6 backdrop-blur-sm shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>AI-Powered Pesticide Advisory & Sustainable Agriculture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            {t('hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            {t('hero_desc')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              to="/disease-detection"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-900/40 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <ScanLine className="w-5 h-5" />
              <span>{t('btn_diagnose')}</span>
            </Link>

            <Link
              to="/organic"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-emerald-400/30 backdrop-blur-sm transition flex items-center gap-2"
            >
              <Leaf className="w-5 h-5 text-emerald-300" />
              <span>{t('btn_explore_organic')}</span>
            </Link>

            <Link
              to="/ai-assistant"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 transition flex items-center gap-2"
            >
              <Bot className="w-5 h-5 text-emerald-400" />
              <span>{t('btn_ask_ai')}</span>
            </Link>
          </div>

          {/* Live Spraying & Weather Quick Strip */}
          {weather && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-3xl mx-auto shadow-xl text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/60 flex items-center justify-center text-emerald-200">
                  <CloudSun className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-emerald-200 font-medium">
                    {weather.district}, {weather.state}
                  </div>
                  <div className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{weather.current.temperature}°C</span>
                    <span className="text-xs font-normal text-emerald-200">({weather.current.condition})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-emerald-100">
                <div className="flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-sky-300" />
                  <span>Humidity: {weather.current.humidity}%</span>
                </div>
                <div>Wind: {weather.current.wind_speed} km/h</div>
              </div>

              <div>
                <SprayingStatusBadge status={weather.spraying_advisory.status} size="sm" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why KrishiRakshak Section */}
      <section className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-emerald-950 mb-3">{t('why_krishirakshak')}</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('why_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">The Chemical Crisis</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Excessive, uncalibrated pesticide usage leads to soil toxicity, groundwater contamination, pest resistance resurgence, and acute health hazards for spraying operators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Knowledge Imbalance</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Farmers often lack verified label instructions for correct dilution and Pre-Harvest Intervals (PHI), leading to rejected harvests and unnecessary input expenditure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">The KrishiRakshak Solution</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We empower farmers with instant AI diagnostics, official CIBRC safety labels, evidence-based organic formulations, and weather-synchronized spraying windows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 5-Step Process */}
      <section className="py-16 px-4 bg-emerald-50/40">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Simple & Effective</span>
            <h2 className="text-3xl font-extrabold text-emerald-950 mt-1">{t('how_it_works')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '01', title: t('how_step1'), desc: 'Select or register your standing crops in your farm profile.' },
              { num: '02', title: t('how_step2'), desc: 'Upload crop photos for instant symptom and leaf blight analysis.' },
              { num: '03', title: t('how_step3'), desc: 'Check verified label dosages, safety PPE, and waiting periods.' },
              { num: '04', title: t('how_step4'), desc: 'Explore natural recipes like Jeevamrutha and bio-agents.' },
              { num: '05', title: t('how_step5'), desc: 'Log treatments and monitor harvest safety in your dashboard.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs relative flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-black text-emerald-300 font-mono mb-2 block">{step.num}</span>
                  <h4 className="text-sm font-bold text-gray-900 mb-1.5">{step.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Complete AgriTech Suite</span>
            <h2 className="text-3xl font-extrabold text-emerald-950 mt-1">{t('features_title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={idx}
                  to={feat.link}
                  className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Explore Module</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-800 to-green-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Protect Your Harvest with Responsible Science
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of progressive farmers transforming their crop yields, lowering chemical input costs, and transitioning toward safe, certified sustainable agriculture.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/auth"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-emerald-900 hover:bg-emerald-50 transition shadow-md"
            >
              Register Farmer Profile
            </Link>
            <Link
              to="/crops"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-emerald-700 text-white hover:bg-emerald-600 border border-emerald-500 transition"
            >
              Browse Pesticide Database
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
