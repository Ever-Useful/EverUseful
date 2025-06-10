
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, TrendingUp, Users, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

export const MarketplaceHero = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-pulse">
            <Package className="w-4 h-4 mr-2" />
            Global Innovation Marketplace
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
            Discover{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Innovation
            </span>{" "}
            at Scale
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Connect with cutting-edge projects, innovative solutions, and brilliant minds from students, 
            businesses, and researchers worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <Input 
                placeholder="Search projects, skills, or innovations..." 
                className="pl-10 h-12 bg-white/80 border-slate-300 text-slate-700 placeholder-slate-500"
              />
            </div>
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-12 px-8">
              <Filter className="mr-2 w-5 h-5" />
              Search
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">2.5K+</div>
              <div className="text-slate-600 text-sm">Live Projects</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">50K+</div>
              <div className="text-slate-600 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">4.9</div>
              <div className="text-slate-600 text-sm">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">95%</div>
              <div className="text-slate-600 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
