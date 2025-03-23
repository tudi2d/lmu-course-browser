
import { supabase } from '@/integrations/supabase/client';

// Local storage key for favorites
const LOCAL_FAVORITES_KEY = 'course_favorites';

// Helper function to get favorites from local storage
const getLocalFavorites = (): string[] => {
  const stored = localStorage.getItem(LOCAL_FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper function to save favorites to local storage
const saveLocalFavorites = (favorites: string[]): void => {
  localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Return local favorites for non-authenticated users
    return getLocalFavorites();
  }
  
  const { data, error } = await supabase
    .from('favorites')
    .select('course_id')
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error fetching favorites:', error);
    return getLocalFavorites(); // Fallback to local if database fetch fails
  }
  
  return data?.map(fav => fav.course_id) || [];
};

export const isFavorite = async (courseId: string): Promise<boolean> => {
  const favorites = await fetchFavorites();
  return favorites.includes(courseId);
};

export const addFavorite = async (courseId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // For non-authenticated users, save to local storage
  if (!user) {
    const favorites = getLocalFavorites();
    if (!favorites.includes(courseId)) {
      favorites.push(courseId);
      saveLocalFavorites(favorites);
    }
    return true;
  }
  
  // For authenticated users, save to database
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: user.id, course_id: courseId });
    
  if (error) {
    console.error('Error adding favorite:', error);
    return false;
  }
  
  return true;
};

export const removeFavorite = async (courseId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // For non-authenticated users, remove from local storage
  if (!user) {
    const favorites = getLocalFavorites();
    const updatedFavorites = favorites.filter(id => id !== courseId);
    saveLocalFavorites(updatedFavorites);
    return true;
  }
  
  // For authenticated users, remove from database
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('course_id', courseId);
    
  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
  
  return true;
};

export const toggleFavorite = async (courseId: string, isFavorited: boolean): Promise<boolean> => {
  if (isFavorited) {
    return removeFavorite(courseId);
  } else {
    return addFavorite(courseId);
  }
};
