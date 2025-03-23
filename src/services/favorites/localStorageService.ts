
// Helper functions for local favorites storage

// Local storage key for favorites
const LOCAL_FAVORITES_KEY = 'course_favorites';

/**
 * Get favorites from local storage
 * @returns Array of course IDs
 */
export const getLocalFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(LOCAL_FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

/**
 * Save favorites to local storage
 * @param favorites Array of course IDs to save
 */
export const saveLocalFavorites = (favorites: string[]): void => {
  try {
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};
