import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Sparkles, ShoppingCart, User, LogOut, Bell, MessageSquare, Send, Briefcase, List, Landmark, UserPlus, Users, Trophy, Heart, Bookmark, TrendingUp, Star, Shield, LayoutGrid, AlertCircle, Edit, Settings, HelpCircle, BarChart2, Calendar, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// Navigation menu items
const marketItems = [
  { title: "Products", href: "/marketplace" },
  { title: "Sell Items", href: "/" },
  { title: "Cart", href: "/cart" },
  { title: "Wishlist", href: "/" },
];

const workItems = [
  { title: "Freelancing", href: "/freelancing" },
  { title: "Find Experts", href: "/findexpert" },
  { title: "Become a Mentor", href: "/" },
  { title: "Jobs", href: "/connect" },
];

const community = [
  { title: "Sustainable", href: "/sustainable" },
  { title: "Agents", href: "/aiagents" },
  { title: "Events", href: "/" },
  { title: "Mentorship", href: "/" },
];

const aboutus = [
  { title: "About us", href: "/aboutus" },
  { title: "Privacy Policy", href: "/privacypolicy" },
  { title: "Terms", href: "/termsofservice" },
  { title: "Send Feedback", href: "/sendfeedback" },
];

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
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const unreadNotificationCount = notifications.filter(n => n.unread).length;
  const unreadMessageCount = messages.filter(m => m.unread).length;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userProfile = await userService.getUserProfile();
        setProfileData({
          firstName: userProfile.auth.firstName || '',
          lastName: userProfile.auth.lastName || '',
        });
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      setShowProfileSidebar(false);
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
      <header className="sticky top-0 z-50 w-full border-b border-purple-200/50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container h-14 w-[1320px] flex items-center justify-between px-4">
          {/* Left: Logo + Search Bar */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Logo */}
            <div className="flex items-center space-x-1">
              <Link to="/" className="flex items-center space-x-2 group">
                <img src={Logo1} alt="AMOGH" className="h-8 w-auto" />
                <div className="py-6 hidden w-4 pr-8 h-4 text-xs px-1 sm:inline-flex text-purple-700">
                  Beta
                </div>
              </Link>
            </div>

            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search for people, jobs, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-50 h-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
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

              {/* Optional search suggestions dropdown */}
            </div>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {/* Market Dropdown */}
            <div className="group relative">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium px-2 py-1">
                <span className="text-base">Market</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="fixed left-1/2 top-[calc(100%+10px)] transform -translate-x-1/2 w-[100vw] bg-white border border-gray-200 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="grid grid-cols-4 gap-8 p-8">
                  {/* Column 1 - Actual Items */}
                  <div className="space-y-4">
                    {marketItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg p-3 -ml-3"
                      >
                        <div className="font-medium">{item.title}</div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 2 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Popular Categories</div>
                      <div className="text-xs text-gray-500 mt-1">Explore trending products</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">AI & ML</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">FinTech</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Robotics</div>
                    </div>
                  </div>

                  {/* Column 3 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Featured Sellers</div>
                      <div className="text-xs text-gray-500 mt-1">Top-rated vendors</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">EcoFriendly Goods</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Tech Innovators</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Mentors</div>
                    </div>
                  </div>

                  {/* Column 4 - Dummy Promo */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="font-medium text-lg mb-2">Join Now</div>
                    <p className="text-sm text-gray-600 mb-4">To be a part of our community</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Dropdown */}
            <div className="group relative">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium px-2 py-1">
                <span className="text-base">Work</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="fixed left-1/2 top-[calc(100%+10px)] transform -translate-x-1/2 w-[100vw] bg-white border border-gray-200 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="grid grid-cols-4 gap-8 p-8">
                  {/* Column 1 - Actual Items */}
                  <div className="space-y-4">
                    {workItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg p-3 -ml-3"
                      >
                        <div className="font-medium">{item.title}</div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 2 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Popular Skills</div>
                      <div className="text-xs text-gray-500 mt-1">Most in-demand services</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Web Development</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Graphic Design</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Content Writing</div>
                    </div>
                  </div>

                  {/* Column 3 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Top Categories</div>
                      <div className="text-xs text-gray-500 mt-1">Browse by industry</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Technology</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Marketing</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Business Consulting</div>
                    </div>
                  </div>

                  {/* Column 4 - Dummy Promo */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="font-medium text-lg mb-2">New to freelancing?</div>
                    <p className="text-sm text-gray-600 mb-4">Create your profile and start getting projects in minutes</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Dropdown */}
            <div className="group relative">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium px-2 py-1">
                <span className="text-base">Community</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="fixed left-1/2 top-[calc(100%+10px)] transform -translate-x-1/2 w-[100vw] bg-white border border-gray-200 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="grid grid-cols-4 gap-8 p-8">
                  {/* Column 1 - Actual Items */}
                  <div className="space-y-4">
                    {community.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg p-3 -ml-3"
                      >
                        <div className="font-medium">{item.title}</div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 2 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Popular Groups</div>
                      <div className="text-xs text-gray-500 mt-1">Join the conversation</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Green Innovators</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Tech Enthusiasts</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Startup Founders</div>
                    </div>
                  </div>

                  {/* Column 3 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Upcoming Events</div>
                      <div className="text-xs text-gray-500 mt-1">Meet like-minded people</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Sustainability Summit</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">AI Workshop</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Networking Mixer</div>
                    </div>
                  </div>

                  {/* Column 4 - Dummy Promo */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="font-medium text-lg mb-2">Community Spotlight</div>
                    <p className="text-sm text-gray-600 mb-4">Featured member stories and achievements</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      View Stories
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Us Dropdown */}
            <div className="group relative">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium px-2 py-1">
                <span className="text-base">About Us</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="fixed left-1/2 top-[calc(100%+10px)] transform -translate-x-1/2 w-[100vw] bg-white border border-gray-200 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="grid grid-cols-4 gap-8 p-8">
                  {/* Column 1 - Actual Items */}
                  <div className="space-y-4">
                    {aboutus.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg p-3 -ml-3"
                      >
                        <div className="font-medium">{item.title}</div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 2 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Our Mission</div>
                      <div className="text-xs text-gray-500 mt-1">Why we do what we do</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Sustainability</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Innovation</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Community</div>
                    </div>
                  </div>

                  {/* Column 3 - Dummy Items */}
                  <div className="space-y-4">
                    <div className="text-gray-700 p-3 -ml-3">
                      <div className="font-medium">Press Center</div>
                      <div className="text-xs text-gray-500 mt-1">Latest news and updates</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Newsroom</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Media Kit</div>
                    </div>
                    <div className="text-gray-400 p-3 -ml-3">
                      <div className="font-medium">Press Contacts</div>
                    </div>
                  </div>

                  {/* Column 4 - Dummy Promo */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="font-medium text-lg mb-2">Join Our Team</div>
                    <p className="text-sm text-gray-600 mb-4">We're hiring! Explore career opportunities</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      View Openings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Right-aligned Buttons */}
          <div className="hidden md:flex items-center space-x-3 ml-auto">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white text-base" asChild>
                  <Link to="/signup">Join</Link>
                </Button>
              </>
            ) : (
              <>
                {/* Messages Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base">
                      <MessageSquare className="w-4 h-4" />
                      {unreadMessageCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500 hover:bg-green-500">
                          {unreadMessageCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 border-0 shadow-lg bg-white/95 backdrop-blur-md">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold text-slate-800">Recent Messages</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {messages.slice(0, 3).map((message) => (
                        <DropdownMenuItem
                          key={message.id}
                          className="flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
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
                    <Button variant="ghost" className="relative text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base">
                      <Bell className="w-4 h-4" />
                      {unreadNotificationCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
                          {unreadNotificationCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 border-0 shadow-lg bg-white/95 backdrop-blur-md">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold text-slate-800">Recent Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 3).map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
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

                <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
                  <Link to="/cart">
                    <ShoppingCart className="w-4 h-4" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowProfileSidebar(true)} 
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base p-2 rounded-full"
                >
                  <User className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transform transition-all duration-300 hover:scale-110 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4 px-4">
              <Link to="/marketplace" className="text-slate-600 hover:text-blue-500 transition-colors font-medium">Market</Link>
              <Link to="/freelancing" className="text-slate-600 hover:text-purple-500 transition-colors font-medium">Work</Link>
              <Link to="/sustainable" className="text-slate-600 hover:text-emerald-500 transition-colors font-medium">Green</Link>
              <Link to="/connect" className="text-slate-600 hover:text-cyan-500 transition-colors font-medium">Connect</Link>
              <Link to="/aiagents" className="text-slate-600 hover:text-cyan-500 transition-colors font-medium flex items-center">
                <span className="text-2xl mr-2">🤖</span>
                AI Agents
              </Link>

              <div className="flex flex-col space-y-2 pt-4">
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                      <Link to="/signin">Sign In</Link>
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600" asChild>
                      <Link to="/signup">Join</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" onClick={() => setShowMessagesSidebar(true)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages {unreadMessageCount > 0 && (`${unreadMessageCount}`)}
                    </Button>
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" onClick={() => setShowNotificationsSidebar(true)}>
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications {unreadNotificationCount > 0 && (`${unreadNotificationCount}`)}
                    </Button>
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                      <Link to="/cart">
                        <ShoppingCart className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                      <Link to="/profile">
                        <User className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" onClick={handleLogout}>
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
                <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                  <button onClick={() => {setShowProfileSidebar(false); setShowEditProfileSidebar(true);}} className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors text-left">
                    <Edit className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="text-gray-700 font-medium">Edit Profile</span>
                  </button>
                </Link>
              </nav>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">GENERAL</h4>
              <nav className="space-y-1">
                <button onClick={() => {setShowProfileSidebar(false); setShowEditProfileSidebar(true);}} className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors text-left">
                  <Edit className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">Edit Profile</span>
                </button>
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
    </>
  );
};