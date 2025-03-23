
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TreeNode from './TreeNode';
import CourseDetail from './CourseDetail';
import HighlightedText from './HighlightedText';
import FilterPanel, { FilterCategory } from './FilterPanel';
import OnboardingGuide from './OnboardingGuide';
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { fetchCourseTree, fetchCourseDetails, CourseTreeItem, Course } from '@/services/courseService';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  extractUniqueFilterValues, 
  filterCourses, 
  countFilteredCourses,
  FilterOptions 
} from '@/utils/filterUtils';

interface TreeNode {
  name: string;
  children: { [key: string]: TreeNode };
  courses: CourseTreeItem[];
}

const TreeBrowser: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode>({ name: 'root', children: {}, courses: [] });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedCourse, setSelectedCourse] = useState<CourseTreeItem | null>(null);
  const [courseDetails, setCoursedDetails] = useState<Course | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<CourseTreeItem[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    faculties: new Set<string>(),
    types: new Set<string>(),
    languages: new Set<string>(),
    semesters: new Set<string>()
  });
  
  const isMobile = useIsMobile();
  
  // Fetch course data from local JSON
  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      try {
        const courseTreeData = await fetchCourseTree();
        if (courseTreeData.length > 0) {
          setAllCourses(courseTreeData);
          const builtTree = buildTree(courseTreeData);
          setTreeData(builtTree);
          
          // Auto-expand first level
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
  }, []);

  // Load course details when a course is selected
  useEffect(() => {
    const loadCourseDetails = async () => {
      if (selectedCourse && selectedCourse.course_id) {
        try {
          // Use the courseNumber to fetch details
          const details = await fetchCourseDetails(selectedCourse.course_id);
          if (details) {
            setCoursedDetails(details);
          } else {
            // If no details in the database, use the data from JSON
            setCoursedDetails(selectedCourse.course);
          }
        } catch (error) {
          console.error('Error loading course details:', error);
          // Fallback to JSON data if database query fails
          setCoursedDetails(selectedCourse.course);
        }
      } else {
        setCoursedDetails(null);
      }
    };

    loadCourseDetails();
  }, [selectedCourse]);
  
  // Apply filtering and search to courses
  const filteredCourses = useMemo(() => {
    return filterCourses(allCourses, searchQuery, filters);
  }, [allCourses, searchQuery, filters]);
  
  // Build tree data from filtered courses
  const filteredTreeData = useMemo(() => {
    return buildTree(filteredCourses);
  }, [filteredCourses]);
  
  // Get unique filter values and counts
  const filterOptions = useMemo(() => {
    const uniqueValues = extractUniqueFilterValues(allCourses);
    const counts = countFilteredCourses(allCourses, filteredCourses);
    
    const createFilterCategory = (
      id: string, 
      name: string, 
      values: string[], 
      countMap: Record<string, number>
    ): FilterCategory => ({
      id,
      name,
      items: values.map(value => ({
        id: value,
        name: value,
        count: countMap[value] || 0
      }))
    });
    
    return [
      createFilterCategory('semesters', 'Semester', uniqueValues.semesters, counts.semesters),
      createFilterCategory('types', 'Course Type', uniqueValues.types, counts.types),
      createFilterCategory('languages', 'Language', uniqueValues.languages, counts.languages),
      createFilterCategory('faculties', 'Faculty', uniqueValues.faculties, counts.faculties)
    ];
  }, [allCourses, filteredCourses]);
  
  // Build tree data from flat data
  const buildTree = useCallback((courseItems: CourseTreeItem[]) => {
    const root: TreeNode = { name: 'root', children: {}, courses: [] };
    
    courseItems.forEach(item => {
      let currentNode = root;
      
      // Add path nodes
      item.path.forEach((pathPart, idx) => {
        if (!currentNode.children[pathPart]) {
          currentNode.children[pathPart] = { name: pathPart, children: {}, courses: [] };
        }
        currentNode = currentNode.children[pathPart];
        
        // Add course to leaf node
        if (idx === item.path.length - 1) {
          currentNode.courses.push(item);
        }
      });
    });
    
    return root;
  }, []);
  
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
  
  const handleFilterChange = (categoryId: string, itemId: string, isChecked: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[categoryId as keyof FilterOptions]) {
        newFilters[categoryId as keyof FilterOptions] = new Set<string>();
      }
      
      const filterSet = newFilters[categoryId as keyof FilterOptions];
      
      if (isChecked) {
        filterSet.add(itemId);
      } else {
        filterSet.delete(itemId);
      }
      
      return newFilters;
    });
  };
  
  const clearFilters = () => {
    setFilters({
      faculties: new Set<string>(),
      types: new Set<string>(),
      languages: new Set<string>(),
      semesters: new Set<string>()
    });
    setSearchQuery('');
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
          
          return (
            <React.Fragment key={nodePath}>
              <TreeNode
                name={name}
                level={level}
                hasChildren={hasChildren || hasCourses}
                isExpanded={isExpanded}
                isActive={selectedCourse?.path.join('/') === currentPath.join('/')}
                onToggle={() => handleNodeToggle(nodePath)}
                onClick={() => handleNodeToggle(nodePath)}
              >
                {isExpanded && hasChildren && renderTreeNodes(childNode, level + 1, currentPath)}
                {isExpanded && hasCourses && childNode.courses.map((courseItem, index) => (
                  <div key={`course-${index}`} className="animate-slide-in">
                    <TreeNode
                      name={
                        <HighlightedText 
                          text={courseItem.course.name} 
                          highlight={searchQuery}
                        />
                      }
                      level={level + 1}
                      hasChildren={false}
                      isActive={selectedCourse === courseItem}
                      onToggle={() => {}}
                      onClick={() => setSelectedCourse(courseItem)}
                    />
                  </div>
                ))}
              </TreeNode>
            </React.Fragment>
          );
        })}
      </>
    );
  };
  
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((count, set) => count + set.size, 0);
  }, [filters]);
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar / Tree View */}
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-0' : 'w-full sm:w-1/2 md:w-1/3 lg:w-3/10'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Search bar */}
          <div className="p-4 border-b border-muted">
            <div className="relative search-input">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/20 border-0 rounded-sm pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-tree-accent transition-shadow"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <Button variant="outline" size="sm" className="calendar-button" asChild>
                <a href="/calendar">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar View
                </a>
              </Button>
              
              {activeFilterCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear filters ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>
          
          {/* Filters and Tree navigation */}
          <div className="flex h-full">
            <div className={`${isMobile ? 'hidden' : 'w-1/3 border-r border-muted'} filter-panel`}>
              {!isMobile && (
                <div className="p-3">
                  <FilterPanel 
                    categories={filterOptions}
                    selectedFilters={{
                      faculties: filters.faculties,
                      types: filters.types,
                      languages: filters.languages,
                      semesters: filters.semesters
                    }}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              )}
            </div>
            
            <div className={`overflow-y-auto ${isMobile ? 'w-full' : 'w-2/3'} course-tree`}>
              {isMobile && (
                <div className="p-2 border-b border-muted">
                  <FilterPanel 
                    categories={filterOptions}
                    selectedFilters={{
                      faculties: filters.faculties,
                      types: filters.types,
                      languages: filters.languages,
                      semesters: filters.semesters
                    }}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              )}
              
              {loading ? (
                <div className="p-4 text-sm text-muted-foreground">Loading courses...</div>
              ) : filteredCourses.length === 0 ? (
                <div className="p-4 text-sm text-center">
                  <p className="text-muted-foreground mb-2">No courses match your search criteria.</p>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              ) : (
                renderTreeNodes(filteredTreeData)
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar toggle button */}
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
      
      {/* Content View */}
      <div className={`bg-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-full' : 'w-full sm:w-1/2 md:w-2/3 lg:w-7/10'
      }`}>
        <CourseDetail 
          course={courseDetails ?? null} 
          path={selectedCourse?.path}
        />
      </div>
      
      {/* Onboarding Guide */}
      <OnboardingGuide />
    </div>
  );
};

export default TreeBrowser;
