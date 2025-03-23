
import { useState, useEffect } from "react";
import { fetchCourseTree, CourseNode } from "@/services/courseService";
import { toast } from "@/components/ui/use-toast";

export function useCourseTree() {
  const [treeData, setTreeData] = useState<CourseNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      setLoading(true);
      try {
        const courseTreeData = await fetchCourseTree();
        setTreeData(courseTreeData);
      } catch (error) {
        console.error("Error loading course data:", error);
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

  return { treeData, loading };
}
