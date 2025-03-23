
import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course as CourseType, isFavorite, toggleFavorite } from '@/services/courseService';

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
  course: CourseType | null;
  path?: string[];
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, path }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset favorite state when course changes
    setIsFavorited(false);
    
    // Check favorite status when course changes
    if (course?.id) {
      checkFavoriteStatus(course.id);
    }
  }, [course]);

  const checkFavoriteStatus = async (courseId: string) => {
    const status = await isFavorite(courseId);
    setIsFavorited(status);
  };

  const handleToggleFavorite = async () => {
    if (!course?.id) return;
    
    setLoading(true);
    const newStatus = await toggleFavorite(course.id);
    setIsFavorited(newStatus);
    setLoading(false);
  };
  
  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm">Select a course to view details</p>
      </div>
    );
  }

  // Format breadcrumb from path
  const breadcrumb = path ? path.join(' / ') : '';

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
            {course.number && (
              <div className="inline-block bg-muted text-xs px-2 py-1 mb-3">
                {course.number}
              </div>
            )}
            
            {/* Course name */}
            <h1 className="text-2xl font-medium text-tree-gray mb-2">{course.name}</h1>
            
            {/* Course subtitle info */}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {course.type && <span>{course.type}</span>}
              {course.type && course.semester && <span>•</span>}
              {course.semester && <span>{course.semester}</span>}
              {(course.type || course.semester) && course.professor && <span>•</span>}
              {course.professor && <span>{course.professor}</span>}
            </div>
          </div>
          
          {/* Favorite button */}
          <Button
            variant="outline"
            size="icon"
            className={`${isFavorited ? 'text-red-500 border-red-500 hover:bg-red-50' : 'text-muted-foreground'}`}
            onClick={handleToggleFavorite}
            disabled={loading}
          >
            <Heart className={`${isFavorited ? 'fill-red-500' : ''}`} />
          </Button>
        </div>
        
        {/* Tabs for different content sections */}
        <Tabs defaultValue="details" className="mb-8">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            {course.description && <TabsTrigger value="description">Description</TabsTrigger>}
          </TabsList>
          
          {/* Details Tab */}
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {course.professor && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Professor</h3>
                  <p className="text-sm">{course.professor}</p>
                </div>
              )}
              
              {course.type && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Type</h3>
                  <p className="text-sm">{course.type}</p>
                </div>
              )}
              
              {course.semester && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Semester</h3>
                  <p className="text-sm">{course.semester}</p>
                </div>
              )}
              
              {course.language && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Language</h3>
                  <p className="text-sm">{course.language}</p>
                </div>
              )}
              
              {course.sws && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">SWS</h3>
                  <p className="text-sm">{course.sws}</p>
                </div>
              )}
              
              {course.max_participants !== undefined && course.max_participants >= 0 && (
                <div className="mb-3">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Max Participants</h3>
                  <p className="text-sm">{course.max_participants}</p>
                </div>
              )}
            </div>
            
            {/* Additional information sections in accordion */}
            <Accordion type="single" collapsible className="mt-6">
              {course.literature && (
                <AccordionItem value="literature">
                  <AccordionTrigger className="text-sm">Literature</AccordionTrigger>
                  <AccordionContent className="text-sm">{course.literature}</AccordionContent>
                </AccordionItem>
              )}
              
              {course.requirements && (
                <AccordionItem value="requirements">
                  <AccordionTrigger className="text-sm">Requirements</AccordionTrigger>
                  <AccordionContent className="text-sm">{course.requirements}</AccordionContent>
                </AccordionItem>
              )}
              
              {course.target_group && (
                <AccordionItem value="target_group">
                  <AccordionTrigger className="text-sm">Target Group</AccordionTrigger>
                  <AccordionContent className="text-sm">{course.target_group}</AccordionContent>
                </AccordionItem>
              )}
              
              {course.registration_info && (
                <AccordionItem value="registration_info">
                  <AccordionTrigger className="text-sm">Registration Info</AccordionTrigger>
                  <AccordionContent className="text-sm">{course.registration_info}</AccordionContent>
                </AccordionItem>
              )}
              
              {course.evaluation_method && (
                <AccordionItem value="evaluation_method">
                  <AccordionTrigger className="text-sm">Evaluation Method</AccordionTrigger>
                  <AccordionContent className="text-sm">{course.evaluation_method}</AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>
          
          {/* Schedule Tab */}
          <TabsContent value="schedule" className="pt-4">
            {course.schedule && course.schedule.length > 0 ? (
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
                    {course.schedule.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.day || '—'}</TableCell>
                        <TableCell>
                          {item.time_start} {item.time_end ? `- ${item.time_end}` : ''} {item.rhythm}
                        </TableCell>
                        <TableCell>{item.room || '—'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-tree-accent">
                            <Calendar size={14} className="mr-1.5" />
                            iCal
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>First Date: {course.schedule[0].first_date || 'N/A'}</p>
                  <p>Last Date: {course.schedule[0].last_date || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No schedule information available.</p>
            )}
          </TabsContent>
          
          {/* Description Tab */}
          {course.description && (
            <TabsContent value="description" className="pt-4">
              <div className="prose prose-sm max-w-none">
                <h2 className="text-lg font-medium mb-3">Description</h2>
                <p className="text-sm leading-relaxed">{course.description}</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        {/* Links */}
        {(course.url || course.detail_url) && (
          <div className="mt-8 pt-6 border-t border-muted">
            <h2 className="text-lg font-medium mb-3">Links</h2>
            <div className="flex flex-col gap-2">
              {course.url && (
                <a 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-tree-accent hover:underline"
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  Course Page
                </a>
              )}
              {course.detail_url && (
                <a 
                  href={course.detail_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-tree-accent hover:underline"
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  Course Details
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
