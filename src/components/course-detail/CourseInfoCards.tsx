
import React from "react";
import { Course } from "@/services/types";

interface CourseInfoCardsProps {
  courseData: Course;
}

export const CourseInfoCards: React.FC<CourseInfoCardsProps> = ({ courseData }) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Description if available */}
      {courseData.description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{courseData.description}</p>
        </div>
      )}
      
      {/* Short comment if available */}
      {courseData.short_comment && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Summary</h3>
          <p className="text-sm text-muted-foreground">{courseData.short_comment}</p>
        </div>
      )}
      
      {/* Long text if available */}
      {courseData.long_text && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Details</h3>
          <p className="text-sm text-muted-foreground">{courseData.long_text}</p>
        </div>
      )}
    </div>
  );
};
