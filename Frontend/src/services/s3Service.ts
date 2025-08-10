import { API_ENDPOINTS } from '../config/api';
import { auth } from '../lib/firebase';

export interface ImageUrls {
  thumbnail: { url: string; key: string };
  small: { url: string; key: string };
  medium: { url: string; key: string };
  large: { url: string; key: string };
}

export interface ProjectImageUrls {
  main: string;
  thumbnail: string;
  large: string;
  small: string;
}

class S3Service {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }
    
    try {
      const token = await user.getIdToken();
      console.log('Successfully retrieved auth token');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Failed to get authentication token');
    }
  }

  // Upload profile image (avatar or background)
  async uploadProfileImage(file: File, type: 'avatar' | 'background'): Promise<ImageUrls> {
    try {
      console.log('Starting profile image upload for type:', type);
      const token = await this.getAuthToken();
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const endpoint = `${API_ENDPOINTS.BASE_URL}/api/s3/upload-profile-image`;
      console.log('Uploading to endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload failed:', error);
        throw new Error(error.error || 'Failed to upload profile image');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result.imageUrls;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }

  // Upload project images
  async uploadProjectImages(files: File[], projectId: string): Promise<ProjectImageUrls[]> {
    try {
      console.log('Starting project images upload for project:', projectId);
      const token = await this.getAuthToken();
      
      const formData = new FormData();
      formData.append('projectId', projectId);
      
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      const endpoint = `${API_ENDPOINTS.BASE_URL}/api/s3/upload-project-images`;
      console.log('Uploading to endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload failed:', error);
        throw new Error(error.error || 'Failed to upload project images');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result.imageUrls;
    } catch (error) {
      console.error('Error uploading project images:', error);
      throw error;
    }
  }

  // Delete image
  async deleteImage(key: string): Promise<boolean> {
    try {
      console.log('Deleting image with key:', key);
      const token = await this.getAuthToken();
      
      const endpoint = `${API_ENDPOINTS.BASE_URL}/api/s3/delete-image`;
      console.log('Deleting from endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key })
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Delete failed:', error);
        throw new Error(error.error || 'Failed to delete image');
      }

      console.log('Delete successful');
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // List user images
  async listUserImages(type: 'profile' | 'projects' = 'profile'): Promise<any[]> {
    try {
      console.log('Listing user images for type:', type);
      const token = await this.getAuthToken();
      
      const endpoint = `${API_ENDPOINTS.BASE_URL}/api/s3/list-user-images?type=${type}`;
      console.log('Listing from endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('List response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('List failed:', error);
        throw new Error(error.error || 'Failed to list user images');
      }

      const result = await response.json();
      console.log('List successful:', result);
      return result.images;
    } catch (error) {
      console.error('Error listing user images:', error);
      throw error;
    }
  }

  // Get signed URL for private content
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      console.log('Getting signed URL for key:', key);
      const token = await this.getAuthToken();
      
      const endpoint = `${API_ENDPOINTS.BASE_URL}/api/s3/signed-url?key=${encodeURIComponent(key)}&expiresIn=${expiresIn}`;
      console.log('Getting signed URL from endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Signed URL response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Signed URL failed:', error);
        throw new Error(error.error || 'Failed to get signed URL');
      }

      const result = await response.json();
      console.log('Signed URL successful');
      return result.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }

  // Create user folder (called on signup)
  async createUserFolder(): Promise<boolean> {
    try {
      console.log('Creating user folder');
      const token = await this.getAuthToken();
      
      const endpoint = `${API_ENDPOINTS.BASE_URL}/api/s3/create-user-folder`;
      console.log('Creating folder at endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Create folder response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Create folder failed:', error);
        throw new Error(error.error || 'Failed to create user folder');
      }

      console.log('Create folder successful');
      return true;
    } catch (error) {
      console.error('Error creating user folder:', error);
      throw error;
    }
  }

  // Optimize image before upload (client-side optimization)
  async optimizeImage(file: File, options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options;
        
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        }, file.type, quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Validate file before upload
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, WebP, and GIF files are allowed' };
    }

    return { isValid: true };
  }
}

export default new S3Service(); 