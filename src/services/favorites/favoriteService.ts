
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

// Ensure these functions are explicitly exported
export { getLocalFavorites, saveLocalFavorites };

/**
 * Sync local favorites with database when user logs in
 * @param userId The user ID
 */
export const syncFavoritesOnLogin = async (userId: string): Promise<void> => {
  const localFavorites = getLocalFavorites();
  
  if (localFavorites.length === 0) return;
  
  // Fetch course names before syncing
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, name')
    .in('id', localFavorites);
    
  if (coursesError) {
    console.error('Error fetching course names for sync:', coursesError);
    // Still sync without names
    await syncFavoritesToDb(userId, localFavorites);
    return;
  }
  
  // Create a map of course IDs to names
  const courseNameMap = (courses || []).reduce((map: Record<string, string>, course) => {
    map[course.id] = course.name;
    return map;
  }, {});
  
  // Sync with names where available
  await syncFavoritesToDb(userId, localFavorites, courseNameMap);
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
      console.log('No user authenticated, using local favorites:', localFavorites);
      return localFavorites;
    }
    
    const dbFavorites = await fetchDbFavorites(user.id);
    console.log('Loaded favorites from DB:', dbFavorites);
    
    const localOnlyFavorites = localFavorites.filter(id => !dbFavorites.includes(id));
    if (localOnlyFavorites.length > 0) {
      console.log('Found local favorites not in DB, syncing them...', localOnlyFavorites);
      await syncFavoritesOnLogin(user.id);
      
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
 * @param courseName The course name (optional)
 * @returns Success status
 */
export const addFavorite = async (courseId: string, courseName: string = ''): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const favorites = getLocalFavorites();
      if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        saveLocalFavorites(favorites);
        console.log('Added to local favorites:', courseId);
      }
      return true;
    }
    
    const success = await addDbFavorite(user.id, courseId, courseName);
    if (!success) {
      const favorites = getLocalFavorites();
      if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        saveLocalFavorites(favorites);
      }
      return false;
    }
    
    console.log('Added to DB favorites:', courseId, 'with name:', courseName);
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
    
    if (!user) {
      const favorites = getLocalFavorites();
      const updatedFavorites = favorites.filter(id => id !== courseId);
      saveLocalFavorites(updatedFavorites);
      console.log('Removed from local favorites:', courseId);
      return true;
    }
    
    const success = await removeDbFavorite(user.id, courseId);
    if (!success) {
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
 * @param courseName The course name (optional)
 * @returns Success status
 */
export const toggleFavorite = async (
  courseId: string, 
  isFavorited: boolean,
  courseName: string = ''
): Promise<boolean> => {
  console.log('Toggling favorite:', courseId, 'currently favorited:', isFavorited, 'name:', courseName);
  if (isFavorited) {
    return removeFavorite(courseId);
  } else {
    return addFavorite(courseId, courseName);
  }
};
