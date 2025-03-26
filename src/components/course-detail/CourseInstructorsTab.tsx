
import React from "react";
import { ExternalLink } from "lucide-react";
import { InstructorDetail } from "@/services/types";

interface CourseInstructorsTabProps {
  instructors: InstructorDetail | InstructorDetail[];
}

export const CourseInstructorsTab: React.FC<CourseInstructorsTabProps> = ({ instructors }) => {
  // Don't render if no data or empty array
  if (!instructors || (Array.isArray(instructors) && instructors.length === 0)) {
    return <p className="text-muted-foreground">No instructor information available.</p>;
  }

  // Handle both single instructor and array of instructors
  const instructorList: InstructorDetail[] = Array.isArray(instructors) ? instructors : [instructors];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-3">Instructors</h2>
      {instructorList.map((instructor, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border">
          {instructor.name && (
            <h3 className="text-base font-medium mb-2">{instructor.name}</h3>
          )}
          
          <div className="space-y-2">
            {instructor.id && (
              <div className="text-sm">
                <span className="text-muted-foreground">ID: </span>
                {instructor.id}
              </div>
            )}
            
            {instructor.url && (
              <div>
                <a 
                  href={instructor.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center"
                >
                  View profile <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
