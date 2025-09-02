// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence, signInWithPhoneNumber, RecaptchaVerifier, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// Removed Firestore import - using DynamoDB now
import { getStorage } from 'firebase/storage';
import { API_ENDPOINTS } from '../config/api';
import { setAuthCookie, setFirebaseRefreshCookie, deleteAuthCookie, deleteFirebaseRefreshCookie, clearAllCookies } from '../utils/cookieUtils';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgTOD0hI8J8-veGl7BFNCOTbIdp8Lgnlc",
  authDomain: "amogh-887e2.firebaseapp.com",
  projectId: "amogh-887e2",
  storageBucket: "amogh-887e2.firebasestorage.app",
  messagingSenderId: "554286104608",
  appId: "1:554286104608:web:245facf8db2fe4c42e7c45",
  measurementId: "G-JKKNWK1YX7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// Removed Firestore initialization - using DynamoDB now
export const auth = getAuth(app);
export const storage = getStorage(app);

// Configure Firebase Auth persistence based on user preference
export const configureAuthPersistence = async (useSessionPersistence: boolean = false) => {
  try {
    if (useSessionPersistence) {
      await setPersistence(auth, browserSessionPersistence);
    } else {
      await setPersistence(auth, browserLocalPersistence);
    }
  } catch (error) {
    console.error('Error setting auth persistence:', error);
    // Fallback to local persistence
    await setPersistence(auth, browserLocalPersistence);
  }
};

// Enhanced authentication with cookie management
export const handleGoogleAuth = async (navigate: (url: string) => void, userType: string = 'student', redirectPath?: string) => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const token = await userCredential.user.getIdToken();
  const refreshToken = userCredential.user.refreshToken;

  // Use the API configuration
  const apiUrl = API_ENDPOINTS.TOKEN;
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userType: userType, // Only used for new users, existing users keep their current userType
      firstName: (userCredential.user.displayName || '').split(' ')[0] || '',
      lastName: (userCredential.user.displayName || '').split(' ').slice(1).join(' ') || '',
      email: userCredential.user.email || undefined
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Set authentication cookies
  setAuthCookie(token);
  if (refreshToken) {
    setFirebaseRefreshCookie(refreshToken);
  }
  
  // Set localStorage to indicate user is logged in (for backward compatibility)
  localStorage.setItem("isLoggedIn", "true");
  // Mirror email signup localStorage behavior for parity
  const displayName = userCredential.user.displayName || '';
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  if (userType) localStorage.setItem('userType', userType);
  if (displayName) localStorage.setItem('userName', displayName);
  if (firstName) localStorage.setItem('userFirstName', firstName);
  if (lastName) localStorage.setItem('userLastName', lastName);
  window.dispatchEvent(new Event("storage"));
  
  // Use redirectPath if provided, otherwise use backend response
  navigate(redirectPath || data.redirectUrl);
};

export const handleGithubAuth = async (navigate: (url: string) => void, userType: string = 'student', redirectPath?: string) => {
  const provider = new GithubAuthProvider();
  provider.addScope('user:email');
  const userCredential = await signInWithPopup(auth, provider);
  const token = await userCredential.user.getIdToken();
  const refreshToken = userCredential.user.refreshToken;

  // Use the API configuration
  const apiUrl = API_ENDPOINTS.TOKEN;
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userType: userType, // Only used for new users, existing users keep their current userType
      firstName: (userCredential.user.displayName || '').split(' ')[0] || '',
      lastName: (userCredential.user.displayName || '').split(' ').slice(1).join(' ') || '',
      email: userCredential.user.email || undefined
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Set authentication cookies
  setAuthCookie(token);
  if (refreshToken) {
    setFirebaseRefreshCookie(refreshToken);
  }
  
  // Set localStorage to indicate user is logged in (for backward compatibility)
  localStorage.setItem("isLoggedIn", "true");
  // Mirror email signup localStorage behavior for parity
  const displayName = userCredential.user.displayName || '';
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  if (userType) localStorage.setItem('userType', userType);
  if (displayName) localStorage.setItem('userName', displayName);
  if (firstName) localStorage.setItem('userFirstName', firstName);
  if (lastName) localStorage.setItem('userLastName', lastName);
  window.dispatchEvent(new Event("storage"));
  
  // Use redirectPath if provided, otherwise use backend response
  navigate(redirectPath || data.redirectUrl);
};

export const loginWithEmailPassword = async (email: string, password: string): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const refreshToken = userCredential.user.refreshToken;
    
    // Set authentication cookies
    setAuthCookie(idTokenResult.token);
    if (refreshToken) {
      setFirebaseRefreshCookie(refreshToken);
    }
    
    return idTokenResult.token;
  } catch (error: any) {
    console.error("Error signing in with email and password:", error.code, error.message);
    throw error;
  }
};

// Phone authentication functions
export const sendPhoneOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    console.log('Attempting to send OTP to:', phoneNumber);
    console.log('reCAPTCHA verifier:', recaptchaVerifier);
    console.log('Auth instance:', auth);
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('OTP sent successfully:', confirmationResult);
    return confirmationResult;
  } catch (error: any) {
    console.error("Error sending phone OTP:", error.code, error.message);
    console.error("Full error object:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    // Provide more specific error messages
    if (error.code === 'auth/invalid-app-credential') {
      throw new Error('App verification failed. Please check Firebase configuration and refresh the page.');
    } else if (error.code === 'auth/captcha-check-failed') {
      throw new Error('reCAPTCHA verification failed. Please try again.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format. Please check and try again.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('Too many verification attempts. Please try again later.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please wait 5 minutes before trying again. This helps prevent abuse.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('Daily quota exceeded. Please try again tomorrow.');
    } else {
      throw new Error(`Verification failed: ${error.message}`);
    }
  }
};

export const verifyPhoneOTP = async (confirmationResult: any, otp: string) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result;
  } catch (error: any) {
    console.error("Error verifying phone OTP:", error.code, error.message);
    throw error;
  }
};

// Password reset function
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    console.error("Error sending password reset email:", error.code, error.message);
    throw error;
  }
};

// Email verification function
export const sendEmailVerificationLink = async (user: any) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error: any) {
    console.error("Error sending email verification:", error.code, error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Clear all cookies
    clearAllCookies();
    
    // Sign out from Firebase
    await auth.signOut();
    
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};