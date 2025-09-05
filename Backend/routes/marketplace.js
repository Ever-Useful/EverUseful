const express = require('express');
const router = express.Router();
const authorize = require('../authorize');
const dynamoDBService = require('../services/dynamoDBService');
const userService = require('../services/userService');

// Safely import S3 service
let s3Service;
try {
  s3Service = require('../services/s3Service');
} catch (error) {
  console.warn('S3 service not available, S3 deletion will be skipped:', error.message);
  s3Service = null;
}

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
        project.title?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        (Array.isArray(project.tags) && project.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Apply category filter
    if (category) {
      filteredProjects = filteredProjects.filter(project => project.category && project.category === category);
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      filteredProjects = filteredProjects.filter(project => {
        if (minPrice && (!project.price || project.price < parseInt(minPrice))) return false;
        if (maxPrice && (!project.price || project.price > parseInt(maxPrice))) return false;
        return true;
      });
    }

    // Apply rating filter
    if (minRating) {
      filteredProjects = filteredProjects.filter(project => project.rating && project.rating >= parseFloat(minRating));
    }

    // Apply skills filter
    if (skills) {
      const skillsList = skills.split(',');
      filteredProjects = filteredProjects.filter(project =>
        Array.isArray(project.skills) && skillsList.some(skill => project.skills.includes(skill))
      );
    }

    // Apply duration filter
    if (duration) {
      filteredProjects = filteredProjects.filter(project => project.duration && project.duration === duration);
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'recent':
          filteredProjects.sort((a, b) => {
            const dateA = a.posted ? new Date(a.posted).getTime() : 0;
            const dateB = b.posted ? new Date(b.posted).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'rating':
          filteredProjects.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'price_asc':
          filteredProjects.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price_desc':
          filteredProjects.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        default:
          // Default to most recent if sort is invalid
          filteredProjects.sort((a, b) => {
            const dateA = a.posted ? new Date(a.posted).getTime() : 0;
            const dateB = b.posted ? new Date(b.posted).getTime() : 0;
            return dateB - dateA;
          });
      }
    } else {
      // Default to most recent if no sort specified
      filteredProjects.sort((a, b) => {
        const dateA = a.posted ? new Date(a.posted).getTime() : 0;
        const dateB = b.posted ? new Date(b.posted).getTime() : 0;
        return dateB - dateA;
      });
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const totalProjects = filteredProjects.length;
    const totalPages = Math.ceil(totalProjects / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex).map(project => {
      // Only return author as customUserId, ensure author exists
      return { ...project, author: project.author || '' };
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

    const project = await dynamoDBService.getMarketplaceItem(id);

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

    await dynamoDBService.updateMarketplaceItem(id, { favoritedBy: project.favoritedBy });
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
    const project = await dynamoDBService.getMarketplaceItem(id);

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

    const project = await dynamoDBService.getMarketplaceItem(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Initialize likedBy array if it doesn't exist
    if (!project.likedBy) {
      project.likedBy = [];
    }

    const likeIndex = project.likedBy.indexOf(userId);
    if (likeIndex === -1) {
      // Add like
      project.likedBy.push(userId);
      project.likes = (project.likes || 0) + 1;
    } else {
      // Remove like
      project.likedBy.splice(likeIndex, 1);
      project.likes = Math.max(0, (project.likes || 0) - 1);
    }

    await dynamoDBService.updateMarketplaceItem(id, { 
      likedBy: project.likedBy,
      likes: project.likes
    });
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
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const newProject = {
      id: Date.now().toString(), // Use timestamp as ID
      ...req.body,
      rating: 0,
      reviews: 0,
      posted: new Date().toISOString().split('T')[0],
      dateAdded: new Date().toISOString(),
      views: 0,
      favoritedBy: [],
      author: user.customUserId,
      createdBy: firebaseUid
    };
    
    // Save project to DynamoDB
    await dynamoDBService.createMarketplaceItem(newProject);
    
    // Update user's project list
    await userService.addUserProject(user.customUserId, newProject);
    
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
    const firebaseUid = req.user?.uid || req.user?.user_id || req.user?.sub;
    
    if (!firebaseUid) {
      return res.status(400).json({ error: 'User authentication failed - no UID found' });
    }
    
    const project = await dynamoDBService.getMarketplaceItem(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Validate project structure
    if (!project.author) {
      return res.status(400).json({ error: 'Project data is corrupted - missing author information' });
    }

    // Verify that the user deleting the project is the author
    let user;
    try {
      user = await userService.findUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        // Check if we can still proceed if project.author matches firebaseUid
        if (project.author === firebaseUid) {
          user = { customUserId: firebaseUid }; // Create a minimal user object
        } else {
          return res.status(404).json({ error: 'User not found' });
        }
      }
      
      if (user.customUserId !== project.author) {
        // Check if project.author might be the firebaseUid instead
        if (firebaseUid === project.author) {
          // Proceed with deletion
        } else {
          return res.status(403).json({ error: 'You are not authorized to delete this project' });
        }
      }
    } catch (userError) {
      // Check if we can still proceed if project.author matches firebaseUid
      if (project.author === firebaseUid) {
        user = { customUserId: firebaseUid }; // Create a minimal user object
      } else {
        return res.status(500).json({ 
          error: 'Failed to verify user authorization',
          errorMessage: userError.message
        });
      }
    }

    // Delete all images associated with the project from S3
    if (s3Service) {
      try {
        // Delete main project image
        if (project.image && project.image.includes('amazonaws.com/')) {
          try {
            const key = project.image.split('.amazonaws.com/')[1]?.split('?')[0];
            if (key) {
              await s3Service.deleteImage(key);
            }
          } catch (imgError) {
            console.warn('Failed to delete main project image:', imgError.message);
          }
        }
        
        // Delete project images array
        if (project.images && Array.isArray(project.images)) {
          for (const imageUrl of project.images) {
            if (imageUrl && imageUrl.includes('amazonaws.com/')) {
              try {
                const key = imageUrl.split('.amazonaws.com/')[1]?.split('?')[0];
                if (key) {
                  await s3Service.deleteImage(key);
                }
              } catch (imgError) {
                console.warn('Failed to delete project image:', imgError.message);
              }
            }
          }
        }
        
        // Delete attachments if they exist
        if (project.attachments && Array.isArray(project.attachments)) {
          for (const attachment of project.attachments) {
            if (attachment.url && attachment.url.includes('amazonaws.com/')) {
              try {
                const key = attachment.url.split('.amazonaws.com/')[1]?.split('?')[0];
                if (key) {
                  await s3Service.deleteImage(key);
                }
              } catch (imgError) {
                console.warn('Failed to delete project attachment:', imgError.message);
              }
            }
          }
        }
      } catch (s3Error) {
        console.warn('Failed to delete some S3 images, but continuing with project deletion:', s3Error.message);
      }
    }
    
    // Delete project from DynamoDB
    try {
      await dynamoDBService.deleteMarketplaceItem(id);
    } catch (dbError) {
      console.error('Failed to delete project from DynamoDB:', dbError);
      return res.status(500).json({ 
        error: 'Failed to delete project from database',
        errorMessage: dbError.message
      });
    }

    // Remove project from user's created list
    try {
      if (user && user.customUserId) {
        await userService.removeUserProject(user.customUserId, id);
      }
    } catch (userError) {
      console.warn('Failed to remove project from user\'s created list:', userError.message);
      // Don't fail the entire operation for this
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    
    // Provide more specific error messages
    if (error.name === 'ConditionalCheckFailedException') {
      return res.status(404).json({ error: 'Project not found or already deleted' });
    }
    
    if (error.name === 'ResourceNotFoundException') {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if it's an S3 permission error
    if (error.message && error.message.includes('AccessDenied')) {
      return res.status(500).json({ 
        error: 'S3 access denied - check IAM permissions',
        errorMessage: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      errorMessage: error.message || null
    });
  }
});

// Get individual project by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const project = await dynamoDBService.getMarketplaceItem(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit (update) a project
router.put('/projects/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const firebaseUid = req.user.uid;
    
    const project = await dynamoDBService.getMarketplaceItem(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify that the user editing the project is the author
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    if (!user || user.customUserId !== project.author) {
      return res.status(403).json({ error: 'You are not authorized to edit this project' });
    }

    // Update allowed fields only
    const allowedFields = [
      'title', 'description', 'category', 'price', 'duration', 'status', 'tags', 'skills', 'image', 'images', 'attachments', 'features', 'techStack', 'deliverables'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Save changes to DynamoDB
    const updatedProject = await dynamoDBService.updateMarketplaceItem(id, updateData);

    res.json({ project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 