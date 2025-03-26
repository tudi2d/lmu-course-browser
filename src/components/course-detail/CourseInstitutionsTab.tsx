
import React from "react";
import { ExternalLink } from "lucide-react";
import { InstitutionDetail } from "@/services/types";

interface CourseInstitutionsTabProps {
  institutions: InstitutionDetail | InstitutionDetail[];
}

export const CourseInstitutionsTab: React.FC<CourseInstitutionsTabProps> = ({ institutions }) => {
  // Don't render if no data or empty array
  if (!institutions || (Array.isArray(institutions) && institutions.length === 0)) {
    return <p className="text-muted-foreground">No institution information available.</p>;
  }

  // Handle both single institution and array of institutions
  const institutionList: InstitutionDetail[] = Array.isArray(institutions) ? institutions : [institutions];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-3">Institutions</h2>
      {institutionList.map((institution, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border">
          {institution.name && (
            <h3 className="text-base font-medium mb-2">{institution.name}</h3>
          )}
          
          <div className="space-y-2">
            {institution.id && (
              <div className="text-sm">
                <span className="text-muted-foreground">ID: </span>
                {institution.id}
              </div>
            )}
            
            {institution.professor && (
              <div className="text-sm">
                <span className="text-muted-foreground">Professor: </span>
                {institution.professor}
              </div>
            )}
            
            {institution.details_url && (
              <div>
                <a 
                  href={institution.details_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-flex items-center"
                >
                  More information <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
