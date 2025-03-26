
import React from "react";
import { Course } from "@/services/types";

interface CourseAdditionalInfoProps {
  courseData: Course;
}

export const CourseAdditionalInfo: React.FC<CourseAdditionalInfoProps> = ({ courseData }) => {
  // Don't render if no assessment_details
  if (!courseData.assessment_details) {
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
      return Object.entries(assessment_details).map(([key, value]) => (
        <div key={key} className="bg-white p-3 rounded text-sm border">
          <span className="font-medium">{key}: </span>
          {typeof value === 'string' ? value : JSON.stringify(value)}
        </div>
      ));
    }
    
    return <p className="text-sm text-muted-foreground">Assessment information is available but in an unrecognized format.</p>;
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-medium mb-3">Assessment Details</h2>
      <div className="space-y-2">
        {renderAssessmentDetails()}
      </div>
    </div>
  );
};
