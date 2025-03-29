
import React, { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourseTree } from "@/hooks/use-course-tree";
import { useCourseFavorites } from "@/hooks/use-course-favorites";
import { useCourseSearch } from "@/hooks/use-course-search";
import { useCourseTabs } from "@/hooks/use-course-tabs";
import { useFilteredTree } from "@/hooks/use-filtered-tree";
import { ScrollArea } from "@/components/ui/scroll-area";
import CourseSidebar from "./CourseSidebar";
import CourseTabsView from "./CourseTabsView";
import { toast } from "@/components/ui/use-toast";
import { CourseNode } from "@/services/courseService";

const TreeBrowser: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [courseNames, setCourseNames] = useState<Record<string, string>>({});
  
  // Use custom hooks to manage different aspects of state
  const { treeData, loading: treeLoading } = useCourseTree();
  const { 
    favorites, 
    loading: favoritesLoading, 
    addFavorite, 
    removeFavorite,
    isFavorite, 
    user 
  } = useCourseFavorites();

  // Extract course names from tree data when loaded
  useEffect(() => {
    if (treeData) {
      const extractCourseNames = (node: CourseNode, namesMap: Record<string, string>) => {
        if (node.value) {
          namesMap[node.value] = node.name;
        }
        
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => extractCourseNames(child, namesMap));
        }
        
        return namesMap;
      };
      
      const names = extractCourseNames(treeData, {});
      setCourseNames(names);
    }
  }, [treeData]);
  
  const { 
    searchQuery, 
    expandedNodes, 
    setSearchQuery, 
    handleNodeToggle, 
    clearSearch 
  } = useCourseSearch(treeData);
  
  const { 
    openTabs, 
    activeTabIndex, 
    activeTab, 
    setActiveTab, 
    handleOpenCourse, 
    handleCloseTab, 
    setActiveTabIndex 
  } = useCourseTabs();
  
  // Handle toggling favorite status
  const handleToggleFavorite = useCallback(async (courseId: string, isFavorited: boolean) => {
    // First find the course name from open tabs or tree data
    let courseName = courseNames[courseId] || "";
    const openTab = openTabs.find(tab => tab.course_id === courseId);
    if (openTab) {
      courseName = openTab.name;
    }
    
    if (isFavorited) {
      await removeFavorite(courseId, courseName);
    } else {
      await addFavorite(courseId, courseName);
    }
  }, [openTabs, addFavorite, removeFavorite, courseNames]);
  
  // Get filtered tree data
  const filteredTreeData = useFilteredTree(treeData, searchQuery, activeTab, favorites);

  // Loading state
  const loading = treeLoading || favoritesLoading;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      {/* Course sidebar/list */}
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed
            ? "w-0"
            : isMobile
            ? "w-full h-1/2" // 50% height for mobile
            : "w-full md:w-1/2 lg:w-1/3"
        }`}
      >
        <CourseSidebar
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          filteredTreeData={filteredTreeData}
          expandedNodes={expandedNodes}
          openTabs={openTabs}
          favorites={favorites}
          courseNames={courseNames}
          handleNodeToggle={handleNodeToggle}
          handleOpenCourse={handleOpenCourse}
          user={user}
          isMobile={isMobile}
        />
      </div>

      {/* Toggle sidebar button (only on desktop) */}
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

      {/* Course details view for mobile */}
      {isMobile && activeTabIndex !== -1 && (
        <div className="w-full h-1/2 border-t border-muted">
          <CourseTabsView
            openTabs={openTabs}
            activeTabIndex={activeTabIndex}
            setActiveTabIndex={setActiveTabIndex}
            handleCloseTab={handleCloseTab}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isMobile={isMobile}
          />
        </div>
      )}
      
      {/* Desktop course view */}
      {(!isMobile || (isMobile && activeTabIndex === -1)) && (
        <div
          className={`bg-white transition-all duration-300 ${
            sidebarCollapsed
              ? "w-full"
              : "w-full md:w-1/2 lg:w-2/3"
          } ${isMobile && activeTabIndex === -1 ? "h-0" : "flex flex-col"}`}
        >
          <CourseTabsView
            openTabs={openTabs}
            activeTabIndex={activeTabIndex}
            setActiveTabIndex={setActiveTabIndex}
            handleCloseTab={handleCloseTab}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
};

export default TreeBrowser;
