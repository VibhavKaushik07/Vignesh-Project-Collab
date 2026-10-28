import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, PhoneCall, ShieldCheck, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-emerald-950 text-emerald-100/80 pt-12 pb-8 border-t border-emerald-900 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Krishi<span className="text-emerald-400">Rakshak</span></span>
            </div>
            <p className="text-xs leading-relaxed text-emerald-200/70">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Project files & databases saved strictly inside project-local storage.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wider uppercase">Platform Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/crops" className="hover:text-emerald-300 transition">Smart Pesticide Advisory</Link></li>
              <li><Link to="/disease-detection" className="hover:text-emerald-300 transition">AI Crop Disease Detection</Link></li>
              <li><Link to="/organic" className="hover:text-emerald-300 transition">Organic Alternatives & Recipes</Link></li>
              <li><Link to="/comparison" className="hover:text-emerald-300 transition">Chemical vs Organic Comparison</Link></li>
              <li><Link to="/weather" className="hover:text-emerald-300 transition">Weather & Spraying Advisory</Link></li>
              <li><Link to="/tracker" className="hover:text-emerald-300 transition">Farming Activity Tracker</Link></li>
            </ul>
          </div>

          {/* Educational Resources */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wider uppercase">Awareness & Guides</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/awareness" className="hover:text-emerald-300 transition">Organic Farming Basics</Link></li>
              <li><Link to="/awareness" className="hover:text-emerald-300 transition">Fast Aerobic Composting</Link></li>
              <li><Link to="/awareness" className="hover:text-emerald-300 transition">Vermicomposting Techniques</Link></li>
              <li><Link to="/awareness" className="hover:text-emerald-300 transition">Integrated Pest Management (IPM)</Link></li>
              <li><Link to="/regional" className="hover:text-emerald-300 transition">State & District Crop Advisories</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-emerald-300 transition">Ask KrishiRakshak AI Assistant</Link></li>
            </ul>
          </div>

          {/* Official Helplines & Verification */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wider uppercase">Farmer Helplines & Verified Sources</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-medium">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Kisan Call Centre: 1800-180-1551</span>
              </div>
              <p className="text-[11px] text-emerald-200/60 leading-relaxed">
                Pesticide safety labels compiled according to Central Insecticides Board & Registration Committee (CIBRC) standards.
              </p>
              <div className="pt-2">
                <a
                  href="https://icar.org.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                >
                  <span>Indian Council of Agricultural Research (ICAR)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-emerald-900/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/70">
          <p>© 2026 KrishiRakshak. {t('all_rights')}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span>Full-Stack AgriTech Platform</span>
            </span>
            <span className="text-emerald-600">|</span>
            <span>Version 1.0.0 Production</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
