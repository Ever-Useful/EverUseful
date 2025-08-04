import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, User, Settings, HelpCircle, LogOut, BookOpen, GraduationCap, Building, Sparkles, Moon, Sun, Search, Plus, Clock, Minus, Briefcase, List, Users, Bell, Menu } from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/dashboard/ThemeProvider";
import StatsCard from "@/components/dashboard/StatsCards";
import DetailedStatsSection from "@/components/dashboard/DetailedStatsSection";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell, Legend, LineChart, Line, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import userService from '@/services/userService';
import InitialsAvatar from '@/components/InitialsAvatar';
import { TrendingUp, Star, Shield, LayoutGrid, UserPlus, Heart, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

type UserType = 'academic' | 'freelancer' | 'business';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('academic');
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasEarnings, setHasEarnings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real backend data states
  const [userStats, setUserStats] = useState({
    projectsPosted: 0,
    projectViews: 0,
    projectFavourites: 0,
    connections: 0,
    likes: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [earningsData, setEarningsData] = useState([
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
  ]);
  const [userProjects, setUserProjects] = useState([]);
  const [lineGraphData, setLineGraphData] = useState([
    { month: 'Jan', projects: 0, favourites: 0, connections: 0, views: 0 },
    { month: 'Feb', projects: 0, favourites: 0, connections: 0, views: 0 },
    { month: 'Mar', projects: 0, favourites: 0, connections: 0, views: 0 },
    { month: 'Apr', projects: 0, favourites: 0, connections: 0, views: 0 },
    { month: 'May', projects: 0, favourites: 0, connections: 0, views: 0 },
    { month: 'Jun', projects: 0, favourites: 0, connections: 0, views: 0 },
  ]);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated before making API calls
        const userProfile = await userService.getUserProfile();
        setIsAuthenticated(true);
        
        // Fetch aggregated dashboard data
        const dashboardData = await userService.getDashboardData();
        
        // Update stats with real data
        const stats = {
          projectsPosted: dashboardData.projectCount,
          projectViews: dashboardData.totalViews,
          projectFavourites: dashboardData.favourites,
          connections: dashboardData.connections,
          likes: 0, // Keep as 0 for now, can be added to backend if needed
        };

        setUserStats(stats);
        setRecentActivity(dashboardData.activities || []);
        
        // Initialize earnings data - will be updated after projects are fetched
        setEarningsData([]);
        setHasEarnings(false);

        const projectsData = await userService.getUserProjects();
        const userProjects = projectsData.created || [];
        setUserProjects(userProjects);

        // Calculate earnings based on actual project data
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            name: d.toLocaleString('default', { month: 'short' }),
            value: 0
          });
        }
        
        // Distribute earnings based on project creation dates
        if (userProjects && userProjects.length > 0) {
          userProjects.forEach((project: any) => {
            if (project.createdAt) {
              const projectDate = new Date(project.createdAt);
              const monthIndex = months.findIndex(m => {
                const monthDate = new Date(projectDate.getFullYear(), projectDate.getMonth(), 1);
                return monthDate.getMonth() === projectDate.getMonth() && 
                       monthDate.getFullYear() === projectDate.getFullYear();
              });
              if (monthIndex !== -1) {
                // Add project price to that month's earnings
                months[monthIndex].value += project.price || 0;
              }
            }
          });
        }
        
        setEarningsData(months);
        setHasEarnings(months.some(e => e.value > 0));

        const statusCounts = userProjects.reduce((acc: any, project: any) => {
          const status = (project.status || 'Unknown').toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
        const pieColors = ['#10b981', '#3b82f6', '#f59e42', '#6366f1', '#f43f5e'];
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

  useEffect(() => {
    const aggregateLineGraphData = async () => {
      try {
        // Get real project data to create accurate graphs
        const projectsData = await userService.getUserProjects();
        const userProjects = projectsData.created || [];
        
        // Prepare months (last 6 months)
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            key: `${d.getFullYear()}-${d.getMonth() + 1}`,
            label: d.toLocaleString('default', { month: 'short' }),
          });
        }

        // Initialize monthly data
        const projectsByMonth = Array(6).fill(0);
        const viewsByMonth = Array(6).fill(0);
        const favouritesByMonth = Array(6).fill(0);
        const connectionsByMonth = Array(6).fill(0);

        // Distribute projects based on actual creation dates
        if (userProjects && userProjects.length > 0) {
          userProjects.forEach((project: any) => {
            if (project.createdAt) {
              const projectDate = new Date(project.createdAt);
              const monthIndex = months.findIndex(m => {
                const monthDate = new Date(projectDate.getFullYear(), projectDate.getMonth(), 1);
                return monthDate.getMonth() === projectDate.getMonth() && 
                       monthDate.getFullYear() === projectDate.getFullYear();
              });
              if (monthIndex !== -1) {
                projectsByMonth[monthIndex]++;
                // Distribute views and other metrics for this project
                const projectViews = project.views || 0;
                const projectFavourites = project.favourites || 0;
                viewsByMonth[monthIndex] += projectViews;
                favouritesByMonth[monthIndex] += projectFavourites;
              }
            }
          });
        }

        // For connections, use a simple distribution since we don't have connection dates
        const totalConnections = userStats.connections || 0;
        if (totalConnections > 0) {
          const connectionsPerMonth = Math.floor(totalConnections / 6);
          for (let i = 0; i < 6; i++) {
            connectionsByMonth[i] = connectionsPerMonth;
          }
          // Distribute remainder
          const remainder = totalConnections % 6;
          for (let i = 0; i < remainder; i++) {
            connectionsByMonth[i]++;
          }
        }

        // Build final data array with real data
        const newLineGraphData = months.map((m, i) => ({
          month: m.label,
          projects: projectsByMonth[i],
          favourites: favouritesByMonth[i],
          connections: connectionsByMonth[i],
          views: viewsByMonth[i],
        }));
        setLineGraphData(newLineGraphData);
      } catch (e) {
        console.error('Error aggregating line graph data:', e);
        // fallback: keep zeros
      }
    };
    
    if (userStats.projectsPosted > 0 || userStats.projectViews > 0) {
      aggregateLineGraphData();
    }
  }, [userStats]);

  const onUserTypeChange = (type: UserType) => {
    setUserType(type);
    setSelectedStat('all');
  };

  // Generate hover data for stats cards
  const generateHoverData = (baseValue: number) => {
    // Generate more realistic weekly data based on the base value
    if (baseValue === 0) {
      return [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 0 },
      ];
    }
    
    // For non-zero values, create a realistic weekly pattern
    const weeklyPattern = [0.9, 1.1, 1.0, 1.2, 1.0, 0.8, 0.7]; // Weekday vs weekend pattern
    return weeklyPattern.map((multiplier, index) => ({
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
      value: Math.round(baseValue * multiplier)
    }));
  };

  const getActionButtonText = (userType: UserType) => {
    // Since this is a project-based website, all user types should create projects
    return 'New Project';
  };

  const DarkModeToggle = () => {
    const { theme, setTheme } = useTheme();
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="rounded-full w-10 h-10"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  };

  const getUserIcon = () => {
    switch (userType) {
      case 'academic':
        return <GraduationCap className="w-5 h-5" />;
      case 'freelancer':
        return <Building className="w-5 h-5" />;
      case 'business':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getStatsData = () => {
    return [
      {
        title: 'Projects Posted',
        value: userStats.projectsPosted,
        icon: <BookOpen className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        title: 'Total Views',
        value: userStats.projectViews,
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
      {
        title: 'Favourites',
        value: userStats.projectFavourites,
        icon: <Heart className="w-5 h-5" />,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      },
      {
        title: 'Connections',
        value: userStats.connections,
        icon: <UserPlus className="w-5 h-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
      },
    ];
  };

  const stats = getStatsData();

  const getProjectAnalyticsData = () => {
    if (userStats.projectsPosted === 0) {
      return [
        { name: 'No Projects', value: 1, color: '#e5e7eb' }
      ];
    }

    return [
      { name: 'Active', value: Math.ceil(userStats.projectsPosted * 0.7), color: '#10b981' },
      { name: 'Completed', value: Math.ceil(userStats.projectsPosted * 0.2), color: '#3b82f6' },
      { name: 'Pending', value: Math.ceil(userStats.projectsPosted * 0.1), color: '#f59e0b' },
    ];
  };

  const dataForProjectAnalytics = getProjectAnalyticsData();

  const getTitleForProjectAnalytics = () => {
    switch (userType) {
      case 'academic': return "Project Analytics";
      case 'freelancer': return "Service Analytics";
      case 'business': return "Deal Analytics";
      default: return "Project Analytics";
    }
  };

  const getProjectProgressData = () => {
    if (userStats.projectsPosted === 0) {
      return [
        { name: 'No Projects', value: 1, color: '#e5e7eb' }
      ];
    }

    const completed = Math.ceil(userStats.projectsPosted * 0.3);
    const inProgress = Math.ceil(userStats.projectsPosted * 0.5);
    const pending = userStats.projectsPosted - completed - inProgress;

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
        time: timeAgo,
        type: activity.type
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

  // Add this helper near the top of the Dashboard component
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile_updated':
        return <User className="w-4 h-4 text-blue-500 mr-2" />;
      case 'project_created':
        return <Plus className="w-4 h-4 text-green-500 mr-2" />;
      case 'project_removed':
        return <Minus className="w-4 h-4 text-red-500 mr-2" />;
      case 'skill_added':
        return <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />;
      case 'skill_updated':
        return <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />;
      case 'skill_removed':
        return <Minus className="w-4 h-4 text-red-400 mr-2" />;
      case 'education_added':
        return <GraduationCap className="w-4 h-4 text-indigo-500 mr-2" />;
      case 'work_experience_added':
        return <Briefcase className="w-4 h-4 text-purple-500 mr-2" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400 mr-2" />;
    }
  };

  // Pie chart colors for project status
  const statusColors = [
    '#10b981', // Completed - emerald
    '#3b82f6', // In Progress - blue
    '#f59e42', // Pending - orange
  ];

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
      {/* Header always on top */}
      <Header />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        {/* Main content with proper spacing for fixed sidebar */}
        <div className="flex flex-1 pt-24"> {/* Add top padding to avoid header overlap */}
          {/* Fixed sidebar - hidden on mobile */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block w-72 h-[calc(100vh-6rem)] bg-white/70 dark:bg-gray-900/80 glass-effect shadow-2xl rounded-2xl m-6 flex flex-col border border-mint/30 backdrop-blur-lg fixed top-24 left-6 z-30`}>
            <div className="flex flex-col items-center py-8 px-4">
              <div className="w-full">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 pl-2">MENU</p>
                <nav className="space-y-2">
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="flex-1 text-left">Dashboard</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <CheckSquare className="w-5 h-5" />
                    <span className="flex-1 text-left">My Projects</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <List className="w-5 h-5" />
                    <span className="flex-1 text-left">My Tasks</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <Users className="w-5 h-5" />
                    <span className="flex-1 text-left">Messages</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <Bell className="w-5 h-5" />
                    <span className="flex-1 text-left">Notifications</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <Calendar className="w-5 h-5" />
                    <span className="flex-1 text-left">Calendar</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <BarChart3 className="w-5 h-5" />
                    <span className="flex-1 text-left">Analytics</span>
                  </Button>
                </nav>
                <div className="my-8 border-t border-mint/20"></div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 pl-2">GENERAL</p>
                <div className="space-y-2">
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <HelpCircle className="w-5 h-5" />
                    <span>Help</span>
                  </Button>
                  <Button className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#10b981] active:bg-[#10b981] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 border-0">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-20"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          
          <div className="flex-1 flex flex-col lg:ml-80"> {/* Add left margin to avoid sidebar overlap on desktop */}
            <div className="max-w-7xl mx-auto space-y-10 pt-8 px-6"> {/* Add horizontal padding */}
              <div className="flex justify-between items-center mb-6">
                <div>
                          <h1 className="text-4xl font-extrabold text-gradient-emerald mb-2 mobile-text-4xl">Dashboard</h1>
        <p className="text-base text-gray-600 dark:text-gray-300 mobile-text-base">Plan, prioritize, and accomplish your tasks with ease.</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Mobile menu button */}
                  <Button 
                    className="lg:hidden text-md bg-mint hover:bg-mint-dark dark:bg-mint-dark dark:hover:bg-mint text-olive font-bold gap-2 shadow-lg hover-lift rounded-xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    <Menu className="w-4 h-4" />
                    Menu
                  </Button>
                  {/* <DarkModeToggle /> */}
                  <Button className="text-md bg-mint hover:bg-mint-dark dark:bg-mint-dark dark:hover:bg-mint text-olive font-bold gap-2 shadow-lg hover-lift rounded-xl">
                    <Plus className="w-4 h-4" />
                    {getActionButtonText(userType)}
                  </Button>
                </div>
              </div>
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="glass-effect hover-lift rounded-xl transition-all duration-200">
                    <StatsCard
                      title={stat.title}
                      value={String(stat.value)}
                      change={''}
                      primary={stat.title === 'Projects Posted'}
                      status={false}
                      onClick={() => setSelectedStat(selectedStat === stat.title ? 'all' : stat.title)}
                      hoverData={generateHoverData(Number(stat.value))}
                    />
                  </div>
                ))}
              </div>
              {/* Earnings, Project Status, Recent Activity cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Earnings Card */}
                <Card className="h-80 glass-effect shadow-lg border-0 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-olive-dark">Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!earningsData || earningsData.length === 0 || earningsData.every(e => !e.value || e.value === 0)) ? (
                      <div className="flex flex-col items-center justify-center h-[180px] text-mint-dark animate-fade-in">
                        <BarChart3 className="w-10 h-10 mb-2 animate-pulse-slow" />
                        <span className="text-md font-semibold">No earnings yet</span>
                        <span className="text-xs text-gray-400 mt-1">Start selling to see your earnings grow!</span>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={earningsData.filter(e => e.value > 0)}>
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            className="text-gray-500 dark:text-gray-400 text-sm"
                          />
                          <Bar
                            dataKey="value"
                            fill="#10b981"
                            radius={[8, 8, 0, 0]}
                            className="hover:opacity-80"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
                {/* Project Status Card (Pie Chart) */}
                <Card className="h-80 bg-[#10b981] border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-[#059669] cursor-pointer rounded-xl flex flex-col items-center justify-center">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Project Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userStats.projectsPosted > 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-2xl font-bold text-white mb-2">{userStats.projectsPosted} Active Project{userStats.projectsPosted > 1 ? 's' : ''}</span>
                        <span className="text-md text-white/90">Keep up the great work!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[180px] text-white animate-fade-in">
                        <PieChart width={60} height={60}>
                          <Pie data={[{ value: 1 }]} dataKey="value" cx="50%" cy="50%" outerRadius={30} fill="#e5e7eb" />
                        </PieChart>
                        <span className="text-md font-semibold">No projects yet</span>
                        <span className="text-xs text-white/80 mt-1">Add a project to see your progress!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                {/* Recent Activity Card */}
                <Card className="h-80 glass-effect shadow-lg border-0 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-olive-dark">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="h-48 overflow-hidden"> {/* Fixed height container */}
                    <div className="bg-mint-light dark:bg-olive-dark p-4 rounded-lg h-full overflow-y-auto"> {/* Scrollable content */}
                      {displayRecentActivity.length === 0 ? (
                        <p className="text-gray-500">No recent activity.</p>
                      ) : (
                        <ul className="space-y-2">
                          {displayRecentActivity.map((activity, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-white/80 dark:bg-olive rounded-lg px-3 py-2 shadow-sm hover-lift transition-all duration-200">
                              <div className="flex items-center flex-1 min-w-0"> {/* Allow text to truncate */}
                                {getActivityIcon(activity.type)}
                                <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{activity.text}</span>
                              </div>
                              <span className="text-xs bg-mint dark:bg-olive-dark text-olive px-2 py-1 rounded-full ml-2 min-w-[60px] text-center flex-shrink-0">{activity.time}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Line Graph */}
              <Card className="glass-effect shadow-lg border-0 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-olive-dark">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={lineGraphData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        className="text-gray-500 dark:text-gray-400"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="projects"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="favourites"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="connections"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                  </LineChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;