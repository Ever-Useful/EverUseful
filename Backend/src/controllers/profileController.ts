import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { uploadImage } from '../utils/imageUpload';

export class ProfileController {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (!userDoc.exists()) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = userDoc.data();
      res.status(200).json(userData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      await updateDoc(doc(db, "users", userId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update profile stats
  async updateStats(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { stats } = req.body;
      
      await updateDoc(doc(db, "users", userId), {
        stats: {
          ...stats,
          updatedAt: new Date().toISOString()
        }
      });

      res.status(200).json({ message: "Stats updated successfully" });
    } catch (error) {
      console.error("Error updating stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Upload profile avatar
  async uploadAvatar(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = await uploadImage(imageFile, `avatars/${userId}`);
      
      await updateDoc(doc(db, "users", userId), {
        avatar: imageUrl,
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Upload background image
  async uploadBackground(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const imageFile = req.file;

      if (!imageFile) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = await uploadImage(imageFile, `backgrounds/${userId}`);
      
      await updateDoc(doc(db, "users", userId), {
        backgroundImage: imageUrl,
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("Error uploading background:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Toggle follow/unfollow
  async toggleFollow(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { followerId } = req.body;

      const userRef = doc(db, "users", userId);
      const followerRef = doc(db, "users", followerId);

      const userDoc = await getDoc(userRef);
      const followerDoc = await getDoc(followerRef);

      if (!userDoc.exists() || !followerDoc.exists()) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = userDoc.data();
      const isFollowing = userData.followers?.includes(followerId);

      if (isFollowing) {
        // Unfollow
        await updateDoc(userRef, {
          followers: arrayRemove(followerId)
        });
        await updateDoc(followerRef, {
          following: arrayRemove(userId)
        });
      } else {
        // Follow
        await updateDoc(userRef, {
          followers: arrayUnion(followerId)
        });
        await updateDoc(followerRef, {
          following: arrayUnion(userId)
        });
      }

      res.status(200).json({ 
        message: isFollowing ? "Unfollowed successfully" : "Followed successfully" 
      });
    } catch (error) {
      console.error("Error toggling follow:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get user's followers
  async getFollowers(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (!userDoc.exists()) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = userDoc.data();
      const followers = userData.followers || [];

      const followersData = await Promise.all(
        followers.map(async (followerId: string) => {
          const followerDoc = await getDoc(doc(db, "users", followerId));
          return followerDoc.data();
        })
      );

      res.status(200).json(followersData);
    } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get user's following
  async getFollowing(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (!userDoc.exists()) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = userDoc.data();
      const following = userData.following || [];

      const followingData = await Promise.all(
        following.map(async (followingId: string) => {
          const followingDoc = await getDoc(doc(db, "users", followingId));
          return followingDoc.data();
        })
      );

      res.status(200).json(followingData);
    } catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
} 