import { useEffect, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'አማርኛ (Amharic)', flag: '🇪🇹' },
  { code: 'ti', name: 'ትግርኛ (Tigrinya)', flag: '🇪🇷' },
  { code: 'om', name: 'Afaan Oromoo', flag: '🇪🇹' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];

const GoogleTranslate = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if Google Translate is loaded
    const checkGoogleTranslate = setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        setIsReady(true);
        clearInterval(checkGoogleTranslate);
      }
    }, 500);

    return () => clearInterval(checkGoogleTranslate);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    
    // Trigger Google Translate language change
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(l => l.code === currentLang) || languages[0];
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden"></div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{getCurrentLanguage().flag} {getCurrentLanguage().name.split(' ')[0]}</span>
            <span className="sm:hidden">{getCurrentLanguage().flag}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={currentLang === lang.code ? 'bg-accent' : ''}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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