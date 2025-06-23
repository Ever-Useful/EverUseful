import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, X, Sparkles, ShoppingCart, User, LogOut, Bell, MessageSquare, Send, Briefcase, List, Landmark, 
  UserPlus, Users, Trophy, Heart, Bookmark, TrendingUp, Star, Shield, LayoutGrid, AlertCircle, Edit, 
  Settings, HelpCircle, BarChart2, Calendar, ChevronDown, Search, Info, FileText 
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { EditProfile } from '../components/EditProfile';
import InitialsAvatar from './InitialsAvatar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import Logo1 from '../assets/images/Logo1.png'
import { PopupMenu } from "@/components/PopupMenu";
import { MyProjects } from '@/components/MyProjects';

// Mock notification data with more comprehensive entries
const mockNotifications = [
  {
    id: 1,
    title: "New order received",
    message: "You have a new order for your sustainable product from EcoMart",
    time: "2 minutes ago",
    unread: true,
    type: "order",
  },
  {
    id: 2,
    title: "Profile updated",
    message: "Your professional profile has been successfully updated with new skills",
    time: "1 hour ago",
    unread: true,
    type: "profile",
  },
  {
    id: 3,
    title: "Welcome to AMOGH!",
    message: "Thank you for joining our platform. Start exploring opportunities now!",
    time: "2 days ago",
    unread: false,
    type: "welcome",
  },
  {
    id: 4,
    title: "New connection request",
    message: "Sarah Johnson wants to connect with you",
    time: "3 hours ago",
    unread: true,
    type: "connection",
  },
  {
    id: 5,
    title: "Project milestone achieved",
    message: "Congratulations! Your green initiative project reached 100 participants",
    time: "1 day ago",
    unread: false,
    type: "achievement",
  },
  {
    id: 6,
    title: "Payment received",
    message: "$250 payment received for your freelance work",
    time: "2 days ago",
    unread: false,
    type: "payment",
  },
  {
    id: 7,
    title: "New job opportunity",
    message: "A perfect job match found based on your skills",
    time: "3 days ago",
    unread: false,
    type: "job",
  },
];

// Mock messages data with conversation threads
const mockMessages = [
  {
    id: 1,
    sender: "John Doe",
    avatar: "👨‍💼",
    message: "Hey, are you available for a quick chat about the sustainability project?",
    time: "5 minutes ago",
    unread: true,
    lastMessage: true,
    conversationId: "conv1",
  },
  {
    id: 2,
    sender: "Sarah Smith",
    avatar: "👩‍💻",
    message: "Thanks for the help with the project! The client loved it.",
    time: "30 minutes ago",
    unread: true,
    lastMessage: true,
    conversationId: "conv2",
  },
  {
    id: 3,
    sender: "Mike Johnson",
    avatar: "👨‍🎨",
    message: "Let's schedule a meeting for tomorrow to discuss the new features",
    time: "2 hours ago",
    unread: false,
    lastMessage: true,
    conversationId: "conv3",
  },
  {
    id: 4,
    sender: "Emma Wilson",
    avatar: "👩‍🔬",
    message: "The green tech proposal looks fantastic! When can we start?",
    time: "1 day ago",
    unread: true,
    lastMessage: true,
    conversationId: "conv4",
  },
  {
    id: 5,
    sender: "Alex Chen",
    avatar: "👨‍💼",
    message: "Your marketplace listing is getting great reviews!",
    time: "2 days ago",
    unread: false,
    lastMessage: true,
    conversationId: "conv5",
  },
];

// Mock chat messages for each conversation
const mockChatMessages: Record<string, Array<{
  id: number;
  sender: string;
  message: string;
  time: string;
  isOwn: boolean;
}>> = {
  conv1: [
    { id: 1, sender: "John Doe", message: "Hey, are you available for a quick chat about the sustainability project?", time: "5 minutes ago", isOwn: false },
    { id: 2, sender: "You", message: "Yes, I'm available. What would you like to discuss?", time: "3 minutes ago", isOwn: true },
    { id: 3, sender: "John Doe", message: "Great! I wanted to get your thoughts on the green initiative we discussed last week.", time: "2 minutes ago", isOwn: false },
  ],
  conv2: [
    { id: 1, sender: "Sarah Smith", message: "Thanks for the help with the project! The client loved it.", time: "30 minutes ago", isOwn: false },
    { id: 2, sender: "You", message: "That's wonderful to hear! I'm glad everything worked out well.", time: "25 minutes ago", isOwn: true },
    { id: 3, sender: "Sarah Smith", message: "Absolutely! Would you be interested in working on another project together?", time: "20 minutes ago", isOwn: false },
  ],
  conv3: [
    { id: 1, sender: "Mike Johnson", message: "Let's schedule a meeting for tomorrow to discuss the new features", time: "2 hours ago", isOwn: false },
    { id: 2, sender: "You", message: "Sounds good! What time works best for you?", time: "1 hour ago", isOwn: true },
  ],
  conv4: [
    { id: 1, sender: "Emma Wilson", message: "The green tech proposal looks fantastic! When can we start?", time: "1 day ago", isOwn: false },
  ],
  conv5: [
    { id: 1, sender: "Alex Chen", message: "Your marketplace listing is getting great reviews!", time: "2 days ago", isOwn: false },
    { id: 2, sender: "You", message: "Thank you! I've been working hard to maintain quality.", time: "2 days ago", isOwn: true },
  ],
};

type NavItem = {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  authAction?: 'popup' | 'hide';
};

// New Navigation Structure with Icons and Descriptions
const navLinks: { [key: string]: NavItem[] } = {
  market: [
    { 
      title: "Explore Marketplace", 
      href: "/marketplace",
      description: "Browse and purchase products and services.",
      icon: <ShoppingCart className="w-5 h-5 text-blue-500" /> 
    },
    { 
      title: "Post a Project", 
      href: "/projects/new",
      description: "Create a new listing and attract talent.",
      icon: <Briefcase className="w-5 h-5 text-orange-500" />,
      authAction: 'popup' 
    }
  ],
  work: [
    { 
      title: "Find Freelancers", 
      href: "/freelancing",
      description: "Discover and hire experts for your projects.",
      icon: <Users className="w-5 h-5 text-blue-500" />
    },
    { 
      title: "Find an Expert", 
      href: "/findexpert",
      description: "Get matched with top-tier professionals.",
      icon: <UserPlus className="w-5 h-5 text-green-500" />
    },
    {
        title: "My Dashboard",
        href: "/dashboard",
        description: "View your stats, projects, and activity.",
        icon: <LayoutGrid className="w-5 h-5 text-purple-500" />,
        authAction: 'hide'
    },
    {
        title: "My Profile",
        href: "/profile",
        description: "Manage your public presence and skills.",
        icon: <User className="w-5 h-5 text-red-500" />,
        authAction: 'hide'
    }
  ],
  community: [
    { 
      title: "Connect", 
      href: "/connect",
      description: "Join our community and collaborate with peers.",
      icon: <Users className="w-5 h-5 text-blue-500" />
    },
    { 
      title: "AI Agents", 
      href: "/aiagents",
      description: "Leverage AI-powered tools for your business.",
      icon: <Sparkles className="w-5 h-5 text-green-500" />
    }
  ],
  about: [
    { 
      title: "About Us", 
      href: "/aboutus",
      description: "Learn more about our mission and values.",
      icon: <Info className="w-5 h-5 text-blue-500" />
    },
    { 
      title: "Privacy Policy", 
      href: "/privacypolicy",
      description: "Read our commitment to your privacy.",
      icon: <Shield className="w-5 h-5 text-green-500" />
    },
    { 
      title: "Terms of Service", 
      href: "/termsofservice",
      description: "Understand the rules of our platform.",
      icon: <FileText className="w-5 h-5 text-purple-500" />
    },
    {
      title: "Send Feedback",
      href: "/sendfeedback",
      description: "Help us improve your experience.",
      icon: <MessageSquare className="w-5 h-5 text-red-500" />
    }
  ]
};

const subLinkVariants = {
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeInOut" } },
  enter: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

const NavLink = ({ title, children, textColor }: { title: string, children: React.ReactNode, textColor: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  const numChildren = React.Children.count(children);
  const gridCols = numChildren > 4 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className={`flex items-center space-x-1 ${textColor} hover:opacity-80 font-medium px-2 py-1 text-sm xl:text-base transition-opacity`}>
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 grid ${gridCols} gap-4 w-max`}
            initial="exit"
            animate="enter"
            exit="exit"
            variants={{
              enter: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
              exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavSubLink = ({ title, href, description, icon, authAction, isLoggedIn, onAuthClick, onShowMyProjects }: { title: string, href: string, description: string, icon: React.ReactNode, authAction?: 'popup' | 'hide', isLoggedIn: boolean, onAuthClick: () => void, onShowMyProjects?: () => void }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (authAction === 'popup' && !isLoggedIn) {
      e.preventDefault();
      onAuthClick();
    } else if (title === "Post a Project" && isLoggedIn && onShowMyProjects) {
      e.preventDefault();
      onShowMyProjects();
    }
  };
  
  return (
    <Link to={href} onClick={handleClick} className="block p-4 rounded-xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 group/sublink w-64">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 group-hover/sublink:text-blue-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '' });
  const [notifications, setNotifications] = useState(mockNotifications);
  const [messages, setMessages] = useState(mockMessages);
  const [showNotificationsSidebar, setShowNotificationsSidebar] = useState(false);
  const [showMessagesSidebar, setShowMessagesSidebar] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [showEditProfileSidebar, setShowEditProfileSidebar] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotificationCount = notifications.filter(n => n.unread).length;
  const unreadMessageCount = messages.filter(m => m.unread).length;

  // Dynamic header styling based on current route
  const getHeaderStyle = () => {
    const path = location.pathname;
    
    if (path === '/marketplace' || path.startsWith('/product/')) {
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        border: 'border-blue-400/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/20',
        buttonHover: 'hover:bg-white/20 hover:text-white'
      };
    } else if (path === '/freelancing') {
      return {
        bg: 'bg-gradient-to-r from-red-500 to-orange-600',
        border: 'border-red-400/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/20',
        buttonHover: 'hover:bg-white/20 hover:text-white'
      };
    } else if (path === '/connect') {
      return {
        bg: 'bg-gradient-to-r from-green-700 to-green-800',
        border: 'border-green-600/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/20',
        buttonHover: 'hover:bg-white/20 hover:text-white'
      };
    } else if (path === '/aiagents') {
      return {
        bg: 'bg-gradient-to-r from-gray-900 to-indigo-950',
        border: 'border-indigo-600/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/10',
        buttonHover: 'hover:bg-white/10 hover:text-white'
      };
    } else if (path === '/dashboard' || path === '/profile') {
      return {
        bg: 'bg-gradient-to-r from-slate-700 to-gray-800',
        border: 'border-slate-600/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/20',
        buttonHover: 'hover:bg-white/20 hover:text-white'
      };
    } else if (path === '/cart' || path === '/checkout') {
      return {
        bg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
        border: 'border-blue-500/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/20',
        buttonHover: 'hover:bg-white/20 hover:text-white'
      };
    } else if (path === '/aboutus') {
      return {
        bg: 'bg-gradient-to-r from-teal-500 to-cyan-600',
        border: 'border-teal-400/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/20',
        buttonHover: 'hover:bg-white/20 hover:text-white'
      };
    } else if (path === '/signin' || path === '/signup') {
      return {
        bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
        border: 'border-indigo-400/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/20',
        buttonHover: 'hover:bg-white/20 hover:text-white'
      };
    } else if (path === '/findexpert') {
      return {
        bg: 'bg-gradient-to-r from-slate-900 to-indigo-900',
        border: 'border-indigo-600/30',
        textColor: 'text-white',
        hoverBg: 'hover:bg-white/10',
        buttonHover: 'hover:bg-white/10 hover:text-white'
      };
    } else {
      // Default for home page and other pages
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-white',
        border: 'border-gray-200',
        textColor: 'text-gray-700',
        hoverBg: 'hover:bg-gray-100',
        buttonHover: 'hover:bg-gray-100 hover:text-gray-800'
      };
    }
  };

  const headerStyle = getHeaderStyle();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        const userProfile = await userService.getUserProfile();
        setProfileData({
          firstName: userProfile.auth.firstName || '',
          lastName: userProfile.auth.lastName || '',
        });
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        setProfileData({ firstName: '', lastName: '' });
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const loginStatus = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loginStatus);
      if (!loginStatus) {
        setProfileData({ firstName: '', lastName: '' });
        setShowNotificationsSidebar(false);
        setShowMessagesSidebar(false);
        setShowProfileSidebar(false);
        setShowEditProfileSidebar(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all user-related state
      setIsLoggedIn(false);
      setProfileData({ firstName: '', lastName: '' });
      setShowNotificationsSidebar(false);
      setShowMessagesSidebar(false);
      setShowProfileSidebar(false);
      setShowEditProfileSidebar(false);
      
      // Clear localStorage
      localStorage.removeItem("isLoggedIn");
      
      // Sign out from Firebase
      await auth.signOut();
      
      // Navigate to signup page
      navigate("/signup");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleNotificationClick = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
    );
  };

  const handleMessageClick = (messageId: number) => {
    setMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, unread: false } : m)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '📦';
      case 'profile': return '👤';
      case 'welcome': return '🎉';
      case 'connection': return '🤝';
      case 'achievement': return '🏆';
      case 'payment': return '💰';
      case 'job': return '💼';
      default: return '📢';
    }
  };

  const handleMessageSelect = (conversationId: string) => {
    setActiveChatId(activeChatId === conversationId ? null : conversationId);
    // Mark message as read when opening chat
    setMessages(prev =>
      prev.map(m => m.conversationId === conversationId ? { ...m, unread: false } : m)
    );
  };

  const handleSendMessage = (conversationId: string) => {
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your backend
    console.log(`Sending message to ${conversationId}: ${newMessage}`);
    setNewMessage("");
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b ${headerStyle.bg} ${headerStyle.border} shadow-lg`}>
        <div className="relative h-14 flex items-center justify-between">
          {/* Left Group */}
          <div className="flex items-center flex-1 lg:flex-none space-x-2 md:space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 group">
                <img src={Logo1} alt="AMOGH" className="h-7 w-auto md:h-8" />
                <div className="py-6 hidden w-4 pr-8 h-4 text-xs px-1 sm:inline-flex text-purple-700">
                  Beta
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs min-w-0 hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 h-9 md:h-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Centered Navigation (Absolutely positioned) */}
          <nav className="hidden lg:flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 items-center space-x-4 xl:space-x-6">
            <Link to="/" className={`${headerStyle.textColor} hover:opacity-80 font-medium px-2 py-1 text-sm xl:text-base transition-opacity`}>
              Home
            </Link>
            <NavLink title="Market" textColor={headerStyle.textColor}>
              {navLinks.market.map(item => (
                <motion.div variants={subLinkVariants} key={item.href}>
                  <NavSubLink {...item} isLoggedIn={isLoggedIn} onAuthClick={() => setShowAuthPopup(true)} onShowMyProjects={() => setShowMyProjects(true)} />
                </motion.div>
              ))}
            </NavLink>
            <NavLink title="Work" textColor={headerStyle.textColor}>
              {navLinks.work
                .filter(item => item.authAction !== 'hide' || isLoggedIn)
                .map(item => (
                  <motion.div variants={subLinkVariants} key={item.href}>
                    <NavSubLink {...item} isLoggedIn={isLoggedIn} onAuthClick={() => setShowAuthPopup(true)} onShowMyProjects={() => setShowMyProjects(true)} />
                  </motion.div>
              ))}
            </NavLink>
            <NavLink title="Community" textColor={headerStyle.textColor}>
              {navLinks.community.map(item => (
                <motion.div variants={subLinkVariants} key={item.href}>
                  <NavSubLink {...item} isLoggedIn={isLoggedIn} onAuthClick={() => setShowAuthPopup(true)} onShowMyProjects={() => setShowMyProjects(true)} />
                </motion.div>
              ))}
            </NavLink>
            <NavLink title="About Us" textColor={headerStyle.textColor}>
              {navLinks.about
                .filter(item => item.authAction !== 'hide' || isLoggedIn)
                .map(item => (
                <motion.div variants={subLinkVariants} key={item.href}>
                  <NavSubLink {...item} isLoggedIn={isLoggedIn} onAuthClick={() => setShowAuthPopup(true)} onShowMyProjects={() => setShowMyProjects(true)} />
                </motion.div>
              ))}
            </NavLink>
          </nav>

          {/* Right Group */}
          <div className="flex items-center flex-1 lg:flex-none justify-end space-x-1 lg:space-x-2 pr-4 sm:pr-6 lg:pr-8">
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {!isLoggedIn ? (
                <>
                  <Button variant="ghost" className={`${headerStyle.textColor} ${headerStyle.buttonHover} hover:scale-105 transition-all duration-300 text-sm`} asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white text-sm" asChild>
                    <Link to="/signup">Join</Link>
                  </Button>
                </>
              ) : (
                <>
                  {/* Messages Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={`relative ${headerStyle.textColor} ${headerStyle.buttonHover} hover:scale-105 transition-all duration-300`}>
                        <MessageSquare className="w-4 h-4" />
                        {unreadMessageCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500 hover:bg-green-500">
                            {unreadMessageCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 border-0 shadow-xl bg-white/95 backdrop-blur-md border border-gray-200">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-slate-800">Recent Messages</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {messages.slice(0, 3).map((message) => (
                          <DropdownMenuItem
                            key={message.id}
                            className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleMessageClick(message.id)}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-2xl">{message.avatar}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm text-slate-800">
                                      {message.sender}
                                    </p>
                                    {message.unread && (
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                    {message.message}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {message.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                        {messages.length === 0 && (
                          <div className="p-4 text-center text-slate-500">
                            No messages yet
                          </div>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowMessagesSidebar(true)} className="flex items-center justify-center p-3 cursor-pointer text-green-600 font-medium hover:bg-green-50">
                        See All Messages
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Notifications Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={`relative ${headerStyle.textColor} ${headerStyle.buttonHover} hover:scale-105 transition-all duration-300`}>
                        <Bell className="w-4 h-4" />
                        {unreadNotificationCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
                            {unreadNotificationCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 border-0 shadow-xl bg-white/95 backdrop-blur-md border border-gray-200">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-slate-800">Recent Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.slice(0, 3).map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleNotificationClick(notification.id)}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm text-slate-800">
                                      {notification.title}
                                    </p>
                                    {notification.unread && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                        {notifications.length === 0 && (
                          <div className="p-4 text-center text-slate-500">
                            No notifications yet
                          </div>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setShowNotificationsSidebar(true)} className="flex items-center justify-center p-3 cursor-pointer text-blue-600 font-medium hover:bg-blue-50">
                        See All Notifications
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" className={`${headerStyle.textColor} ${headerStyle.buttonHover} hover:scale-105 transition-all duration-300`} asChild>
                    <Link to="/cart">
                      <ShoppingCart className="w-4 h-4" />
                    </Link>
                  </Button>
                  
                  {/* Profile Button with User Name */}
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowProfileSidebar(true)} 
                    className={`${headerStyle.textColor} ${headerStyle.buttonHover} hover:scale-105 transition-all duration-300 text-sm px-2 lg:px-3 py-2 rounded-lg flex items-center space-x-2`}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    {profileData.firstName && (
                      <span className="hidden sm:inline text-sm font-medium">
                        Hi, {profileData.firstName}
                      </span>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden transform transition-all duration-300 hover:scale-110 ${headerStyle.textColor}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${headerStyle.border} animate-fade-in ${headerStyle.bg}`}>
            <nav className="flex flex-col space-y-4 px-4">
              <Link to="/marketplace" className={`${headerStyle.textColor} hover:opacity-80 transition-opacity font-medium`}>Market</Link>
              <Link to="/freelancing" className={`${headerStyle.textColor} hover:opacity-80 transition-opacity font-medium`}>Work</Link>
              <Link to="/sustainable" className={`${headerStyle.textColor} hover:opacity-80 transition-opacity font-medium`}>Green</Link>
              <Link to="/connect" className={`${headerStyle.textColor} hover:opacity-80 transition-opacity font-medium`}>Connect</Link>
              <Link to="/aiagents" className={`${headerStyle.textColor} hover:opacity-80 transition-opacity font-medium flex items-center`}>
                <span className="text-2xl mr-2">🤖</span>
                AI Agents
              </Link>

              <div className="flex flex-col space-y-2 pt-4">
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" className={`${headerStyle.textColor} ${headerStyle.buttonHover} justify-start`} asChild>
                      <Link to="/signin">Sign In</Link>
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600" asChild>
                      <Link to="/signup">Join</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    {profileData.firstName && (
                      <div className={`px-3 py-2 text-sm ${headerStyle.textColor} border-b ${headerStyle.border} mb-2`}>
                        Hi, {profileData.firstName}!
                      </div>
                    )}
                    <Button variant="ghost" className={`${headerStyle.textColor} ${headerStyle.buttonHover} justify-start`} onClick={() => { setIsMenuOpen(false); setShowMessagesSidebar(true); }}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages {unreadMessageCount > 0 && (`(${unreadMessageCount})`)}
                    </Button>
                    <Button variant="ghost" className={`${headerStyle.textColor} ${headerStyle.buttonHover} justify-start`} onClick={() => { setIsMenuOpen(false); setShowNotificationsSidebar(true); }}>
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications {unreadNotificationCount > 0 && (`(${unreadNotificationCount})`)}
                    </Button>
                    <Button variant="ghost" className={`${headerStyle.textColor} ${headerStyle.buttonHover} justify-start`} asChild>
                      <Link to="/cart">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Cart
                      </Link>
                    </Button>
                    <Button variant="ghost" className={`${headerStyle.textColor} ${headerStyle.buttonHover} justify-start`} asChild>
                      <Link to="/profile">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" className={`${headerStyle.textColor} ${headerStyle.buttonHover} justify-start`} onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Header Spacer - prevents content from being hidden behind fixed header */}
      <div className="h-14"></div>

      <PopupMenu isOpen={showAuthPopup} onClose={() => setShowAuthPopup(false)} redirectPath={location.pathname} />

      {/* Overlay for sidebars */}
      {(showNotificationsSidebar || showMessagesSidebar || showProfileSidebar || showEditProfileSidebar) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => {
            setShowNotificationsSidebar(false);
            setShowMessagesSidebar(false);
            setShowProfileSidebar(false);
            setShowEditProfileSidebar(false);
          }}
        />
      )}

      {/* Notifications Sidebar */}
      {showNotificationsSidebar && (
        <div className="fixed top-0 right-0 w-96 max-w-[90vw] h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h2 className="font-bold text-xl text-slate-800">All Notifications</h2>
              <p className="text-sm text-slate-600">{unreadNotificationCount} unread</p>
            </div>
            <button 
              onClick={() => setShowNotificationsSidebar(false)} 
              className="text-slate-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                      notification.unread ? "bg-blue-50/50 border-l-4 border-l-blue-400" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800 text-sm truncate">
                            {notification.title}
                          </h3>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-slate-50">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
              }}
            >
              Mark All as Read
            </Button>
          </div>
        </div>
      )}

      {/* Messages Sidebar */}
      {showMessagesSidebar && (
        <div className="fixed top-0 right-0 w-96 max-w-[90vw] h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <div>
              <h2 className="font-bold text-xl text-slate-800">All Messages</h2>
              <p className="text-sm text-slate-600">{unreadMessageCount} unread conversations</p>
            </div>
            <button 
              onClick={() => setShowMessagesSidebar(false)} 
              className="text-slate-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {messages.map((message) => (
                  <div key={message.id} className="relative">
                    <div 
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        message.unread ? "bg-green-50/50 border-l-4 border-l-green-400" : ""
                      } ${activeChatId === message.conversationId ? "bg-green-100" : ""}`}
                      onClick={() => handleMessageSelect(message.conversationId)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{message.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-800 text-sm truncate">
                                {message.sender}
                              </h3>
                              {message.unread && (
                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 flex-shrink-0">{message.time}</p>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dropdown Chat Box */}
                    {activeChatId === message.conversationId && (
                      <div className="border-t bg-white shadow-inner">
                        <div className="max-h-64 overflow-y-auto p-3 space-y-2">
                          {mockChatMessages[message.conversationId]?.map((chatMsg) => (
                            <div
                              key={chatMsg.id}
                              className={`flex ${chatMsg.isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                                  chatMsg.isOwn
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                <p>{chatMsg.message}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    chatMsg.isOwn ? 'text-green-100' : 'text-slate-500'
                                  }`}
                                >
                                  {chatMsg.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Message Input */}
                        <div className="p-3 border-t bg-slate-50">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleSendMessage(message.conversationId);
                                }
                              }}
                              className="flex-1 text-sm"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSendMessage(message.conversationId)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-slate-50">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setMessages(prev => prev.map(m => ({ ...m, unread: false })));
              }}
            >
              Mark All as Read
            </Button>
          </div>
        </div>
      )}

      {/* Profile Sidebar */}
      {showProfileSidebar && (
        <div className="fixed top-0 right-0 w-96 max-w-[90vw] h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-bold text-xl text-gray-900">Profile</h2>
            <button 
              onClick={() => setShowProfileSidebar(false)} 
              className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <InitialsAvatar firstName={profileData.firstName} lastName={profileData.lastName} size={96} />
              <h3 className="font-bold text-lg text-gray-900 mt-3">{profileData.firstName} {profileData.lastName}</h3>
              <Link to="/profile" className="text-sm text-blue-600 hover:underline mt-1">
                View Profile &gt;
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-gray-50">
                <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-1" />
                <p className="font-bold text-sm text-gray-900">111452</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <Star className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
                <p className="font-bold text-sm text-gray-900">7083</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <Shield className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <p className="font-bold text-sm text-gray-900">528</p>
              </div>
            </div>
            <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">USER</h4>
              <nav className="space-y-1">
                <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <LayoutGrid className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Dashboard</span>
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
                <Link to="/signin" onClick={handleLogout} className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <LogOut className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Logout</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Sidebar */}
      {showEditProfileSidebar && (
        <EditProfile onClose={() => setShowEditProfileSidebar(false)} />
      )}

      {/* My Projects Sidebar */}
      {showMyProjects && (
        <MyProjects onClose={() => setShowMyProjects(false)} />
      )}
    </>
  );
};