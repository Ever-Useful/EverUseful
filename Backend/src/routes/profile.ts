import express from 'express';
import { verifyToken } from '../middleware/auth';
import { 
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addProjectToRecent,
  createOrUpdateUserProfile,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill
} from '../services/profile';

const router = express.Router();

// Profile routes
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const profileData = {
      email: req.body.email,
      displayName: req.body.displayName,
      photoURL: req.body.photoURL,
    };

    const profile = await createOrUpdateUserProfile(userId, profileData);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
});

// Project routes
router.post('/projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const projectData = req.body;
    const project = await createProject(userId, projectData);
    await addProjectToRecent(userId, project.id);
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.get('/projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const projects = await getProjects(userId);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.put('/projects/:projectId', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { projectId } = req.params;
    const projectData = req.body;
    
    const updatedProject = await updateProject(userId, projectId, projectData);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:projectId', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { projectId } = req.params;
    await deleteProject(userId, projectId);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Skills routes
router.get('/skills', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const skills = await getSkills(userId);
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/skills', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    console.log('Received skill creation request for user:', userId);
    console.log('Request body:', req.body);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const skillData = req.body;
    console.log('Skill data to add:', skillData);

    const skill = await addSkill(userId, skillData);
    console.log('Skill added successfully:', skill);

    res.status(201).json(skill);
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

router.put('/skills/:skillId', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { skillId } = req.params;
    const skillData = req.body;
    const updatedSkill = await updateSkill(userId, skillId, skillData);
    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/skills/:skillId', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { skillId } = req.params;
    await deleteSkill(userId, skillId);
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router; 