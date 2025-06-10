
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, DollarSign, Clock, ArrowRight, Briefcase } from "lucide-react";

export const FreelancingHero = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
            <Briefcase className="w-4 h-4 mr-2" />
            Global Freelance Network
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
            Connect with{" "}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Top Talent
            </span>{" "}
            Worldwide
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Access a global network of skilled freelancers, innovative students, and expert professionals. 
            Find the perfect talent for your next breakthrough project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4">
              <Users className="mr-2 w-5 h-5" />
              Find Freelancers
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100 text-lg px-8 py-4">
              <Briefcase className="mr-2 w-5 h-5" />
              Post a Project
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">25K+</div>
              <div className="text-slate-600 text-sm">Active Freelancers</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">4.8</div>
              <div className="text-slate-600 text-sm">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">$2.5M+</div>
              <div className="text-slate-600 text-sm">Paid Out</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800">48hr</div>
              <div className="text-slate-600 text-sm">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
