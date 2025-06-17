import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";
import toast from "react-hot-toast";

export type StatType = 'followers' | 'following' | 'projects' | 'likes';

export const updateUserStats = async (userId: string, statType: StatType, action: 'increment' | 'decrement') => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`stats.${statType}`]: increment(action === 'increment' ? 1 : -1)
    });
    return true;
  } catch (error) {
    console.error(`Error updating ${statType}:`, error);
    toast.error(`Failed to update ${statType}`);
    return false;
  }
};

// Helper functions for specific stat updates
export const incrementFollowers = (userId: string) => updateUserStats(userId, 'followers', 'increment');
export const decrementFollowers = (userId: string) => updateUserStats(userId, 'followers', 'decrement');
export const incrementFollowing = (userId: string) => updateUserStats(userId, 'following', 'increment');
export const decrementFollowing = (userId: string) => updateUserStats(userId, 'following', 'decrement');
export const incrementProjects = (userId: string) => updateUserStats(userId, 'projects', 'increment');
export const decrementProjects = (userId: string) => updateUserStats(userId, 'projects', 'decrement');
export const incrementLikes = (userId: string) => updateUserStats(userId, 'likes', 'increment');
export const decrementLikes = (userId: string) => updateUserStats(userId, 'likes', 'decrement'); 