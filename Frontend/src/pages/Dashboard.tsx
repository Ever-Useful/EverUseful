import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, User, Settings, HelpCircle, LogOut, BookOpen, GraduationCap, Building, Sparkles, Moon, Sun, Search, Plus, Clock, Minus, Briefcase, List, Users, Bell } from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/dashboard/ThemeProvider";
import StatsCard from "@/components/dashboard/StatsCards";
import DetailedStatsSection from "@/components/dashboard/DetailedStatsSection";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell, Legend, LineChart, Line, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { userService } from '@/services/userService';
import InitialsAvatar from '@/components/InitialsAvatar';
import { TrendingUp, Star, Shield, LayoutGrid, UserPlus, Heart, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import marketplaceData from '../../../Backend/data/marketplace.json';

type UserType = 'academic' | 'freelancer' | 'business';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('academic');
  const [selectedStat, setSelectedStat] = useState<string>('all');
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasEarnings, setHasEarnings] = useState(false);

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

  // Fetch real user stats and data
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
        
        const totalEarnings = dashboardData.totalEarnings || 0;
        let realEarningsData;
        if (totalEarnings > 0) {
          realEarningsData = [
            { name: 'Jan', value: Math.round(totalEarnings * 0.2) },
            { name: 'Feb', value: Math.round(totalEarnings * 0.3) },
            { name: 'Mar', value: Math.round(totalEarnings * 0.15) },
            { name: 'Apr', value: Math.round(totalEarnings * 0.25) },
            { name: 'May', value: Math.round(totalEarnings * 0.1) },
            { name: 'Jun', value: Math.round(totalEarnings * 0.1) },
          ];
        } else {
          realEarningsData = [
            { name: 'Jan', value: 0 },
            { name: 'Feb', value: 0 },
            { name: 'Mar', value: 0 },
            { name: 'Apr', value: 0 },
            { name: 'May', value: 0 },
            { name: 'Jun', value: 0 },
          ];
        }
        setHasEarnings(realEarningsData.some(e => e.value > 0));
        setEarningsData(realEarningsData);

        const projectsData = await userService.getUserProjects();
        setUserProjects(projectsData.created || []);

        const statusCounts = userProjects.reduce((acc, project) => {
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
        const userProfile = await userService.getUserProfile();
        const customUserId = userProfile.customUserId;
        // Get all projects from marketplace.json
        const allProjects = marketplaceData.projects || [];
        // Filter projects by current user
        const userProjects = allProjects.filter(
          (p) => p.author === customUserId || p.customUserId === customUserId
        );
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
        // Aggregate projects posted per month
        const projectsByMonth = {};
        months.forEach((m) => (projectsByMonth[m.key] = []));
        userProjects.forEach((project) => {
          const posted = new Date(project.posted);
          const key = `${posted.getFullYear()}-${posted.getMonth() + 1}`;
          if (projectsByMonth[key]) {
            projectsByMonth[key].push(project);
          }
        });
        // Count projects per month
        let projectsCount = months.map((m) => projectsByMonth[m.key].length);
        // If all zero, show a faint line for demo
        if (projectsCount.every((v) => v === 0)) {
          projectsCount = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
        }
        // Views: progressive curve from 0 to totalViews
        const totalViews = userProjects.reduce((sum, p) => sum + (p.views || 0), 0);
        let viewsCurve = Array(6).fill(0);
        if (totalViews > 0) {
          let sum = 0;
          for (let i = 0; i < 5; i++) {
            // Randomly increment, but always increasing
            const remaining = totalViews - sum;
            const increment = i === 4 ? remaining : Math.floor(Math.random() * (remaining / (6 - i)));
            sum += increment;
            viewsCurve[i] = sum;
          }
          viewsCurve[5] = totalViews;
        }
        // Favourites and connections: random distribution as before
        const totalFavourites = userStats.projectFavourites || 0;
        const totalConnections = userStats.connections || 0;
        function randomDistribute(total, n) {
          if (total === 0) return Array(n).fill(0);
          let arr = Array(n).fill(0);
          let sum = 0;
          for (let i = 0; i < n - 1; i++) {
            arr[i] = Math.floor(Math.random() * (total - sum));
            sum += arr[i];
          }
          arr[n - 1] = total - sum;
          // Shuffle for randomness
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          return arr;
        }
        const favouritesByMonth = randomDistribute(totalFavourites, 6);
        const connectionsByMonth = randomDistribute(totalConnections, 6);
        // Build final data array
        const newLineGraphData = months.map((m, i) => ({
          month: m.label,
          projects: projectsCount[i],
          favourites: favouritesByMonth[i],
          connections: connectionsByMonth[i],
          views: viewsCurve[i],
        }));
        setLineGraphData(newLineGraphData);
      } catch (e) {
        // fallback: keep zeros
      }
    };
    aggregateLineGraphData();
    // eslint-disable-next-line
  }, [userStats]);

  const onUserTypeChange = (type: UserType) => {
    setUserType(type);
    setSelectedStat('all');
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
    // Only show stats for the current authenticated user
    return [
      { title: 'Projects Posted', value: userStats.projectsPosted },
      { title: 'Favourites', value: userStats.projectFavourites },
      { title: 'Connections', value: userStats.connections },
      { title: 'Views', value: userStats.projectViews },
    ];
  };

  const stats = getStatsData();

  // Generate project analytics data from real projects
  const getProjectAnalyticsData = () => {
    if (recentActivity.length === 0) {
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
    recentActivity.forEach(activity => {
      if (activity.createdAt) {
        const day = new Date(activity.createdAt).getDay();
        const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
        const dayName = dayNames[day];
        if (dayViews[dayName] !== undefined) {
          dayViews[dayName] += activity.views || 0;
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
    if (userStats.projectsPosted === 0) {
      return [
        { name: 'Completed', value: 0, color: '#16a34a' },
        { name: 'In Progress', value: 0, color: '#3b82f6' },
        { name: 'Pending', value: 0, color: '#f59e0b' },
      ];
    }

    const completed = recentActivity.filter(a => a.status === 'completed' || a.status === 'Completed').length;
    const inProgress = recentActivity.filter(a => a.status === 'in-progress' || a.status === 'In Progress').length;
    const pending = recentActivity.filter(a => a.status === 'pending' || a.status === 'Pending').length;

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        {/* Header always on top */}
        <Header />
        <div className="flex flex-1">
          {/* Fixed sidebar */}
          <div className="w-72 h-[90vh] bg-white/70 dark:bg-gray-900/80 glass-effect shadow-2xl rounded-2xl m-6 flex flex-col border border-mint/30 backdrop-blur-lg fixed top-6 left-6 z-30" style={{ position: 'fixed', top: 24, left: 24, height: '90vh' }}>
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
          <div className="flex-1 flex flex-col">
            <div className="max-w-7xl mx-auto space-y-10 pt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-4xl font-extrabold text-gradient-emerald mb-2">Dashboard</h1>
                  <p className="text-base text-gray-600 dark:text-gray-300">Plan, prioritize, and accomplish your tasks with ease.</p>
                </div>
                <div className="flex items-center gap-3">
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
                  <CardContent className="space-y-6">
                    <div className="bg-mint-light dark:bg-olive-dark p-4 rounded-lg">
                      {displayRecentActivity.length === 0 ? (
                        <p className="text-gray-500">No recent activity.</p>
                      ) : (
                        <ul className="space-y-3">
                          {displayRecentActivity.map((activity, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-white/80 dark:bg-olive rounded-lg px-3 py-2 shadow-sm hover-lift transition-all duration-200">
                              <div className="flex items-center">
                                {getActivityIcon(activity.type)}
                                <span className="font-medium text-gray-800 dark:text-gray-100">{activity.text}</span>
                              </div>
                              <span className="text-xs bg-mint dark:bg-olive-dark text-olive px-2 py-1 rounded-full ml-2 min-w-[60px] text-center">{activity.time}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Line graph for stats (moved below cards) */}
              <div className="glass-effect bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-8 mt-8 border border-mint/20 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Stats Trend (Last 6 Months)</h2>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={lineGraphData} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(16,185,129,0.08)' }} labelStyle={{ color: '#10b981', fontWeight: 600 }} cursor={{ stroke: '#10b981', strokeWidth: 0.5, opacity: 0.1 }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    {(selectedStat === 'all' || selectedStat === 'Projects Posted') && (
                      <>
                        <Area type="monotone" dataKey="projects" stroke="#10b981" fill="url(#colorProjects)" fillOpacity={0.2} dot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} isAnimationActive={true} />
                        <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} name="Projects Posted" isAnimationActive={true} />
                      </>
                    )}
                    {(selectedStat === 'all' || selectedStat === 'Favourites') && (
                      <Line type="monotone" dataKey="favourites" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} name="Favourites" isAnimationActive={true} />
                    )}
                    {(selectedStat === 'all' || selectedStat === 'Connections') && (
                      <Line type="monotone" dataKey="connections" stroke="#f59e42" strokeWidth={2} dot={{ r: 4, fill: '#f59e42', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} name="Connections" isAnimationActive={true} />
                    )}
                    {(selectedStat === 'all' || selectedStat === 'Views') && (
                      <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} name="Views" isAnimationActive={true} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;