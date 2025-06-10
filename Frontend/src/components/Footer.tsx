import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-200 to-gray-300 text-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-12 text-sm">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">AMOGH</span>
            </div>
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
              Connecting innovative students with forward-thinking businesses to create the next generation of successful startups.
            </p>
            <div className="flex space-x-3 pt-2">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500 p-1.5 hover:bg-blue-50">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600 p-1.5 hover:bg-blue-50">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 p-1.5 hover:bg-slate-100">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-pink-500 p-1.5 hover:bg-pink-50">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* For Students */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-800">For Students</h4>
            <ul className="space-y-1 text-slate-600">
              <li><a href="#" className="hover:text-blue-500">Submit Project</a></li>
              <li><a href="#" className="hover:text-blue-500">Find Mentors</a></li>
              <li><a href="#" className="hover:text-blue-500">Startup Resources</a></li>
              <li><a href="#" className="hover:text-blue-500">Success Stories</a></li>
              <li><a href="#" className="hover:text-blue-500">Community</a></li>
            </ul>
          </div>

          {/* For Businesses */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-800">For Businesses</h4>
            <ul className="space-y-1 text-slate-600">
              <li><a href="#" className="hover:text-purple-500">Browse Projects</a></li>
              <li><a href="#" className="hover:text-purple-500">Partner Program</a></li>
              <li><a href="#" className="hover:text-purple-500">Talent Pipeline</a></li>
              <li><a href="#" className="hover:text-purple-500">Innovation Hub</a></li>
              <li><a href="#" className="hover:text-purple-500">Case Studies</a></li>
            </ul>
          </div>

          {/* PHD Scholars */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-800">PhD Scholars</h4>
            <ul className="space-y-1 text-slate-600">
              <li><a href="#" className="hover:text-green-600">Research Projects</a></li>
              <li><a href="#" className="hover:text-green-600">Funding Options</a></li>
              <li><a href="#" className="hover:text-green-600">Collaboration Tools</a></li>
              <li><a href="#" className="hover:text-green-600">Journals & Papers</a></li>
            </ul>
          </div>

          {/* Professors */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-800">Professors</h4>
            <ul className="space-y-1 text-slate-600">
              <li><a href="#" className="hover:text-red-500">Post Research</a></li>
              <li><a href="#" className="hover:text-red-500">Find Talent</a></li>
              <li><a href="#" className="hover:text-red-500">Academic Resources</a></li>
              <li><a href="#" className="hover:text-red-500">Industry Ties</a></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-300 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs space-y-4 md:space-y-0">
          <div>© 2024 AMOGH. All rights reserved.</div>
          <div className="flex space-x-5">
            <a href="#" className="hover:text-slate-700">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700">Terms of Service</a>
            <a href="#" className="hover:text-slate-700">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
