
import { useState, useEffect } from "react";
import { CourseNode } from "@/services/courseService";

export function useCourseSearch(treeData: CourseNode | null) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Initialize expanded nodes with top-level nodes when tree data loads
  useEffect(() => {
    if (!treeData || !treeData.children) return;
    
    const initialExpanded = new Set<string>();
    
    // Auto-expand top-level nodes
    treeData.children.forEach((node) => {
      const nodePath = node.name;
      initialExpanded.add(nodePath);
    });
    
    setExpandedNodes(initialExpanded);
  }, [treeData]);

  // Update expanded nodes based on search query - more targeted expansion
  useEffect(() => {
    if (!searchQuery || !treeData) return;
    
    const nodesToExpand = new Set<string>();
    const searchLowerCase = searchQuery.toLowerCase();
    
    // Only expand direct paths to matching nodes, not everything
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
      
      // Only add paths that directly lead to matching nodes 
      if (nameMatches || hasMatchingChild) {
        // Only add the direct path, not all parent paths
        if (nameMatches) {
          nodesToExpand.add(nodePath);
        }
        
        // Add immediate parent to make the match visible
        if (parentPath.length > 0) {
          nodesToExpand.add(parentPath.join("/"));
        }
        
        return true;
      }
      
      return false;
    };
    
    findMatchingNodes(treeData);
    
    setExpandedNodes(nodesToExpand);
  }, [searchQuery, treeData]);

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
    expandedNodes,
    setSearchQuery,
    handleNodeToggle,
    clearSearch
  };
}
