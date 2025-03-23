
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

  // Skip nodes that aren't courses and don't have children
  if (!node.value && (!node.children || node.children.length === 0)) {
    return null;
  }

  const nodePath = [...parentPath, node.name].join("/");
  const isExpanded =
    expandedNodes.has(node.name) || expandedNodes.has(nodePath);
  const hasChildren = node.children && node.children.length > 0;
  const isCourse = node.value !== undefined;

  // In the favorites tab, we automatically expand all nodes
  // Fix the type issue by ensuring shouldAutoExpand is always a boolean
  const shouldAutoExpand = Boolean(
    searchQuery || (hasChildren && node.children?.some(child => 
      child.value && favorites.includes(child.value)))
  );
  
  const isFavorite = isCourse && node.value && favorites.includes(node.value);

  return (
    <React.Fragment key={nodePath}>
      <TreeNode
        name={node.name}
        level={level}
        hasChildren={hasChildren}
        isExpanded={isExpanded || shouldAutoExpand}
        isActive={
          isCourse && openTabs.some((tab) => tab.course_id === node.value)
        }
        isHighlighted={
          searchQuery &&
          node.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
        isFavorite={isFavorite}
        onToggle={() => handleNodeToggle(nodePath)}
        onClick={() => {
          if (isCourse && node.value) {
            handleOpenCourse(node.value, node.name);
          } else {
            handleNodeToggle(nodePath);
          }
        }}
      >
        {(isExpanded || shouldAutoExpand) &&
          hasChildren &&
          node.children?.map((childNode) => (
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

export default CourseTreeRenderer;
