
import React, { useState, useEffect } from "react";
import { ExternalLink, Calendar, Heart } from "lucide-react";
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
import {
  Course,
  isFavorite,
  toggleFavorite,
  fetchCourseDetails,
} from "@/services/courseService";

interface Schedule {
  day: string;
  time_start: string;
  time_end: string;
  rhythm: string;
  first_date: string;
  last_date: string;
  room: string;
  room_link: string;
}

interface CourseDetailProps {
  course: unknown | null;
  path?: string[];
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, path }) => {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset course data and favorite state when course changes
    setCourseData(null);
    setIsFavorited(false);

    // Load course data
    const loadCourse = async () => {
      if (typeof course === "string") {
        // If course is just an ID string, fetch the details
        const details = await fetchCourseDetails(course);
        setCourseData(details);

        // Check favorite status
        if (details?.id) {
          checkFavoriteStatus(details.id);
        }
      } else if (course && typeof course === "object") {
        // If course is already an object with data
        setCourseData(course as Course);

        // Check favorite status
        if ((course as Course)?.id) {
          checkFavoriteStatus((course as Course).id as string);
        }
      }
    };

    loadCourse();
  }, [course]);

  const checkFavoriteStatus = async (courseId: string) => {
    const status = await isFavorite(courseId);
    setIsFavorited(status);
  };

  const handleToggleFavorite = async () => {
    if (!courseData?.id) return;

    setLoading(true);
    const success = await toggleFavorite(courseData.id, isFavorited);
    if (success) {
      setIsFavorited(!isFavorited);
    }
    setLoading(false);
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
        </div>

        {/* Tabs for different content sections */}
        <Tabs defaultValue="details" className="mb-8">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            {courseData.description && (
              <TabsTrigger value="description">Description</TabsTrigger>
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
            </Accordion>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="pt-4">
            {courseData.schedule && courseData.schedule.length > 0 ? (
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
                  <p>
                    First Date: {courseData.schedule[0].first_date || "N/A"}
                  </p>
                  <p>Last Date: {courseData.schedule[0].last_date || "N/A"}</p>
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
        </Tabs>

        {/* External links section */}
        {courseData.url && (
          <div className="mt-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
