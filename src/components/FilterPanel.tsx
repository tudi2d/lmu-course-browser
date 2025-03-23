
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';

export interface FilterItem {
  id: string;
  name: string;
  count: number;
}

export interface FilterCategory {
  id: string;
  name: string;
  items: FilterItem[];
}

interface FilterPanelProps {
  categories: FilterCategory[];
  selectedFilters: Record<string, Set<string>>;
  onFilterChange: (categoryId: string, itemId: string, isChecked: boolean) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  categories, 
  selectedFilters, 
  onFilterChange,
  onClearFilters
}) => {
  const isMobile = useIsMobile();
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(new Set(['semester']));
  
  const activeFilterCount = Object.values(selectedFilters)
    .reduce((count, set) => count + set.size, 0);
  
  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filterContent = (
    <div className="w-full max-h-[70vh] overflow-y-auto p-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium">Filters</h2>
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
      
      {categories.map((category) => (
        <Collapsible 
          key={category.id} 
          open={openCategories.has(category.id)}
          onOpenChange={() => toggleCategory(category.id)}
          className="mb-2"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full flex items-center justify-between py-2 font-medium"
            >
              <span>{category.name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedFilters[category.id]?.size || 0} selected
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-2 pt-1 pb-2">
            {category.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`${category.id}-${item.id}`}
                  checked={selectedFilters[category.id]?.has(item.id)}
                  onCheckedChange={(checked) => {
                    onFilterChange(category.id, item.id, !!checked);
                  }}
                />
                <Label 
                  htmlFor={`${category.id}-${item.id}`}
                  className="text-sm flex items-center justify-between w-full cursor-pointer"
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-muted-foreground">({item.count})</span>
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
  
  return isMobile ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="h-4 w-4 mr-1" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        {filterContent}
      </PopoverContent>
    </Popover>
  ) : (
    <div className="border rounded-md p-3 w-full max-w-xs">
      {filterContent}
    </div>
  );
};

export default FilterPanel;
