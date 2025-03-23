
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch favorites from database for a specific user
 * @param userId The user ID to fetch favorites for
 * @returns Array of course IDs from the database
 */
export const fetchDbFavorites = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('course_id')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching favorites from database:', error);
    return [];
  }
  
  return data?.map(fav => fav.course_id) || [];
};

/**
 * Add a favorite to the database
 * @param userId The user ID
 * @param courseId The course ID to add
 * @param courseName The course name (optional)
 * @returns Success status
 */
export const addDbFavorite = async (
  userId: string, 
  courseId: string,
  courseName: string = ''
): Promise<boolean> => {
  const { error } = await supabase
    .from('favorites')
    .insert({ 
      user_id: userId, 
      course_id: courseId,
      name: courseName || null
    });
    
  if (error) {
    console.error('Error adding favorite to database:', error);
    return false;
  }
  
  return true;
};

/**
 * Remove a favorite from the database
 * @param userId The user ID
 * @param courseId The course ID to remove
 * @returns Success status
 */
export const removeDbFavorite = async (
  userId: string, 
  courseId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('course_id', courseId);
    
  if (error) {
    console.error('Error removing favorite from database:', error);
    return false;
  }
  
  return true;
};

/**
 * Synchronize local favorites with the database
 * @param userId The user ID
 * @param localFavorites Array of local course IDs
 * @param courseNames Map of course IDs to names (optional)
 */
export const syncFavoritesToDb = async (
  userId: string, 
  localFavorites: string[],
  courseNames: Record<string, string> = {}
): Promise<void> => {
  // Get existing favorites from the database
  const dbFavorites = await fetchDbFavorites(userId);
  
  // Filter out courses that are already favorites in the database
  const newFavorites = localFavorites.filter(
    courseId => !dbFavorites.includes(courseId)
  );
  
  if (newFavorites.length === 0) return;
  
  // Prepare data for insertion
  const favoritesToInsert = newFavorites.map(courseId => ({
    user_id: userId,
    course_id: courseId,
    name: courseNames[courseId] || null
  }));
  
  // Insert new favorites into the database
  const { error } = await supabase
    .from('favorites')
    .insert(favoritesToInsert);
    
  if (error) {
    console.error('Error syncing favorites to database:', error);
  }
};
