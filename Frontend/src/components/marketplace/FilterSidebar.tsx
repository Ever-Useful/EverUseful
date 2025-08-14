import { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, Star, DollarSign, Clock, Users, ChevronDown } from "lucide-react";
import debounce from "lodash/debounce";

export interface FilterSidebarProps {
  onFiltersChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    skills?: string[];
    duration?: string;
  }) => void;
  onClose?: () => void;
  disableMobileDropdown?: boolean;
}

const categories = [
  { name: "AI & ML", count: 245 },
  { name: "Sustainable", count: 189 },
  { name: "FinTech", count: 156 },
  { name: "HealthTech", count: 134 },
  { name: "EdTech", count: 98 },
  { name: "IoT", count: 87 },
  { name: "Blockchain", count: 76 },
  { name: "Mobile", count: 234 }
];


const skills = [
  "React", "Python", "JavaScript", "ML", "UI/UX",
  "DataSci", "Blockchain", "Cloud"
];


const durations = [
  "1-2w", "1m", "2-3m", "3-6m", "6+m"
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export const FilterSidebar = ({ onFiltersChange, disableMobileDropdown = false }: FilterSidebarProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  const handleApplyFilters = useCallback(() => {
    onFiltersChange({
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
      minRating: selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      duration: selectedDurations.length > 0 ? selectedDurations.join(',') : undefined,
    });
  }, [selectedCategories, priceRange, selectedRatings, selectedSkills, selectedDurations, onFiltersChange]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      return newCategories;
    });
  }, []);

  const handleSkillChange = useCallback((skill: string) => {
    setSelectedSkills(prev => {
      const newSkills = prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill];
      return newSkills;
    });
  }, []);

  const handleDurationChange = useCallback((duration: string) => {
    setSelectedDurations(prev => {
      const newDurations = prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration];
      return newDurations;
    });
  }, []);

  const handleRatingChange = useCallback((rating: number) => {
    setSelectedRatings(prev => {
      const newRatings = prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating];
      return newRatings;
    });
  }, []);

  const debouncedPriceChange = useMemo(
    () =>
      debounce((value: number[]) => {
        setPriceRange([value[0], value[1]]);
      }, 300),
    []
  );

  const handlePriceRangeChange = useCallback((value: number[]) => {
    debouncedPriceChange(value);
  }, [debouncedPriceChange]);

  // Render filter content (used by both mobile and desktop)
  const renderFilterContent = (isMobileView: boolean) => (
    <div className="space-y-6">
      {/* Categories */}
      <section>
        <h3 className="flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
          <Users className="w-4 h-4 text-blue-500" />
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category, idx) => (
            <div key={idx} className="flex items-center">
              <Checkbox
                id={`cat-${idx}`}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => handleCategoryChange(category.name)}
              />
              <label
                htmlFor={`cat-${idx}`}
                className="ml-3 text-sm text-gray-700 flex justify-between w-full"
              >
                <span>{category.name}</span>
                <span className="text-gray-400 text-xs">{category.count}</span>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <h3 className="flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
          <DollarSign className="w-4 h-4 text-blue-500" />
          Price Range
        </h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            min={0}
            step={100}
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
          <div className="flex justify-between mt-3">
            <div className="text-sm font-medium text-gray-700">
              ${priceRange[0]}
            </div>
            <div className="text-sm font-medium text-gray-700">
              ${priceRange[1]}
            </div>
          </div>
        </div>
      </section>

      {/* Duration */}
      <section>
        <h3 className="flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
          <Clock className="w-4 h-4 text-blue-500" />
          Duration
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {durations.map((duration, idx) => (
            <div key={idx} className="flex items-center">
              <Checkbox
                id={`duration-${idx}`}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedDurations.includes(duration)}
                onCheckedChange={() => handleDurationChange(duration)}
              />
              <label
                htmlFor={`duration-${idx}`}
                className="ml-2 text-sm text-gray-700"
              >
                {duration}
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h3 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                selectedSkills.includes(skill)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleSkillChange(skill)}
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Rating */}
      <section>
        <h3 className="flex items-center gap-2 font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
          <Star className="w-4 h-4 text-blue-500" />
          Rating
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={`rating-${rating}`}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => handleRatingChange(rating)}
              />
              <label
                htmlFor={`rating-${rating}`}
                className="ml-3 text-sm text-gray-700 flex items-center"
              >
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">& Up</span>
              </label>
            </div>
          ))}
        </div>
      </section>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors shadow-sm"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
      <Button
        variant="outline"
        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 rounded-md transition-colors shadow-sm"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange([0, 10000]);
          setSelectedRatings([]);
          setSelectedSkills([]);
          setSelectedDurations([]);
        }}
      >
        Clear All
      </Button>
    </div>
  );

  if (isMobile && !disableMobileDropdown) {
    return (
      <div className="w-full mb-4">
        <button
          className="w-full bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between font-medium text-gray-700 mb-2 shadow-sm hover:bg-gray-50 transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Filters</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            {renderFilterContent(true)}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className={`${!isMobile ? 'w-full max-w-xs lg:w-72 sticky top-4 h-fit' : 'w-full'}`}>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Filter className="w-5 h-5 text-blue-500" />
            Filters
          </h3>
        </div>
        <div className="p-4">
          {renderFilterContent(false)}
        </div>
      </div>
    </aside>
  );
};