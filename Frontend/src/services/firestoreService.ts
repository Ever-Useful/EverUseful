import { auth, db } from '../lib/firebase';
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

class FirestoreService {
  // Get current user's data from Firestore
  async getCurrentUserData(): Promise<FirestoreUser | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const userDoc = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        return userSnap.data() as FirestoreUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
      throw error;
    }
  }

  // Get user data by Firebase UID
  async getUserDataByUid(uid: string): Promise<FirestoreUser | null> {
    try {
      const userDoc = doc(db, 'users', uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        return userSnap.data() as FirestoreUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data by UID:', error);
      throw error;
    }
  }

  // Set or update current user's data in Firestore
  async setCurrentUserData(data: Partial<FirestoreUser>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, data, { merge: true });
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService; 