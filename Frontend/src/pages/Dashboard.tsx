import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, User, Settings, HelpCircle, LogOut, BookOpen, GraduationCap, Building, Sparkles, Moon, Sun, Search, Plus, Mail, Bell, Clock } from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/dashboard/ThemeProvider";
import StatsCard from "@/components/dashboard/StatsCards";
import DetailedStatsSection from "@/components/dashboard/DetailedStatsSection";
import { BarChart, Bar, XAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts";
import { Link } from "react-router-dom";

export type UserType = 'student' | 'professor' | 'enterprise';

const Dashboard = () => {
  const [userType, setUserType] = useState<UserType>('student');
  const [selectedStat, setSelectedStat] = useState<any>(null);

  const onUserTypeChange = (type: UserType) => {
    setUserType(type);
    setSelectedStat(null); // Close detailed view when changing user type
  };

  // Generate hover data for stats cards
  const generateHoverData = (baseValue: number) => {
    return [
      { name: 'Mon', value: baseValue * 0.8 },
      { name: 'Tue', value: baseValue * 1.2 },
      { name: 'Wed', value: baseValue * 0.9 },
      { name: 'Thu', value: baseValue * 1.4 },
      { name: 'Fri', value: baseValue * 1.1 },
      { name: 'Sat', value: baseValue * 0.7 },
      { name: 'Sun', value: baseValue },
    ];
  };

  const getActionButtonText = (userType: UserType) => {
    switch (userType) {
      case 'student': return "Add Project";
      case 'professor': return "Host Session";
      case 'enterprise': return "Find Deals";
      default: return "Add Project";
    }
  };

  const DarkModeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-8 w-8 px-0"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  };

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

  const getStatsData = () => {
    switch (userType) {
      case 'student':
        return [
          { title: "Total Projects", value: "18", change: "Increased from last month", primary: true },
          { title: "Completed", value: "12", change: "Increased from last month" },
          { title: "In Progress", value: "4", change: "Increased from last month" },
          { title: "Sold", value: "2", change: "On Discuss", status: true },
          { title: "Earning", value: "2500$", change: "Ongoing", status: true },
        ];
      case 'professor':
        return [
          { title: "Total Sessions", value: "8", change: "Increased from last month", primary: true },
          { title: "Active Students", value: "156", change: "Increased from last month" },
          { title: "Projects Reviews", value: "24", change: "Increased from last month" },
          { title: "Pending Reviews", value: "12", change: "On Discuss", status: true },
          { title: "Earning", value: "2500$", change: "Ongoing", status: true },
        ];
      case 'enterprise':
        return [
          { title: "Total Deals", value: "24", change: "Increased from last month", primary: true },
          { title: "Past Deals", value: "10", change: "Increased from last month" },
          { title: "Ongoing deals", value: "12", change: "Increased from last month" },
          { title: "Inventory", value: "2", change: "Projects", status: true },
          { title: "Earning", value: "2500$", change: "Ongoing", status: true },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsData();

  const dataForProjectAnalytics = [
    { name: 'M', value: 20 },
    { name: 'T', value: 45 },
    { name: 'W', value: 60 },
    { name: 'T', value: 35 },
    { name: 'F', value: 25 },
    { name: 'S', value: 15 },
  ];

  const getTitleForProjectAnalytics = () => {
    switch (userType) {
      case 'student': return "Project Contributions";
      case 'professor': return "Course Analytics";
      case 'enterprise': return "Project Analytics";
      default: return "Project Analytics";
    }
  };

  const dataForProjectProgress = [
    { name: 'Completed', value: 41, color: '#16a34a' },
    { name: 'In Progress', value: 35, color: '#3b82f6' },
    { name: 'Pending', value: 24, color: '#f59e0b' },
  ];

  const getTitleForProjectProgress = () => {
    switch (userType) {
      case 'student': return "Project Progress";
      case 'professor': return "Mentoring Progress";
      case 'enterprise': return "Ongoing Deals";
      default: return "Project Progress";
    }
  };

  const getReminderData = () => {
    switch (userType) {
      case 'student':
        return {
          title: "Assignment Due",
          subtitle: "Math Problem Set #5",
          time: "Due: 11:59 pm - Today",
          buttonText: "Start Working"
        };
      case 'professor':
        return {
          title: "Faculty Meeting",
          subtitle: "Department Curriculum Review",
          time: "Time: 02:00 pm - 04:00 pm",
          buttonText: "Join Meeting"
        };
      case 'enterprise':
        return {
          title: "Meeting with Arc Company",
          subtitle: "Quarterly Business Review",
          time: "Time: 02:00 pm - 04:00 pm",
          buttonText: "Start Meeting"
        };
      default:
        return {
          title: "Meeting with Arc Company",
          subtitle: "Quarterly Business Review",
          time: "Time: 02:00 pm - 04:00 pm",
          buttonText: "Start Meeting"
        };
    }
  };

  const reminder = getReminderData();

  return (
    <ThemeProvider defaultTheme="light" storageKey="amogh-ui-theme">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
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
                  <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1">ever useful</span>
                </div>
                <Badge variant="secondary" className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">Beta</Badge>
              </Link>
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">MENU</p>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Button key={item.label} variant={item.active ? "secondary" : "ghost"} className={`w-full justify-start gap-3 h-10 text-md ${item.active ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-md border-r-2 border-green-600" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}>
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-green-600 dark:bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                ))}
              </nav>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">GENERAL</p>
              <div className="space-y-1">
                {generalItems.map((item) => (
                  <Button key={item.label} variant="ghost" className="w-full justify-start gap-3 h-10 text-gray-600 dark:text-gray-300 text-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Mobile App Announcement Poster */}
            <div className="mt-4">
              <Card className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mx-auto mb-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">AMOGH Mobile</h3>
                  <p className="text-xs text-emerald-100 mb-3">App is coming soon!</p>
                  <Button 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs w-full"
                  >
                    Get Notified
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search task"
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button className="text-md bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  {getActionButtonText(userType)}
                </Button>
                <Button variant="outline" className="text-md text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Import Data
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 touch-manipulation"
                    asChild
                  >
                    <Link to="/profile">
                      <User className="w-5 h-5 mr-3" />
                      <span className="text-base">Profile</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-300">Plan, prioritize, and accomplish your tasks with ease.</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Dark mode toggle */}
                  <DarkModeToggle />
                  
                  {/* User type selection */}
                  <Card className="w-fit dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-2">
                      <div className="flex gap-1">
                        <Button
                          variant={userType === 'student' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => onUserTypeChange('student')}
                          className="text-xs"
                        >
                          Student
                        </Button>
                        <Button
                          variant={userType === 'professor' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => onUserTypeChange('professor')}
                          className="text-xs"
                        >
                          Professor
                        </Button>
                        <Button
                          variant={userType === 'enterprise' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => onUserTypeChange('enterprise')}
                          className="text-xs"
                        >
                          Enterprise
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                  <StatsCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    primary={stat.primary}
                    status={stat.status}
                    onClick={() => setSelectedStat(stat)}
                    hoverData={generateHoverData(parseInt(stat.value))}
                  />
                ))}
              </div>

              {/* Detailed Stats Section */}
              {selectedStat && (
                <DetailedStatsSection
                  selectedStat={selectedStat}
                  onClose={() => setSelectedStat(null)}
                  userType={userType}
                />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Analytics */}
                <Card className="h-80 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{getTitleForProjectAnalytics()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={dataForProjectAnalytics}>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          className="text-gray-500 dark:text-gray-400 text-sm"
                        />
                        <Bar
                          dataKey="value"
                          fill="#16a34a"
                          radius={[4, 4, 0, 0]}
                          className="hover:opacity-80"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Project progress */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{getTitleForProjectProgress()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dataForProjectProgress}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {dataForProjectProgress.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">41%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userType === 'student' ? 'Assignments' : userType === 'professor' ? 'Courses' : 'Projects'} Completed
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {dataForProjectProgress.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reminders */}
                <Card className="h-80 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Reminders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">{reminder.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{reminder.subtitle}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Clock className="w-4 h-4" />
                        {reminder.time}
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white w-full">
                        {reminder.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

// Wrap the Dashboard component with ThemeProvider
const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="amogh-ui-theme">
      <Dashboard />
    </ThemeProvider>
  );
};

export default Index;