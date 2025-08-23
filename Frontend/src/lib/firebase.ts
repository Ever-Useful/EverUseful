// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, inMemoryPersistence } from "firebase/auth";
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
  apiKey: "AIzaSyAx1XlxKo6DtdIMAS-5T8hll11WgCdCXSU",
  authDomain: "amogh-2a435.firebaseapp.com",
  projectId: "amogh-2a435",
  storageBucket: "amogh-2a435.firebasestorage.app",
  messagingSenderId: "112791364084",
  appId: "1:112791364084:web:ea167f2a8a4e33007b99a1",
  measurementId: "G-LD19DYSZ75"
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