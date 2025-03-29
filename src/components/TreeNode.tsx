
import React from 'react';
import { ChevronRight, ChevronDown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  name: string;
  level: number;
  hasChildren: boolean;
  isExpanded?: boolean;
  isActive?: boolean;
  isHighlighted?: boolean;
  isFavorite?: boolean;
  onClick: () => void;
  onToggle: () => void;
  children?: React.ReactNode;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  name,
  level,
  hasChildren,
  isExpanded = false,
  isActive = false,
  isHighlighted = false,
  isFavorite = false,
  onClick,
  onToggle,
  children,
}) => {
  const padding = level * 16 + 8; // 16px per level plus 8px base padding
  
  const handleContentClick = (e: React.MouseEvent) => {
    // Only call onClick for leaf nodes (courses) or if clicking on the text but not the toggle button
    if (!hasChildren) {
      onClick();
    }
  };
  
  return (
    <div className="tree-node">
      <div
        className={cn(
          "tree-node-content flex items-center py-1.5 px-2 cursor-pointer text-sm transition-colors",
          isHighlighted && "bg-accent/20"
        )}
        style={{ paddingLeft: `${padding}px` }}
        onClick={handleContentClick}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="mr-1 p-0.5 hover:bg-muted rounded-sm"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" /> // Spacer for alignment
        )}
        
        <span 
          className={cn(
            "flex-1 truncate",
            isActive && "font-bold", // Only keep the bold text for active state
            isHighlighted && "font-medium"
          )}
          onClick={() => {
            // For non-leaf nodes, we toggle. For leaf nodes, we call onClick
            if (hasChildren) {
              onToggle();
            } else {
              onClick();
            }
          }}
        >
          {name}
        </span>
        
        {isFavorite && (
          <Heart size={12} className="text-red-500 fill-red-500 ml-1" />
        )}
      </div>
      
      {isExpanded && children && (
        <div className="tree-node-children">{children}</div>
      )}
    </div>
  );
};

export default TreeNode;
