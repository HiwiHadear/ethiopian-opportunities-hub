import { useEffect } from 'react';
import { Globe } from 'lucide-react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Wait for the Google Translate script to load and initialize
    const timer = setTimeout(() => {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
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