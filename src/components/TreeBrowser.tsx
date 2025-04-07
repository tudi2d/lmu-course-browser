
import React, { useState, useCallback, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourseTree } from "@/hooks/use-course-tree";
import { useCourseFavorites } from "@/hooks/use-course-favorites";
import { useCourseSearch } from "@/hooks/use-course-search";
import { useCourseTabs } from "@/hooks/use-course-tabs";
import { useFilteredTree } from "@/hooks/use-filtered-tree";
import { CourseNode } from "@/services/courseService";

// Import our new components
import MobileSearchBar from "./sidebar/MobileSearchBar";
import MobileSidebar from "./sidebar/MobileSidebar";
import DesktopSidebar from "./sidebar/DesktopSidebar";
import ContentArea from "./content/ContentArea";

interface TreeBrowserProps {
  mobileDrawerOpen?: boolean;
  setMobileDrawerOpen?: (open: boolean) => void;
}

const TreeBrowser: React.FC<TreeBrowserProps> = ({ 
  mobileDrawerOpen = true,
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

  // Open drawer by default on mobile
  useEffect(() => {
    if (isMobile && setMobileDrawerOpen) {
      setMobileDrawerOpen(true);
    }
  }, [isMobile, setMobileDrawerOpen]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      {/* Mobile search bar - REMOVED/HIDDEN since it's in the drawer already */}
      {isMobile && (
        <MobileSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          showSearchBar={false} // Hide the search bar since it's in the drawer
        />
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <DesktopSidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
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
      )}

      {/* Content area */}
      <ContentArea
        sidebarCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        openTabs={openTabs}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
        handleCloseTab={handleCloseTab}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
      
      {/* Mobile drawer sidebar */}
      {isMobile && (
        <MobileSidebar
          mobileDrawerOpen={mobileDrawerOpen}
          setMobileDrawerOpen={setMobileDrawerOpen}
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
      )}
    </div>
  );
};

export default TreeBrowser;
