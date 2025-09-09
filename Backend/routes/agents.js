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
  console.warn('S3 service not available, S3 operations will be skipped:', error.message);
  s3Service = null;
}

// Get all agents with optional search and filters
router.get('/agents', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, minRating, sort, page = 1, limit = 6 } = req.query;
    const agents = await dynamoDBService.getAllAgents();
    let filteredAgents = [...agents];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAgents = filteredAgents.filter(agent => 
        agent.name?.toLowerCase().includes(searchLower) ||
        agent.description?.toLowerCase().includes(searchLower) ||
        (Array.isArray(agent.tags) && agent.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Apply category filter
    if (category) {
      filteredAgents = filteredAgents.filter(agent => agent.category && agent.category === category);
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      filteredAgents = filteredAgents.filter(agent => {
        if (minPrice && (!agent.price || agent.price < parseInt(minPrice))) return false;
        if (maxPrice && (!agent.price || agent.price > parseInt(maxPrice))) return false;
        return true;
      });
    }

    // Apply rating filter
    if (minRating) {
      filteredAgents = filteredAgents.filter(agent => agent.rating && agent.rating >= parseFloat(minRating));
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'recent':
          filteredAgents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'rating':
          filteredAgents.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'price_asc':
          filteredAgents.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price_desc':
          filteredAgents.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'downloads':
          filteredAgents.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
          break;
        default:
          filteredAgents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else {
      // Default sort by recent
      filteredAgents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalPages = Math.ceil(filteredAgents.length / parseInt(limit));
    const pagination = {
      currentPage: parseInt(page),
      totalPages,
      totalAgents: filteredAgents.length,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1
    };

    res.json({
      agents: paginatedAgents,
      pagination
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agent details by ID
router.get('/agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await dynamoDBService.getAgent(id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Increment view count
    await dynamoDBService.updateAgent(id, { views: (agent.views || 0) + 1 });

    res.json({ agent });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new agent
router.post('/agents', authorize, async (req, res) => {
  try {
    console.log('Create agent request body:', req.body);
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const newAgent = {
      ...req.body,
      author: user.customUserId,
      createdBy: firebaseUid
    };
    
    // Save agent to DynamoDB
    const createdAgent = await dynamoDBService.createAgent(newAgent);

    // Store agent ID in user's projects for profile display
    try {
      await userService.addUserProject(user.customUserId, {
        id: createdAgent.id,
        type: 'agent'
      });
    } catch (e) {
      console.warn('Non-fatal: failed to append agent to user.projects', e?.message || e);
    }

    res.status(201).json({ agent: createdAgent });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent', details: error?.message || null });
  }
});

// Update an agent
router.put('/agents/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const firebaseUid = req.user.uid;
    
    // Get the agent to check ownership
    const agent = await dynamoDBService.getAgent(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Check if user owns this agent
    if (agent.createdBy !== firebaseUid) {
      return res.status(403).json({ error: 'Not authorized to update this agent' });
    }
    
    const updatedAgent = await dynamoDBService.updateAgent(id, req.body);
    
    res.json({ agent: updatedAgent });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an agent
router.delete('/agents/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const firebaseUid = req.user.uid;
    
    // Get the agent to check ownership
    const agent = await dynamoDBService.getAgent(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    // Check if user owns this agent
    if (agent.createdBy !== firebaseUid) {
      return res.status(403).json({ error: 'Not authorized to delete this agent' });
    }
    
    // Delete associated files from S3 if available
    if (s3Service && agent.files) {
      try {
        for (const file of agent.files) {
          if (file.s3Key) {
            await s3Service.deleteImage(file.s3Key);
          }
        }
      } catch (s3Error) {
        console.warn('Error deleting files from S3:', s3Error);
      }
    }
    
    // Delete associated images array and video from S3 if available
    if (s3Service) {
      try {
        if (agent.images && Array.isArray(agent.images)) {
          for (const imageUrl of agent.images) {
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes('amazonaws.com/')) {
              try {
                const key = imageUrl.split('.amazonaws.com/')[1]?.split('?')[0];
                if (key) {
                  await s3Service.deleteImage(key);
                }
              } catch (imgError) {
                console.warn('Failed to delete agent image from S3:', imgError.message);
              }
            }
          }
        }
        if (agent.video && typeof agent.video === 'string' && agent.video.includes('amazonaws.com/')) {
          try {
            const key = agent.video.split('.amazonaws.com/')[1]?.split('?')[0];
            if (key) {
              await s3Service.deleteImage(key);
            }
          } catch (vidError) {
            console.warn('Failed to delete agent video from S3:', vidError.message);
          }
        }
        if (agent.files && Array.isArray(agent.files)) {
          for (const file of agent.files) {
            const url = typeof file === 'string' ? file : file.url || file.main || '';
            if (url && url.includes('amazonaws.com/')) {
              try {
                const key = url.split('.amazonaws.com/')[1]?.split('?')[0];
                if (key) {
                  await s3Service.deleteImage(key);
                }
              } catch (fileErr) {
                console.warn('Failed to delete agent file from S3:', fileErr.message);
              }
            }
          }
        }
      } catch (s3Err) {
        console.warn('S3 cleanup for agent had issues:', s3Err.message);
      }
    }

    await dynamoDBService.deleteAgent(id);
    
    res.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agents by author
router.get('/agents/author/:authorId', async (req, res) => {
  try {
    const { authorId } = req.params;
    const agents = await dynamoDBService.getAgentsByAuthor(authorId);
    
    res.json({ agents });
  } catch (error) {
    console.error('Error fetching agents by author:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agents by category
router.get('/agents/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const agents = await dynamoDBService.getAgentsByCategory(category);
    
    res.json({ agents });
  } catch (error) {
    console.error('Error fetching agents by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle favorite for an agent
router.post('/agents/:id/favorite', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const firebaseUid = req.user.uid;
    const user = await userService.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const agent = await dynamoDBService.getAgent(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const favoritedBy = agent.favoritedBy || [];
    const isFavorited = favoritedBy.includes(user.customUserId);
    
    if (isFavorited) {
      // Remove from favorites
      const updatedFavorites = favoritedBy.filter(userId => userId !== user.customUserId);
      await dynamoDBService.updateAgent(id, { favoritedBy: updatedFavorites });
    } else {
      // Add to favorites
      const updatedFavorites = [...favoritedBy, user.customUserId];
      await dynamoDBService.updateAgent(id, { favoritedBy: updatedFavorites });
    }
    
    res.json({ 
      success: true, 
      isFavorited: !isFavorited,
      message: !isFavorited ? 'Agent added to favorites' : 'Agent removed from favorites'
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;