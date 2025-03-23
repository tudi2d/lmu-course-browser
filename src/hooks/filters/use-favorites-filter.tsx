import { CourseNode } from "@/services/courseService";

export function useFavoritesFilter() {
  // Simplified favorites filtering that preserves the entire tree structure
  // but only includes nodes that are favorites or lead to favorites
  const filterForFavorites = (node: CourseNode, favorites: string[]): CourseNode => {
    // Create a new node to avoid mutating the original
    const filteredNode: CourseNode = {
      id: node.id,
      name: node.name,
      value: node.value,
      children: [],
    };

    // Check if this is a course node that's in favorites
    const isInFavorites = node.value && favorites.includes(node.value);
    
    // Process children if they exist
    if (node.children && node.children.length > 0) {
      // Keep track if any children contain favorites
      let hasChildWithFavorite = false;
      
      // Process each child
      node.children.forEach(child => {
        const filteredChild = filterForFavorites(child, favorites);
        
        // If the child has favorites or descendants with favorites, keep it
        if (filteredChild.children && filteredChild.children.length > 0 || 
            (filteredChild.value && favorites.includes(filteredChild.value))) {
          hasChildWithFavorite = true;
          if (!filteredNode.children) filteredNode.children = [];
          filteredNode.children.push(filteredChild);
        }
      });
      
      // If this node isn't a favorite but has children with favorites, include it
      if (hasChildWithFavorite || isInFavorites) {
        return filteredNode;
      }
    } else if (isInFavorites) {
      // This is a leaf node and it's a favorite
      return filteredNode;
    }
    
    // If we reach here, this node doesn't have favorites and none of its children do
    if (isInFavorites) {
      return filteredNode;
    }
    
    // Empty children array for non-favorite nodes with no favorite descendants
    filteredNode.children = [];
    return filteredNode;
  };

  return { filterForFavorites };
}
