
import React from "react";
import TreeNode from "./TreeNode";
import { CourseNode } from "@/services/courseService";

interface CourseTreeRendererProps {
  node: CourseNode | null;
  level?: number;
  parentPath?: string[];
  expandedNodes: Set<string>;
  searchQuery: string;
  openTabs: Array<{ course_id: string; name: string; details: any }>;
  favorites: string[];
  handleNodeToggle: (nodePath: string) => void;
  handleOpenCourse: (courseId: string, courseName: string) => void;
}

const CourseTreeRenderer: React.FC<CourseTreeRendererProps> = ({
  node,
  level = 0,
  parentPath = [],
  expandedNodes,
  searchQuery,
  openTabs,
  favorites,
  handleNodeToggle,
  handleOpenCourse,
}) => {
  if (!node) {
    console.log("CourseTreeRenderer received null node");
    return null;
  }

  const nodePath = [...parentPath, node.name].join("/");
  const isExpanded = expandedNodes.has(nodePath);
  const hasChildren = node.children && node.children.length > 0;
  const isCourse = node.value !== undefined;
  const isFavorite = isCourse && node.value && favorites.includes(node.value);
  
  // Determine if this node or its children match the search query
  const isMatched = searchQuery && 
    node.name.toLowerCase().includes(searchQuery.toLowerCase());

  // Avoid rendering children that don't match the search query
  const relevantChildren = hasChildren && (isExpanded || isMatched) ? 
    node.children?.filter(child => {
      // If there's no search query, show all children
      if (!searchQuery) return true;
      
      // If there's a search query and we're already expanded,
      // only show children that match the query
      return isNodeRelevantToSearch(child, searchQuery);
    }) : [];

  // Handle node click - different behavior for courses vs folders
  const handleNodeClick = () => {
    if (isCourse && node.value) {
      // If it's a course (leaf node), open it
      handleOpenCourse(node.value, node.name);
    } else if (hasChildren) {
      // If it's a folder (has children), toggle expansion
      handleNodeToggle(nodePath);
    }
  };

  return (
    <React.Fragment key={nodePath}>
      <TreeNode
        name={node.name}
        level={level}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        isActive={isCourse && openTabs.some((tab) => tab.course_id === node.value)}
        isHighlighted={isMatched}
        isFavorite={isFavorite}
        onToggle={() => hasChildren && handleNodeToggle(nodePath)}
        onClick={handleNodeClick}
      >
        {isExpanded &&
          hasChildren &&
          relevantChildren.map((childNode) => (
            <CourseTreeRenderer
              key={`${nodePath}/${childNode.name}`}
              node={childNode}
              level={level + 1}
              parentPath={[...parentPath, node.name]}
              expandedNodes={expandedNodes}
              searchQuery={searchQuery}
              openTabs={openTabs}
              favorites={favorites}
              handleNodeToggle={handleNodeToggle}
              handleOpenCourse={handleOpenCourse}
            />
          ))}
      </TreeNode>
    </React.Fragment>
  );
};

// Helper function to determine if a node or any of its children 
// match the search query
const isNodeRelevantToSearch = (node: CourseNode, searchQuery: string): boolean => {
  if (!searchQuery) return true;
  
  const nameMatches = node.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
    
  if (nameMatches) return true;
  
  if (node.children) {
    for (const child of node.children) {
      if (isNodeRelevantToSearch(child, searchQuery)) {
        return true;
      }
    }
  }
  
  return false;
};

export default CourseTreeRenderer;
