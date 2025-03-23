
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeNodeProps {
  name: string;
  level: number;
  hasChildren: boolean;
  isExpanded?: boolean;
  isActive?: boolean;
  onToggle: () => void;
  onClick: () => void;
  children?: React.ReactNode;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  name,
  level,
  hasChildren,
  isExpanded = false,
  isActive = false,
  onToggle,
  onClick,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Define indent based on level
  const indent = `${level * 16}px`;

  // Define text size based on level (fakultät is larger)
  const textSize = level === 0 ? 'text-sm font-medium' : 'text-sm';
  
  return (
    <div className="tree-node">
      <div
        className={`tree-node-content flex items-center py-2 px-3 cursor-pointer ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: indent }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {hasChildren ? (
          <div 
            className="mr-1.5 text-gray-500 hover:text-tree-accent transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? (
              <ChevronDown size={16} className="transition-transform duration-200" />
            ) : (
              <ChevronRight size={16} className="transition-transform duration-200" />
            )}
          </div>
        ) : (
          <div className="w-[16px] mr-1.5" />
        )}
        <span className={`${textSize} truncate ${isActive ? 'text-tree-accent' : 'text-tree-gray'}`}>
          {name}
        </span>
      </div>
      {isExpanded && children && (
        <div className="animate-slide-in overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
