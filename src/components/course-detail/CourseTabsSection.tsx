
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/services/types";
import { CourseDetailsTab } from "./CourseDetailsTab";
import { CourseScheduleTab } from "./CourseScheduleTab";
import { CourseInstructorsTab } from "./CourseInstructorsTab";
import { CourseInstitutionsTab } from "./CourseInstitutionsTab";
import { CourseModulesTab } from "./CourseModulesTab";
import { CourseStudyProgramsTab } from "./CourseStudyProgramsTab";

interface CourseTabsSectionProps {
  courseData: Course;
}

export const CourseTabsSection: React.FC<CourseTabsSectionProps> = ({ courseData }) => {
  // We need at least one section with data to show the tabs
  const hasScheduleData = courseData.schedule && Array.isArray(courseData.schedule) && courseData.schedule.length > 0;
  const hasInstructorDetails = courseData.instructor_details && (
    Array.isArray(courseData.instructor_details) ? 
    courseData.instructor_details.length > 0 : 
    Object.keys(courseData.instructor_details).length > 0
  );
  const hasInstitutionDetails = courseData.institution_details && (
    Array.isArray(courseData.institution_details) ? 
    courseData.institution_details.length > 0 : 
    Object.keys(courseData.institution_details).length > 0
  );
  const hasModuleDetails = courseData.module_details && Array.isArray(courseData.module_details) && courseData.module_details.length > 0;
  const hasStudyPrograms = courseData.study_programs && Array.isArray(courseData.study_programs) && courseData.study_programs.length > 0;

  // Don't show tabs if there's no content to display
  if (!hasScheduleData && !hasInstructorDetails && !hasInstitutionDetails && !hasModuleDetails && !hasStudyPrograms) {
    return null;
  }

  // Determine default active tab based on available data
  let defaultTab = "details";
  if (!courseData.literature && !courseData.requirements && !courseData.target_group && !courseData.registration_info && !courseData.evaluation_method) {
    if (hasScheduleData) defaultTab = "schedule";
    else if (hasInstructorDetails) defaultTab = "instructors";
    else if (hasInstitutionDetails) defaultTab = "institutions";
    else if (hasModuleDetails) defaultTab = "modules";
    else if (hasStudyPrograms) defaultTab = "programs";
  }

  return (
    <Tabs defaultValue={defaultTab} className="mb-8">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        {hasScheduleData && <TabsTrigger value="schedule">Schedule</TabsTrigger>}
        {hasInstructorDetails && (
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
        )}
        {hasInstitutionDetails && (
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
        )}
        {hasModuleDetails && (
          <TabsTrigger value="modules">Modules</TabsTrigger>
        )}
        {hasStudyPrograms && (
          <TabsTrigger value="programs">Study Programs</TabsTrigger>
        )}
      </TabsList>

      {/* Details Tab */}
      <TabsContent value="details" className="pt-4">
        <CourseDetailsTab courseData={courseData} />
      </TabsContent>

      {/* Schedule Tab */}
      {hasScheduleData && (
        <TabsContent value="schedule" className="pt-4">
          <CourseScheduleTab courseData={courseData} />
        </TabsContent>
      )}

      {/* Instructors Tab */}
      {hasInstructorDetails && (
        <TabsContent value="instructors" className="pt-4">
          <CourseInstructorsTab instructors={courseData.instructor_details} />
        </TabsContent>
      )}
      
      {/* Institutions Tab */}
      {hasInstitutionDetails && (
        <TabsContent value="institutions" className="pt-4">
          <CourseInstitutionsTab institutions={courseData.institution_details} />
        </TabsContent>
      )}
      
      {/* Modules Tab */}
      {hasModuleDetails && (
        <TabsContent value="modules" className="pt-4">
          <CourseModulesTab modules={courseData.module_details} />
        </TabsContent>
      )}
      
      {/* Study Programs Tab */}
      {hasStudyPrograms && (
        <TabsContent value="programs" className="pt-4">
          <CourseStudyProgramsTab programs={courseData.study_programs} />
        </TabsContent>
      )}
    </Tabs>
  );
};
