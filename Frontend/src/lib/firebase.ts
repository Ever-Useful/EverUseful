// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
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
  measurementId: "G-LD19BYSZ75"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore
export const auth =  getAuth(app);
export { db }; 
export const storage = getStorage(app);

const API_BASE_URL = 'http://localhost:3001';

export const handleGoogleAuth = async (navigate: (url: string) => void) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();

    // Create or update user profile
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Navigate to profile page after successful authentication
    navigate('/profile');
  } catch (error) {
    console.error("Error during Google auth:", error);
    throw error;
  }
};

export const handleGithubAuth = async (navigate: (url: string) => void) => {
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();

    // Create or update user profile
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Navigate to profile page after successful authentication
    navigate('/profile');
  } catch (error) {
    console.error("Error during Github auth:", error);
    throw error;
  }
};

export const loginWithEmailPassword = async (email: string, password: string): Promise<string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idTokenResult = await userCredential.user.getIdTokenResult();
    return idTokenResult.token;
  } catch (error: any) {
    console.error("Error signing in with email and password:", error.code, error.message);
    throw error;
  }
};

export const logout = async () => {
  return await auth.signOut();
}