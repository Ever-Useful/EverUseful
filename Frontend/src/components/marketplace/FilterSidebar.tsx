import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, Star, DollarSign, Clock, Users } from "lucide-react";
import debounce from "lodash/debounce";

interface FilterSidebarProps {
  onFiltersChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    skills?: string[];
    duration?: string;
  }) => void;
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


export const FilterSidebar = ({ onFiltersChange }: FilterSidebarProps) => {
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


export const FilterSidebar = () => {
  return (
    <aside className="w-full max-w-xs lg:w-72 sticky top-8 z-20 font-sans">
      <Card
        className="bg-[#2f343d] border border-[#444b59] shadow-md rounded-lg overflow-hidden"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <CardHeader className="py-4 px-5 border-b border-[#444b59] bg-[#2f343d]">
          <CardTitle className="flex items-center gap-2 text-gray-300 text-lg font-semibold tracking-tight">
            <Filter className="w-5 h-5 text-gray-400" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="py-5 px-5 space-y-6">
          {/* Categories */}
          <section>
            <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm mb-3">
              <Users className="w-4 h-4 text-gray-400" />
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-200 cursor-pointer transition ${
                    selectedCategories.includes(category.name)
                      ? 'bg-blue-600'
                      : 'bg-[#3a3f4d] hover:bg-[#464c5b]'
                  }`}
                  onClick={() => handleCategoryChange(category.name)}
                >
                  <Checkbox
                    id={`cat-${idx}`}
                    className="scale-90 border-gray-500 checked:bg-gray-300"
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryChange(category.name)}
                  />
                  <span>{category.name}</span>
                  <Badge variant="outline" className="border-gray-500 text-gray-400 bg-transparent px-1 font-medium">
                    {category.count}
                  </Badge>
                </label>
              ))}
            </div>
          </section>

          {/* Budget Range */}
          <section>
            <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm mb-3">
              <DollarSign className="w-4 h-4 text-gray-400" />
              Budget
            </h3>
            <Slider
              defaultValue={[0, 10000]}
              max={10000}
              min={0}
              step={100}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </section>

          {/* Duration */}
          <section>
            <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              Duration
            </h3>
            <div className="flex flex-wrap gap-2">
              {durations.map((duration, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-200 cursor-pointer transition ${
                    selectedDurations.includes(duration)
                      ? 'bg-blue-600'
                      : 'bg-[#3a3f4d] hover:bg-[#464c5b]'
                  }`}
                  onClick={() => handleDurationChange(duration)}
                >
                  <Checkbox
                    id={`duration-${idx}`}
                    className="scale-90 border-gray-500 checked:bg-gray-300"
                    checked={selectedDurations.includes(duration)}
                    onCheckedChange={() => handleDurationChange(duration)}
                  />
                  <span>{duration}</span>
                </label>
              ))}
            </div>
          </section>
          {/* Skills */}
          <section>
            <h3 className="font-semibold text-gray-400 text-sm mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className={`cursor-pointer transition-colors font-medium px-2 py-1 text-xs ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-300 border-gray-500 bg-transparent hover:bg-gray-400 hover:border-gray-400'
                  }`}
                  onClick={() => handleSkillChange(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {/* Rating */}
          <section>
            <h3 className="flex items-center gap-2 font-semibold text-gray-400 text-sm mb-3">
              <Star className="w-4 h-4 text-gray-400" />
              Minimum Rating
            </h3>
            <div className="flex gap-2 flex-wrap">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-200 cursor-pointer transition ${
                    selectedRatings.includes(rating)
                      ? 'bg-blue-600'
                      : 'bg-[#3a3f4d] hover:bg-[#464c5b]'
                  }`}
                  onClick={() => handleRatingChange(rating)}
                >
                  <Checkbox
                    id={`rating-${rating}`}
                    className="scale-90 border-gray-500 checked:bg-gray-300"
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => handleRatingChange(rating)}
                  />
                  <span className="flex items-center">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                    ))}
                  </span>
                  <span>&up</span>
                </label>
              ))}
            </div>
          </section>
          <Button
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold shadow-sm mt-2 text-sm py-2 rounded-xl transition"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
};


