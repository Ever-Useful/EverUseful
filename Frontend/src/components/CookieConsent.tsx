import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { setCookie, getCookie } from '../utils/cookieUtils';

interface CookieConsentProps {
  onClose?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the banner today
    const hasSeenBanner = getCookie('cookie_banner_seen');
    const today = new Date().toDateString();
    
    if (!hasSeenBanner || hasSeenBanner !== today) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Set cookie to remember user has seen the banner today
    const today = new Date().toDateString();
    setCookie('cookie_banner_seen', today, { expires: 1 }); // 1 day
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-gray-800 border-t border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Main Content */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 leading-tight">
                Cookies & Your Privacy
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                We use cookies to improve your browsing experience and provide tailored content. 
                By continuing to browse, you agree to our{' '}
                <a 
                  href="/cookie-policy" 
                  className="text-white underline hover:text-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cookie policy
                </a>
                . For more information, please review our{' '}
                <a 
                  href="/terms-conditions" 
                  className="text-white underline hover:text-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-white underline hover:text-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* Action Buttons - Better mobile alignment */}
          <div className="flex items-center justify-end gap-2 sm:flex-shrink-0">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Got it
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 