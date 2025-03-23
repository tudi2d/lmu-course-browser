
import { CourseTreeItem } from '@/services/courseService';

export interface FilterOptions {
  faculties: Set<string>;
  types: Set<string>;
  languages: Set<string>;
  semesters: Set<string>;
}

export const extractUniqueFilterValues = (courses: CourseTreeItem[]) => {
  const faculties = new Set<string>();
  const types = new Set<string>();
  const languages = new Set<string>();
  const semesters = new Set<string>();
  
  courses.forEach(item => {
    const course = item.course;
    
    // Extract faculties
    if (course.faculties && course.faculties.length) {
      course.faculties.forEach(faculty => faculties.add(faculty));
    }
    
    // Extract course types
    if (course.type) {
      types.add(course.type);
    }
    
    // Extract languages
    if (course.language) {
      languages.add(course.language);
    }
    
    // Extract semesters
    if (course.semester) {
      semesters.add(course.semester);
    }
  });
  
  return {
    faculties: Array.from(faculties).sort(),
    types: Array.from(types).sort(),
    languages: Array.from(languages).sort(),
    semesters: Array.from(semesters).sort()
  };
};

export const filterCourses = (
  courses: CourseTreeItem[],
  searchQuery: string,
  filters: FilterOptions
): CourseTreeItem[] => {
  if (
    searchQuery.trim() === '' && 
    !filters.faculties.size && 
    !filters.types.size && 
    !filters.languages.size && 
    !filters.semesters.size
  ) {
    return courses;
  }
  
  const lowercaseQuery = searchQuery.trim().toLowerCase();
  
  return courses.filter(item => {
    const course = item.course;
    
    // Search filtering
    const matchesSearch = lowercaseQuery === '' || 
      course.name.toLowerCase().includes(lowercaseQuery) ||
      (course.description && course.description.toLowerCase().includes(lowercaseQuery)) ||
      (course.number && course.number.toLowerCase().includes(lowercaseQuery));
    
    if (!matchesSearch) return false;
    
    // Faculty filtering
    const passesFacultyFilter = !filters.faculties.size || 
      (course.faculties && course.faculties.some(faculty => filters.faculties.has(faculty)));
    
    // Type filtering
    const passesTypeFilter = !filters.types.size || 
      (course.type && filters.types.has(course.type));
    
    // Language filtering
    const passesLanguageFilter = !filters.languages.size || 
      (course.language && filters.languages.has(course.language));
    
    // Semester filtering
    const passesSemesterFilter = !filters.semesters.size || 
      (course.semester && filters.semesters.has(course.semester));
    
    return passesFacultyFilter && passesTypeFilter && passesLanguageFilter && passesSemesterFilter;
  });
};

export const countFilteredCourses = (
  allCourses: CourseTreeItem[],
  filteredCourses: CourseTreeItem[]
): Record<string, Record<string, number>> => {
  // Initialize counters
  const counters: Record<string, Record<string, number>> = {
    faculties: {},
    types: {},
    languages: {},
    semesters: {}
  };
  
  // Count filtered courses
  filteredCourses.forEach(item => {
    const course = item.course;
    
    // Count faculties
    if (course.faculties && course.faculties.length) {
      course.faculties.forEach(faculty => {
        counters.faculties[faculty] = (counters.faculties[faculty] || 0) + 1;
      });
    }
    
    // Count types
    if (course.type) {
      counters.types[course.type] = (counters.types[course.type] || 0) + 1;
    }
    
    // Count languages
    if (course.language) {
      counters.languages[course.language] = (counters.languages[course.language] || 0) + 1;
    }
    
    // Count semesters
    if (course.semester) {
      counters.semesters[course.semester] = (counters.semesters[course.semester] || 0) + 1;
    }
  });
  
  return counters;
};
