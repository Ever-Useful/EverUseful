
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, Star, DollarSign, Clock, Users } from "lucide-react";

export const FilterSidebar = () => {
  const categories = [
    { name: "AI & Machine Learning", count: 245 },
    { name: "Sustainable Tech", count: 189 },
    { name: "FinTech", count: 156 },
    { name: "HealthTech", count: 134 },
    { name: "EdTech", count: 98 },
    { name: "IoT & Hardware", count: 87 },
    { name: "Blockchain", count: 76 },
    { name: "Mobile Apps", count: 234 }
  ];

  const skills = [
    "React", "Python", "JavaScript", "Machine Learning", "UI/UX Design", 
    "Data Science", "Blockchain", "Cloud Computing"
  ];

  return (
    <div className="w-80 space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`category-${index}`} />
                    <label htmlFor={`category-${index}`} className="text-gray-300 text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Budget Range
            </h3>
            <Slider
              defaultValue={[500, 5000]}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>$0</span>
              <span>$10,000+</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Project Duration
            </h3>
            <div className="space-y-2">
              {["1-2 weeks", "1 month", "2-3 months", "3-6 months", "6+ months"].map((duration, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`duration-${index}`} />
                  <label htmlFor={`duration-${index}`} className="text-gray-300 text-sm cursor-pointer">
                    {duration}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-white font-semibold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-600 hover:border-blue-600 text-gray-300 border-gray-600 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Minimum Rating
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <label htmlFor={`rating-${rating}`} className="text-gray-300 text-sm cursor-pointer flex items-center">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                    ))}
                    & up
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
