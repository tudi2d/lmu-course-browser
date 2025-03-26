
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/services/types";
import { CourseDetailsTab } from "./CourseDetailsTab";
import { CourseScheduleTab } from "./CourseScheduleTab";
import { GenericJSONTab } from "./GenericJSONTab";

interface CourseTabsSectionProps {
  courseData: Course;
}

export const CourseTabsSection: React.FC<CourseTabsSectionProps> = ({ courseData }) => {
  return (
    <Tabs defaultValue="details" className="mb-8">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        {courseData.instructor_details && (
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
        )}
        {courseData.institution_details && (
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
        )}
        {courseData.module_details && (
          <TabsTrigger value="modules">Modules</TabsTrigger>
        )}
        {courseData.study_programs && (
          <TabsTrigger value="programs">Study Programs</TabsTrigger>
        )}
      </TabsList>

      {/* Details Tab */}
      <TabsContent value="details" className="pt-4">
        <CourseDetailsTab courseData={courseData} />
      </TabsContent>

      {/* Schedule Tab */}
      <TabsContent value="schedule" className="pt-4">
        <CourseScheduleTab courseData={courseData} />
      </TabsContent>

      {/* Instructors Tab */}
      {courseData.instructor_details && (
        <TabsContent value="instructors" className="pt-4">
          <GenericJSONTab 
            title="Instructors" 
            data={courseData.instructor_details} 
          />
        </TabsContent>
      )}
      
      {/* Institutions Tab */}
      {courseData.institution_details && (
        <TabsContent value="institutions" className="pt-4">
          <GenericJSONTab 
            title="Institutions" 
            data={courseData.institution_details} 
          />
        </TabsContent>
      )}
      
      {/* Modules Tab */}
      {courseData.module_details && (
        <TabsContent value="modules" className="pt-4">
          <GenericJSONTab 
            title="Module Details" 
            data={courseData.module_details} 
          />
        </TabsContent>
      )}
      
      {/* Study Programs Tab */}
      {courseData.study_programs && (
        <TabsContent value="programs" className="pt-4">
          <GenericJSONTab 
            title="Study Programs" 
            data={courseData.study_programs} 
          />
        </TabsContent>
      )}
    </Tabs>
  );
};
