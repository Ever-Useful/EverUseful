import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, User, Settings, HelpCircle, LogOut, BookOpen, GraduationCap, Building, Sparkles, Moon, Sun, Search, Plus, Clock } from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/dashboard/ThemeProvider";
import StatsCard from "@/components/dashboard/StatsCards";
import DetailedStatsSection from "@/components/dashboard/DetailedStatsSection";
import { BarChart, Bar, XAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { userService } from '@/services/userService';
import InitialsAvatar from '@/components/InitialsAvatar';
import { TrendingUp, Star, Shield, LayoutGrid, UserPlus, Users, List, Heart, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

type UserType = 'academic' | 'freelancer' | 'business';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('academic');
  const [selectedStat, setSelectedStat] = useState<any>(null);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Real backend data states
  const [userStats, setUserStats] = useState({
    projectsPosted: 0,
    projectViews: 0,
    projectFavourites: 0,
    connections: 0,
    likes: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);

  // Fetch userType from API on mount
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const userProfile = await userService.getUserProfile();
        // userType may be in auth or profile
        let apiType = (userProfile?.auth?.userType || userProfile?.profile?.userType || '').toLowerCase();
        let mappedType: UserType = 'academic';
        if (apiType === 'student' || apiType === 'professor') mappedType = 'academic';
        else if (apiType === 'freelancer') mappedType = 'freelancer';
        else if (apiType === 'business' || apiType === 'enterprise') mappedType = 'business';
        setUserType(mappedType);
      } catch (e) {
        console.log('User not authenticated or error fetching user type:', e);
        if (e.message?.includes('not authenticated')) {
          navigate('/signin');
          return;
        }
        setUserType('academic'); // fallback
      }
    };
    fetchUserType();
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await userService.getUserProfile();
        setProfileData({
          firstName: userProfile?.auth?.firstName || '',
          lastName: userProfile?.auth?.lastName || '',
          avatar: userProfile?.profile?.avatar || '',
        });
      } catch (error) {
        console.log('User not authenticated or error fetching profile:', error);
        if (error.message?.includes('not authenticated')) {
          navigate('/signin');
          return;
        }
        setProfileData({ firstName: '', lastName: '', avatar: '' });
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fetch real user stats and data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated before making API calls
        const userProfile = await userService.getUserProfile();
        setIsAuthenticated(true);
        
        // Fetch user projects
        let projects = [];
        let totalViews = 0;
        try {
          const projectsData = await userService.getUserProjects();
          projects = projectsData.created || [];
          setUserProjects(projects);
          
          // Calculate total views from user's stats (this is the correct way)
          totalViews = userProfile.stats?.totalViews || 0;
        } catch (error) {
          console.log('No projects found or error fetching projects:', error);
        }

        // Fetch user activities
        let activities = [];
        try {
          const activitiesData = await userService.getUserActivities();
          activities = activitiesData.recent || [];
          setRecentActivity(activities);
        } catch (error) {
          console.log('No activities found or error fetching activities:', error);
        }

        // Calculate stats from real data
        const stats = {
          projectsPosted: projects.length,
          projectViews: totalViews, // Use totalViews from user stats
          projectFavourites: projects.reduce((sum, project) => sum + (project.favourites || 0), 0),
          connections: userProfile.stats?.connectionsCount || 0,
          likes: userProfile.stats?.totalLikes || 0,
        };

        setUserStats(stats);
      } catch (error) {
        console.log('User not authenticated or error fetching user data:', error);
        // Redirect to signin if not authenticated
        if (error.message?.includes('not authenticated')) {
          navigate('/signin');
          return;
        }
        // Don't show error toast for authentication issues
        if (!error.message?.includes('not authenticated')) {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userType !== 'business') {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userType, navigate]);

  const onUserTypeChange = (type: UserType) => {
    setUserType(type);
    setSelectedStat(null);
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
      case 'academic': return "Add Project";
      case 'freelancer': return "Host Session";
      case 'business': return "Find Deals";
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
      case 'academic': return BookOpen;
      case 'freelancer': return GraduationCap;
      case 'business': return Building;
      default: return LayoutDashboard;
    }
  };
  
  const UserIcon = getUserIcon();
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: CheckSquare, label: userType === 'academic' ? "Projects" : userType === 'freelancer' ? "Courses" : "Tasks", badge: "24" },
    { icon: Calendar, label: "Calendar" },
    { icon: BarChart3, label: "Analytics" },
  ];
  
  const generalItems = [
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help" },
    { icon: LogOut, label: "Logout" },
  ];

  // Build stats array based on userType
  const getStatsData = () => {
    if (userType === 'academic') {
      return [
        { title: 'Projects Posted', value: userStats.projectsPosted },
        { title: 'Project Views', value: userStats.projectViews },
        { title: 'Favourites', value: userStats.projectFavourites },
        { title: 'Connections', value: userStats.connections },
        { title: 'Views', value: userStats.projectViews },
      ];
    } else if (userType === 'freelancer') {
      return [
        { title: 'Projects Posted', value: userStats.projectsPosted },
        { title: 'Project Views', value: userStats.projectViews },
        { title: 'Favourites', value: userStats.projectFavourites },
        { title: 'Connections', value: userStats.connections },
        { title: 'Views', value: userStats.projectViews },
      ];
    }
    return [];
  };

  const stats = getStatsData();

  // Generate project analytics data from real projects
  const getProjectAnalyticsData = () => {
    if (userProjects.length === 0) {
      return [
        { name: 'M', value: 0 },
        { name: 'T', value: 0 },
        { name: 'W', value: 0 },
        { name: 'Th', value: 0 },
        { name: 'F', value: 0 },
        { name: 'S', value: 0 },
      ];
    }

    // Group projects by creation day and count views
    const dayViews = { M: 0, T: 0, W: 0, Th: 0, F: 0, S: 0 };
    userProjects.forEach(project => {
      if (project.createdAt) {
        const day = new Date(project.createdAt).getDay();
        const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
        const dayName = dayNames[day];
        if (dayViews[dayName] !== undefined) {
          dayViews[dayName] += project.views || 0;
        }
      }
    });

    return Object.entries(dayViews).map(([name, value]) => ({ name, value }));
  };

  const dataForProjectAnalytics = getProjectAnalyticsData();

  const getTitleForProjectAnalytics = () => {
    switch (userType) {
      case 'academic': return "Project Contributions";
      case 'freelancer': return "Course Analytics";
      case 'business': return "Project Analytics";
      default: return "Project Analytics";
    }
  };

  // Generate project progress data from real projects
  const getProjectProgressData = () => {
    if (userProjects.length === 0) {
      return [
        { name: 'Completed', value: 0, color: '#16a34a' },
        { name: 'In Progress', value: 0, color: '#3b82f6' },
        { name: 'Pending', value: 0, color: '#f59e0b' },
      ];
    }

    const completed = userProjects.filter(p => p.status === 'completed' || p.status === 'Completed').length;
    const inProgress = userProjects.filter(p => p.status === 'in-progress' || p.status === 'In Progress').length;
    const pending = userProjects.filter(p => p.status === 'pending' || p.status === 'Pending').length;

    return [
      { name: 'Completed', value: completed, color: '#16a34a' },
      { name: 'In Progress', value: inProgress, color: '#3b82f6' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
    ];
  };

  const dataForProjectProgress = getProjectProgressData();

  const getTitleForProjectProgress = () => {
    switch (userType) {
      case 'academic': return "Project Progress";
      case 'freelancer': return "Mentoring Progress";
      case 'business': return "Ongoing Deals";
      default: return "Project Progress";
    }
  };

  const getReminderData = () => {
    switch (userType) {
      case 'academic':
        return {
          title: "Assignment Due",
          subtitle: "Math Problem Set #5",
          time: "Due: 11:59 pm - Today",
          buttonText: "Start Working"
        };
      case 'freelancer':
        return {
          title: "Faculty Meeting",
          subtitle: "Department Curriculum Review",
          time: "Time: 02:00 pm - 04:00 pm",
          buttonText: "Join Meeting"
        };
      case 'business':
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

  // Format recent activity for display
  const formatRecentActivity = () => {
    if (recentActivity.length === 0) {
      return [];
    }

    return recentActivity.slice(0, 5).map(activity => {
      const timeAgo = getTimeAgo(activity.timestamp);
      return {
        text: activity.description,
        time: timeAgo
      };
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  const displayRecentActivity = formatRecentActivity();

  if (loading) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="amogh-ui-theme">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated && !loading) {
    return null; // This will trigger the redirect in useEffect
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="amogh-ui-theme">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        {/* Header always on top */}
        <Header disableProfileSidebar={true} />
        {/* Permanent Profile Sidebar, z-10 so header is above */}
        <div className="fixed top-0 left-0 w-96 max-w-[90vw] h-full bg-white shadow-2xl z-10 flex flex-col">
          <div className="flex items-center justify-between p-2.5 border-b">
            <h2 className="font-bold text-xl text-gray-900">Profile</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <InitialsAvatar firstName={profileData.firstName} lastName={profileData.lastName} avatar={profileData.avatar} size={96} />
              <h3 className="font-bold text-lg text-gray-900 mt-3">{profileData.firstName} {profileData.lastName}</h3>
              <Link to="/profile" className="text-sm text-blue-600 hover:underline mt-1">
                View Profile &gt;
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-gray-50">
                <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-1" />
                <p className="font-bold text-sm text-gray-900">{userStats.projectViews}</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <Star className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
                <p className="font-bold text-sm text-gray-900">{userStats.likes}</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <Shield className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <p className="font-bold text-sm text-gray-900">{userStats.projectsPosted}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">USER</h4>
              <nav className="space-y-1">
                <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <LayoutGrid className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Dashboard</span>
                </Link>
                <Link to="/connection" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <UserPlus className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">My Connections</span>
                </Link>
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <Users className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">My Collaborations</span>
                </Link>
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <List className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">My Projects</span>
                </Link>
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">My Favourites</span>
                </Link>
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <BarChart2 className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Analytics</span>
                </Link>
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <Calendar className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Calendar</span>
                </Link>
              </nav>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">GENERAL</h4>
              <nav className="space-y-1">
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Settings</span>
                </Link>
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <HelpCircle className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Help</span>
                </Link>
                <Link to="/signin" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <LogOut className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Logout</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
        {/* Main dashboard content with left margin for sidebar */}
        <main className="flex-1 p-6 overflow-auto ml-96">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Plan, prioritize, and accomplish your tasks with ease.</p>
              </div>
              {/* Remove userType tab switcher and custom header */}
              <div className="flex items-center gap-4">
                {/* Dark mode toggle */}
                <DarkModeToggle />
                <Button className="text-md bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  {getActionButtonText(userType)}
                </Button>
              </div>
            </div>

            {/* Stats cards */}
            {(userType === 'academic' || userType === 'freelancer') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                  <StatsCard
                    key={index}
                    title={stat.title}
                    value={String(stat.value)}
                    change={''}
                    primary={index === 0}
                    status={false}
                    onClick={() => {}}
                    hoverData={generateHoverData(Number(stat.value))}
                  />
                ))}
              </div>
            )}

            {/* Detailed Stats Section */}
            {selectedStat && (
              <DetailedStatsSection
                selectedStat={selectedStat}
                onClose={() => setSelectedStat(null)}
                userType={
                  userType === 'academic' ? 'student' :
                  userType === 'freelancer' ? 'professor' :
                  'enterprise'
                }
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
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userProjects.length > 0 ? Math.round((dataForProjectProgress[0]?.value / userProjects.length) * 100) : 0}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {userType === 'academic' ? 'Assignments' : userType === 'freelancer' ? 'Courses' : 'Projects'} Completed
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

              {/* Recent Activity (in place of Reminders) */}
              {(userType === 'academic' || userType === 'freelancer') && (
                <Card className="h-80 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {displayRecentActivity.length === 0 ? (
                        <p className="text-gray-500">No recent activity.</p>
                      ) : (
                        <ul className="space-y-2">
                          {displayRecentActivity.map((activity, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-200 flex items-center justify-between">
                              <span>{activity.text}</span>
                              <span className="text-xs text-gray-400 ml-2">{activity.time}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;