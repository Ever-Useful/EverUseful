const { s3, S3_CONFIG } = require('../config/aws');
const sharp = require('sharp');

class S3Service {
  constructor() {
    this.bucketName = S3_CONFIG.BUCKET_NAME;
    this.region = S3_CONFIG.REGION;
  }

  // Create user-specific folder structure
  async createUserFolder(customUserId) {
    try {
      console.log(`Creating user folder structure for ${customUserId}`);
      
      // Create main user folder
      const userFolder = `user-content/${customUserId}/`;
      
      // Create folder structure by uploading a placeholder file
      const params = {
        Bucket: this.bucketName,
        Key: `${userFolder}.keep`,
        Body: 'User folder created',
        ContentType: 'text/plain'
      };

      await s3.upload(params).promise();
      
      // Create subfolders for different content types
      const subfolders = ['profile', 'projects', 'documents'];
      for (const folder of subfolders) {
        await s3.upload({
          Bucket: this.bucketName,
          Key: `${userFolder}${folder}/.keep`,
          Body: `${folder} folder created`,
          ContentType: 'text/plain'
        }).promise();
      }

      console.log(`Created user folder structure for ${customUserId}`);
      return true;
    } catch (error) {
      console.error('Error creating user folder:', error);
      throw error;
    }
  }

  // Optimize image before upload
  async optimizeImage(buffer, options = {}) {
    try {
      const {
        width = 800,
        height = 800,
        quality = 80,
        format = 'jpeg'
      } = options;

      let sharpInstance = sharp(buffer);

      // Resize if dimensions provided
      if (width && height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Convert to specified format
      if (format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
      } else if (format === 'png') {
        sharpInstance = sharpInstance.png({ quality });
      } else if (format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality });
      }

      return await sharpInstance.toBuffer();
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw error;
    }
  }

  // Generate multiple image sizes
  async generateImageSizes(buffer) {
    try {
      const sizes = {
        thumbnail: { width: 150, height: 150, quality: 70 },
        small: { width: 300, height: 300, quality: 75 },
        medium: { width: 600, height: 600, quality: 80 },
        large: { width: 1200, height: 1200, quality: 85 }
      };

      const optimizedImages = {};

      for (const [size, config] of Object.entries(sizes)) {
        optimizedImages[size] = await this.optimizeImage(buffer, config);
      }

      return optimizedImages;
    } catch (error) {
      console.error('Error generating image sizes:', error);
      throw error;
    }
  }

  // Upload image with multiple sizes to user's folder
  async uploadImage(file, customUserId, type, filename) {
    try {
      console.log(`Uploading image for user ${customUserId}, type: ${type}, filename: ${filename}`);
      
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Generate optimized sizes
      const imageSizes = await this.generateImageSizes(fileBuffer);
      
      // Upload all sizes to user's folder with simpler naming
      const uploadPromises = Object.entries(imageSizes).map(async ([size, buffer]) => {
        const key = `user-content/${customUserId}/${type}/${filename}-${size}.${fileExtension}`;
        
        const params = {
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          CacheControl: 'public, max-age=31536000' // Cache for 1 year
        };

        const result = await s3.upload(params).promise();
        console.log(`Uploaded ${size} image: ${result.Location}`);
        return { size, url: result.Location, key: result.Key };
      });

      const results = await Promise.all(uploadPromises);
      
      // Return organized results
      const urls = {};
      results.forEach(({ size, url, key }) => {
        urls[size] = { url, key };
      });

      return urls;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload profile image (avatar or background) to user's folder
  async uploadProfileImage(file, customUserId, type = 'avatar') {
    try {
      console.log(`Uploading profile image for user ${customUserId}, type: ${type}`);
      
      const filename = type === 'avatar' ? 'profile-photo' : 'background-photo';
      const result = await this.uploadImage(file, customUserId, 'profile', filename);
      
      console.log('Profile image upload successful:', result);
      return result;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }

  // Upload project images to marketplace folder
  async uploadProjectImages(files, customUserId, projectId) {
    try {
      console.log(`Uploading project images for user ${customUserId}, project: ${projectId}`);
      
      const uploadPromises = files.map(async (file, index) => {
        const filename = `project-${projectId}-image-${index + 1}`;
        
        // Upload to marketplace folder instead of user's projects folder
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        // Generate optimized sizes
        const imageSizes = await this.generateImageSizes(fileBuffer);
        
        // Upload all sizes to marketplace folder with simpler naming
        const uploadPromises = Object.entries(imageSizes).map(async ([size, buffer]) => {
          const key = `marketplace/projects/${projectId}/${filename}-${size}.${fileExtension}`;
          
          const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            CacheControl: 'public, max-age=31536000'
          };

          const result = await s3.upload(params).promise();
          console.log(`Uploaded marketplace ${size} image: ${result.Location}`);
          return { size, url: result.Location, key: result.Key };
        });

        const results = await Promise.all(uploadPromises);
        
        // Return organized results
        const urls = {};
        results.forEach(({ size, url, key }) => {
          urls[size] = { url, key };
        });

        return urls;
      });

      const results = await Promise.all(uploadPromises);
      console.log('Project images upload successful:', results);
      return results;
    } catch (error) {
      console.error('Error uploading project images:', error);
      throw error;
    }
  }

  // Delete image from S3
  async deleteImage(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      await s3.deleteObject(params).promise();
      console.log(`Deleted image: ${key}`);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Get signed URL for private content
  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn
      };

      return await s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  // List user's images
  async listUserImages(customUserId, type = 'profile') {
    try {
      const params = {
        Bucket: this.bucketName,
        Prefix: `user-content/${customUserId}/${type}/`,
        MaxKeys: 100
      };

      const result = await s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      console.error('Error listing user images:', error);
      throw error;
    }
  }

  // Upload stock image (for static website images)
  async uploadStockImage(file, category, filename) {
    try {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const optimizedBuffer = await this.optimizeImage(fileBuffer, {
        width: 1200,
        height: 1200,
        quality: 85
      });

      const key = `stock-images/${category}/${filename}`;
      
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: optimizedBuffer,
        ContentType: file.type,
        CacheControl: 'public, max-age=31536000'
      };

      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error('Error uploading stock image:', error);
      throw error;
    }
  }
}

module.exports = new S3Service(); 