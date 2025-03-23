
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";
import courseTreeData from "@/data/course_tree.json";

// Type definitions
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
  number?: string;
  name: string;
  type?: string;
  url?: string;
  detail_url?: string;
  professor?: string | null;
  semester?: string;
  sws?: number;
  max_participants?: number;
  language?: string;
  schedule?: Schedule[];
  instructors?: any[]; // Using any[] because the structure seems mixed
  description?: string;
  literature?: string;
  requirements?: string;
  target_group?: string;
  registration_info?: string;
  evaluation_method?: string;
  faculties?: string[];
  departments?: string[];
  degree_programs?: string[];
  modules?: string[];
  registration_periods?: string[];
  has_content?: boolean;
  processing_date?: string;
  scrape_success?: boolean;
  error_message?: string;
}

export interface CourseTreeItem {
  id?: string;
  path: string[];
  course_id?: string;
  course: Course;
}

// Function to fetch course tree data from local JSON
export const fetchCourseTree = async (): Promise<CourseTreeItem[]> => {
  try {
    // Transform the JSON data to match our CourseTreeItem interface
    const transformedData: CourseTreeItem[] = courseTreeData.map((course, index) => {
      // Create a simple path based on course type or other attributes
      const pathParts = [];
      
      if (course.semester) {
        pathParts.push(course.semester);
      } else {
        pathParts.push("Unknown Semester");
      }
      
      if (course.type) {
        pathParts.push(course.type);
      } else {
        pathParts.push("Unknown Type");
      }
      
      return {
        id: index.toString(),
        path: pathParts,
        course_id: course.number,
        course: course as Course
      };
    });
    
    return transformedData;
  } catch (error) {
    console.error('Error loading course tree data:', error);
    toast({
      title: "Error loading courses",
      description: "Could not load course data",
      variant: "destructive",
    });
    return [];
  }
};

// Function to fetch course details from Supabase by course number
export const fetchCourseDetails = async (courseNumber: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('number', courseNumber)
      .single();

    if (error) {
      console.error('Error fetching course details:', error);
      return null;
    }

    return {
      ...data,
      // Convert schedule from Json to Schedule[] if it exists
      schedule: data.schedule ? (data.schedule as any as Schedule[]) : undefined
    } as Course;
  } catch (error) {
    console.error('Unexpected error fetching course details:', error);
    return null;
  }
};

// Function to check if a course is favorited
export const isFavorite = async (courseId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session?.user) {
      return false;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', session.session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking favorite status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error checking favorite status:', error);
    return false;
  }
};

// Function to toggle favorite status
export const toggleFavorite = async (courseId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return false;
    }

    const userId = session.session.user.id;
    
    // Check if already favorited
    const isFavorited = await isFavorite(courseId);
    
    if (isFavorited) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('course_id', courseId)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error removing favorite:', error);
        toast({
          title: "Error",
          description: "Failed to remove from favorites",
          variant: "destructive",
        });
        return true; // Return true because it's still favorited
      }
      
      toast({
        title: "Removed from favorites",
        description: "Course removed from your favorites",
      });
      return false;
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert({
          course_id: courseId,
          user_id: userId,
        });
        
      if (error) {
        console.error('Error adding favorite:', error);
        toast({
          title: "Error",
          description: "Failed to add to favorites",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Added to favorites",
        description: "Course added to your favorites",
      });
      return true;
    }
  } catch (error) {
    console.error('Unexpected error toggling favorite:', error);
    return false;
  }
};

// Function to fetch user's favorites
export const fetchFavorites = async (): Promise<string[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session?.user) {
      return [];
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('course_id')
      .eq('user_id', session.session.user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data.map(item => item.course_id);
  } catch (error) {
    console.error('Unexpected error fetching favorites:', error);
    return [];
  }
};
