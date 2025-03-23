
import { CourseNode } from "@/services/courseService";

// Clone a tree node to avoid modifying the original
export const cloneTree = (node: CourseNode): CourseNode => {
  return {
    id: node.id,
    name: node.name,
    value: node.value,
    children: node.children ? node.children.map(child => cloneTree(child)) : []
  };
};

// Check if a node or any of its descendants match a search query
export const nodeMatchesSearch = (node: CourseNode, searchQuery: string): boolean => {
  if (!searchQuery) return true;

  const nameMatches = node.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  if (nameMatches) return true;

  if (node.children) {
    for (const child of node.children) {
      if (nodeMatchesSearch(child, searchQuery)) {
        return true;
      }
    }
  }

  return false;
};

// Check if a node is in the favorites list
export const isNodeFavorite = (node: CourseNode, favorites: string[]): boolean => {
  return node.value !== undefined && favorites.includes(node.value);
};

// Check if this node or any of its descendants are in favorites
export const nodeHasFavorites = (node: CourseNode, favorites: string[]): boolean => {
  // If this node is a course and is in favorites, return true
  if (isNodeFavorite(node, favorites)) {
    return true;
  }

  // If any children have favorites, return true
  if (node.children) {
    for (const child of node.children) {
      if (nodeHasFavorites(child, favorites)) {
        return true;
      }
    }
  }

  return false;
};
