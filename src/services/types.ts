
import { Json } from '@/integrations/supabase/types';

// Define types needed by components
export interface ScheduleRoom {
  name: string;
  floor_plan?: string;
  details_url?: string;
}

export interface ScheduleDuration {
  start: string;
  end?: string | null;
}

export interface ScheduleItem {
  day: string;
  time: string;
  rhythm?: string;
  notes?: string | null;
  rooms?: ScheduleRoom[];
  duration?: ScheduleDuration;
  instructor?: string | null;
  cancelled_dates?: string | null;
}

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

export interface InstructorDetail {
  id?: string;
  name?: string;
  url?: string;
}

export interface InstitutionDetail {
  id?: string;
  name?: string;
  professor?: string;
  details_url?: string;
}

export interface StudyProgram {
  ects?: string | null;
  type?: string | null;
  degree?: string;
  program?: string;
}

export interface ModuleDetail {
  ects?: string | null;
  type?: string;
  degree?: string;
  program?: string;
  version?: string;
  details_url?: string;
  exam_number?: string;
  module_name?: string;
  module_number?: string;
}

export interface AssessmentDetail {
  type?: string;
  period?: string;
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
  schedule?: Schedule[] | ScheduleItem[];
  faculties?: string[];
  departments?: string[];
  degree_programs?: string[];
  instructors?: LocationInfo[];
  registration_periods?: any[];
  modules?: any[];
  detail_url?: string;
  short_comment?: string;
  long_text?: string;
  instructor_details?: InstructorDetail | InstructorDetail[];
  institution_details?: InstitutionDetail | InstitutionDetail[];
  study_programs?: StudyProgram[];
  module_details?: ModuleDetail[];
  assessment_details?: AssessmentDetail | string | string[];
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
