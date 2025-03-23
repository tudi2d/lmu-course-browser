import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
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
  instructors?: unknown[]; // Changed from any[] to unknown[]
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

export interface CourseNode {
  name: string;
  value?: string;
  children?: CourseNode[];
}

export interface CourseTreeItem {
  id?: string;
  path: string[];
  course_id?: string;
  course: Course;
}

// Cache for course data
let courseTreeCache: CourseNode | null = null;
let favoriteCache: string[] | null = null;
let courseDetailsCache: Record<string, Course> = {};

// Function to fetch course tree data from local JSON
export const fetchCourseTree = async (): Promise<CourseNode> => {
  // Return from cache if available
  if (courseTreeCache) {
    return courseTreeCache;
  }

  try {
    // Simply return the JSON data as is, without transforming
    courseTreeCache = courseTreeData as CourseNode;
    return courseTreeCache;
  } catch (error) {
    console.error("Error loading course tree data:", error);
    toast({
      title: "Error loading courses",
      description: "Could not load course data",
      variant: "destructive",
    });
    return { name: "Error", children: [] };
  }
};

// Function to fetch course details from Supabase by course number
export const fetchCourseDetails = async (
  courseNumber: string
): Promise<Course | null> => {
  // Return from cache if available
  if (courseDetailsCache[courseNumber]) {
    return courseDetailsCache[courseNumber];
  }

  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("number", courseNumber)
      .single();

    if (error) {
      console.error("Error fetching course details:", error);
      return null;
    }

    const course = {
      ...data,
      // Convert schedule from Json to Schedule[] if it exists
      schedule: data.schedule
        ? (data.schedule as unknown as Schedule[])
        : undefined,
    } as Course;

    // Cache the result
    courseDetailsCache[courseNumber] = course;

    return course;
  } catch (error) {
    console.error("Unexpected error fetching course details:", error);
    return null;
  }
};

// Function to check if a course is favorited
export const isFavorite = async (courseId: string): Promise<boolean> => {
  // First check favorites cache if available
  if (favoriteCache) {
    return favoriteCache.includes(courseId);
  }

  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      return false;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("course_id", courseId)
      .eq("user_id", session.session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      console.error("Error checking favorite status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Unexpected error checking favorite status:", error);
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
        .from("favorites")
        .delete()
        .eq("course_id", courseId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error removing favorite:", error);
        toast({
          title: "Error",
          description: "Failed to remove from favorites",
          variant: "destructive",
        });
        return true; // Return true because it's still favorited
      }

      // Update cache if exists
      if (favoriteCache) {
        favoriteCache = favoriteCache.filter((id) => id !== courseId);
      }

      toast({
        title: "Removed from favorites",
        description: "Course removed from your favorites",
      });
      return false;
    } else {
      // Add favorite
      const { error } = await supabase.from("favorites").insert({
        course_id: courseId,
        user_id: userId,
      });

      if (error) {
        console.error("Error adding favorite:", error);
        toast({
          title: "Error",
          description: "Failed to add to favorites",
          variant: "destructive",
        });
        return false;
      }

      // Update cache if exists
      if (favoriteCache) {
        favoriteCache.push(courseId);
      }

      toast({
        title: "Added to favorites",
        description: "Course added to your favorites",
      });
      return true;
    }
  } catch (error) {
    console.error("Unexpected error toggling favorite:", error);
    return false;
  }
};

// Function to fetch user's favorites
export const fetchFavorites = async (): Promise<string[]> => {
  // Return from cache if available
  if (favoriteCache) {
    return favoriteCache;
  }

  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      return [];
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("course_id")
      .eq("user_id", session.session.user.id);

    if (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }

    const favorites = data.map((item) => item.course_id);

    // Cache the result
    favoriteCache = favorites;

    return favorites;
  } catch (error) {
    console.error("Unexpected error fetching favorites:", error);
    return [];
  }
};

// Invalidate caches when needed
export const invalidateCache = (
  type: "all" | "favorites" | "course" = "all",
  courseId?: string
) => {
  if (type === "all" || type === "favorites") {
    favoriteCache = null;
  }

  if (type === "all") {
    courseTreeCache = null;
    courseDetailsCache = {};
  } else if (type === "course" && courseId) {
    delete courseDetailsCache[courseId];
  }
};
