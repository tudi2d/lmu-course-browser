
import React, { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourseTree } from "@/hooks/use-course-tree";
import { useCourseFavorites } from "@/hooks/use-course-favorites";
import { useCourseSearch } from "@/hooks/use-course-search";
import { useCourseTabs } from "@/hooks/use-course-tabs";
import { useFilteredTree } from "@/hooks/use-filtered-tree";
import CourseSidebar from "./CourseSidebar";
import CourseTabsView from "./CourseTabsView";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import CourseSearch from "./CourseSearch";
import { toast } from "@/components/ui/use-toast";
import { CourseNode } from "@/services/courseService";

interface TreeBrowserProps {
  mobileDrawerOpen?: boolean;
  setMobileDrawerOpen?: (open: boolean) => void;
}

const TreeBrowser: React.FC<TreeBrowserProps> = ({ 
  mobileDrawerOpen = false, 
  setMobileDrawerOpen = () => {}
}) => {
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
      console.log("Extracted course names:", names);
    }
  }, [treeData]);
  
  // Use custom hooks to manage different aspects of state
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
  
  // Get filtered tree data
  const filteredTreeData = useFilteredTree(treeData, searchQuery, activeTab, favorites);

  // Loading state
  const loading = treeLoading || favoritesLoading;

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

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      {/* Mobile search bar only */}
      {isMobile && (
        <div className="border-b border-muted">
          <CourseSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            clearSearch={clearSearch}
            isMobile={true}
          />
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={`border-r border-muted transition-all duration-300 ease-in-out ${
          sidebarCollapsed
            ? "w-0"
            : "w-full md:w-1/2 lg:w-1/3"
        } ${isMobile ? "hidden" : "flex"}`}
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
        />
      </div>

      {/* Toggle sidebar button for desktop */}
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

      {/* Content area */}
      <div
        className={`bg-white transition-all duration-300 ${
          sidebarCollapsed
            ? "w-full"
            : isMobile
            ? "w-full"
            : "w-full md:w-1/2 lg:w-2/3"
        } flex flex-col`}
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
      
      {/* Mobile drawer sidebar */}
      {isMobile && (
        <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
          <DrawerContent className="h-[80vh] px-0 pt-0 bg-white">
            <div className="h-full overflow-hidden">
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
                handleOpenCourse={(courseId, courseName) => {
                  handleOpenCourse(courseId, courseName);
                  setMobileDrawerOpen(false);
                }}
                user={user}
                isMobile={isMobile}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default TreeBrowser;
