/**
 * Helper function to load images from paths in CSV
 * Works with both local assets and web URLs
 */
export const getImageSource = (imagePath) => {
  // Handle null, undefined, or empty values
  if (!imagePath || typeof imagePath !== 'string') {
    // Return a placeholder or default image
    return { uri: 'https://via.placeholder.com/300x200?text=No+Image' };
  }
  
  // If it's a web URL (http/https), use it directly
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return { uri: imagePath };
  }
  
  // For local assets, convert to proper path
  if (imagePath.startsWith('assets/') || imagePath.startsWith('./assets/')) {
    // Remove leading ./ if present
    const cleanPath = imagePath.startsWith('./') ? imagePath.substring(2) : imagePath;
    // For Expo web, use the path as-is (will be served from public/assets)
    return { uri: `/${cleanPath}` };
  }
  
  // Default: treat as URI (add leading slash if it doesn't have one)
  const uri = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return { uri };
};

