
import courseTreeData from '../data/course_tree.json';
import type { CourseNode } from '../integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

export { CourseNode };

// Type guard to determine if a value is a CourseNode array
export function isCourseNodeArray(value: any[] | CourseNode): value is any[] {
  return Array.isArray(value);
}

export const fetchCourseTree = async (): Promise<CourseNode> => {
  // Return local data for now, later can be replaced with actual API call
  return courseTreeData as CourseNode;
};

export const fetchCourseDetails = async (courseId: string): Promise<any> => {
  // Simulate fetching course details
  // In a real app, this would be an API call to get detailed information
  return {
    id: courseId,
    title: `Course ${courseId}`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero.",
    schedule: "Mo 10:00-12:00, Thu 14:00-16:00",
    instructor: "Prof. Dr. Example",
    credits: 5,
    prerequisites: "None",
    location: "Main Campus, Room A101",
  };
};

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

export const toggleFavorite = async (courseId: string, isFavorite: boolean): Promise<boolean> => {
  if (isFavorite) {
    return removeFavorite(courseId);
  } else {
    return addFavorite(courseId);
  }
};
