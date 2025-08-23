// Cookie utility functions for managing authentication, cart, and other essential cookies

interface CookieOptions {
  expires?: number; // days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean; // Note: httpOnly can only be set server-side
}

// Set a cookie with options
export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  const {
    expires = 30, // default 30 days
    path = '/',
    domain,
    secure = true,
    sameSite = 'Lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  if (sameSite) cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

// Get a cookie value by name
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

// Delete a cookie
export const deleteCookie = (name: string, path = '/') => {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
};

// Check if cookies are enabled
export const areCookiesEnabled = (): boolean => {
  try {
    setCookie('test', 'test');
    const enabled = getCookie('test') === 'test';
    deleteCookie('test');
    return enabled;
  } catch (e) {
    return false;
  }
};

// Authentication cookies
export const setAuthCookie = (value: string) => {
  setCookie('auth_session', value, { expires: 30, secure: true, sameSite: 'Lax' });
};

export const getAuthCookie = (): string | null => {
  return getCookie('auth_session');
};

export const deleteAuthCookie = () => {
  deleteCookie('auth_session');
};

// Firebase refresh token cookie
export const setFirebaseRefreshCookie = (value: string) => {
  setCookie('firebase_refresh_token', value, { expires: 90, secure: true, sameSite: 'Lax' });
};

export const getFirebaseRefreshCookie = (): string | null => {
  return getCookie('firebase_refresh_token');
};

export const deleteFirebaseRefreshCookie = () => {
  deleteCookie('firebase_refresh_token');
};

// Cart session cookie
export const setCartCookie = (value: string) => {
  setCookie('cart_session', value, { expires: 7, secure: true, sameSite: 'Lax' });
};

export const getCartCookie = (): string | null => {
  return getCookie('cart_session');
};

export const deleteCartCookie = () => {
  deleteCookie('cart_session');
};

// Recent activity cookie
export const setRecentActivityCookie = (value: string) => {
  setCookie('recent_activity', value, { expires: 30, secure: true, sameSite: 'Lax' });
};

export const getRecentActivityCookie = (): string | null => {
  return getCookie('recent_activity');
};

export const deleteRecentActivityCookie = () => {
  deleteCookie('recent_activity');
};

// CSRF token cookie
export const setCSRFTokenCookie = (value: string) => {
  setCookie('csrf_token', value, { expires: 1, secure: true, sameSite: 'Strict' });
};

export const getCSRFTokenCookie = (): string | null => {
  return getCookie('csrf_token');
};

export const deleteCSRFTokenCookie = () => {
  deleteCookie('csrf_token');
};

// Clear all cookies (useful for logout)
export const clearAllCookies = () => {
  deleteAuthCookie();
  deleteFirebaseRefreshCookie();
  deleteCartCookie();
  deleteRecentActivityCookie();
  deleteCSRFTokenCookie();
  deleteCookie('cookie_banner_seen');
}; 