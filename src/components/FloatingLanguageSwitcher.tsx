import { useState, useEffect } from 'react';
import { Globe, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷' },
  { code: 'om', name: 'Oromoo', flag: '🇪🇹' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
];

const FloatingLanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show when scrolling up or at top, hide when scrolling down
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
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
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden"></div>
      
      {/* Floating Button */}
      <div 
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        )}
      >
        {/* Language Options Panel */}
        <div 
          className={cn(
            "absolute bottom-16 right-0 bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-200",
            isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="p-2 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium px-2">Select Language</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={cn(
                  "w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-accent transition-colors",
                  currentLang === lang.code && "bg-accent"
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {currentLang === lang.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Floating Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105",
            isOpen && "bg-primary/90"
          )}
        >
          <div className="flex flex-col items-center gap-0.5">
            <Globe className="h-5 w-5" />
            <span className="text-[10px] font-medium">{getCurrentLanguage().flag}</span>
          </div>
        </Button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingLanguageSwitcher;
