import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Bell, Plus, User } from "lucide-react";
import { UserType } from "@/pages/Dashboard";
import { Link } from "react-router-dom";

interface HeaderProps {
  userType: UserType;
}

const Header = ({ userType }: HeaderProps) => {
  const getActionButtonText = () => {
    switch (userType) {
      case 'student': return "Add Project";
      case 'professor': return "Host Session";
      case 'enterprise': return "Find Deals";
      default: return "Add Project";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search task" 
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button className="text-md bg-green-600 hover:bg-green-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            {getActionButtonText()}
          </Button>
          
          <Button variant="outline" className="text-md text-gray-600">
            Import Data
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Mail className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-slate-700 hover:text-slate-900 hover:bg-slate-50 touch-manipulation"
              asChild
            >
              <Link to="/profile" >
                <User className="w-5 h-5 mr-3" />
                <span className="text-base">Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;