import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TreeNode from './TreeNode';
import CourseDetail from './CourseDetail';
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon } from 'lucide-react';
import { fetchCourseTree, fetchCourseDetails, fetchFavorites, CourseTreeItem } from '@/services/courseService';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import CalendarModal from './CalendarModal';

interface TreeNode {
  name: string;
  children: { [key: string]: TreeNode };
  courses: CourseTreeItem[];
}

const TreeBrowser: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode>({ name: 'root', children: {}, courses: [] });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<CourseTreeItem | null>(null);
  const [courseDetails, setCoursedDetails] = useState<any | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all-courses');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const isMobile = useIsMobile();
  
  const buildTree = useCallback((courseItems: CourseTreeItem[]) => {
    const root: TreeNode = { name: 'root', children: {}, courses: [] };
    
    courseItems.forEach(item => {
      let currentNode = root;
      
      item.path.forEach((pathPart, idx) => {
        if (!currentNode.children[pathPart]) {
          currentNode.children[pathPart] = { name: pathPart, children: {}, courses: [] };
        }
        currentNode = currentNode.children[pathPart];
        
        if (idx === item.path.length - 1) {
          currentNode.courses.push(item);
        }
      });
    });
    
    return root;
  }, []);
  
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      try {
        const courseTreeData = await fetchCourseTree();
        if (courseTreeData.length > 0) {
          const builtTree = buildTree(courseTreeData);
          setTreeData(builtTree);
          
          const firstLevelNodes = new Set<string>();
          courseTreeData.forEach(item => {
            if (item.path[0]) {
              firstLevelNodes.add(item.path[0]);
            }
          });
          setExpandedNodes(firstLevelNodes);
        } else {
          toast({
            title: "No courses found",
            description: "The course database is empty.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading course data:', error);
        toast({
          title: "Error loading courses",
          description: "Could not load course data from the database.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCourseData();
  }, [buildTree]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userFavorites = await fetchFavorites();
        setFavorites(userFavorites);
        setShowCalendar(userFavorites.length > 0);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    
    loadFavorites();
  }, []);

  useEffect(() => {
    const loadCourseDetails = async () => {
      if (selectedCourse && selectedCourse.course_id) {
        try {
          const details = await fetchCourseDetails(selectedCourse.course_id);
          if (details) {
            setCoursedDetails(details);
          } else {
            setCoursedDetails(selectedCourse.course);
          }
        } catch (error) {
          console.error('Error loading course details:', error);
          setCoursedDetails(selectedCourse.course);
        }
      } else {
        setCoursedDetails(null);
      }
    };

    loadCourseDetails();
  }, [selectedCourse]);
  
  const filteredTreeData = useMemo(() => {
    if (!searchQuery && activeTab === 'all-courses') {
      return treeData;
    }
    
    const filteredRoot: TreeNode = { name: 'root', children: {}, courses: [] };
    
    const courseMatchesSearch = (course: CourseTreeItem) => {
      if (!searchQuery) return true;
      
      const lowerQuery = searchQuery.toLowerCase();
      return (
        course.course.name.toLowerCase().includes(lowerQuery) ||
        (course.course.number && course.course.number.toLowerCase().includes(lowerQuery)) ||
        (course.course.professor && course.course.professor.toLowerCase().includes(lowerQuery)) ||
        (course.course.type && course.course.type.toLowerCase().includes(lowerQuery))
      );
    };
    
    const filterNode = (node: TreeNode, parentPath: string[] = []): TreeNode | null => {
      const filteredNode: TreeNode = { name: node.name, children: {}, courses: [] };
      let hasMatchingContent = false;
      
      node.courses.forEach(course => {
        const isFavorite = course.course.id && favorites.includes(course.course.id);
        const shouldInclude = courseMatchesSearch(course) && 
                            (activeTab === 'all-courses' || (activeTab === 'favorites' && isFavorite));
        
        if (shouldInclude) {
          filteredNode.courses.push(course);
          hasMatchingContent = true;
        }
      });
      
      Object.entries(node.children).forEach(([key, childNode]) => {
        const childPath = [...parentPath, key];
        const filteredChild = filterNode(childNode, childPath);
        
        if (filteredChild) {
          filteredNode.children[key] = filteredChild;
          hasMatchingContent = true;
        }
      });
      
      return hasMatchingContent ? filteredNode : null;
    };
    
    const filtered = filterNode(treeData);
    return filtered || { name: 'root', children: {}, courses: [] };
  }, [treeData, searchQuery, activeTab, favorites]);
  
  const handleNodeToggle = (nodePath: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  };
  
  const renderTreeNodes = (node: TreeNode, level: number = 0, parentPath: string[] = []) => {
    if (!node) return null;
    
    const nodeEntries = Object.entries(node.children);
    
    return (
      <>
        {nodeEntries.map(([name, childNode]) => {
          const currentPath = [...parentPath, name];
          const nodePath = currentPath.join('/');
          const isExpanded = expandedNodes.has(name) || expandedNodes.has(nodePath);
          const hasChildren = Object.keys(childNode.children).length > 0;
          const hasCourses = childNode.courses.length > 0;
          
          const matchesSearch = searchQuery && name.toLowerCase().includes(searchQuery.toLowerCase());
          
          return (
            <React.Fragment key={nodePath}>
              <TreeNode
                name={name}
                level={level}
                hasChildren={hasChildren || hasCourses}
                isExpanded={isExpanded}
                isActive={selectedCourse?.path.join('/') === currentPath.join('/')}
                isHighlighted={matchesSearch}
                onToggle={() => handleNodeToggle(nodePath)}
                onClick={() => handleNodeToggle(nodePath)}
              >
                {isExpanded && hasChildren && renderTreeNodes(childNode, level + 1, currentPath)}
                {isExpanded && hasCourses && childNode.courses.map((courseItem, index) => {
                  const isFavorite = courseItem.course.id && favorites.includes(courseItem.course.id);
                  const courseMatchesSearch = searchQuery && (
                    courseItem.course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (courseItem.course.number && courseItem.course.number.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (courseItem.course.professor && courseItem.course.professor.toLowerCase().includes(searchQuery.toLowerCase()))
                  );
                  
                  return (
                    <div key={`course-${index}`} className={`animate-slide-in ${courseMatchesSearch ? 'bg-accent/20' : ''}`}>
                      <TreeNode
                        name={courseItem.course.name}
                        level={level + 1}
                        hasChildren={false}
                        isActive={selectedCourse === courseItem}
                        isHighlighted={courseMatchesSearch}
                        isFavorite={isFavorite}
                        onToggle={() => {}}
                        onClick={() => setSelectedCourse(courseItem)}
                      />
                    </div>
                  );
                })}
              </TreeNode>
            </React.Fragment>
          );
        })}
      </>
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-0' : isMobile ? 'w-full h-1/2' : 'w-full md:w-1/2 lg:w-1/3'
        } ${isMobile && selectedCourse ? 'hidden' : 'flex'}`}
      >
        <div className="flex flex-col h-full w-full">
          <div className="p-4 border-b border-muted">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2"
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="all-courses">All Courses</TabsTrigger>
              <TabsTrigger className="flex-1" value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {!isMobile && activeTab === 'favorites' && (
            <div className="p-2 border-b border-muted">
              <CalendarModal />
            </div>
          )}
          
          <div className="overflow-y-auto h-full">
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground">Loading courses...</div>
            ) : activeTab === 'favorites' && favorites.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                You don't have any favorite courses yet. Browse courses and click the heart icon to add favorites.
              </div>
            ) : (
              renderTreeNodes(filteredTreeData)
            )}
          </div>
        </div>
      </div>
      
      {!isMobile && (
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md p-1.5 rounded-r-sm hover:bg-muted transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={16} className="text-tree-gray" />
          ) : (
            <ChevronLeft size={16} className="text-tree-gray" />
          )}
        </button>
      )}
      
      <div className={`bg-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-full' : isMobile ? 'w-full h-1/2' : 'w-full md:w-1/2 lg:w-2/3'
      } ${isMobile && !selectedCourse ? 'hidden' : 'flex flex-col'}`}>
        {isMobile && selectedCourse && (
          <div className="p-2 border-b">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center" 
              onClick={() => setSelectedCourse(null)}
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to courses
            </Button>
          </div>
        )}
        
        {favorites.length > 0 && (
          <Accordion type="single" collapsible className="w-full border-b">
            <AccordionItem value="calendar" className="border-0">
              <AccordionTrigger className="px-6 py-3">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Your Schedule
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  <p className="text-sm mb-3">Quick view of your upcoming course sessions:</p>
                  <div className="flex justify-between mb-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/calendar">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Calendar View
                      </a>
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        <div className="flex-1 overflow-y-auto">
          <CourseDetail 
            course={courseDetails ?? null} 
            path={selectedCourse?.path}
          />
        </div>
      </div>
    </div>
  );
};

export default TreeBrowser;
