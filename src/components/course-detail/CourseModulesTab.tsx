
import React from "react";
import { ExternalLink } from "lucide-react";
import { ModuleDetail } from "@/services/types";
import { Badge } from "@/components/ui/badge";

interface CourseModulesTabProps {
  modules: ModuleDetail[];
}

export const CourseModulesTab: React.FC<CourseModulesTabProps> = ({ modules }) => {
  // Don't render if no data or empty array
  if (!modules || modules.length === 0) {
    return <p className="text-muted-foreground">No module information available.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-3">Module Details</h2>
      {modules.map((module, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border">
          {module.module_name && (
            <h3 className="text-base font-medium mb-2">
              {module.module_name}
              {module.module_number && <span className="text-sm font-normal text-muted-foreground ml-2">({module.module_number})</span>}
            </h3>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="space-y-2">
              {module.program && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Program: </span>
                  {module.program}
                </div>
              )}
              
              {module.degree && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Degree: </span>
                  {module.degree}
                </div>
              )}
              
              {module.type && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Type: </span>
                  {module.type}
                </div>
              )}
              
              {module.ects && (
                <div className="text-sm">
                  <span className="text-muted-foreground">ECTS: </span>
                  {module.ects}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {module.version && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Version: </span>
                  {module.version}
                </div>
              )}
              
              {module.exam_number && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Exam Number: </span>
                  {module.exam_number}
                </div>
              )}
            </div>
          </div>
          
          {module.details_url && (
            <div className="mt-3">
              <a 
                href={module.details_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center"
              >
                Module details <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
