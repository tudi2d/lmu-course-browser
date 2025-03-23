
import { supabase } from '@/integrations/supabase/client';

export const fetchFavorites = async (): Promise<string[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('favorites')
    .select('course_id')
    .eq('user_id', user.id);
    
  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  
  return data?.map(fav => fav.course_id) || [];
};

export const isFavorite = async (courseId: string): Promise<boolean> => {
  const favorites = await fetchFavorites();
  return favorites.includes(courseId);
};

export const addFavorite = async (courseId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }
  
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
  
  if (!user) {
    console.error('User not authenticated');
    return false;
  }
  
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
