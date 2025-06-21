import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Sparkles, ShoppingCart, User, LogOut, Bell, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock notification data - replace with real data from your backend
const mockNotifications = [
  {
    id: 1,
    title: "New order received",
    message: "You have a new order for your product",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Profile updated",
    message: "Your profile has been successfully updated",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Welcome to AMOGH!",
    message: "Thank you for joining our platform",
    time: "2 days ago",
    unread: false,
  },
];

// Mock messages data - replace with real data from your backend
const mockMessages = [
  {
    id: 1,
    sender: "John Doe",
    message: "Hey, are you available for a quick chat?",
    time: "5 minutes ago",
    unread: true,
  },
  {
    id: 2,
    sender: "Sarah Smith",
    message: "Thanks for the help with the project!",
    time: "30 minutes ago",
    unread: true,
  },
  {
    id: 3,
    sender: "Mike Johnson",
    message: "Let's schedule a meeting for tomorrow",
    time: "2 hours ago",
    unread: false,
  },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [messages, setMessages] = useState(mockMessages);
  const navigate = useNavigate();

  const unreadNotificationCount = notifications.filter(n => n.unread).length;
  const unreadMessageCount = messages.filter(m => m.unread).length;

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
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
    // Mark notification as read when clicked
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
    );
  };

  const handleMessageClick = (messageId: number) => {
    // Mark message as read when clicked
    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, unread: false } : m)
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-200/50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container h-14 w-full flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
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
            <Badge variant="secondary" className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
              Beta
            </Badge>
          </Link>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/marketplace" className="text-slate-600 hover:text-blue-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Market
          </Link>
          <Link to="/freelancing" className="text-slate-600 hover:text-purple-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Work
          </Link>
          <Link to="/sustainable" className="text-slate-600 hover:text-emerald-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Green
          </Link>
          <Link to="/connect" className="text-slate-600 hover:text-cyan-500 transition-colors font-medium hover:scale-105 transform duration-200">
            Connect
          </Link>
          <Link to="/aboutus" className="text-slate-600 hover:text-cyan-500 transition-colors font-medium hover:scale-105 transform duration-200">
            About Us
          </Link>
          <Button 
            variant="ghost" 
            className="text-2xl hover:scale-110 transition-all duration-300 bg-white rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-red-500 hover:via-yellow-500 hover:via-green-500 hover:via-blue-500 hover:to-purple-500"
            asChild
          >
            <Link to="/aiagents">
              <span className="text-base font-medium bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent hover:text-white transition-all duration-300">
                🤖 Agents
              </span>
            </Link>
          </Button>
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
                    <h3 className="font-semibold text-slate-800">Messages</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {messages.slice(0, 3).map((message) => (
                      <DropdownMenuItem
                        key={message.id}
                        className="flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
                        onClick={() => handleMessageClick(message.id)}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-slate-800">
                                {message.sender}
                              </p>
                              {message.unread && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              {message.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {message.time}
                            </p>
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
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center justify-center p-3 cursor-pointer text-green-600 font-medium">
                      See All
                    </Link>
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
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.slice(0, 3).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm text-slate-800">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {notification.time}
                            </p>
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
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center justify-center p-3 cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                      See All
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base" asChild>
                <Link to="/cart">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base">
                    <User className="w-4 h-4 mr-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 border-0 shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center cursor-pointer">
                      <span className="w-4 h-4 mr-2">📊</span>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
          <nav className="flex flex-col space-y-4">
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
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                    <Link to="/profile">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages {unreadMessageCount > 0 && `(${unreadMessageCount})`}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                    <Link to="/profile">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications {unreadNotificationCount > 0 && `(${unreadNotificationCount})`}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                    <Link to="/cart">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-800 justify-start" asChild>
                    <Link to="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile
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
  );
};