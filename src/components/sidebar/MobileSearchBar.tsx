
import React from "react";
import CourseSearch from "../CourseSearch";

interface MobileSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  showSearchBar?: boolean;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  clearSearch,
  showSearchBar = true,
}) => {
  if (!showSearchBar) return null;
  
  return (
    <div className="border-b border-muted">
      <CourseSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearSearch={clearSearch}
        isMobile={true}
      />
    </div>
  );
};

export default MobileSearchBar;
