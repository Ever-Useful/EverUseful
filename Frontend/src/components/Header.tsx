import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Bell, MessageSquare, Settings, LogOut, ChevronDown, X } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo1 from "@/assets/images/Logo1.png";
import { Badge as NotificationBadge } from "@/components/ui/badge";

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
];

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
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for demo
  const [notifications, setNotifications] = useState(mockNotifications);
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [showMessagesSidebar, setShowMessagesSidebar] = useState(false);
  const [showNotificationsSidebar, setShowNotificationsSidebar] = useState(false);

  const unreadNotificationCount = notifications.filter(n => n.unread).length;
  const unreadMessageCount = messages.filter(m => m.unread).length;
  const totalUnreadCount = unreadNotificationCount + unreadMessageCount;

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true" || true); // Demo mode
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      navigate("/signin");
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">

          {/* Left: Logo + Search Bar */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 group">
                <img src={Logo1} alt="AMOGH" className="h-8 w-auto" />
                <div className="hidden w-10 h-6 text-sm px-1 sm:inline-flex text-purple-700">
                  Beta
                </div>
              </Link>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-40 h-8 border-gray-300 rounded-medium focus:outline-none focus:border-transparent"
              />
            </div>
          </div>

          {/* Center: Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {/* Market Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium">
                  <span className="text-base">Market</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border shadow-lg">
                {marketItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link to={item.href} className="flex items-center px-3 py-2 text-sm hover:bg-gray-50">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Work Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium">
                  <span className="text-base">Work</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border shadow-lg">
                {workItems.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link to={item.href} className="flex items-center px-3 py-2 text-sm hover:bg-gray-50">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Green Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium">
                  <span className="text-base">Community</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border shadow-lg">
                {community.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link to={item.href} className="flex items-center px-3 py-2 text-sm hover:bg-gray-50">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Connect Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-slate-600 font-medium">
                  <span className="text-base">About Us</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border shadow-lg">
                {aboutus.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <Link to={item.href} className="flex items-center px-3 py-2 text-sm hover:bg-gray-50">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right: Messages, Notifications, and Profile Icon */}
          <div className="flex items-center space-x-4 px-4">

            {/* Messages Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base">
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessageCount > 0 && (
                    <Badge className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-green-500 hover:bg-green-500">
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
                    <Badge className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
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

            {/* Right: Profile Icon with Sidebar */}
            <div className="flex items-center">
              {!isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600" asChild>
                    <Link to="/signup">Join</Link>
                  </Button>
                </div>
              ) : (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="relative p-2">
                      <User className="w-6 h-6 text-gray-700" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[50vw] max-w-lg p-0">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <SheetHeader className="p-6 border-b bg-gradient-to-r from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-xl font-bold text-gray-800">Profile Menu</SheetTitle>
                      </SheetHeader>

                      {/* Content */}
                      <div className="flex-1 overflow-y-auto">
                        {/* Profile Section */}
                        <div className="p-4 border-b">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">John Doe</h3>
                              <p className="text-sm text-gray-600">john.doe@example.com</p>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full" asChild>
                            <Link to="/profile">View Profile</Link>
                          </Button>
                        </div>

                        {/* Messages Section */}
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Messages
                            </h3>
                            {unreadMessageCount > 0 && (
                              <Badge className="bg-green-500">{unreadMessageCount}</Badge>
                            )}
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {messages.slice(0, 3).map((message) => (
                              <div
                                key={message.id}
                                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${message.unread ? "bg-green-50 border-l-4 border-l-green-400" : ""
                                  }`}
                                onClick={() => handleMessageClick(message.id)}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-lg">{message.avatar}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm text-gray-800 truncate">
                                        {message.sender}
                                      </p>
                                      {message.unread && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {message.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button variant="ghost" className="w-full mt-2 text-green-600">
                            View All Messages
                          </Button>
                        </div>

                        {/* Notifications Section */}
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-800 flex items-center">
                              <Bell className="w-4 h-4 mr-2" />
                              Notifications
                            </h3>
                            {unreadNotificationCount > 0 && (
                              <Badge className="bg-red-500">{unreadNotificationCount}</Badge>
                            )}
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {notifications.slice(0, 3).map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${notification.unread ? "bg-blue-50 border-l-4 border-l-blue-400" : ""
                                  }`}
                                onClick={() => handleNotificationClick(notification.id)}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm text-gray-800 truncate">
                                        {notification.title}
                                      </p>
                                      {notification.unread && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button variant="ghost" className="w-full mt-2 text-blue-600">
                            View All Notifications
                          </Button>
                        </div>

                        {/* Settings Section */}
                        <div className="p-4 border-b">
                          <h3 className="font-semibold text-gray-800 flex items-center mb-3">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </h3>
                          <div className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start" asChild>
                              <Link to="/settings/account">Account Settings</Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" asChild>
                              <Link to="/settings/privacy">Privacy Settings</Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" asChild>
                              <Link to="/settings/notifications">Notification Preferences</Link>
                            </Button>
                          </div>
                        </div>

                        {/* Logout Section */}
                        <div className="p-4">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>


        </div>
      </div>
    </header>
  );
};