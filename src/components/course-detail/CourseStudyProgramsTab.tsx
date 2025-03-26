
import React from "react";
import { StudyProgram } from "@/services/types";
import { Badge } from "@/components/ui/badge";

interface CourseStudyProgramsTabProps {
  programs: StudyProgram[];
}

export const CourseStudyProgramsTab: React.FC<CourseStudyProgramsTabProps> = ({ programs }) => {
  // Don't render if no data or empty array
  if (!programs || programs.length === 0) {
    return <p className="text-muted-foreground">No study program information available.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-3">Study Programs</h2>
      {programs.map((program, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border">
          {program.program && (
            <h3 className="text-base font-medium mb-2">{program.program}</h3>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {program.degree && (
              <Badge variant="outline" className="bg-gray-50">
                {program.degree}
              </Badge>
            )}
            
            {program.type && (
              <Badge variant="outline" className="bg-gray-50">
                {program.type}
              </Badge>
            )}
            
            {program.ects && (
              <Badge variant="outline" className="bg-gray-50">
                {program.ects}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
