
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Course } from "@/services/types";
import { toggleFavorite } from "@/services/favorites/favoriteService";
import { CourseInfoCards } from "./CourseInfoCards";
import { CourseTabsSection } from "./CourseTabsSection";
import { CourseAdditionalInfo } from "./CourseAdditionalInfo";
import { CourseLocationInfo } from "./CourseLocationInfo";
import { CourseExternalLinks } from "./CourseExternalLinks";

interface CourseDetailProps {
  course: Course | null;
  path?: string[];
  favorites: string[];
  onToggleFavorite?: (courseId: string, isFavorited: boolean) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ 
  course, 
  path,
  favorites = [],
  onToggleFavorite
}) => {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset course data when course changes
    setCourseData(null);

    if (course) {
      console.log("CourseDetail received course:", course);
      setCourseData(course);
      
      // Check favorite status if we have a course ID
      if (course.id) {
        checkFavoriteStatus(course.id);
      }
    }
  }, [course, favorites]);

  // Check if course is in favorites
  const checkFavoriteStatus = (courseId: string) => {
    const status = favorites.includes(courseId);
    console.log(`Course ${courseId} favorite status:`, status);
    setIsFavorited(status);
  };

  const handleToggleFavorite = async () => {
    if (!courseData?.id) return;

    setLoading(true);
    
    try {
      // First try the callback if provided
      if (onToggleFavorite) {
        await onToggleFavorite(courseData.id, isFavorited);
        setIsFavorited(!isFavorited);
      } else {
        // Fallback to direct toggle
        const success = await toggleFavorite(courseData.id, isFavorited);
        if (success) {
          setIsFavorited(!isFavorited);
          toast({
            title: isFavorited ? "Removed from favorites" : "Added to favorites",
            description: isFavorited 
              ? "Course has been removed from your favorites" 
              : "Course has been added to your favorites",
            variant: "default",
          });
        } else {
          toast({
            title: "Action failed",
            description: "Could not update favorites. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Action failed",
        description: "An error occurred while updating favorites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">
          Loading course details...
        </p>
      </div>
    );
  }

  // Format breadcrumb from path
  const breadcrumb = path && path.length > 0 ? path.join(" / ") : "";

  return (
    <div className="p-8 animate-fade-in overflow-y-auto h-full">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="text-xs tracking-wide text-muted-foreground mb-6">
            {breadcrumb}
          </div>
        )}

        {/* Header section with favorite button */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {/* Course number badge */}
            {courseData.number && (
              <div className="inline-block bg-muted text-xs px-2 py-1 mb-3">
                {courseData.number}
              </div>
            )}

            {/* Course name */}
            <h1 className="text-2xl font-medium text-tree-gray mb-2">
              {courseData.name}
            </h1>

            {/* Course subtitle info */}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {courseData.type && <span>{courseData.type}</span>}
              {courseData.type && courseData.semester && <span>•</span>}
              {courseData.semester && <span>{courseData.semester}</span>}
              {(courseData.type || courseData.semester) &&
                courseData.professor && <span>•</span>}
              {courseData.professor && <span>{courseData.professor}</span>}
            </div>
          </div>

          {/* Favorite button */}
          {courseData.id && (
            <Button
              variant="outline"
              size="icon"
              className={`${
                isFavorited
                  ? "text-red-500 border-red-500 hover:bg-red-50"
                  : "text-muted-foreground"
              }`}
              onClick={handleToggleFavorite}
              disabled={loading}
            >
              <Heart className={`${isFavorited ? "fill-red-500" : ""}`} />
            </Button>
          )}
        </div>

        {/* Key Information Cards - Always Visible */}
        <CourseInfoCards courseData={courseData} />

        {/* Tabs for different content sections */}
        <CourseTabsSection courseData={courseData} />
        
        {/* Assessment Details Section */}
        <CourseAdditionalInfo courseData={courseData} />

        {/* Location Information Section */}
        <CourseLocationInfo courseData={courseData} />

        {/* External links section */}
        <CourseExternalLinks courseData={courseData} />
      </div>
    </div>
  );
};

export default CourseDetail;
