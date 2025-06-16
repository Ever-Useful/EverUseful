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
    const { search, category, minPrice, maxPrice, minRating, skills, duration, sort } = req.query;
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

    res.json({ projects });
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

module.exports = router; 