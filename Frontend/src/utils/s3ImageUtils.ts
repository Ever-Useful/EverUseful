import NoImageAvailable from "@/assets/images/no image available.png";
import NoUserProfile from "@/assets/images/no user profile.png";

// S3 bucket base URL
const S3_BASE_URL = 'https://amogh-assets.s3.ap-south-1.amazonaws.com';

/**
 * Get the appropriate S3 image URL with fallback
 * @param imageUrl - The image URL from the database
 * @param type - The type of image (project, avatar, background)
 * @param size - The desired size (thumbnail, small, medium, large)
 * @returns The complete S3 URL or fallback image
 */
export const getS3ImageUrl = (
  imageUrl: string | null | undefined,
  type: 'project' | 'avatar' | 'background' = 'project',
  size: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!imageUrl) {
    return type === 'avatar' ? NoUserProfile : NoImageAvailable;
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // If it's an S3 key, construct the full URL (bucket is public)
  if (imageUrl.startsWith('user-content/') || imageUrl.startsWith('stock-images/') || imageUrl.startsWith('marketplace/')) {
    return `${S3_BASE_URL}/${imageUrl}`;
  }

  // For project images, handle different scenarios
  if (type === 'project') {
    // If the URL already contains a size suffix, return as is
    if (imageUrl.includes('-thumbnail.') || imageUrl.includes('-small.') || 
        imageUrl.includes('-medium.') || imageUrl.includes('-large.')) {
      return `${S3_BASE_URL}/${imageUrl}`;
    }
    
    // If it's a base image URL, construct the size-specific URL
    if (imageUrl.includes('.')) {
      const baseKey = imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      return `${S3_BASE_URL}/${baseKey}-${size}.jpg`;
    }
  }

  // For profile images (avatar/background), handle size suffixes
  if (type === 'avatar' || type === 'background') {
    // If the URL already contains a size suffix, return as is
    if (imageUrl.includes('-thumbnail.') || imageUrl.includes('-small.') || 
        imageUrl.includes('-medium.') || imageUrl.includes('-large.')) {
      return `${S3_BASE_URL}/${imageUrl}`;
    }
    
    // If it's a base image URL, construct the size-specific URL
    if (imageUrl.includes('.')) {
      const baseKey = imageUrl.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      return `${S3_BASE_URL}/${baseKey}-${size}.jpg`;
    }
  }

  // Fallback to the original URL
  return imageUrl;
};

/**
 * Get project image URLs for different sizes
 * @param project - The project object
 * @returns Object with different image sizes
 */
export const getProjectImageUrls = (project: any) => {
  const baseImage = project.image || project.images?.[0];
  
  return {
    thumbnail: getS3ImageUrl(baseImage, 'project', 'thumbnail'),
    small: getS3ImageUrl(baseImage, 'project', 'small'),
    medium: getS3ImageUrl(baseImage, 'project', 'medium'),
    large: getS3ImageUrl(baseImage, 'project', 'large'),
    original: getS3ImageUrl(baseImage, 'project')
  };
};

/**
 * Get user avatar URL
 * @param user - The user object
 * @returns The avatar URL with fallback
 */
export const getUserAvatarUrl = (user: any): string => {
  return getS3ImageUrl(user?.avatar || user?.profilePhoto, 'avatar', 'small');
};

/**
 * Get background image URL
 * @param backgroundUrl - The background image URL
 * @returns The background URL with fallback
 */
export const getBackgroundImageUrl = (backgroundUrl: string | null | undefined): string => {
  return getS3ImageUrl(backgroundUrl, 'background', 'large');
};

/**
 * Handle image loading errors
 * @param event - The error event
 * @param fallbackSrc - The fallback image source
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string) => {
  event.currentTarget.src = fallbackSrc;
  event.currentTarget.onerror = null; // Prevent infinite loop
};

/**
 * Check if an image URL is from S3
 * @param imageUrl - The image URL to check
 * @returns True if the image is from S3
 */
export const isS3Image = (imageUrl: string | null | undefined): boolean => {
  if (!imageUrl) return false;
  return imageUrl.includes('amogh-assets.s3.ap-south-1.amazonaws.com') || 
         imageUrl.startsWith('user-content/') || 
         imageUrl.startsWith('stock-images/');
};

/**
 * Get optimized image URL for different screen sizes
 * @param imageUrl - The base image URL
 * @param type - The type of image
 * @returns Object with responsive image URLs
 */
export const getResponsiveImageUrls = (imageUrl: string | null | undefined, type: 'project' | 'avatar' | 'background' = 'project') => {
  return {
    xs: getS3ImageUrl(imageUrl, type, 'thumbnail'),
    sm: getS3ImageUrl(imageUrl, type, 'small'),
    md: getS3ImageUrl(imageUrl, type, 'medium'),
    lg: getS3ImageUrl(imageUrl, type, 'large'),
    xl: getS3ImageUrl(imageUrl, type, 'large')
  };
}; 