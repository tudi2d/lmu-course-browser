
import courseTreeData from '../data/course_tree.json';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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

// Helper function to safely parse schedule data
const parseScheduleData = (scheduleData: Json | null): Schedule[] => {
  if (!scheduleData) return [];
  
  try {
    // Handle different possible formats of the schedule data
    if (Array.isArray(scheduleData)) {
      // Validate that each item has the required fields for a Schedule
      return scheduleData.map(item => {
        return {
          day: item.day || '',
          time_start: item.time_start || '',
          time_end: item.time_end || '',
          rhythm: item.rhythm || '',
          first_date: item.first_date || '',
          last_date: item.last_date || '',
          room: item.room || '',
          room_link: item.room_link || '',
        } as Schedule;
      });
    } else if (typeof scheduleData === 'string') {
      // Parse string JSON
      const parsed = JSON.parse(scheduleData);
      return Array.isArray(parsed) ? parseScheduleData(parsed) : [parseScheduleData(parsed)[0]];
    } else if (scheduleData && typeof scheduleData === 'object') {
      // Single schedule object
      return [{
        day: scheduleData.day || '',
        time_start: scheduleData.time_start || '',
        time_end: scheduleData.time_end || '',
        rhythm: scheduleData.rhythm || '',
        first_date: scheduleData.first_date || '',
        last_date: scheduleData.last_date || '',
        room: scheduleData.room || '',
        room_link: scheduleData.room_link || '',
      } as Schedule];
    }
  } catch (e) {
    console.error('Error parsing schedule data:', e);
  }
  
  return [];
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
  
  if (!data) return null;
  
  // Transform the data to match our Course interface
  const courseData: Course = {
    id: data.id,
    name: data.name,
    number: data.number || undefined,
    type: data.type || undefined,
    semester: data.semester || undefined,
    professor: data.professor || undefined,
    language: data.language || undefined,
    sws: data.sws !== null ? Number(data.sws) : undefined,
    max_participants: data.max_participants !== null ? Number(data.max_participants) : undefined,
    description: data.description || undefined,
    literature: data.literature || undefined,
    requirements: data.requirements || undefined,
    target_group: data.target_group || undefined,
    registration_info: data.registration_info || undefined,
    evaluation_method: data.evaluation_method || undefined,
    url: data.url || undefined,
    faculties: data.faculties || undefined,
    // Parse schedule data properly
    schedule: parseScheduleData(data.schedule)
  };
  
  return courseData;
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
