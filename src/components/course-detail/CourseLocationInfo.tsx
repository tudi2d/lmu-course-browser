
import React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course } from "@/services/types";

interface CourseLocationInfoProps {
  courseData: Course;
}

export const CourseLocationInfo: React.FC<CourseLocationInfoProps> = ({ courseData }) => {
  if (!courseData.instructors || courseData.instructors.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-medium">Locations</h2>
      </div>
      <div className="space-y-1">
        {courseData.instructors.map((location, idx) => (
          <p key={idx} className="text-sm">{location.name}</p>
        ))}
        <div className="mt-3">
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://www.lmu.de/raumfinder/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <MapPin size={14} className="mr-1.5" />
              Find Rooms
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
