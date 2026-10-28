import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CropAdvisoryPage } from './pages/CropAdvisoryPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { OrganicFarmingPage } from './pages/OrganicFarmingPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { WeatherPage } from './pages/WeatherPage';
import { RegionalAdvisoryPage } from './pages/RegionalAdvisoryPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ActivityTrackerPage } from './pages/ActivityTrackerPage';
import { AwarenessHubPage } from './pages/AwarenessHubPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPage } from './pages/AuthPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-[#1F2937]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/crops" element={<CropAdvisoryPage />} />
                <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
                <Route path="/organic" element={<OrganicFarmingPage />} />
                <Route path="/comparison" element={<ComparisonPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/regional" element={<RegionalAdvisoryPage />} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/tracker" element={<ActivityTrackerPage />} />
                <Route path="/awareness" element={<AwarenessHubPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
