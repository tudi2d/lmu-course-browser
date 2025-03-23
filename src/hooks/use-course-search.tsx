
import { useState, useEffect } from "react";
import { CourseNode } from "@/services/courseService";

export function useCourseSearch(treeData: CourseNode | null) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Add debounce to search query to delay tree expansion
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Update expanded nodes based on search query
  useEffect(() => {
    if (!debouncedSearchQuery || !treeData) return;
    
    const nodesToExpand = new Set<string>();
    const searchLowerCase = debouncedSearchQuery.toLowerCase();
    
    const findMatchingNodes = (node: CourseNode, parentPath: string[] = []): boolean => {
      const currentPath = [...parentPath, node.name];
      const nodePath = currentPath.join("/");
      let hasMatchingChild = false;
      
      const nameMatches = node.name.toLowerCase().includes(searchLowerCase);
      
      if (node.children) {
        for (const child of node.children) {
          if (findMatchingNodes(child, currentPath)) {
            hasMatchingChild = true;
          }
        }
      }
      
      if (nameMatches || hasMatchingChild) {
        for (let i = 0; i < currentPath.length; i++) {
          const path = currentPath.slice(0, i + 1).join("/");
          nodesToExpand.add(path);
        }
        return true;
      }
      
      return false;
    };
    
    findMatchingNodes(treeData);
    
    setExpandedNodes(nodesToExpand);
  }, [debouncedSearchQuery, treeData]);

  // Handle node toggling
  const handleNodeToggle = (nodePath: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);
      } else {
        newSet.add(nodePath);
      }
      return newSet;
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    debouncedSearchQuery,
    expandedNodes,
    setSearchQuery,
    handleNodeToggle,
    clearSearch
  };
}
