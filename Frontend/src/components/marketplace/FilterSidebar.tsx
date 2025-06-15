import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, Star, DollarSign, Clock, Users } from "lucide-react";


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
                  className="flex items-center gap-1 bg-[#3a3f4d] px-2 py-1 rounded text-xs text-gray-200 cursor-pointer hover:bg-[#464c5b] transition"
                >
                  <Checkbox id={`cat-${idx}`} className="scale-90 border-gray-500 checked:bg-gray-300" />
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
              defaultValue={[500, 5000]}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$10k+</span>
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
                  className="flex items-center gap-1 bg-[#3a3f4d] px-2 py-1 rounded text-xs text-gray-200 cursor-pointer hover:bg-[#464c5b] transition"
                >
                  <Checkbox id={`duration-${idx}`} className="scale-90 border-gray-500 checked:bg-gray-300" />
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
                  className="cursor-pointer hover:bg-gray-400 hover:border-gray-400 text-gray-300 border-gray-500 bg-transparent transition-colors font-medium px-2 py-1 text-xs"
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
                  className="flex items-center gap-1 bg-[#3a3f4d] px-2 py-1 rounded text-xs text-gray-200 cursor-pointer hover:bg-[#464c5b] transition"
                >
                  <Checkbox id={`rating-${rating}`} className="scale-90 border-gray-500 checked:bg-gray-300" />
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


          <Button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold shadow-sm mt-2 text-sm py-2 rounded-xl transition">
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
};


