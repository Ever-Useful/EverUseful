import express from 'express';
import cors from 'cors';
import multer from 'multer';
import profileRoutes from './routes/profileRoutes';
import quickActionsRoutes from './routes/quickActionsRoutes';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/quick-actions', quickActionsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app; 