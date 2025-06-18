import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export type ActivityType = 'collaboration' | 'milestone' | 'profile' | 'project' | 'meeting' | 'skill';

export const addActivity = async (
  userId: string,
  type: ActivityType,
  message: string
) => {
  try {
    console.log('Adding activity:', { userId, type, message });
    
    const activityData = {
      userId,
      type,
      message,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleString()
    };

    console.log('Activity data to save:', activityData);
    
    const docRef = await addDoc(collection(db, 'activities'), activityData);
    console.log('Activity added successfully with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error; // Re-throw the error so the calling function can handle it
  }
}; 