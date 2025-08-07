import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately
    const scrollToTopInstant = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });

      // Fallback for browsers that don't support smooth scrolling
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Execute immediately
    scrollToTopInstant();

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      scrollToTopInstant();
    });

    // Additional timeout fallback
    const timeoutId = setTimeout(() => {
      scrollToTopInstant();
    }, 0);

    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;