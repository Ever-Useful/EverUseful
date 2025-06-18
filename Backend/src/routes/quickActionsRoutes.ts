import express from 'express';
import { auth } from '../middleware/auth';
import { QuickActionsController } from '../controllers/quickActionsController';
import multer from 'multer';

const router = express.Router();
const quickActionsController = new QuickActionsController();
const upload = multer({ storage: multer.memoryStorage() });

// Project routes
router.post('/projects', auth, upload.single('image'), quickActionsController.createProject);
router.get('/projects', auth, quickActionsController.getProjects);
router.get('/projects/:projectId', auth, quickActionsController.getProject);
router.put('/projects/:projectId', auth, quickActionsController.updateProject);
router.delete('/projects/:projectId', auth, quickActionsController.deleteProject);

// Collaborator routes
router.get('/collaborators', auth, quickActionsController.searchCollaborators);
router.post('/collaborators/connect', auth, quickActionsController.connectWithUser);
router.get('/collaborators/connections', auth, quickActionsController.getConnections);

// Meeting routes
router.post('/meetings', auth, quickActionsController.scheduleMeeting);
router.get('/meetings', auth, quickActionsController.getMeetings);
router.get('/meetings/:meetingId', auth, quickActionsController.getMeeting);
router.put('/meetings/:meetingId', auth, quickActionsController.updateMeeting);
router.delete('/meetings/:meetingId', auth, quickActionsController.deleteMeeting);

export default router; 