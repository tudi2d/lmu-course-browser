
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
  if (!node) return null;

  // Skip nodes that aren't courses and don't have children
  if (!node.value && (!node.children || node.children.length === 0)) {
    return null;
  }

  const nodePath = [...parentPath, node.name].join("/");
  const isExpanded =
    expandedNodes.has(node.name) || expandedNodes.has(nodePath);
  const hasChildren = node.children && node.children.length > 0;
  const isCourse = node.value !== undefined;

  const matchesSearch = searchQuery && 
    (node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (hasChildren && node.children?.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase()))));

  return (
    <React.Fragment key={nodePath}>
      <TreeNode
        name={node.name}
        level={level}
        hasChildren={hasChildren}
        isExpanded={isExpanded || matchesSearch}
        isActive={
          isCourse && openTabs.some((tab) => tab.course_id === node.value)
        }
        isHighlighted={
          searchQuery &&
          node.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
        isFavorite={
          isCourse &&
          node.value !== undefined &&
          favorites.includes(node.value)
        }
        onToggle={() => handleNodeToggle(nodePath)}
        onClick={() => {
          if (isCourse && node.value) {
            handleOpenCourse(node.value, node.name);
          } else {
            handleNodeToggle(nodePath);
          }
        }}
      >
        {(isExpanded || matchesSearch) &&
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
