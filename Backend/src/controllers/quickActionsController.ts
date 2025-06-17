import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { 
  doc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { uploadImage } from '../utils/imageUpload';

export class QuickActionsController {
  // Project Methods
  async createProject(req: Request, res: Response) {
    try {
      const { title, description, category, tags, projectLink, githubLink } = req.body;
      const imageFile = req.file;
      const userId = req.user?.uid;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, `projects/${userId}`);
      }

      const projectData = {
        title,
        description,
        category,
        tags: tags.split(',').map((tag: string) => tag.trim()),
        projectLink,
        githubLink,
        imageUrl,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        status: 'Planning',
        progress: 0,
        collaborators: 0
      };

      const projectRef = await addDoc(collection(db, 'projects'), projectData);
      
      // Update user's project count
      await updateDoc(doc(db, 'users', userId), {
        'stats.projects': increment(1)
      });

      res.status(201).json({ 
        message: "Project created successfully",
        projectId: projectRef.id,
        ...projectData
      });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProjects(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      const projectsQuery = query(
        collection(db, 'projects'),
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(projectsQuery);
      const projects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const projectDoc = await getDoc(doc(db, 'projects', projectId));

      if (!projectDoc.exists()) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.status(200).json({
        id: projectDoc.id,
        ...projectDoc.data()
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const updates = req.body;
      const imageFile = req.file;

      if (imageFile) {
        updates.imageUrl = await uploadImage(imageFile, `projects/${projectId}`);
      }

      await updateDoc(doc(db, 'projects', projectId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({ message: "Project updated successfully" });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const userId = req.user?.uid;

      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (!projectDoc.exists()) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (projectDoc.data().createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this project" });
      }

      await deleteDoc(doc(db, 'projects', projectId));
      
      // Update user's project count
      await updateDoc(doc(db, 'users', userId), {
        'stats.projects': increment(-1)
      });

      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Collaborator Methods
  async searchCollaborators(req: Request, res: Response) {
    try {
      const { searchTerm, skills } = req.query;
      const userId = req.user?.uid;

      let usersQuery = query(
        collection(db, 'users'),
        where('type', 'in', ['student', 'professor'])
      );

      if (searchTerm) {
        usersQuery = query(
          usersQuery,
          where('name', '>=', searchTerm),
          where('name', '<=', searchTerm + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(usersQuery);
      let users = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.id !== userId);

      if (skills) {
        const skillsArray = (skills as string).split(',').map(s => s.trim());
        users = users.filter(user => 
          skillsArray.some(skill => user.skills?.includes(skill))
        );
      }

      res.status(200).json(users);
    } catch (error) {
      console.error("Error searching collaborators:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async connectWithUser(req: Request, res: Response) {
    try {
      const { targetUserId } = req.body;
      const userId = req.user?.uid;

      if (!userId || !targetUserId) {
        return res.status(400).json({ message: "Invalid user IDs" });
      }

      // Update both users' connections
      await updateDoc(doc(db, 'users', targetUserId), {
        followers: arrayUnion(userId)
      });

      await updateDoc(doc(db, 'users', userId), {
        following: arrayUnion(targetUserId),
        'stats.following': increment(1)
      });

      res.status(200).json({ message: "Connection established successfully" });
    } catch (error) {
      console.error("Error connecting with user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getConnections(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = userDoc.data();
      const connections = {
        followers: userData.followers || [],
        following: userData.following || []
      };

      res.status(200).json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Meeting Methods
  async scheduleMeeting(req: Request, res: Response) {
    try {
      const { title, date, time, participants } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const meetingId = Math.random().toString(36).substring(2, 15);
      const meetingLink = `https://meet.google.com/${meetingId}`;

      const meetingData = {
        title,
        date,
        time,
        meetingId,
        meetingLink,
        participants: participants ? participants.split(',').map((email: string) => email.trim()) : [],
        createdBy: userId,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      };

      const meetingRef = await addDoc(collection(db, 'meetings'), meetingData);

      res.status(201).json({
        message: "Meeting scheduled successfully",
        meetingId: meetingRef.id,
        ...meetingData
      });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getMeetings(req: Request, res: Response) {
    try {
      const userId = req.user?.uid;
      const meetingsQuery = query(
        collection(db, 'meetings'),
        where('createdBy', '==', userId),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(meetingsQuery);
      const meetings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getMeeting(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;
      const meetingDoc = await getDoc(doc(db, 'meetings', meetingId));

      if (!meetingDoc.exists()) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      res.status(200).json({
        id: meetingDoc.id,
        ...meetingDoc.data()
      });
    } catch (error) {
      console.error("Error fetching meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateMeeting(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;
      const updates = req.body;

      await updateDoc(doc(db, 'meetings', meetingId), {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({ message: "Meeting updated successfully" });
    } catch (error) {
      console.error("Error updating meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteMeeting(req: Request, res: Response) {
    try {
      const { meetingId } = req.params;
      const userId = req.user?.uid;

      const meetingDoc = await getDoc(doc(db, 'meetings', meetingId));
      if (!meetingDoc.exists()) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      if (meetingDoc.data().createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this meeting" });
      }

      await deleteDoc(doc(db, 'meetings', meetingId));
      res.status(200).json({ message: "Meeting deleted successfully" });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
} 