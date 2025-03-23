
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoritesListProps {
  favorites: string[];
  courseNames: Record<string, string>;
  openTabs: Array<{ course_id: string; name: string; details: any }>;
  handleOpenCourse: (courseId: string, courseName: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  courseNames,
  openTabs,
  handleOpenCourse,
}) => {
  if (favorites.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        You don't have any favorite courses yet. Browse courses and
        click the heart icon to add favorites.
      </div>
    );
  }

  return (
    <div className="p-2">
      <ul className="space-y-1">
        {favorites.map((courseId) => {
          const courseName = courseNames[courseId] || courseId;
          const isActive = openTabs.some((tab) => tab.course_id === courseId);
          
          return (
            <li key={courseId}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left px-3 py-2 h-auto ${
                  isActive ? 'bg-muted' : ''
                }`}
                onClick={() => handleOpenCourse(courseId, courseName)}
              >
                <Heart className="h-4 w-4 mr-2 text-red-500 fill-red-500" />
                <span className="truncate">{courseName}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FavoritesList;
