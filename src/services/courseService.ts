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
        // Safely access properties with type checking
        const scheduleItem = item as Record<string, any>;
        return {
          day: scheduleItem.day?.toString() || '',
          time_start: scheduleItem.time_start?.toString() || '',
          time_end: scheduleItem.time_end?.toString() || '',
          rhythm: scheduleItem.rhythm?.toString() || '',
          first_date: scheduleItem.first_date?.toString() || '',
          last_date: scheduleItem.last_date?.toString() || '',
          room: scheduleItem.room?.toString() || '',
          room_link: scheduleItem.room_link?.toString() || '',
        } as Schedule;
      });
    } else if (typeof scheduleData === 'string') {
      // Parse string JSON
      try {
        const parsed = JSON.parse(scheduleData);
        return Array.isArray(parsed) 
          ? parsed.map(item => ({
              day: item.day?.toString() || '',
              time_start: item.time_start?.toString() || '',
              time_end: item.time_end?.toString() || '',
              rhythm: item.rhythm?.toString() || '',
              first_date: item.first_date?.toString() || '',
              last_date: item.last_date?.toString() || '',
              room: item.room?.toString() || '',
              room_link: item.room_link?.toString() || '',
            } as Schedule))
          : [{
              day: parsed.day?.toString() || '',
              time_start: parsed.time_start?.toString() || '',
              time_end: parsed.time_end?.toString() || '',
              rhythm: parsed.rhythm?.toString() || '',
              first_date: parsed.first_date?.toString() || '',
              last_date: parsed.last_date?.toString() || '',
              room: parsed.room?.toString() || '',
              room_link: parsed.room_link?.toString() || '',
            } as Schedule];
      } catch (e) {
        console.error('Error parsing schedule string data:', e);
        return [];
      }
    } else if (scheduleData && typeof scheduleData === 'object') {
      // Single schedule object
      const scheduleItem = scheduleData as Record<string, any>;
      return [{
        day: scheduleItem.day?.toString() || '',
        time_start: scheduleItem.time_start?.toString() || '',
        time_end: scheduleItem.time_end?.toString() || '',
        rhythm: scheduleItem.rhythm?.toString() || '',
        first_date: scheduleItem.first_date?.toString() || '',
        last_date: scheduleItem.last_date?.toString() || '',
        room: scheduleItem.room?.toString() || '',
        room_link: scheduleItem.room_link?.toString() || '',
      } as Schedule];
    }
  } catch (e) {
    console.error('Error parsing schedule data:', e);
  }
  
  return [];
};

// Function to check if a string is in UUID format
const isUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const fetchCourseDetails = async (courseId: string): Promise<Course | null> => {
  console.log('Fetching course details for:', courseId);
  
  // If the courseId is not a valid UUID, search in the course tree data instead
  if (!isUUID(courseId)) {
    console.log('CourseId is not a UUID, searching in local data:', courseId);
    
    // First, get the whole course tree
    const tree = await fetchCourseTree();
    
    // Helper function to find a course by ID in the tree
    const findCourseInTree = (node: CourseNode, id: string): Course | null => {
      // Check if this node has the value we're looking for
      if (node.value === id) {
        // Convert node to Course format
        return {
          id: node.value,
          name: node.name,
          // Add other properties if available in the node
          ...(node.course || {}),
        };
      }
      
      // Search in children
      if (node.children) {
        for (const child of node.children) {
          const found = findCourseInTree(child, id);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    // Search for the course in the tree
    const course = findCourseInTree(tree, courseId);
    
    if (course) {
      console.log('Found course in local data:', course);
      return course;
    } else {
      console.error('Course not found in local data:', courseId);
      return null;
    }
  }
  
  // Otherwise, proceed with database query as before
  console.log('Querying database for course:', courseId);
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching course details from database:', error);
    return null;
  }
  
  if (!data) {
    console.log('No course found with ID:', courseId);
    return null;
  }
  
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
  
  console.log('Successfully fetched course data:', courseData);
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
