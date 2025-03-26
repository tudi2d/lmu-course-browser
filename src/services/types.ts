
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

export interface LocationInfo {
  link: string;
  name: string;
  title: string;
}

export interface CalendarLink {
  type?: string;
  url?: string;
  title?: string;
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
  departments?: string[];
  degree_programs?: string[];
  instructors?: LocationInfo[];
  registration_periods?: any[];
  modules?: any[];
  detail_url?: string;
  short_comment?: string;
  long_text?: string;
  instructor_details?: any[];
  institution_details?: any[];
  study_programs?: any[];
  module_details?: any[];
  assessment_details?: any[];
  calendar_links?: CalendarLink[];
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
