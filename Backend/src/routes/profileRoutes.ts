import express from 'express';
import { auth } from '../middleware/auth';
import { ProfileController } from '../controllers/profileController';
import { addProject, getRecentProjects, updateProject, deleteProject } from '../profile';

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

// Project routes
router.post('/projects', auth, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const project = await addProject(userId, req.body);
    if (!project) {
      return res.status(400).json({ message: 'Failed to create project' });
    }

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/projects', auth, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projects = await getRecentProjects(userId);
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/projects/:projectId', auth, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const project = await updateProject(userId, req.params.projectId, req.body);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/projects/:projectId', auth, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const success = await deleteProject(userId, req.params.projectId);
    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 