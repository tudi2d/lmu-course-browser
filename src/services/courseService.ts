
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

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
  instructors?: string[];
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

// Function to fetch course tree data
export const fetchCourseTree = async (): Promise<CourseTreeItem[]> => {
  try {
    const { data, error } = await supabase
      .from('course_tree')
      .select(`
        id,
        path,
        course_id,
        courses:course_id (*)
      `);

    if (error) {
      console.error('Error fetching course tree:', error);
      toast({
        title: "Error fetching courses",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Transform data to match our CourseTreeItem interface
    return data.map((item) => ({
      id: item.id,
      path: item.path,
      course_id: item.course_id,
      course: {
        ...item.courses as any,
        // Convert schedule from Json to Schedule[] if it exists
        schedule: item.courses?.schedule ? (item.courses.schedule as any as Schedule[]) : undefined
      },
    }));
  } catch (error) {
    console.error('Unexpected error fetching course tree:', error);
    return [];
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
