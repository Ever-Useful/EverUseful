import express from 'express';
import { auth } from '../middleware/auth';
import { ProfileController } from '../controllers/profileController';

const router = express.Router();
const profileController = new ProfileController();

// Get user profile
router.get('/:userId', auth, profileController.getProfile);

// Update user profile
router.put('/:userId', auth, profileController.updateProfile);

// Update profile stats
router.patch('/:userId/stats', auth, profileController.updateStats);

// Upload profile image
router.post('/:userId/avatar', auth, profileController.uploadAvatar);

// Upload background image
router.post('/:userId/background', auth, profileController.uploadBackground);

// Follow/Unfollow user
router.post('/:userId/follow', auth, profileController.toggleFollow);

// Get user's followers
router.get('/:userId/followers', auth, profileController.getFollowers);

// Get user's following
router.get('/:userId/following', auth, profileController.getFollowing);

export default router; 