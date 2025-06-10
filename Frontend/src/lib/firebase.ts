// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore
export const auth = getAuth(app);
export { db }; 