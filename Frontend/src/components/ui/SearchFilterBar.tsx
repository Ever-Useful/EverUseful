import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface FilterTag {
  id: string;
  label: string;
  active?: boolean;
}

interface SearchFilterBarProps {
  tags: FilterTag[];
  onTagClick: (tagId: string) => void;
  className?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ 
  tags, 
  onTagClick, 
  className = "" 
}) => {
  return (
    <div className={`flex gap-1 overflow-x-auto scrollbar-hide ${className}`}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={tag.active ? "default" : "secondary"}
          className={`
            cursor-pointer transition-all duration-200 hover:scale-105 flex-shrink-0
            ${tag.active 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
            }
            px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap
          `}
          onClick={() => onTagClick(tag.id)}
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
};

export default SearchFilterBar;
