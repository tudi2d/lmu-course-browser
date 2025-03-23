
import courseTreeData from '../data/course_tree.json';
import { supabase } from '@/integrations/supabase/client';

// Define types needed by components
export interface Schedule {
  day: string;
  time_start: string;
  time_end: string;
  rhythm: string;
  first_date: string;
  last_date: string;
  room: string;
  room_link: string;
}

export interface Course {
  id?: string;
  name: string;
  number?: string;
  type?: string;
  semester?: string;
  professor?: string;
  language?: string;
  sws?: number;
  max_participants?: number;
  description?: string;
  literature?: string;
  requirements?: string;
  target_group?: string;
  registration_info?: string;
  evaluation_method?: string;
  url?: string;
  schedule?: Schedule[];
  faculties?: string[];
}

export interface CourseTreeItem {
  course: Course;
  children?: CourseTreeItem[];
}

// Define CourseNode type from the course_tree.json structure
export interface CourseNode {
  id?: string;
  name: string;
  value?: string;
  course?: Course;
  children?: CourseNode[];
  [key: string]: any;
}

// Type guard to determine if a value is a CourseNode array
export function isCourseNodeArray(value: any[] | CourseNode): value is any[] {
  return Array.isArray(value);
}

export const fetchCourseTree = async (): Promise<CourseNode> => {
  // Return local data for now, later can be replaced with actual API call
  return courseTreeData as unknown as CourseNode;
};

export const fetchCourseDetails = async (courseId: string): Promise<Course | null> => {
  // Fetch actual course data from Supabase database
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching course details:', error);
    return null;
  }
  
  // Parse schedule data if it exists
  if (data && data.schedule) {
    try {
      // Ensure schedule is treated as an array
      const scheduleData = Array.isArray(data.schedule) 
        ? data.schedule 
        : (typeof data.schedule === 'string' 
            ? JSON.parse(data.schedule) 
            : [data.schedule]);
            
      data.schedule = scheduleData;
    } catch (e) {
      console.error('Error parsing schedule data:', e);
      data.schedule = [];
    }
  }
  
  return data as Course;
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

// Add the missing isFavorite function
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
