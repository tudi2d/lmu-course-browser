
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseTreeItem } from "@/services/courseService";
import { Json } from "@/integrations/supabase/types";

// Function to import tree data from a tree.json file
export const importTreeData = async (treeData: CourseTreeItem[]): Promise<boolean> => {
  try {
    // First, insert all courses
    for (const item of treeData) {
      // Insert the course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          number: item.course.number || null,
          name: item.course.name,
          type: item.course.type || null,
          url: item.course.url || null,
          detail_url: item.course.detail_url || null,
          professor: item.course.professor || null,
          semester: item.course.semester || null
        })
        .select('id')
        .single();

      if (courseError) {
        console.error('Error inserting course:', courseError);
        return false;
      }

      const courseId = courseData.id;

      // Insert the tree item with reference to the course
      const { error: treeError } = await supabase
        .from('course_tree')
        .insert({
          path: item.path,
          course_id: courseId
        });

      if (treeError) {
        console.error('Error inserting tree item:', treeError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Unexpected error importing tree data:', error);
    return false;
  }
};

// Function to import course details from a details.json file
export const importCourseDetails = async (courseDetails: Course[]): Promise<boolean> => {
  try {
    for (const detail of courseDetails) {
      if (!detail.name) {
        console.error('Course name is required');
        continue;
      }

      // Find the course by name
      const { data: existingCourse, error: findError } = await supabase
        .from('courses')
        .select('id')
        .eq('name', detail.name)
        .maybeSingle();

      if (findError) {
        console.error(`Error finding course "${detail.name}":`, findError);
        continue;
      }

      if (!existingCourse) {
        console.error(`Course "${detail.name}" not found`);
        continue;
      }

      // Update the course with additional details
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          schedule: detail.schedule as unknown as Json, // Convert Schedule[] to Json
          sws: detail.sws || null,
          max_participants: detail.max_participants || null,
          language: detail.language || null,
          instructors: detail.instructors || null,
          description: detail.description || null,
          literature: detail.literature || null,
          requirements: detail.requirements || null,
          target_group: detail.target_group || null,
          registration_info: detail.registration_info || null,
          evaluation_method: detail.evaluation_method || null,
          faculties: detail.faculties || null,
          departments: detail.departments || null,
          degree_programs: detail.degree_programs || null,
          modules: detail.modules || null,
          registration_periods: detail.registration_periods || null,
          has_content: detail.has_content || false,
          processing_date: detail.processing_date || null
        })
        .eq('id', existingCourse.id);

      if (updateError) {
        console.error(`Error updating course "${detail.name}":`, updateError);
        continue;
      }
    }

    return true;
  } catch (error) {
    console.error('Unexpected error importing course details:', error);
    return false;
  }
};
