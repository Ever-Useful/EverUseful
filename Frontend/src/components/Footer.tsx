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
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 lg:gap-8 mb-8 text-sm">
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
              institutions worldwide since 2025.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                <span>amogheveruseful@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                <span>Connaught Place Delhi-110001</span>
              </div>
              {/* <div className="flex items-start">
                <Award className="h-4 w-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>ISO 27001 Certified • GDPR Compliant</span>
              </div> */}
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <h4 className="text-white font-medium mb-3 text-sm">Connect With Us</h4>
              <div className="flex space-x-3">
                {/* <a href="#" className="bg-gray-700 p-2.5 rounded-full hover:bg-blue-500 transition-all transform hover:-translate-y-0.5 shadow-md">
                  <Twitter className="h-5 w-5 text-blue-300" />
                </a> */}
                <a 
                  href="https://www.linkedin.com/company/amogh-ever-useful/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-700 p-2.5 rounded-full hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 shadow-md"
                >
                  <Linkedin className="h-5 w-5 text-blue-300" />
                </a>
                <a 
                  href="https://github.com/HARSH6309" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-700 p-2.5 rounded-full hover:bg-gray-600 transition-all transform hover:-translate-y-0.5 shadow-md"
                >
                  <Github className="h-5 w-5 text-gray-300" />
                </a>
                <a 
                  href="https://www.instagram.com/amoghever/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-700 p-2.5 rounded-full hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all transform hover:-translate-y-0.5 shadow-md"
                >
                  <Instagram className="h-5 w-5 text-purple-300" />
                </a>
                {/* <a href="amogheveruseful@gmail.com" className="bg-gray-700 p-2.5 rounded-full hover:bg-red-600 transition-all transform hover:-translate-y-0.5 shadow-md">
                  <Mail className="h-5 w-5 text-red-300" />
                </a> */}
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
              <li><Link to="/consulting" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><Calendar className="mr-2 h-4 w-4 text-gray-500" /> Schedule Sessions</Link></li>
              {/* <li><Link to="/collaborators" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><Users className="mr-2 h-4 w-4 text-gray-500" /> Study Groups</Link></li> */}
              {/* <li><Link to="/dashboard" onClick={scrollToTop} className="hover:text-blue-400 transition-colors flex items-center"><Award className="mr-2 h-4 w-4 text-gray-500" /> Progress Dashboard</Link></li> */}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center text-sm">
              <Briefcase className="mr-2 h-5 w-5 text-purple-400" />
              Enterprise
            </h4>
            <ul className="space-y-2.5 text-xs">
            <li><Link to="/consulting" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><Users className="mr-2 h-4 w-4 text-gray-500" /> Expert Consultation</Link></li>
              <li><Link to="/freelancing" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><BookOpen className="mr-2 h-4 w-4 text-gray-500" /> Research Freelancing</Link></li>
              <li><Link to="/connect" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-gray-500" /> Career Opportunities</Link></li>
              {/* <li><Link to="/projects/new" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><Award className="mr-2 h-4 w-4 text-gray-500" /> Start New Project</Link></li> */}
              <li><Link to="/connections" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><Globe className="mr-2 h-4 w-4 text-gray-500" /> Network & Connect</Link></li>
              <li><Link to="/sustainable" onClick={scrollToTop} className="hover:text-purple-400 transition-colors flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-gray-500" /> Sustainable Projects</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2 space-y-4 bg-gray-800/50 p-4 lg:p-6 rounded-xl border border-gray-700">
            <div className="flex items-center">
              <Mail className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-400 mr-2" />
              <h3 className="text-white font-bold text-base lg:text-lg">Stay Ahead</h3>
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
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-xs h-8 lg:h-9"
                />
                <Input 
                  type="text" 
                  placeholder="Area of interest (e.g. AI, Business)" 
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-xs h-8 lg:h-9"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-8 lg:h-9 text-xs shadow-lg"
              >
                <Mail className="mr-2 h-3 w-3" />
                <span className="text-xs">Subscribe to Insights</span>
              </Button>
              <p className="text-gray-500 text-xs leading-tight">
                By subscribing, you agree to our Privacy Policy and consent to receive 
                updates from our company. You can unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 pb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-3">
            {/* App Download */}
            <div className="space-y-1.5">
              <h4 className="text-white font-semibold text-xs lg:text-sm">Coming Soon</h4>
              <p className="text-gray-400 text-xs">Mobile App</p>
              <div className="flex space-x-1.5">
                <Button className="bg-black hover:bg-gray-900 text-white h-7 lg:h-8 px-2 text-xs">
                  <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 18.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <span className="text-xs">App Store</span>
                </Button>
                <Button className="bg-black hover:bg-gray-900 text-white h-7 lg:h-8 px-2 text-xs">
                  <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span className="text-xs">Play Store</span>
                </Button>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-1.5">
              <h4 className="text-white font-semibold text-xs lg:text-sm">Legal</h4>
              <div className="space-y-1">
                <Link to="/privacy-policy" className="block text-gray-400 hover:text-white text-xs transition-colors">Privacy Policy</Link>
                <Link to="/cookie-policy" className="block text-gray-400 hover:text-white text-xs transition-colors">Cookies Policy</Link>
                <Link to="/accessibility" className="block text-gray-400 hover:text-white text-xs transition-colors">Accessibility</Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-1.5">
              <h4 className="text-white font-semibold text-xs lg:text-sm">Support</h4>
              <div className="space-y-1">
                <a href="mailto:support@amogh.com" className="block text-gray-400 hover:text-white text-xs transition-colors">support@amogh.com</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs transition-colors">Live Chat</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs transition-colors">Help Center</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-3">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Trusted by 850+ institutions and 1.2M+ learners worldwide</span>
              </div>
              
              <div className="text-center">
                <span>© 2025 AMOGH - ever useful Marketplace Website. All rights reserved.</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-green-400" />
                  <span>ISO 27001</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3 text-blue-400" />
                  <span>GDPR</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3 text-purple-400" />
                  <span>Global</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};