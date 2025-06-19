import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  BookOpen,
  GraduationCap,
  Building,
  Sparkles,
  Moon
} from "lucide-react";
import { UserType } from "@/pages/Dashboard";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import DarkModeToggle from "@/components/dashboard/DarkModeToggle";

interface SidebarProps {
  userType: UserType;
}

const Sidebar = ({ userType }: SidebarProps) => {
  const getUserIcon = () => {
    switch (userType) {
      case 'student': return BookOpen;
      case 'professor': return GraduationCap;
      case 'enterprise': return Building;
      default: return LayoutDashboard;
    }
  };

  const UserIcon = getUserIcon();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: CheckSquare, label: userType === 'student' ? "Projects" : userType === 'professor' ? "Courses" : "Tasks", badge: "24" },
    { icon: Calendar, label: "Calendar" },
    { icon: BarChart3, label: "Analytics" },
  ];

  const generalItems = [
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="container h-14 w-full flex items-center justify-between">
        <div className="w-30 flex items-left space-x-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                AMOGH
              </span>
              <span className="text-xs text-slate-500 -mt-1">ever useful</span>
            </div>
            <Badge variant="secondary" className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">Beta</Badge>
          </Link>
        </div>
      </div>


      <div className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">MENU</p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-10 text-md ${
                  item.active ? "bg-green-50 text-green-700 text-md border-r-2 border-green-600" : "text-gray-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Button>
            ))}
          </nav>
        </div>
        
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">GENERAL</p>
          <div className="w-full flex items-center gap-3 mb-2">
            <DarkModeToggle />
            <span>Dark Mode Toggle</span>
          </div>
          <nav className="space-y-1">
            {generalItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-10 text-gray-600 text-md"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;