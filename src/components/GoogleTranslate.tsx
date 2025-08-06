import { useEffect } from 'react';
import { Globe } from 'lucide-react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Ensure the Google Translate widget is initialized when component mounts
    const addGoogleTranslateScript = () => {
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    };

    // Check if script is already loaded
    if (window.google && window.google.translate) {
      addGoogleTranslateScript();
    } else {
      // Wait for script to load
      const checkForGoogleTranslate = setInterval(() => {
        if (window.google && window.google.translate) {
          addGoogleTranslateScript();
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