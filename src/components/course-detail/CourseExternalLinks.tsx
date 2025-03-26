
import React from "react";
import { ExternalLink, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/services/types";

interface CourseExternalLinksProps {
  courseData: Course;
}

export const CourseExternalLinks: React.FC<CourseExternalLinksProps> = ({ courseData }) => {
  if (!courseData.url && !courseData.detail_url) {
    return null;
  }

  return (
    <div className="mt-6 space-y-2">
      {courseData.url && (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={courseData.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} className="mr-2" />
            Visit course page
          </a>
        </Button>
      )}
      
      {courseData.detail_url && courseData.detail_url !== courseData.url && (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={courseData.detail_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Book size={14} className="mr-2" />
            View detailed course description
          </a>
        </Button>
      )}
    </div>
  );
};
