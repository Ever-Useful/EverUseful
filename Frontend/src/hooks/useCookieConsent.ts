import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookieUtils';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface UseCookieConsentReturn {
  hasConsented: boolean;
  consentType: 'all' | 'custom' | 'rejected' | null;
  preferences: CookiePreferences;
  updatePreferences: (newPreferences: Partial<CookiePreferences>) => void;
  setConsent: (type: 'all' | 'custom' | 'rejected', prefs?: CookiePreferences) => void;
  canUseCookie: (type: keyof CookiePreferences) => boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false
};

export const useCookieConsent = (): UseCookieConsentReturn => {
  const [hasConsented, setHasConsented] = useState(false);
  const [consentType, setConsentType] = useState<'all' | 'custom' | 'rejected' | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check for existing consent
    const consent = getCookie('cookie_consent');
    const prefs = getCookie('cookie_preferences');

    if (consent) {
      setHasConsented(true);
      setConsentType(consent as 'all' | 'custom' | 'rejected');
      
      if (prefs) {
        try {
          const parsedPrefs = JSON.parse(prefs);
          setPreferences(parsedPrefs);
        } catch (error) {
          console.error('Error parsing cookie preferences:', error);
          setPreferences(defaultPreferences);
        }
      }
    }
  }, []);

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPrefs = { ...preferences, ...newPreferences };
    setPreferences(updatedPrefs);
    
    // Update cookie if user has already consented
    if (hasConsented) {
      setCookie('cookie_preferences', JSON.stringify(updatedPrefs), { expires: 365 });
    }
  };

  const setConsent = (type: 'all' | 'custom' | 'rejected', prefs?: CookiePreferences) => {
    setHasConsented(true);
    setConsentType(type);
    
    if (prefs) {
      setPreferences(prefs);
    } else if (type === 'all') {
      setPreferences({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true
      });
    } else if (type === 'rejected') {
      setPreferences({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false
      });
    }

    // Save to cookies
    setCookie('cookie_consent', type, { expires: 365 });
    setCookie('cookie_preferences', JSON.stringify(preferences), { expires: 365 });
  };

  const canUseCookie = (type: keyof CookiePreferences): boolean => {
    if (type === 'essential') return true; // Essential cookies are always allowed
    
    if (!hasConsented) return false; // No consent given
    
    if (consentType === 'all') return true; // All cookies accepted
    
    if (consentType === 'custom') return preferences[type]; // Check specific preference
    
    if (consentType === 'rejected') return false; // All non-essential rejected
    
    return false; // Default to false
  };

  return {
    hasConsented,
    consentType,
    preferences,
    updatePreferences,
    setConsent,
    canUseCookie
  };
}; 