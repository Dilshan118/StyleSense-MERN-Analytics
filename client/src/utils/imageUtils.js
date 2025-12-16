import { API_BASE_URL } from '../config/api';

/**
 * Constructs a full image URL given a product image path.
 * Handles:
 * 1. Full URLs (starting with http) -> returns as is.
 * 2. Relative paths -> prepends API_BASE_URL.
 * 3. Null/Undefined -> returns placeholder.
 * 4. Error events (can be used in onError handlers, though this function returns string).
 *
 * @param {string} imagePath - The image path from the database.
 * @returns {string} - The full URL to the image.
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;

    // Ensure leading slash for local paths if missing (though usually backend saves with /uploads/)
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Helper to handle image load errors on <img> tags.
 * Usage: onError={handleImageError}
 */
export const handleImageError = (e) => {
    e.target.src = '/placeholder.png';
};
