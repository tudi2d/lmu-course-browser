
import React from "react";
import { Course, AssessmentDetail } from "@/services/types";

interface CourseAdditionalInfoProps {
  courseData: Course;
}

export const CourseAdditionalInfo: React.FC<CourseAdditionalInfoProps> = ({ courseData }) => {
  // Don't render if no assessment_details or if it's empty
  if (!courseData.assessment_details) {
    return null;
  }
  
  // If it's an object with type and period properties, check if they're both null/undefined/empty
  if (
    typeof courseData.assessment_details === 'object' && 
    !Array.isArray(courseData.assessment_details) &&
    (!courseData.assessment_details.type || courseData.assessment_details.type === "null") &&
    (!courseData.assessment_details.period || courseData.assessment_details.period === "null")
  ) {
    return null;
  }
  
  // If it's an empty string, don't render
  if (typeof courseData.assessment_details === 'string' && !courseData.assessment_details.trim()) {
    return null;
  }

  const renderAssessmentDetails = () => {
    const { assessment_details } = courseData;
    
    if (typeof assessment_details === 'string') {
      return <p className="text-sm text-muted-foreground">{assessment_details}</p>;
    }
    
    if (Array.isArray(assessment_details)) {
      return assessment_details.map((detail, idx) => (
        <div key={idx} className="bg-white p-3 rounded text-sm border">
          {typeof detail === 'string' ? detail : JSON.stringify(detail)}
        </div>
      ));
    }
    
    // Object type assessment details
    if (assessment_details && typeof assessment_details === 'object') {
      return Object.entries(assessment_details).map(([key, value]) => {
        // Skip null or empty values
        if (!value || value === "null") return null;
        
        return (
          <div key={key} className="bg-white p-3 rounded text-sm border">
            <span className="font-medium">{key}: </span>
            {typeof value === 'string' ? value : JSON.stringify(value)}
          </div>
        );
      }).filter(Boolean); // Filter out null entries
    }
    
    return <p className="text-sm text-muted-foreground">Assessment information is available but in an unrecognized format.</p>;
  };
  
  // Get the rendered assessment details
  const detailsContent = renderAssessmentDetails();
  
  // If the content is empty or just an empty array, don't render anything
  if (!detailsContent || (Array.isArray(detailsContent) && detailsContent.length === 0)) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-medium mb-3">Assessment Details</h2>
      <div className="space-y-2">
        {detailsContent}
      </div>
    </div>
  );
};
