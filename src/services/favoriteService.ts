
import { supabase } from '@/integrations/supabase/client';

// Local storage key for favorites
const LOCAL_FAVORITES_KEY = 'course_favorites';

// Helper function to get favorites from local storage
export const getLocalFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(LOCAL_FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

// Helper function to save favorites to local storage
export const saveLocalFavorites = (favorites: string[]): void => {
  try {
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

// Sync local favorites with database when user logs in
export const syncFavoritesOnLogin = async (userId: string): Promise<void> => {
  const localFavorites = getLocalFavorites();
  
  if (localFavorites.length === 0) return;
  
  // Get existing favorites from the database
  const { data: existingFavorites, error: fetchError } = await supabase
    .from('favorites')
    .select('course_id')
    .eq('user_id', userId);
    
  if (fetchError) {
    console.error('Error fetching existing favorites:', fetchError);
    return;
  }
  
  const existingCourseIds = existingFavorites?.map(fav => fav.course_id) || [];
  
  // Filter out courses that are already favorites in the database
  const newFavorites = localFavorites.filter(courseId => !existingCourseIds.includes(courseId));
  
  if (newFavorites.length === 0) return;
  
  // Prepare data for insertion
  const favoritesToInsert = newFavorites.map(courseId => ({
    user_id: userId,
    course_id: courseId
  }));
  
  // Insert new favorites into the database
  const { error: insertError } = await supabase
    .from('favorites')
    .insert(favoritesToInsert);
    
  if (insertError) {
    console.error('Error syncing favorites to database:', insertError);
  }
};

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
    const { data, error } = await supabase
      .from('favorites')
      .select('course_id')
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error fetching favorites from database:', error);
      return localFavorites; // Fallback to local if database fetch fails
    }
    
    const dbFavorites = data?.map(fav => fav.course_id) || [];
    console.log('Loaded favorites from DB:', dbFavorites);
    
    // If there are local favorites not in the DB, we might want to sync them
    const localOnlyFavorites = localFavorites.filter(id => !dbFavorites.includes(id));
    if (localOnlyFavorites.length > 0) {
      console.log('Found local favorites not in DB, syncing them...', localOnlyFavorites);
      await syncFavoritesOnLogin(user.id);
      // Refetch after sync
      const { data: updatedData, error: refetchError } = await supabase
        .from('favorites')
        .select('course_id')
        .eq('user_id', user.id);
        
      if (!refetchError && updatedData) {
        const updatedFavorites = updatedData.map(fav => fav.course_id);
        console.log('Updated favorites after sync:', updatedFavorites);
        return updatedFavorites;
      }
    }
    
    return dbFavorites;
  } catch (error) {
    console.error('Error in fetchFavorites:', error);
    return getLocalFavorites();
  }
};

export const isFavorite = async (courseId: string): Promise<boolean> => {
  const favorites = await fetchFavorites();
  return favorites.includes(courseId);
};

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
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, course_id: courseId });
      
    if (error) {
      console.error('Error adding favorite to database:', error);
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
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId);
      
    if (error) {
      console.error('Error removing favorite from database:', error);
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

export const toggleFavorite = async (courseId: string, isFavorited: boolean): Promise<boolean> => {
  console.log('Toggling favorite:', courseId, 'currently favorited:', isFavorited);
  if (isFavorited) {
    return removeFavorite(courseId);
  } else {
    return addFavorite(courseId);
  }
};
