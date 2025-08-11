const express = require('express');
const multer = require('multer');
const router = express.Router();
const authorize = require('../authorize');
const s3Service = require('../services/s3Service');
const userService = require('../services/userService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create user folder structure on signup
router.post('/create-user-folder', authorize, async (req, res) => {
  try {
    console.log('=== Create User Folder Request ===');
    const firebaseUid = req.user.uid;
    console.log('Firebase UID:', firebaseUid);
    
    let user = await userService.findUserByFirebaseUid(firebaseUid);
    console.log('User found:', user ? 'Yes' : 'No');
    
    // If user doesn't exist, create them
    if (!user) {
      console.log('User not found, creating new user...');
      try {
        const userData = {
          firstName: req.user.name ? req.user.name.split(' ')[0] : '',
          lastName: req.user.name ? req.user.name.split(' ').slice(1).join(' ') : '',
          email: req.user.email || '',
          userType: 'student',
          mobile: req.user.phone_number || '',
          phoneNumber: req.user.phone_number || ''
        };
        
        user = await userService.createUser(firebaseUid, userData);
        console.log('New user created:', user.customUserId);
      } catch (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user account' });
      }
    }

    console.log('Creating S3 folder for user:', user.customUserId);
    await s3Service.createUserFolder(user.customUserId);
    console.log('S3 folder created successfully');
    
    res.json({ 
      success: true, 
      message: 'User folder created successfully',
      customUserId: user.customUserId 
    });
  } catch (error) {
    console.error('=== Create User Folder Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create user folder' });
  }
});

// Upload profile image (avatar or background)
router.post('/upload-profile-image', authorize, upload.single('image'), async (req, res) => {
  try {
    console.log('=== Profile Image Upload Request ===');
    console.log('User from token:', req.user);
    console.log('File received:', req.file ? 'Yes' : 'No');
    console.log('Request body:', req.body);

    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    const firebaseUid = req.user.uid;
    console.log('Firebase UID:', firebaseUid);
    
    let user = await userService.findUserByFirebaseUid(firebaseUid);
    console.log('User found:', user ? 'Yes' : 'No');
    
    // If user doesn't exist, create them
    if (!user) {
      console.log('User not found, creating new user...');
      try {
        const userData = {
          firstName: req.user.name ? req.user.name.split(' ')[0] : '',
          lastName: req.user.name ? req.user.name.split(' ').slice(1).join(' ') : '',
          email: req.user.email || '',
          userType: 'student',
          mobile: req.user.phone_number || '',
          phoneNumber: req.user.phone_number || ''
        };
        
        user = await userService.createUser(firebaseUid, userData);
        console.log('New user created:', user.customUserId);
      } catch (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user account' });
      }
    }

    console.log('User custom ID:', user.customUserId);
    const { type = 'avatar' } = req.body; // 'avatar' or 'background'
    console.log('Image type:', type);
    
    // Convert multer file to File-like object
    const file = {
      name: req.file.originalname,
      type: req.file.mimetype,
      arrayBuffer: () => Promise.resolve(req.file.buffer)
    };

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: req.file.size
    });

    console.log('Calling S3 service...');
    const imageUrls = await s3Service.uploadProfileImage(file, user.customUserId, type);
    console.log('S3 upload successful:', imageUrls);
    
    // Update user profile with new image URL
    const updateData = {};
    if (type === 'avatar') {
      updateData.avatar = imageUrls.medium.url; // Use medium size for avatar
    } else if (type === 'background') {
      updateData.backgroundImage = imageUrls.large.url; // Use large size for background
    }

    console.log('Updating user profile with:', updateData);
    await userService.updateUserProfile(user.customUserId, updateData);
    console.log('User profile updated successfully');

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrls,
      updatedProfile: updateData
    });
  } catch (error) {
    console.error('=== Profile Image Upload Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Upload project images
router.post('/upload-project-images', authorize, upload.array('images', 10), async (req, res) => {
  try {
    console.log('=== Project Images Upload Request ===');
    console.log('User from token:', req.user);
    console.log('Files received:', req.files ? req.files.length : 0);
    console.log('Request body:', req.body);

    if (!req.files || req.files.length === 0) {
      console.error('No files provided in request');
      return res.status(400).json({ error: 'No image files provided' });
    }

    const firebaseUid = req.user.uid;
    console.log('Firebase UID:', firebaseUid);
    
    let user = await userService.findUserByFirebaseUid(firebaseUid);
    console.log('User found:', user ? 'Yes' : 'No');
    
    // If user doesn't exist, create them
    if (!user) {
      console.log('User not found, creating new user...');
      try {
        const userData = {
          firstName: req.user.name ? req.user.name.split(' ')[0] : '',
          lastName: req.user.name ? req.user.name.split(' ').slice(1).join(' ') : '',
          email: req.user.email || '',
          userType: 'student',
          mobile: req.user.phone_number || '',
          phoneNumber: req.user.phone_number || ''
        };
        
        user = await userService.createUser(firebaseUid, userData);
        console.log('New user created:', user.customUserId);
      } catch (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user account' });
      }
    }

    console.log('User custom ID:', user.customUserId);
    const { projectId } = req.body;
    if (!projectId) {
      console.error('Project ID not provided');
      return res.status(400).json({ error: 'Project ID is required' });
    }
    console.log('Project ID:', projectId);

    // Convert multer files to File-like objects
    const files = req.files.map(file => ({
      name: file.originalname,
      type: file.mimetype,
      arrayBuffer: () => Promise.resolve(file.buffer)
    }));

    console.log('Files to upload:', files.map(f => ({ name: f.name, type: f.type })));

    console.log('Calling S3 service...');
    const imageResults = await s3Service.uploadProjectImages(files, user.customUserId, projectId);
    console.log('S3 upload successful:', imageResults);
    
    // Extract URLs for database storage
    const imageUrls = imageResults.map(result => ({
      main: result.medium.url,
      thumbnail: result.thumbnail.url,
      large: result.large.url,
      small: result.small.url
    }));

    console.log('Processed image URLs:', imageUrls);

    res.json({
      success: true,
      message: 'Project images uploaded successfully',
      imageUrls,
      count: imageUrls.length
    });
  } catch (error) {
    console.error('=== Project Images Upload Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to upload project images' });
  }
});

// Delete image
router.delete('/delete-image', authorize, async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: 'Image key is required' });
    }

    await s3Service.deleteImage(key);
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// List user images
router.get('/list-user-images', authorize, async (req, res) => {
  try {
    console.log('=== List User Images Request ===');
    const firebaseUid = req.user.uid;
    console.log('Firebase UID:', firebaseUid);
    
    let user = await userService.findUserByFirebaseUid(firebaseUid);
    console.log('User found:', user ? 'Yes' : 'No');
    
    // If user doesn't exist, create them
    if (!user) {
      console.log('User not found, creating new user...');
      try {
        const userData = {
          firstName: req.user.name ? req.user.name.split(' ')[0] : '',
          lastName: req.user.name ? req.user.name.split(' ').slice(1).join(' ') : '',
          email: req.user.email || '',
          userType: 'student',
          mobile: req.user.phone_number || '',
          phoneNumber: req.user.phone_number || ''
        };
        
        user = await userService.createUser(firebaseUid, userData);
        console.log('New user created:', user.customUserId);
      } catch (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user account' });
      }
    }

    const { type = 'profile' } = req.query;
    console.log('Listing images for type:', type);
    console.log('User custom ID:', user.customUserId);
    
    const images = await s3Service.listUserImages(user.customUserId, type);
    console.log('Found images:', images.length);
    
    res.json({
      success: true,
      images: images.map(img => ({
        key: img.Key,
        size: img.Size,
        lastModified: img.LastModified,
        url: `https://${s3Service.bucketName}.s3.${s3Service.region}.amazonaws.com/${img.Key}`
      }))
    });
  } catch (error) {
    console.error('=== List User Images Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to list user images' });
  }
});

// Get signed URL for private content
router.get('/signed-url', authorize, async (req, res) => {
  try {
    const { key, expiresIn = 3600 } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'Image key is required' });
    }

    const signedUrl = await s3Service.getSignedUrl(key, parseInt(expiresIn));
    
    res.json({
      success: true,
      signedUrl
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate signed URL' });
  }
});

// Upload stock image (admin only)
router.post('/upload-stock-image', authorize, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { category, filename } = req.body;
    if (!category || !filename) {
      return res.status(400).json({ error: 'Category and filename are required' });
    }

    // Convert multer file to File-like object
    const file = {
      name: req.file.originalname,
      type: req.file.mimetype,
      arrayBuffer: () => Promise.resolve(req.file.buffer)
    };

    const imageUrl = await s3Service.uploadStockImage(file, category, filename);
    
    res.json({
      success: true,
      message: 'Stock image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    console.error('Error uploading stock image:', error);
    res.status(500).json({ error: 'Failed to upload stock image' });
  }
});

module.exports = router; 