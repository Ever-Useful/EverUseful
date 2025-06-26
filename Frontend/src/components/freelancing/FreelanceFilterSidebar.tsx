import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, Star, DollarSign, Users, CheckCircle } from "lucide-react";
import debounce from "lodash/debounce";

const skills = [
  "Machine Learning", "Data Science", "AI Research", "Biotechnology", "Quantum Computing", "Blockchain", "Cybersecurity", "Robotics"
];

const ratings = [5, 4, 3, 2, 1];

const availabilities = ["Available", "Busy"];

interface FreelanceFilterSidebarProps {
  onFiltersChange: (filters: {
    skills?: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    availability?: string[];
  }) => void;
}

export const FreelanceFilterSidebar = ({ onFiltersChange }: FreelanceFilterSidebarProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  const handleApplyFilters = useCallback(() => {
    onFiltersChange({
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
      minRating: selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined,
      availability: selectedAvailability.length > 0 ? selectedAvailability : undefined,
    });
  }, [selectedSkills, priceRange, selectedRatings, selectedAvailability, onFiltersChange]);

  const handleSkillChange = useCallback((skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  }, []);

  const handleRatingChange = useCallback((rating: number) => {
    setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
  }, []);

  const handleAvailabilityChange = useCallback((status: string) => {
    setSelectedAvailability(prev => prev.includes(status) ? prev.filter(a => a !== status) : [...prev, status]);
  }, []);

  const debouncedPriceChange = useMemo(
    () => debounce((value: number[]) => setPriceRange([value[0], value[1]]), 300),
    []
  );
  const handlePriceRangeChange = useCallback((value: number[]) => {
    debouncedPriceChange(value);
  }, [debouncedPriceChange]);

  const handleReset = () => {
    setSelectedSkills([]);
    setPriceRange([0, 500]);
    setSelectedRatings([]);
    setSelectedAvailability([]);
    onFiltersChange({});
  };

  return (
    <aside className="w-full max-w-xs lg:w-72 sticky top-8 z-20 font-sans">
      <Card className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <CardHeader className="py-4 px-5 border-b border-gray-100 bg-white">
          <CardTitle className="flex items-center gap-2 text-gray-700 text-lg font-semibold tracking-tight">
            <Filter className="w-5 h-5 text-gray-400" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="py-5 px-5 space-y-6">
          {/* Skills */}
          <section>
            <h3 className="font-semibold text-gray-500 text-sm mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className={`cursor-pointer transition-colors font-medium px-2 py-1 text-xs ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-700 border-gray-300 bg-transparent hover:bg-gray-100 hover:border-gray-400'
                  }`}
                  onClick={() => handleSkillChange(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section>
            <h3 className="flex items-center gap-2 font-semibold text-gray-500 text-sm mb-3">
              <DollarSign className="w-4 h-4 text-gray-400" />
              Hourly Rate ($)
            </h3>
            <Slider
              defaultValue={[0, 500]}
              max={500}
              min={0}
              step={10}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </section>

          {/* Availability */}
          <section>
            <h3 className="flex items-center gap-2 font-semibold text-gray-500 text-sm mb-3">
              <CheckCircle className="w-4 h-4 text-gray-400" />
              Availability
            </h3>
            <div className="flex flex-wrap gap-2">
              {availabilities.map((status, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-700 cursor-pointer transition ${
                    selectedAvailability.includes(status)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleAvailabilityChange(status)}
                >
                  <Checkbox
                    id={`avail-${idx}`}
                    className="scale-90 border-gray-400 checked:bg-gray-300"
                    checked={selectedAvailability.includes(status)}
                    onCheckedChange={() => handleAvailabilityChange(status)}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Rating */}
          <section>
            <h3 className="flex items-center gap-2 font-semibold text-gray-500 text-sm mb-3">
              <Star className="w-4 h-4 text-gray-400" />
              Minimum Rating
            </h3>
            <div className="flex gap-2 flex-wrap">
              {ratings.map((rating) => (
                <label
                  key={rating}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-700 cursor-pointer transition ${
                    selectedRatings.includes(rating)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleRatingChange(rating)}
                >
                  <Checkbox
                    id={`rating-${rating}`}
                    className="scale-90 border-gray-400 checked:bg-gray-300"
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

          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm text-sm py-2 rounded-xl transition"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
            <Button
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold shadow-sm text-sm py-2 rounded-xl transition"
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}; 