import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'kn' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    site_name: 'KrishiRakshak',
    tagline: 'Protecting Crops. Empowering Farmers. Preserving Nature.',
    secondary_tagline: 'Smarter Farming, Safer Harvests.',
    nav_home: 'Home',
    nav_crop_advisory: 'Crop Advisory',
    nav_disease_detect: 'Disease Detection',
    nav_organic: 'Organic Farming',
    nav_comparison: 'Chemical vs Organic',
    nav_weather: 'Weather Advisory',
    nav_regional: 'Regional Advisory',
    nav_ai_assistant: 'AI Assistant',
    nav_tracker: 'Activity Tracker',
    nav_awareness: 'Awareness Hub',
    nav_dashboard: 'Dashboard',
    nav_login: 'Login / Register',
    nav_logout: 'Logout',
    hero_title: 'Smarter Farming. Healthier Crops. Greener Tomorrow.',
    hero_desc: 'Your intelligent farming companion for crop protection, responsible pesticide usage, organic alternatives, and sustainable agriculture.',
    btn_get_started: 'Get Started',
    btn_diagnose: 'Diagnose Crop Disease',
    btn_explore_organic: 'Explore Organic Solutions',
    btn_ask_ai: 'Ask AI Assistant',
    why_krishirakshak: 'Why KrishiRakshak?',
    why_desc: 'Indian agriculture faces dual challenges: excessive synthetic chemical toxicity that damages farmer health and destroys soil microbiomes, coupled with a lack of verified, accessible organic knowledge. KrishiRakshak bridges this gap.',
    how_it_works: 'How It Works',
    how_step1: 'Select Your Crop',
    how_step2: 'Identify the Problem',
    how_step3: 'Receive Verified Advisory',
    how_step4: 'Adopt Organic Alternatives',
    how_step5: 'Track Progress & Yield',
    features_title: 'Our Platform Features',
    spraying_advisory: 'Spraying Suitability',
    optimal: 'Optimal Window',
    moderate: 'Exercise Caution',
    unsuitable: 'Unsuitable for Spraying',
    weather_summary: 'Live Weather & Spraying Forecast',
    quick_actions: 'Quick Actions',
    my_crops: 'My Crops',
    recent_diagnoses: 'Recent Diagnoses',
    notifications: 'Notifications',
    all_rights: 'All Rights Reserved. Verified by ICAR & CIBRC agricultural safety standards.'
  },
  kn: {
    site_name: 'ಕೃಷಿ ರಕ್ಷಕ್',
    tagline: 'ಬೆಳೆಗಳ ರಕ್ಷಣೆ. ರೈತರ ಸಬಲೀಕರಣ. ಪರಿಸರ ಸಂರಕ್ಷಣೆ.',
    secondary_tagline: 'ಬುದ್ಧಿವಂತ ಕೃಷಿ, ಸುರಕ್ಷಿತ ಸುಗ್ಗಿ.',
    nav_home: 'ಮುಖಪುಟ',
    nav_crop_advisory: 'ಬೆಳೆ ಸಲಹೆ',
    nav_disease_detect: 'ರೋಗ ಪತ್ತೆ',
    nav_organic: 'ಸಾವಯವ ಕೃಷಿ',
    nav_comparison: 'ರಾಸಾಯನಿಕ vs ಸಾವಯವ',
    nav_weather: 'ಹವಾಮಾನ ಸಲಹೆ',
    nav_regional: 'ಪ್ರಾದೇಶಿಕ ಮಾರ್ಗದರ್ಶನ',
    nav_ai_assistant: 'ಎಐ ಸಹಾಯಕ',
    nav_tracker: 'ಚಟುವಟಿಕೆ ಟ್ರ್ಯಾಕರ್',
    nav_awareness: 'ಅರಿವು ಕೇಂದ್ರ',
    nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    nav_login: 'ಲಾಗಿನ್ / ನೋಂದಣಿ',
    nav_logout: 'ಲಾಗ್ಔಟ್',
    hero_title: 'ಬುದ್ಧಿವಂತ ಕೃಷಿ. ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳು. ಹಸಿರು ನಾಳೆ.',
    hero_desc: 'ಬೆಳೆ ರಕ್ಷಣೆ, ಜವಾಬ್ದಾರಿಯುತ ಕೀಟನಾಶಕ ಬಳಕೆ, ಸಾವಯವ ಪರ್ಯಾಯಗಳು ಮತ್ತು ಸುಸ್ಥಿರ ಕೃಷಿಗಾಗಿ ನಿಮ್ಮ ಬುದ್ಧಿವಂತ ಕೃಷಿ ಒಡನಾಡಿ.',
    btn_get_started: 'ಪ್ರಾರಂಭಿಸಿ',
    btn_diagnose: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆಹಚ್ಚಿ',
    btn_explore_organic: 'ಸಾವಯವ ಪರಿಹಾರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    btn_ask_ai: 'ಎಐ ಸಹಾಯಕನನ್ನು ಕೇಳಿ',
    why_krishirakshak: 'ಕೃಷಿ ರಕ್ಷಕ್ ಏಕೆ?',
    why_desc: 'ಭಾರತೀಯ ಕೃಷಿಯು ಅತಿಯಾದ ರಾಸಾಯನಿಕ ವಿಷತ್ವ ಮತ್ತು ಮಣ್ಣಿನ ಸವೆತದ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸುತ್ತಿದೆ. ಕೃಷಿ ರಕ್ಷಕ್ ರೈತರಿಗೆ ಸರಿಯಾದ ಸುರಕ್ಷಿತ ಸಲಹೆ ಮತ್ತು ಜೈವಿಕ ಪರಿಹಾರಗಳನ್ನು ನೀಡುತ್ತದೆ.',
    how_it_works: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    how_step1: 'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    how_step2: 'ಸಮಸ್ಯೆಯನ್ನು ಗುರುತಿಸಿ',
    how_step3: 'ಪರಿಶೀಲಿಸಿದ ಸಲಹೆ ಪಡೆಯಿರಿ',
    how_step4: 'ಸಾವಯವ ವಿಧಾನಗಳನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಿ',
    how_step5: 'ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    features_title: 'ನಮ್ಮ ವೇದಿಕೆಯ ವೈಶಿಷ್ಟ್ಯಗಳು',
    spraying_advisory: 'ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತತೆ',
    optimal: 'ಉತ್ತಮ ಸಮಯ',
    moderate: 'ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ',
    unsuitable: 'ಸಿಂಪಡಿಸಲು ಸೂಕ್ತವಲ್ಲ',
    weather_summary: 'ನೇರ ಹವಾಮಾನ ಮತ್ತು ಸಿಂಪಡಣೆ ಮುನ್ಸೂಚನೆ',
    quick_actions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    my_crops: 'ನನ್ನ ಬೆಳೆಗಳು',
    recent_diagnoses: 'ಇತ್ತೀಚಿನ ರೋಗ ಪತ್ತೆಗಳು',
    notifications: 'ಸೂಚನೆಗಳು',
    all_rights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ICAR ಮತ್ತು CIBRC ಕೃಷಿ ಸುರಕ್ಷತಾ ಮಾನದಂಡಗಳಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.'
  },
  hi: {
    site_name: 'कृषि रक्षक',
    tagline: 'फसलों की सुरक्षा। किसानों का सशक्तिकरण। प्रकृति का संरक्षण।',
    secondary_tagline: 'समझदार खेती, सुरक्षित पैदावार।',
    nav_home: 'होम',
    nav_crop_advisory: 'फसल परामर्श',
    nav_disease_detect: 'रोग पहचान',
    nav_organic: 'जैविक खेती',
    nav_comparison: 'रासायनिक बनाम जैविक',
    nav_weather: 'मौसम परामर्श',
    nav_regional: 'क्षेत्रीय परामर्श',
    nav_ai_assistant: 'एआई सहायक',
    nav_tracker: 'गतिविधि ट्रैकर',
    nav_awareness: 'जागरूकता केंद्र',
    nav_dashboard: 'डैशबोर्ड',
    nav_login: 'लॉगिन / पंजीकरण',
    nav_logout: 'लॉगआउट',
    hero_title: 'समझदार खेती। स्वस्थ फसलें। हरा-भरा कल।',
    hero_desc: 'फसल सुरक्षा, जिम्मेदार कीटनाशक उपयोग, जैविक विकल्पों और टिकाऊ कृषि के लिए आपका बुद्धिमान साथी।',
    btn_get_started: 'शुरू करें',
    btn_diagnose: 'फसल रोग पहचानें',
    btn_explore_organic: 'जैविक समाधान खोजें',
    btn_ask_ai: 'एआई सहायक से पूछें',
    why_krishirakshak: 'कृषि रक्षक क्यों?',
    why_desc: 'अत्यधिक रासायनिक कीटनाशकों के खतरों और मिट्टी के नुकसान से बचने के लिए कृषि रक्षक प्रमाणित वैज्ञानिक परामर्श और जैविक विकल्प प्रदान करता है।',
    how_it_works: 'यह कैसे काम करता है',
    how_step1: 'अपनी फसल चुनें',
    how_step2: 'समस्या की पहचान करें',
    how_step3: 'सत्यापित परामर्श प्राप्त करें',
    how_step4: 'जैविक तरीके अपनाएं',
    how_step5: 'प्रगति ट्रैक करें',
    features_title: 'हमारी मुख्य विशेषताएं',
    spraying_advisory: 'छिड़काव उपयुक्तता',
    optimal: 'अनुकूल समय',
    moderate: 'सावधानी बरतें',
    unsuitable: 'छिड़काव के लिए अनुपयुक्त',
    weather_summary: 'लाइव मौसम और छिड़काव पूर्वानुमान',
    quick_actions: 'त्वरित क्रियाएं',
    my_crops: 'मेरी फसलें',
    recent_diagnoses: 'हालिया रोग निदान',
    notifications: 'सूचनाएं',
    all_rights: 'सर्वाधिकार सुरक्षित। ICAR और CIBRC कृषि सुरक्षा मानकों द्वारा सत्यापित।'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('krishi_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krishi_lang', lang);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
