const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Helper function to read marketplace data
const readMarketplaceData = async () => {
  const data = await fs.readFile(path.join(__dirname, '../data/marketplace.json'), 'utf8');
  return JSON.parse(data);
};

// Helper function to write marketplace data
const writeMarketplaceData = async (data) => {
  await fs.writeFile(
    path.join(__dirname, '../data/marketplace.json'),
    JSON.stringify(data, null, 2),
    'utf8'
  );
};

// Get all projects with optional search and filters
router.get('/projects', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, minRating, skills, duration, sort, page = 1, limit = 6 } = req.query;
    const data = await readMarketplaceData();
    let projects = [...data.projects];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (category) {
      projects = projects.filter(project => project.category === category);
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      projects = projects.filter(project => {
        if (minPrice && project.price < parseInt(minPrice)) return false;
        if (maxPrice && project.price > parseInt(maxPrice)) return false;
        return true;
      });
    }

    // Apply rating filter
    if (minRating) {
      projects = projects.filter(project => project.rating >= parseFloat(minRating));
    }

    // Apply skills filter
    if (skills) {
      const skillsList = skills.split(',');
      projects = projects.filter(project =>
        skillsList.some(skill => project.skills.includes(skill))
      );
    }

    // Apply duration filter
    if (duration) {
      projects = projects.filter(project => project.duration === duration);
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'recent':
          projects.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
          break;
        case 'rating':
          projects.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_asc':
          projects.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          projects.sort((a, b) => b.price - a.price);
          break;
        default:
          // Default to most recent if sort is invalid
          projects.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
      }
    } else {
      // Default to most recent if no sort specified
      projects.sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime());
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const totalProjects = projects.length;
    const totalPages = Math.ceil(totalProjects / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProjects = projects.slice(startIndex, endIndex);

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
    const data = await readMarketplaceData();
    const project = data.projects.find(p => p.id === parseInt(id));

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment views
    project.views += 1;
    await writeMarketplaceData(data);

    res.json({ views: project.views });
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
router.post('/projects', async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      images,
      category,
      price,
      duration,
      status,
      posted,
      teamSize,
      tags,
      skills,
      features,
      techStack,
      deliverables,
      customUserId // required for author
    } = req.body;

    // Enforce required fields
    if (!title || !description || !price || !category || !customUserId) {
      return res.status(400).json({ error: 'Title, description, price, category, and customUserId are required' });
    }

    // Load marketplace data
    const data = await readMarketplaceData();
    // Load user data
    const userService = require('../services/userService');
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new project id
    const newId = data.projects.length > 0 ? Math.max(...data.projects.map(p => p.id)) + 1 : 1;

    // Build author object from user profile
    const authorProfile = user.profile || {};
    const author = {
      name: authorProfile.title || 'Unknown',
      image: authorProfile.avatar || null,
      verified: true,
      rating: 0,
      projects: user.projects?.count || 0,
      bio: authorProfile.bio || null
    };

    // Build new project object
    const newProject = {
      id: newId,
      title,
      description,
      image: image || null,
      images: images || [],
      category,
      price,
      duration: duration || null,
      rating: 0,
      reviews: 0,
      likes: 0,
      views: 0,
      author,
      status: 'active',
      posted: posted || new Date().toISOString().split('T')[0],
      teamSize: teamSize || null,
      tags: tags || [],
      skills: skills || [],
      features: features || [],
      techStack: techStack || [],
      deliverables: deliverables || [],
      favoritedBy: []
    };

    data.projects.push(newProject);
    await writeMarketplaceData(data);

    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error('Error creating new project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customUserId } = req.body; // Get the user who owns the project

    if (!customUserId) {
      return res.status(400).json({ error: 'customUserId is required' });
    }

    console.log(`=== DELETE PROJECT DEBUGGING ===`);
    console.log(`Deleting project ID: ${id}`);
    console.log(`User ID: ${customUserId}`);

    // Load marketplace data
    const data = await readMarketplaceData();
    const projectIndex = data.projects.findIndex(p => p.id === parseInt(id));

    if (projectIndex === -1) {
      console.log('Project not found in marketplace.json');
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = data.projects[projectIndex];
    console.log(`Found project: ${project.title}`);

    // Verify the user owns this project (check author name matches user profile)
    const userService = require('../services/userService');
    await userService.loadUserData();
    const user = userService.findUserByCustomId(customUserId);
    
    if (!user) {
      console.log('User not found in userData.json');
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user owns this project (by checking if project ID is in their created list)
    if (!user.projects.created.includes(parseInt(id))) {
      console.log('User does not own this project');
      return res.status(403).json({ error: 'You can only delete your own projects' });
    }

    // Remove project from marketplace.json
    data.projects.splice(projectIndex, 1);
    await writeMarketplaceData(data);
    console.log('Project removed from marketplace.json');

    // Remove project ID from user's created projects list
    const projectIdIndex = user.projects.created.indexOf(parseInt(id));
    if (projectIdIndex !== -1) {
      user.projects.created.splice(projectIdIndex, 1);
      user.projects.count = Math.max(0, user.projects.count - 1);
      user.stats.projectsCount = Math.max(0, user.stats.projectsCount - 1);
      await userService.saveUserData();
      console.log('Project ID removed from user\'s created projects list');
    }

    console.log(`=== END DELETE PROJECT DEBUGGING ===`);

    res.json({ 
      success: true, 
      message: 'Project deleted successfully',
      deletedProjectId: parseInt(id)
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 