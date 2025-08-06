import { useEffect } from 'react';
import { Globe } from 'lucide-react';

const GoogleTranslate = () => {
  useEffect(() => {
    const initializeGoogleTranslate = () => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,am,ti,om',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          multilanguagePage: true,
          gaTrack: true,
          gaId: 'GA_TRACKING_ID'
        }, 'google_translate_element');
      }
    };

    // Check if script is already loaded
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      initializeGoogleTranslate();
    } else {
      // Wait for script to load
      const checkForGoogleTranslate = setInterval(() => {
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
          initializeGoogleTranslate();
          clearInterval(checkForGoogleTranslate);
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkForGoogleTranslate), 10000);
    }
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <div id="google_translate_element" className="text-sm"></div>
    </div>
  );
};

// Extend window object to include Google Translate types
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default GoogleTranslate;