import courseTreeData from '../data/course_tree.json';
import { supabase } from '@/integrations/supabase/client';
import { CourseNode, Course } from './types';
import { parseScheduleData } from './scheduleService';
import { isUUID } from '@/utils/validators';

export type { CourseNode, Course, CourseTreeItem, Schedule } from './types';
export { isCourseNodeArray } from './types';
export { 
  fetchFavorites, 
  isFavorite, 
  addFavorite, 
  removeFavorite, 
  toggleFavorite,
  syncFavoritesOnLogin,
  getLocalFavorites,
  saveLocalFavorites
} from './favorites/favoriteService';

export const fetchCourseTree = async (): Promise<CourseNode> => {
  // Return local data for now, later can be replaced with actual API call
  return courseTreeData as unknown as CourseNode;
};

export const fetchCourseDetails = async (courseId: string): Promise<Course | null> => {
  console.log('Fetching course details for:', courseId);
  
  // First try to fetch from database by ID or number field
  try {
    let data;
    
    if (isUUID(courseId)) {
      console.log('CourseId is a UUID, querying database by id:', courseId);
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();
        
      if (error) throw error;
      data = courseData;
    } else {
      console.log('CourseId is not a UUID, querying database by number:', courseId);
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('number', courseId)
        .maybeSingle();
        
      if (error) throw error;
      data = courseData;
    }
    
    if (data) {
      console.log('Found course in database:', data);
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
    }
  } catch (error) {
    console.error('Error querying database:', error);
  }
  
  // If database query failed or returned no results, fall back to searching in the course tree
  console.log('No results from database, searching in course tree for:', courseId);
  
  // Get the whole course tree
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
  }
  
  console.error('Course not found anywhere:', courseId);
  return null;
};
