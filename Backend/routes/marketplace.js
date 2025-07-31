const express = require('express');
const router = express.Router();
const authorize = require('../authorize');
const admin = require('firebase-admin');
const db = admin.firestore();
const dynamoDBService = require('../services/dynamoDBService');
const userService = require('../services/userService');

// Get all projects with optional search and filters
router.get('/projects', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, minRating, skills, duration, sort, page = 1, limit = 6 } = req.query;
    const projects = await dynamoDBService.getAllMarketplaceItems();
    let filteredProjects = [...projects];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (category) {
      filteredProjects = filteredProjects.filter(project => project.category === category);
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      filteredProjects = filteredProjects.filter(project => {
        if (minPrice && project.price < parseInt(minPrice)) return false;
        if (maxPrice && project.price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    // Apply rating filter
    if (minRating) {
      filteredProjects = filteredProjects.filter(project => project.rating >= parseFloat(minRating));
    }

    // Apply skills filter
    if (skills) {
      const skillsList = skills.split(',');
      filteredProjects = filteredProjects.filter(project =>
        skillsList.some(skill => project.skills.includes(skill))
      );
    }

    // Apply duration filter
    if (duration) {
      filteredProjects = filteredProjects.filter(project => project.duration === duration);
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'recent':
          filteredProjects.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
          break;
        case 'rating':
          filteredProjects.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_asc':
          filteredProjects.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProjects.sort((a, b) => b.price - a.price);
          break;
        default:
          // Default to most recent if sort is invalid
          filteredProjects.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
      }
    } else {
      // Default to most recent if no sort specified
      filteredProjects.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const totalProjects = filteredProjects.length;
    const totalPages = Math.ceil(totalProjects / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex).map(project => {
      // Only return author as customUserId
      return { ...project, author: project.author };
    });
    res.json({ 
      projects: paginatedProjects,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProjects,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Increment view count for a project
router.post('/projects/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await dynamoDBService.getMarketplaceItem(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment views
    const updatedProject = await dynamoDBService.updateMarketplaceItem(id, {
      views: (project.views || 0) + 1
    });

    res.json({ views: updatedProject.views });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle favorite for a project
router.post('/projects/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const data = await readMarketplaceData();
    const project = data.projects.find(p => p.id === parseInt(id));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Initialize favorites array if it doesn't exist
    if (!project.favoritedBy) {
      project.favoritedBy = [];
    }

    const favoriteIndex = project.favoritedBy.indexOf(userId);
    if (favoriteIndex === -1) {
      // Add to favorites
      project.favoritedBy.push(userId);
    } else {
      // Remove from favorites
      project.favoritedBy.splice(favoriteIndex, 1);
    }

    await writeMarketplaceData(data);
    res.json({ 
      isFavorited: favoriteIndex === -1,
      favoritedBy: project.favoritedBy
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get project details by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readMarketplaceData();
    const project = data.projects.find(p => p.id === parseInt(id));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle like for a project
router.post('/projects/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const data = await readMarketplaceData();
    const project = data.projects.find(p => p.id === parseInt(id));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const likeIndex = project.likedBy.indexOf(userId);
    if (likeIndex === -1) {
      // Add like
      project.likedBy.push(userId);
      project.likes += 1;
    } else {
      // Remove like
      project.likedBy.splice(likeIndex, 1);
      project.likes -= 1;
    }

    await writeMarketplaceData(data);
    res.json({ 
      likes: project.likes, 
      likedBy: project.likedBy,
      isLiked: likeIndex === -1 
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new project
router.post('/projects', authorize, async (req, res) => {
  try {
    const marketplaceData = await readMarketplaceData();
    const userData = await readUserData();
    
    const newProject = {
      id: marketplaceData.projects.length > 0 ? Math.max(...marketplaceData.projects.map(p => p.id)) + 1 : 1,
      ...req.body,
      rating: 0,
      reviews: 0,
      posted: new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString(),
      views: 0,
      favoritedBy: []
    };
    
    // Add author details from user data
    const user = userData.users[req.body.customUserId];
    if (user) {
      newProject.author = req.body.customUserId;
    }

    marketplaceData.projects.push(newProject);
    await writeMarketplaceData(marketplaceData);
    
    // Update user's project list
    if (user) {
      user.projects.created.push(newProject.id);
      user.stats.projectsCount = (user.stats.projectsCount || 0) + 1;
      await writeUserData(userData);
    }
    
    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project
router.delete('/projects/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);
    
    const marketplaceData = await readMarketplaceData();
    const userData = await readUserData();

    const projectIndex = marketplaceData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = marketplaceData.projects[projectIndex];
    const customUserId = project.customUserId;

    // Verify that the user deleting the project is the author
    const userRef = await db.collection('users').doc(req.user.uid).get();
    if (!userRef.exists || userRef.data().customUserId !== customUserId) {
      return res.status(403).json({ error: 'You are not authorized to delete this project' });
    }

    // Remove project from marketplace
    marketplaceData.projects.splice(projectIndex, 1);
    await writeMarketplaceData(marketplaceData);

    // Remove project from user's created list
    const user = userData.users[customUserId];
    if (user) {
      user.projects.created = user.projects.created.filter(pId => pId !== projectId);
      user.stats.projectsCount = Math.max(0, (user.stats.projectsCount || 0) - 1);
      await writeUserData(userData);
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit (update) a project
router.put('/projects/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);
    const marketplaceData = await readMarketplaceData();
    const userData = await readUserData();

    const projectIndex = marketplaceData.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = marketplaceData.projects[projectIndex];
    const customUserId = project.customUserId;

    // Verify that the user editing the project is the author
    const userRef = await db.collection('users').doc(req.user.uid).get();
    if (!userRef.exists || userRef.data().customUserId !== customUserId) {
      return res.status(403).json({ error: 'You are not authorized to edit this project' });
    }

    // Update allowed fields only
    const allowedFields = [
      'title', 'description', 'category', 'price', 'duration', 'status', 'tags', 'skills', 'image', 'attachments'
    ];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Save changes
    marketplaceData.projects[projectIndex] = project;
    await writeMarketplaceData(marketplaceData);

    res.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 