import { auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface FirestoreUser {
  customUserId: string;
  name: string;
  email: string;
  photo: string;
  provider: string;
  userType: string;
  createdAt: string;
}



// export const firestoreService = new FirestoreService();
// export default firestoreService; 