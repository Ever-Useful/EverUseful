import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, GraduationCap, Plus, Heart } from 'lucide-react';
import { FeaturedProject, SavedItem } from '@/components/cart/types';
import { getCategoryIcon } from '@/components/cart/utils';

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
  onAddToCart: (project: FeaturedProject) => void;
  onAddToWishlist: (project: FeaturedProject) => void;
}

const FeaturedProjects = ({ projects, onAddToCart, onAddToWishlist }: FeaturedProjectsProps) => {
   // Convert dollars to rupees (approximate conversion rate: 1 USD = 83 INR)
  const conversionRate = 83;
  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader className="bg-gray-50 rounded-t-lg px-4 sm:px-6">
        <CardTitle className="flex items-center gap-3 text-gray-900 text-lg sm:text-xl">
          <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
          Featured Engineering Solutions
        </CardTitle>
        <p className="text-gray-600 text-sm mt-2">Discover more innovative projects from top engineering students</p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {projects.map(project => {
            const priceINR = project.price * conversionRate;
          return (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border border-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                    {getCategoryIcon(project.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">{project.name}</h4>
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-medium text-gray-700">{project.rating}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddToWishlist(project)}
                    className="p-1 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-gray-600 text-xs leading-relaxed mb-3">{project.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <GraduationCap className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{project.studentName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="truncate">{project.university}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <p className="font-bold text-lg text-gray-900">₹{priceINR.toFixed(2)}</p>
                  <Button 
                    size="sm" 
                    onClick={() => onAddToCart(project)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedProjects;