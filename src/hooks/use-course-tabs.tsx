
import { useState } from "react";
import { fetchCourseDetails, fetchCourseTree, Course, CourseNode } from "@/services/courseService";
import { toast } from "@/components/ui/use-toast";

interface CourseTab {
  course_id: string;
  name: string;
  details: Course | null;
}

export function useCourseTabs() {
  const [openTabs, setOpenTabs] = useState<CourseTab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState("all-courses");

  // Function to find a course name in the tree by ID
  const findCourseNameInTree = async (courseId: string): Promise<string | null> => {
    try {
      const treeData = await fetchCourseTree();
      
      const findName = (node: CourseNode, id: string): string | null => {
        if (node.value === id) {
          return node.name;
        }
        
        if (node.children) {
          for (const child of node.children) {
            const found = findName(child, id);
            if (found) return found;
          }
        }
        
        return null;
      };
      
      return findName(treeData, courseId);
    } catch (error) {
      console.error("Error finding course name in tree:", error);
      return null;
    }
  };

  const loadCourseDetails = async (courseId: string): Promise<Course | null> => {
    if (courseId) {
      try {
        console.log("Loading course details for:", courseId);
        const details = await fetchCourseDetails(courseId);
        console.log("Loaded course details:", details);
        return details;
      } catch (error) {
        console.error("Error loading course details:", error);
        return null;
      }
    }
    return null;
  };

  const handleOpenCourse = async (courseId: string, courseName: string) => {
    const existingTabIndex = openTabs.findIndex(
      (tab) => tab.course_id === courseId
    );

    if (existingTabIndex !== -1) {
      setActiveTabIndex(existingTabIndex);
    } else {
      console.log("Opening course:", courseId, courseName);
      const details = await loadCourseDetails(courseId);
      
      if (!details) {
        toast({
          title: "Error loading course",
          description: "Could not load details for this course.",
          variant: "destructive",
        });
        return;
      }
      
      // Use the name from details if available
      let finalName = details.name || courseName;
      
      // If we still don't have a name, try to find it in the course tree
      if (!finalName || finalName === courseId) {
        const treeName = await findCourseNameInTree(courseId);
        if (treeName) {
          finalName = treeName;
        }
      }
      
      setOpenTabs((prev) => [
        ...prev,
        { course_id: courseId, name: finalName, details },
      ]);
      setActiveTabIndex((prev) => prev + 1);
    }
  };

  const handleCloseTab = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    setOpenTabs((prev) => {
      const newTabs = [...prev];
      newTabs.splice(index, 1);
      return newTabs;
    });

    if (index === activeTabIndex) {
      if (index > 0) {
        setActiveTabIndex(index - 1);
      } else if (openTabs.length > 1) {
        setActiveTabIndex(0);
      } else {
        setActiveTabIndex(-1);
      }
    } else if (index < activeTabIndex) {
      setActiveTabIndex((prev) => prev - 1);
    }
  };

  return {
    openTabs,
    activeTabIndex,
    setActiveTabIndex,
    activeTab,
    setActiveTab,
    handleOpenCourse,
    handleCloseTab
  };
}
