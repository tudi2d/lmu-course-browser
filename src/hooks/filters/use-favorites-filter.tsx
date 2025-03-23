
import { CourseNode } from "@/services/courseService";

export function useFavoritesFilter() {
  // Mark all courses that are favorites
  const markFavorites = (node: CourseNode, favorites: string[]): CourseNode => {
    // Create a new node to avoid mutating the original
    const markedNode: CourseNode = {
      id: node.id,
      name: node.name,
      value: node.value,
      children: [],
    };
    
    // Process children if they exist
    if (node.children && node.children.length > 0) {
      markedNode.children = node.children.map(child => markFavorites(child, favorites));
    }
    
    return markedNode;
  };

  return { filterForFavorites: markFavorites };
}
