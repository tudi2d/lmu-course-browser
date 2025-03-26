
import React from "react";
import { Course } from "@/services/types";

interface CourseAdditionalInfoProps {
  courseData: Course;
}

export const CourseAdditionalInfo: React.FC<CourseAdditionalInfoProps> = ({ courseData }) => {
  if (!courseData.assessment_details) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-medium mb-3">Assessment Details</h2>
      <div className="space-y-2">
        {Array.isArray(courseData.assessment_details) ? (
          courseData.assessment_details.map((assessment, idx) => (
            <div key={idx} className="bg-white p-3 rounded text-sm border">
              {typeof assessment === 'string' ? assessment : JSON.stringify(assessment)}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Assessment information is not available in a readable format.
          </p>
        )}
      </div>
    </div>
  );
};
