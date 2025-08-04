import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Rocket,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Mail,
  BookOpen,
  Briefcase,
  GraduationCap,
  User,
  Shield,
  FileText,
  Globe,
  Award,
  Laptop,
  BookMarked,
  Lightbulb,
  HelpCircle,
  Calendar,
  Users,
  MessageSquare
} from "lucide-react";
import Logo from '../assets/Logo/Logo Main.png'
import { Link } from 'react-router-dom';

export const Footer = () => {
   // Function to scroll to top immediately
   const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    // Additional fallbacks
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 border-t border-gray-700">
      {/* Decorative top border */}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-10 mb-16 text-sm">
          {/* Brand Column */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center space-x-3">
              <Link to="#" onClick={scrollToTop} className="flex items-center space-x-2 group">
                <img src={Logo} alt="AMOGH" className="h-20 w-auto" />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-1">Future-Ready Education Solutions</p>
            
            <p className="text-gray-400 leading-relaxed text-sm max-w-lg">
              Transforming education through cutting-edge technology, industry partnerships, 
              and innovative learning methodologies. Empowering students, educators, and 
              institutions worldwide since 2018.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>support@amoghedu.com</span>
              </div>
              <div className="flex items-start">
                <Globe className="h-4 w-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>Bengaluru, India • San Francisco, USA • London, UK</span>
              </div>
              <div className="flex items-start">
                <Award className="h-4 w-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>ISO 27001 Certified • GDPR Compliant</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <h4 className="text-white font-medium mb-3 text-sm">Connect With Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-blue-500 transition-all transform hover:-translate-y-0.5 shadow-md">
                  <Twitter className="h-5 w-5 text-blue-300" />
                </a>
                <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 shadow-md">
                  <Linkedin className="h-5 w-5 text-blue-300" />
                </a>
                <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-gray-600 transition-all transform hover:-translate-y-0.5 shadow-md">
                  <Github className="h-5 w-5 text-gray-300" />
                </a>
                <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all transform hover:-translate-y-0.5 shadow-md">
                  <Instagram className="h-5 w-5 text-purple-300" />
                </a>
                <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-red-600 transition-all transform hover:-translate-y-0.5 shadow-md">
                  <Mail className="h-5 w-5 text-red-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center text-sm">
              <Laptop className="mr-2 h-5 w-5 text-blue-400" />
              Learning Hub
            </h4>
            <ul className="space-y-2.5 text-xs">
            <li><Link to="/marketplace" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><BookMarked className="mr-2 h-4 w-4 text-gray-500" /> Course Marketplace</Link></li>
              <li><Link to="/aiagents" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-gray-500" /> AI Learning Agents</Link></li>
              <li><Link to="/findexpert" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><HelpCircle className="mr-2 h-4 w-4 text-gray-500" /> Find Expert Mentors</Link></li>
              <li><Link to="/meetings/schedule" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><Calendar className="mr-2 h-4 w-4 text-gray-500" /> Schedule Sessions</Link></li>
              <li><Link to="/collaborators" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><Users className="mr-2 h-4 w-4 text-gray-500" /> Study Groups</Link></li>
              <li><Link to="/dashboard" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><Award className="mr-2 h-4 w-4 text-gray-500" /> Progress Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center text-sm">
              <Briefcase className="mr-2 h-5 w-5 text-purple-400" />
              Enterprise
            </h4>
            <ul className="space-y-2.5 text-xs">
            <li><Link to="/consultation" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><Users className="mr-2 h-4 w-4 text-gray-500" /> Expert Consultation</Link></li>
              <li><Link to="/freelancing" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><BookOpen className="mr-2 h-4 w-4 text-gray-500" /> Research Freelancing</Link></li>
              <li><Link to="/connect" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-gray-500" /> Career Opportunities</Link></li>
              <li><Link to="/projects/new" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><Award className="mr-2 h-4 w-4 text-gray-500" /> Start New Project</Link></li>
              <li><Link to="/connection" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><Globe className="mr-2 h-4 w-4 text-gray-500" /> Network & Connect</Link></li>
              <li><Link to="/sustainable" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-gray-500" /> Sustainable Projects</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2 space-y-5 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-yellow-400 mr-2" />
              <h3 className="text-white font-bold text-lg">Stay Ahead</h3>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Subscribe to our newsletter for the latest courses, industry insights, 
              and exclusive learning resources. Never miss an update!
            </p>
            <form className="space-y-3">
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Your work email" 
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-xs h-9"
                />
                <Input 
                  type="text" 
                  placeholder="Area of interest (e.g. AI, Business)" 
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-xs h-9"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-9 text-xs shadow-lg"
              >
                <Mail className="mr-2 h-4 w-4" />
                Subscribe to Insights
              </Button>
              <p className="text-gray-500 text-xs leading-tight">
                By subscribing, you agree to our Privacy Policy and consent to receive 
                updates from our company. You can unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* App Download */}
            <div className="space-y-4">
              <h4 className="text-white font-medium text-lg">Coming Soon</h4>
              <h3 className="text-white font-medium text-sm">Mobile Experience</h3>
              <p className="text-gray-400 text-xs max-w-xs">
                Download our app for on-the-go learning with offline access and personalized recommendations.
              </p>
              <div className="flex space-x-3">
                <Button className="bg-black hover:bg-gray-900 text-white h-10 px-4 text-xs">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  App Store
                </Button>
                <Button className="bg-black hover:bg-gray-900 text-white h-10 px-4 text-xs">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  Play Store
                </Button>
              </div>
            </div>
            
            {/* Policy Links */}
            <div className="space-y-4">
              <h4 className="text-white font-medium text-sm">Legal</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
              <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">                  <Shield className="mr-2 h-4 w-4 text-gray-500" />
                  Privacy Policy
                </Link>
                <Link to="/terms-conditions" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Terms of Service
                </Link>
                <Link to="/cookie-policy" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Cookie Policy
                </Link>
                <Link to="/delivery-policy" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Delivery Policy
                </Link>
                <Link to="/refund-policy" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Refund Policy
                </Link>
                <a href="#" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  GDPR Compliance
                </a>
                <a href="#" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Accessibility
                </a>
                <a href="#" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Security Practices
                </a>
              </div>
            </div>
            
            {/* Awards */}
            <div className="space-y-4">
              <h4 className="text-white font-medium text-sm">Recognitions</h4>
              <div className="flex flex-wrap gap-3">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-xs flex items-center">
                  <span className="text-yellow-400 mr-1">★</span> EdTech 100
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-xs flex items-center">
                  <span className="text-blue-400 mr-1">🏆</span> G2 Leader
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-xs">
                  ISO 27001
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-xs">
                  AWS EdStart
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2">
                Trusted by 850+ institutions and 1.2M+ learners worldwide
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-6 border-t border-gray-800 text-center">
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} AMOGH - ever useful EdTech Platform. All rights reserved.<br />
              AMOGH® is a registered trademark of Future Learning Solutions Inc. | GSTIN: 29ABCDE1234F1GH<br />
              Patent Pending: US20210765432 | All course materials are protected by copyright laws.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};