
import React, { useState, useEffect, useContext } from "react";
import { ExternalLink, Calendar, Heart, Building, Book, Users, GraduationCap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Course } from "@/services/courseService";
import { toggleFavorite } from "@/services/favoriteService";
import { Badge } from "@/components/ui/badge";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Faculty/Department Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Faculty</h3>
            </div>
            <div>
              {courseData.faculties && courseData.faculties.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {courseData.faculties.map((faculty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {faculty}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Not specified</p>
              )}
            </div>
          </div>

          {/* Language/Type Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Format</h3>
            </div>
            <div className="space-y-1">
              {courseData.language && (
                <p className="text-xs">
                  <span className="font-medium">Language:</span> {courseData.language}
                </p>
              )}
              {courseData.type && (
                <p className="text-xs">
                  <span className="font-medium">Type:</span> {courseData.type}
                </p>
              )}
              {courseData.sws && (
                <p className="text-xs">
                  <span className="font-medium">SWS:</span> {courseData.sws}
                </p>
              )}
            </div>
          </div>

          {/* Participants Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Participants</h3>
            </div>
            <div className="space-y-1">
              {courseData.max_participants !== undefined ? (
                <p className="text-xs">
                  <span className="font-medium">Max:</span> {courseData.max_participants}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">No limit specified</p>
              )}
              {courseData.target_group && (
                <p className="text-xs">
                  <span className="font-medium">Target Group:</span> {courseData.target_group.substring(0, 60)}
                  {courseData.target_group.length > 60 ? "..." : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for different content sections */}
        <Tabs defaultValue="details" className="mb-8">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            {courseData.description && (
              <TabsTrigger value="description">Description</TabsTrigger>
            )}
            {courseData.modules && (
              <TabsTrigger value="modules">Modules</TabsTrigger>
            )}
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {courseData.professor && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Professor
                  </h3>
                  <p className="text-sm">{courseData.professor}</p>
                </div>
              )}

              {courseData.type && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Type
                  </h3>
                  <p className="text-sm">{courseData.type}</p>
                </div>
              )}

              {courseData.semester && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Semester
                  </h3>
                  <p className="text-sm">{courseData.semester}</p>
                </div>
              )}

              {courseData.language && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Language
                  </h3>
                  <p className="text-sm">{courseData.language}</p>
                </div>
              )}

              {courseData.sws && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    SWS
                  </h3>
                  <p className="text-sm">{courseData.sws}</p>
                </div>
              )}

              {courseData.max_participants !== undefined &&
                courseData.max_participants >= 0 && (
                  <div className="mb-3">
                    <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Max Participants
                    </h3>
                    <p className="text-sm">{courseData.max_participants}</p>
                  </div>
                )}
                
              {courseData.departments && courseData.departments.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Departments
                  </h3>
                  <p className="text-sm">{courseData.departments.join(', ')}</p>
                </div>
              )}
              
              {courseData.degree_programs && courseData.degree_programs.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Degree Programs
                  </h3>
                  <p className="text-sm">{courseData.degree_programs.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Additional information sections in accordion */}
            <Accordion type="single" collapsible className="mt-6">
              {courseData.literature && (
                <AccordionItem value="literature">
                  <AccordionTrigger className="text-sm">
                    Literature
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {courseData.literature}
                  </AccordionContent>
                </AccordionItem>
              )}

              {courseData.requirements && (
                <AccordionItem value="requirements">
                  <AccordionTrigger className="text-sm">
                    Requirements
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {courseData.requirements}
                  </AccordionContent>
                </AccordionItem>
              )}

              {courseData.target_group && (
                <AccordionItem value="target_group">
                  <AccordionTrigger className="text-sm">
                    Target Group
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {courseData.target_group}
                  </AccordionContent>
                </AccordionItem>
              )}

              {courseData.registration_info && (
                <AccordionItem value="registration_info">
                  <AccordionTrigger className="text-sm">
                    Registration Info
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {courseData.registration_info}
                  </AccordionContent>
                </AccordionItem>
              )}

              {courseData.evaluation_method && (
                <AccordionItem value="evaluation_method">
                  <AccordionTrigger className="text-sm">
                    Evaluation Method
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {courseData.evaluation_method}
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {courseData.instructors && courseData.instructors.length > 0 && (
                <AccordionItem value="instructors">
                  <AccordionTrigger className="text-sm">
                    Instructors
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {courseData.instructors.join(', ')}
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {courseData.registration_periods && courseData.registration_periods.length > 0 && (
                <AccordionItem value="registration_periods">
                  <AccordionTrigger className="text-sm">
                    Registration Periods
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    {courseData.registration_periods.join(', ')}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="pt-4">
            {courseData.schedule && Array.isArray(courseData.schedule) && courseData.schedule.length > 0 ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseData.schedule.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.day || "—"}</TableCell>
                        <TableCell>
                          {item.time_start}{" "}
                          {item.time_end ? `- ${item.time_end}` : ""}{" "}
                          {item.rhythm}
                        </TableCell>
                        <TableCell>{item.room || "—"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-tree-accent"
                          >
                            <Calendar size={14} className="mr-1.5" />
                            iCal
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 text-sm text-muted-foreground">
                  {courseData.schedule[0].first_date && (
                    <p>First Date: {courseData.schedule[0].first_date}</p>
                  )}
                  {courseData.schedule[0].last_date && (
                    <p>Last Date: {courseData.schedule[0].last_date}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No schedule information available.
              </p>
            )}
          </TabsContent>

          {/* Description Tab */}
          {courseData.description && (
            <TabsContent value="description" className="pt-4">
              <div className="prose prose-sm max-w-none">
                <h2 className="text-lg font-medium mb-3">Description</h2>
                <p className="text-sm leading-relaxed">
                  {courseData.description}
                </p>
              </div>
            </TabsContent>
          )}
          
          {/* Modules Tab */}
          {courseData.modules && (
            <TabsContent value="modules" className="pt-4">
              <div className="prose prose-sm max-w-none">
                <h2 className="text-lg font-medium mb-3">Modules</h2>
                <div className="space-y-2">
                  {Array.isArray(courseData.modules) ? (
                    courseData.modules.map((module, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                        {typeof module === 'string' ? module : JSON.stringify(module)}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Module information is not available in a readable format.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* External links section */}
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
      </div>
    </div>
  );
};

export default CourseDetail;
