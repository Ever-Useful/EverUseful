import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
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
    <footer className="bg-gradient-to-br from-slate-100 to-gray-200 text-slate-900 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
          {/* Brand & Mission */}
          <div className="mb-8 md:mb-0 md:w-1/3 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-800 tracking-tight">AMOGH</span>
              </div>
              <p className="text-slate-600 text-base max-w-xs leading-relaxed font-medium">
                Empowering students, educators, and businesses to collaborate, innovate, and shape the future of education and entrepreneurship.
              </p>
            </div>
            {/* Socials */}
            <div className="flex space-x-3 pt-2">
              <a href="#" aria-label="Twitter" className="hover:text-blue-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" aria-label="GitHub" className="hover:text-slate-700 transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          {/* Grouped Link Sections */}
          <div className="w-full md:w-2/3 flex justify-end">
            <div className="flex flex-row gap-4 text-sm"> {/* slightly bigger text size */}
              {/* Students */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Students</h4>
                <ul className="space-y-1 text-slate-600">
                  <li><a href="#" className="hover:text-blue-600">Submit Project</a></li>
                  <li><a href="#" className="hover:text-blue-600">Find Mentors</a></li>
                  <li><a href="#" className="hover:text-blue-600">Learning Resources</a></li>
                  <li><a href="#" className="hover:text-blue-600">Success Stories</a></li>
                  <li><a href="#" className="hover:text-blue-600">Community</a></li>
                </ul>
              </div>
              {/* Businesses */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Businesses</h4>
                <ul className="space-y-1 text-slate-600">
                  <li><a href="#" className="hover:text-purple-600">Browse Projects</a></li>
                  <li><a href="#" className="hover:text-purple-600">Partner Program</a></li>
                  <li><a href="#" className="hover:text-purple-600">Talent Pipeline</a></li>
                  <li><a href="#" className="hover:text-purple-600">Innovation Hub</a></li>
                  <li><a href="#" className="hover:text-purple-600">Case Studies</a></li>
                </ul>
              </div>
              {/* Researchers */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Researchers</h4>
                <ul className="space-y-1 text-slate-600">
                  <li><a href="#" className="hover:text-green-600">Research Projects</a></li>
                  <li><a href="#" className="hover:text-green-600">Funding Options</a></li>
                  <li><a href="#" className="hover:text-green-600">Collaboration Tools</a></li>
                  <li><a href="#" className="hover:text-green-600">Journals & Papers</a></li>
                </ul>
              </div>
              {/* Educators */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Educators</h4>
                <ul className="space-y-1 text-slate-600">
                  <li><a href="#" className="hover:text-red-500">Post Research</a></li>
                  <li><a href="#" className="hover:text-red-500">Find Talent</a></li>
                  <li><a href="#" className="hover:text-red-500">Academic Resources</a></li>
                  <li><a href="#" className="hover:text-red-500">Industry Ties</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-300 mb-2" />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center text-slate-500 text-xs space-y-1 md:space-y-0">
          {/* Contact Info */}
          <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4">
            <span className="flex items-center space-x-1"><Mail className="w-4 h-4 mr-1" /> <a href="mailto:info@amogh.com" className="hover:underline">info@amogh.com</a></span>
            <span className="flex items-center space-x-1"><Phone className="w-4 h-4 mr-1" /> <a href="tel:+1234567890" className="hover:underline">+1 234 567 890</a></span>
            <span className="flex items-center space-x-1"><MapPin className="w-4 h-4 mr-1" /> <span>123 EdTech Ave, Innovation City</span></span>
          </div>
          {/* Legal Links */}
          <div className="flex space-x-5">
          <Link to="/privacypolicy" className="hover:text-slate-700">Privacy Policy</Link>
          <Link to="/termsofservice" className="hover:text-slate-700">Terms of Service</Link>
          <Link to="/sendfeedback" className="hover:text-slate-700">Send Feedback</Link>
          <Link to="/aboutus" className="hover:text-slate-700">About Us</Link>
            <a href="#" className="hover:text-slate-700">Cookie Policy</a>
          </div>
          <div className="text-slate-400">© 2024 AMOGH. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
