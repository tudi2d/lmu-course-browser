
import { supabase } from '@/integrations/supabase/client';
import { 
  getLocalFavorites, 
  saveLocalFavorites 
} from './localStorageService';
import {
  fetchDbFavorites,
  addDbFavorite,
  removeDbFavorite,
  syncFavoritesToDb
} from './dbService';

/**
 * Sync local favorites with database when user logs in
 * @param userId The user ID
 */
export const syncFavoritesOnLogin = async (userId: string): Promise<void> => {
  const localFavorites = getLocalFavorites();
  
  if (localFavorites.length === 0) return;
  
  await syncFavoritesToDb(userId, localFavorites);
};

/**
 * Fetch all favorites for the current user
 * Returns database favorites for authenticated users, or local favorites otherwise
 * @returns Array of course IDs
 */
export const fetchFavorites = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const localFavorites = getLocalFavorites();
    
    if (!user) {
      // Return local favorites for non-authenticated users
      console.log('No user authenticated, using local favorites:', localFavorites);
      return localFavorites;
    }
    
    // For authenticated users, get favorites from database
    const dbFavorites = await fetchDbFavorites(user.id);
    console.log('Loaded favorites from DB:', dbFavorites);
    
    // If there are local favorites not in the DB, sync them
    const localOnlyFavorites = localFavorites.filter(id => !dbFavorites.includes(id));
    if (localOnlyFavorites.length > 0) {
      console.log('Found local favorites not in DB, syncing them...', localOnlyFavorites);
      await syncFavoritesOnLogin(user.id);
      
      // Refetch after sync
      const updatedFavorites = await fetchDbFavorites(user.id);
      console.log('Updated favorites after sync:', updatedFavorites);
      return updatedFavorites;
    }
    
    return dbFavorites;
  } catch (error) {
    console.error('Error in fetchFavorites:', error);
    return getLocalFavorites();
  }
};

/**
 * Check if a course is in the user's favorites
 * @param courseId The course ID to check
 * @returns Boolean indicating favorite status
 */
export const isFavorite = async (courseId: string): Promise<boolean> => {
  const favorites = await fetchFavorites();
  return favorites.includes(courseId);
};

/**
 * Add a course to favorites
 * @param courseId The course ID to add
 * @returns Success status
 */
export const addFavorite = async (courseId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // For non-authenticated users, save to local storage
    if (!user) {
      const favorites = getLocalFavorites();
      if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        saveLocalFavorites(favorites);
        console.log('Added to local favorites:', courseId);
      }
      return true;
    }
    
    // For authenticated users, save to database
    const success = await addDbFavorite(user.id, courseId);
    if (!success) {
      // Fallback to local storage
      const favorites = getLocalFavorites();
      if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        saveLocalFavorites(favorites);
      }
      return false;
    }
    
    console.log('Added to DB favorites:', courseId);
    return true;
  } catch (error) {
    console.error('Error in addFavorite:', error);
    return false;
  }
};

/**
 * Remove a course from favorites
 * @param courseId The course ID to remove
 * @returns Success status
 */
export const removeFavorite = async (courseId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // For non-authenticated users, remove from local storage
    if (!user) {
      const favorites = getLocalFavorites();
      const updatedFavorites = favorites.filter(id => id !== courseId);
      saveLocalFavorites(updatedFavorites);
      console.log('Removed from local favorites:', courseId);
      return true;
    }
    
    // For authenticated users, remove from database
    const success = await removeDbFavorite(user.id, courseId);
    if (!success) {
      // Still update local storage as fallback
      const favorites = getLocalFavorites();
      const updatedFavorites = favorites.filter(id => id !== courseId);
      saveLocalFavorites(updatedFavorites);
      return false;
    }
    
    console.log('Removed from DB favorites:', courseId);
    return true;
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    return false;
  }
};

/**
 * Toggle a course's favorite status
 * @param courseId The course ID to toggle
 * @param isFavorited Current favorite status
 * @returns Success status
 */
export const toggleFavorite = async (
  courseId: string, 
  isFavorited: boolean
): Promise<boolean> => {
  console.log('Toggling favorite:', courseId, 'currently favorited:', isFavorited);
  if (isFavorited) {
    return removeFavorite(courseId);
  } else {
    return addFavorite(courseId);
  }
};
