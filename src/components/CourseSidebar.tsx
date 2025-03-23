
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import CourseSearch from "./CourseSearch";
import CourseTreeRenderer from "./CourseTreeRenderer";
import CalendarModal from "./CalendarModal";
import { CourseNode } from "@/services/courseService";

interface CourseSidebarProps {
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  filteredTreeData: CourseNode | null;
  expandedNodes: Set<string>;
  openTabs: Array<{ course_id: string; name: string; details: any }>;
  favorites: string[];
  handleNodeToggle: (nodePath: string) => void;
  handleOpenCourse: (courseId: string, courseName: string) => void;
  user: any;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  loading,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  clearSearch,
  filteredTreeData,
  expandedNodes,
  openTabs,
  favorites,
  handleNodeToggle,
  handleOpenCourse,
  user,
}) => {
  // State to check if we have favorited courses in structure
  const [hasFavoritesInTree, setHasFavoritesInTree] = useState(false);
  
  // Debug favorites data directly
  useEffect(() => {
    if (activeTab === "favorites") {
      console.log("Favorites tab selected with favorites:", favorites);
      console.log("Filtered tree data:", filteredTreeData);
    }
  }, [activeTab, favorites, filteredTreeData]);
  
  // Check if we have any favorites in the tree structure
  useEffect(() => {
    if (activeTab === "favorites" && filteredTreeData) {
      // CRITICAL FIX: Properly check if any courses are found after filtering
      let hasVisibleNodes = false;
      
      const checkForVisibleCourses = (node: CourseNode): boolean => {
        // Direct check if this is a course and in favorites
        if (node.value && favorites.includes(node.value)) {
          return true;
        }
        
        // Check children recursively
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            if (checkForVisibleCourses(child)) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      hasVisibleNodes = checkForVisibleCourses(filteredTreeData);
      
      console.log("Favorites tab has visible nodes:", hasVisibleNodes);
      setHasFavoritesInTree(hasVisibleNodes);
    }
  }, [activeTab, filteredTreeData, favorites]);

  return (
    <div className="flex flex-col h-full w-full">
      <CourseSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="all-courses">
            All Courses
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="favorites">
            Favorites {favorites.length > 0 && `(${favorites.length})`}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "favorites" && (
        <div className="p-2 border-b border-muted">
          <CalendarModal />
        </div>
      )}

      <div className="overflow-y-auto h-full relative">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">
            Loading courses...
          </div>
        ) : (
          <>
            {activeTab === "favorites" && !user && (
              <div className="p-4 text-sm bg-muted/30 border-b">
                <p className="text-muted-foreground mb-2">
                  <strong>Note:</strong> Sign in to save your favorites permanently.
                </p>
                <Button 
                  onClick={() => {
                    const signInButton = document.querySelector('[aria-label="Sign In"]');
                    if (signInButton && 'click' in signInButton) {
                      (signInButton as HTMLElement).click();
                    }
                  }}
                  className="gap-2"
                  size="sm"
                  variant="outline"
                >
                  <User size={14} />
                  Sign In
                </Button>
              </div>
            )}
            
            {activeTab === "favorites" && favorites.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                You don't have any favorite courses yet. Browse courses and
                click the heart icon to add favorites.
              </div>
            ) : (activeTab === "favorites" && favorites.length > 0 && !hasFavoritesInTree) ? (
              <div className="p-4 text-sm text-muted-foreground">
                No courses found. Try clearing your search or check that your favorite courses
                are still available in the course catalog.
              </div>
            ) : filteredTreeData && filteredTreeData.children && filteredTreeData.children.length > 0 ? (
              filteredTreeData.children.map((childNode) => (
                <CourseTreeRenderer
                  key={childNode.name}
                  node={childNode}
                  expandedNodes={expandedNodes}
                  searchQuery={searchQuery}
                  openTabs={openTabs}
                  favorites={favorites}
                  handleNodeToggle={handleNodeToggle}
                  handleOpenCourse={handleOpenCourse}
                />
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                No courses found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;
