import courseTreeData from '../data/course_tree.json';
import { supabase } from '@/integrations/supabase/client';
import { CourseNode, Course } from './types';
import { parseScheduleData } from './scheduleService';
import { isUUID } from '@/utils/validators';

export { CourseNode, Course, CourseTreeItem, Schedule, isCourseNodeArray } from './types';
export { fetchFavorites, isFavorite, addFavorite, removeFavorite, toggleFavorite } from './favoriteService';

export const fetchCourseTree = async (): Promise<CourseNode> => {
  // Return local data for now, later can be replaced with actual API call
  return courseTreeData as unknown as CourseNode;
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
