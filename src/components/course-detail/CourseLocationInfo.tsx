
import React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course, LocationInfo } from "@/services/types";

interface CourseLocationInfoProps {
  courseData: Course;
}

export const CourseLocationInfo: React.FC<CourseLocationInfoProps> = ({ courseData }) => {
  // Skip rendering if no instructors data
  if (!courseData.instructors || !Array.isArray(courseData.instructors) || courseData.instructors.length === 0) {
    return null;
  }

  // Extract location names from instructors
  const locations = courseData.instructors.map((instructor) => {
    if (typeof instructor === 'string') {
      try {
        // Parse string if it's a JSON string
        const parsed = JSON.parse(instructor);
        return parsed.name ? parsed.name.replace(' Geschossplan', '') : null;
      } catch (e) {
        return instructor;
      }
    } else if (instructor && 'name' in instructor) {
      // It's already an object
      return instructor.name ? instructor.name.replace(' Geschossplan', '') : null;
    }
    return null;
  }).filter(Boolean); // Remove null/undefined values

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <div className="flex items-start mb-3">
        <MapPin className="w-5 h-5 mr-2 text-muted-foreground mt-0.5" />
        <h2 className="text-lg font-medium">Locations</h2>
      </div>
      
      <ul className="space-y-1 mb-3">
        {locations.map((location, index) => (
          <li key={index} className="text-sm">{location}</li>
        ))}
      </ul>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        asChild
      >
        <a 
          href="https://www.lmu.de/raumfinder/" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <MapPin className="mr-1 h-3.5 w-3.5" />
          <span>LMU Raumfinder</span>
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </Button>
    </div>
  );
};
