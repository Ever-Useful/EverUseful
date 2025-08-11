import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    User,
    Settings,
    LogOut,
    Bell,
    Search,
    MessageSquare,
    TrendingUp,
    Star,
    Shield,
    Heart,
    BarChart2,
    Calendar,
    X,
    HelpCircle,
    Users,
    List,
    LayoutGrid,
    Send,
    UserPlus,
    Globe,
    Palette,
    Database,
    Lock, 
    ShoppingCart,
    Menu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo Side Simple.png';
import InitialsAvatar from './InitialsAvatar';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import userService from '@/services/userService';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Connections from '@/components/Connections';
import { EditProfile } from '../components/EditProfile';
import { MyProjects } from '@/components/MyProjects';
import { Input } from '@/components/ui/input';

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

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if current page needs user data (only pages that require authentication)
    const needsUserData = useMemo(() => {
        const authRequiredRoutes = [
            '/dashboard', '/profile', '/marketplace', '/cart', '/chat', 
            '/connections', '/collaborators', '/freelancing', '/findexpert',
            '/freelancerprofile', '/studentprofile', '/businessprofile',
            '/new-project', '/schedule-meeting'
        ];
        const needsData = authRequiredRoutes.some(route => location.pathname.startsWith(route));
        return needsData;
    }, [location.pathname]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [messages, setMessages] = useState(mockMessages);
    const unreadMessageCount = messages.filter(m => m.unread).length;
    const [showMessagesSidebar, setShowMessagesSidebar] = useState(false);
    const [showNotificationsSidebar, setShowNotificationsSidebar] = useState(false);
    const [showProfileSidebar, setShowProfileSidebar] = useState(false);
    const [showEditProfileSidebar, setShowEditProfileSidebar] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const unreadNotificationCount = notifications.filter(n => n.unread).length;
    const { profileData, isLoggedIn, refreshProfile } = useUserProfile();
    const [showMyProjects, setShowMyProjects] = useState(false);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
    const [showProjectsSidebar, setShowProjectsSidebar] = useState(false);
    const [showFavouritesSidebar, setShowFavouritesSidebar] = useState(false);
    const [showCalendarSidebar, setShowCalendarSidebar] = useState(false);
    const [showConnectionsSidebar, setShowConnectionsSidebar] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
   
    // Mock data for connections (replace with real data fetching as needed)
    const existingConnections: Array<any> = [
        {
            id: '1',
            name: 'Alice Johnson',
            title: 'Frontend Developer',
            company: 'TechCorp',
            avatar: '',
            mutualConnections: 8,
            isConnected: true,
        },
        {
            id: '2',
            name: 'Bob Smith',
            title: 'Backend Engineer',
            company: 'CodeWorks',
            avatar: '',
            mutualConnections: 8,
            isConnected: true,
        },
        {
            id: '3',
            name: 'Carla Brown',
            title: 'Data Scientist',
            company: 'DataSolutions',
            avatar: '',
            mutualConnections: 8,
            isConnected: true,
        },
        {
            id: '4',
            name: 'Dwayne Johnson',
            title: 'Archiologist',
            company: 'Rockfellar',
            avatar: '',
            mutualConnections: 8,
            isConnected: true,
        }
    ];
    const suggestedConnections: Array<any> = [
        {
            id: '1',
            name: 'Alice Johnson',
            title: 'Frontend Developer',
            company: 'TechCorp',
            avatar: '',
            mutualConnections: 8,
            isConnected: false,
        },
        {
            id: '2',
            name: 'Bob Smith',
            title: 'Backend Engineer',
            company: 'CodeWorks',
            avatar: '',
            mutualConnections: 8,
            isConnected: false,
        },
        {
            id: '3',
            name: 'Carla Brown',
            title: 'Data Scientist',
            company: 'DataSolutions',
            avatar: '',
            mutualConnections: 8,
            isConnected: false,
        },
        {
            id: '4',
            name: 'Dwayne Johnson',
            title: 'Archiologist',
            company: 'Rockfellar',
            avatar: '',
            mutualConnections: 8,
            isConnected: false,
        }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                localStorage.setItem("isLoggedIn", "true");
                
                // Only fetch user profile if the current page needs it AND we don't have cached data
                if (needsUserData) {
                    await refreshProfile();
                }
            } else {
                localStorage.removeItem("isLoggedIn");
            }
        });
        return () => unsubscribe();
    }, [needsUserData, refreshProfile]);

    // Function to refresh profile data - only called when explicitly needed
    const refreshProfileData = async () => {
        if (!needsUserData) return; // Skip if not needed
        await refreshProfile();
    };

    const handleMessageClick = (messageId: number) => {
        setMessages(prev =>
            prev.map(m => m.id === messageId ? { ...m, unread: false } : m)
        );
    };

    const handleNotificationClick = (notificationId: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
        );
    };

    const handleLogout = async () => {
        try {
            // Clear all user-related state
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

    useEffect(() => {
        const handleStorageChange = () => {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            if (!loginStatus) {
                setShowNotificationsSidebar(false);
                setShowMessagesSidebar(false);
                setShowProfileSidebar(false);
                setShowEditProfileSidebar(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

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

    function handleConnect(personId: string): void {
        // Here you would typically send a connection request to your backend
        // For now, just show a toast or alert for demonstration
        alert(`Connection request sent to user with ID: ${personId}`);
        // Optionally, update UI state to reflect the request was sent
        // Example: setSuggestedConnections(prev => prev.filter(p => p.id !== personId));
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white shadow-sm">
                <div className="container max-w-full md:w-[1320px] mx-auto px-2 sm:px-4">
                    <div className="flex h-14 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-1 flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-2 group">
                                <img src={Logo} alt="AMOGH" className="h-10 w-auto md:h-8" />
                            </Link>
                        </div>

                        {/* Desktop Navigation and Search */}
                        <div className="hidden md:flex flex-1 items-center">
                            <div className="mx-4 flex-1 max-w-md">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search projects, services..."
                                        className="flex h-9 w-full rounded-full border border-gray-200 bg-transparent py-2 pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                            <Navigation />
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            {isLoggedIn ? (
                                <>
                                    {/* Mobile: Hamburger and Profile */}
                                    <div className="flex md:hidden items-center space-x-2">
                                        {/* Profile Button */}
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowProfileSidebar(true)}
                                            className="hover:bg-white/10 hover:text-gray-900 hover:scale-105 transition-all duration-300 text-sm px-2 py-2 rounded-lg flex items-center"
                                        >
                                            <User className="h-5 w-5 text-gray-600" />
                                        </Button>
                                        {/* Hamburger Menu */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="p-2"
                                            aria-label="Open menu"
                                            onClick={() => setShowMobileMenu(true)}
                                        >
                                            <Menu className="h-6 w-6 text-gray-700" />
                                        </Button>
                                    </div>
                                    {/* Desktop: All header actions */}
                                    <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
                                        {/* Cart Button */}
                                        <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-300" asChild>
                                            <Link to="/cart">
                                                <ShoppingCart className="h-5 w-5 text-gray-600" />
                                            </Link>
                                        </Button>
                                        {/* Messages Button */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="relative hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-300">
                                                    <MessageSquare className="h-5 w-5 text-gray-600" />
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
                                                <Button variant="ghost" size="icon" className="relative hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-300">
                                                    <Bell className="h-5 w-5 text-gray-600" />
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
                                        {/* Profile Button with User Name */}
                                        <Button variant="ghost" onClick={() => setShowProfileSidebar(true)} className="bg-white/10 text-gray-900 hover:scale-105 transition-all duration-300 text-sm px-2 lg:px-3 py-2 rounded-lg flex items-center space-x-2">
                                            <User className="h-5 w-5 text-gray-600" />
                                            {profileData.firstName && (
                                                <span className="hidden sm:inline text-sm font-medium">
                                                    Hi, {profileData.firstName}
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Mobile: Join and Sign In buttons */}
                                    <div className="flex md:hidden items-center space-x-2 ">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="text-sm px-3 py-1"
                                        >
                                            <Link to="/signin">Sign In</Link>
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            bg-background="emerald-600"
                                            asChild
                                            className="text-sm px-3 py-1"
                                        >
                                            <Link to="/signup">Join</Link>
                                        </Button>
                                    </div>
                                    {/* Desktop: Join and Sign In buttons */}
                                    <div className="hidden md:flex items-center space-x-3 ">
                                        <Button
                                            variant="outline"
                                            asChild
                                            bg-border="emerald-600"
                                            className="text-sm px-4 py-2"
                                        >
                                            <Link to="/signin">Sign In</Link>
                                        </Button>
                                        <Button
                                            variant="default"
                                            asChild
                                            bg-background="emerald-600"
                                            className="text-sm px-4 py-2"
                                        >
                                            <Link to="/signup">Join</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            {/* Mobile Drawer/Menu */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowMobileMenu(false)}
                    />
                    {/* Drawer */}
                    <div className="relative ml-auto w-72 max-w-[90vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="font-bold text-xl text-gray-900">Menu</h2>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {/* Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search projects, services..."
                                        className="flex h-9 w-full rounded-full border border-gray-200 bg-transparent py-2 pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                            {/* Navigation */}
                            <Navigation mobile />
                            {/* Cart */}
                            <Link to="/cart" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                <ShoppingCart className="w-5 h-5 mr-3 text-gray-600" />
                                <span className="text-gray-700 font-medium">Cart</span>
                            </Link>
                            {/* Messages */}
                            <button
                                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors w-full"
                                onClick={() => {
                                    setShowMessagesSidebar(true);
                                    setShowMobileMenu(false);
                                }}
                            >
                                <MessageSquare className="w-5 h-5 mr-3 text-gray-600" />
                                <span className="text-gray-700 font-medium">Messages</span>
                                {unreadMessageCount > 0 && (
                                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500 hover:bg-green-500">
                                        {unreadMessageCount}
                                    </Badge>
                                )}
                            </button>
                            {/* Notifications */}
                            <button
                                className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors w-full"
                                onClick={() => {
                                    setShowNotificationsSidebar(true);
                                    setShowMobileMenu(false);
                                }}
                            >
                                <Bell className="w-5 h-5 mr-3 text-gray-600" />
                                <span className="text-gray-700 font-medium">Notifications</span>
                                {unreadNotificationCount > 0 && (
                                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
                                        {unreadNotificationCount}
                                    </Badge>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Profile Sidebar */}
            {showProfileSidebar && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => {
                            setShowProfileSidebar(false);
                            setShowSettingsSidebar(false);
                            setShowCalendarSidebar(false);
                            setShowFavouritesSidebar(false);
                            setShowConnectionsSidebar(false);
                            setShowProjectsSidebar(false);
                        }}
                    />

                    {showSettingsSidebar && (
                        <div className="fixed bottom-0 right-0 sm:right-[24rem] w-full sm:w-96 h-[80vh] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right z-[60]">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="font-bold text-lg sm:text-xl text-gray-900">Settings</h2>
                                <button
                                    onClick={() => setShowSettingsSidebar(false)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ACCOUNT</h4>
                                    <nav className="space-y-1">
                                        <Link to="/settings/profile" className="flex items-center p-2 sm:p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Profile Settings</span>
                                        </Link>
                                        <Link to="/settings/security" className="flex items-center p-2 sm:p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Security</span>
                                        </Link>
                                        <Link to="/settings/notifications" className="flex items-center p-2 sm:p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Notifications</span>
                                        </Link>
                                    </nav>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">PREFERENCES</h4>
                                    <nav className="space-y-1">
                                        <Link to="/settings/theme" className="flex items-center p-2 sm:p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Theme & Appearance</span>
                                        </Link>
                                        <Link to="/settings/language" className="flex items-center p-2 sm:p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Language</span>
                                        </Link>
                                    </nav>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ADVANCED</h4>
                                    <nav className="space-y-1">
                                        <Link to="/settings/privacy" className="flex items-center p-2 sm:p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Privacy</span>
                                        </Link>
                                        <Link to="/settings/data" className="flex items-center p-2 sm:p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Data & Storage</span>
                                        </Link>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}

                    {showProjectsSidebar && (
                        <div className="fixed bottom-0 right-0 sm:right-[24rem] w-full sm:w-96 h-[80vh] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right z-[60]">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="font-bold text-lg sm:text-xl text-gray-900">Projects</h2>
                                <button
                                    onClick={() => setShowProjectsSidebar(false)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                            </div>
                        </div>
                    )}

                    {showFavouritesSidebar && (
                        <div className="fixed bottom-0 right-0 sm:right-[24rem] w-full sm:w-96 h-[80vh] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right z-[60]">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="font-bold text-lg sm:text-xl text-gray-900">Favourites</h2>
                                <button
                                    onClick={() => setShowFavouritesSidebar(false)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                            </div>
                        </div>
                    )}

                    {showCalendarSidebar && (
                        <div className="fixed bottom-0 right-0 sm:right-[24rem] w-full sm:w-96 h-[80vh] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right z-[60]">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="font-bold text-lg sm:text-xl text-gray-900">Calendar</h2>
                                <button
                                    onClick={() => setShowCalendarSidebar(false)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                            </div>
                        </div>
                    )}

                    {showConnectionsSidebar && (
                        <div className="fixed bottom-0 right-0 sm:right-[24rem] w-full sm:w-[50rem] h-[80vh] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right z-50">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="font-bold text-lg sm:text-xl text-gray-900">Connections</h2>
                                <button
                                    onClick={() => setShowConnectionsSidebar(false)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <Tabs defaultValue="existing" className="w-full h-full">
                                    <TabsList className="grid w-auto grid-cols-2 mx-3 sm:mx-4 mt-3 sm:mt-4">
                                        <TabsTrigger value="existing" className="text-xs sm:text-sm">Existing Connections</TabsTrigger>
                                        <TabsTrigger value="new" className="text-xs sm:text-sm">Make New Connections</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="existing" className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                        {existingConnections.length > 0 ? (
                                            existingConnections.map((person) => (
                                                <Connections
                                                    key={person.id}
                                                    person={person}
                                                    onMessage={handleSendMessage}
                                                    showConnectButton={false}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 mt-6 sm:mt-8">
                                                <p className="text-sm sm:text-base">No existing connections found</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="new" className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                        {suggestedConnections.length > 0 ? (
                                            suggestedConnections.map((person) => (
                                                <Connections
                                                    key={person.id}
                                                    person={person}
                                                    onConnect={handleConnect}
                                                    onMessage={handleSendMessage}
                                                    showConnectButton={true}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 mt-6 sm:mt-8">
                                                <p className="text-sm sm:text-base">No new connection suggestions available</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}

                    {showProfileSidebar && (
                        <div className="relative w-full sm:w-96 max-w-[90vw] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                                <h2 className="font-bold text-lg sm:text-xl text-gray-900">Profile</h2>
                                <button
                                    onClick={() => setShowProfileSidebar(false)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                                <div className="flex flex-col items-center text-center">
                                    {profileData.avatar ? (
                                        <img 
                                            src={profileData.avatar} 
                                            alt={`${profileData.firstName} ${profileData.lastName}`}
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <InitialsAvatar 
                                        firstName={profileData.firstName} 
                                        lastName={profileData.lastName} 
                                        size={80} 
                                        className={`sm:w-24 sm:h-24 ${profileData.avatar ? 'hidden' : ''}`} 
                                    />
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mt-2 sm:mt-3">{profileData.firstName} {profileData.lastName}</h3>
                                    <Link to="/profile" className="text-xs sm:text-sm text-blue-600 hover:underline mt-1">
                                        View Profile &gt;
                                    </Link>
                                </div>

                                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-green-500 mb-1" />
                                        <p className="font-bold text-xs sm:text-sm text-gray-900">111452</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <Star className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-yellow-500 mb-1" />
                                        <p className="font-bold text-xs sm:text-sm text-gray-900">7083</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-blue-500 mb-1" />
                                        <p className="font-bold text-xs sm:text-sm text-gray-900">528</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">USER</h4>
                                    <nav className="space-y-1">
                                        <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Dashboard</span>
                                        </Link>
                                        <Link to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowConnectionsSidebar(true);
                                                setShowProjectsSidebar(false);
                                                setShowSettingsSidebar(false);
                                                setShowCalendarSidebar(false);
                                                setShowFavouritesSidebar(false);
                                            }}
                                            className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">My Connections</span>
                                        </Link>
                                        <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">My Collaborations</span>
                                        </Link>
                                        <Link to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowProjectsSidebar(true);
                                                setShowSettingsSidebar(false);
                                                setShowCalendarSidebar(false);
                                                setShowFavouritesSidebar(false);
                                                setShowConnectionsSidebar(false);
                                            }}
                                            className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <List className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">My Projects</span>
                                        </Link>
                                        <Link to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowFavouritesSidebar(true);
                                                setShowProjectsSidebar(false);
                                                setShowSettingsSidebar(false);
                                                setShowConnectionsSidebar(false);
                                                setShowCalendarSidebar(false);
                                            }}
                                            className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">My Favourites</span>
                                        </Link>
                                        <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Analytics</span>
                                        </Link>
                                        <Link to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowCalendarSidebar(true);
                                                setShowFavouritesSidebar(false);
                                                setShowProjectsSidebar(false);
                                                setShowConnectionsSidebar(false);
                                                setShowSettingsSidebar(false);
                                            }}
                                            className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Calendar</span>
                                        </Link>
                                    </nav>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">GENERAL</h4>
                                    <nav className="space-y-1">
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowSettingsSidebar(true);
                                                setShowCalendarSidebar(false);
                                                setShowFavouritesSidebar(false);
                                                setShowConnectionsSidebar(false);
                                                setShowProjectsSidebar(false);
                                            }}
                                            className="flex items-center p-2 rounded-md hover:bg-gray-100"
                                        >
                                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Settings</span>
                                        </Link>
                                        <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Help</span>
                                        </Link>
                                        <Link to="/signin" onClick={handleLogout} className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-600" />
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">Logout</span>
                                        </Link>
                                    </nav>
                                </div>
                            </div>


                        </div>
                    )}
                </div>
            )}

            {/* Notifications Sidebar */}
            {showNotificationsSidebar && (
                <div className="fixed top-0 right-0 w-full sm:w-96 max-w-[90vw] h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <div>
                            <h2 className="font-bold text-lg sm:text-xl text-slate-800">All Notifications</h2>
                            <p className="text-xs sm:text-sm text-slate-600">{unreadNotificationCount} unread</p>
                        </div>
                        <button
                            onClick={() => setShowNotificationsSidebar(false)}
                            className="text-slate-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 sm:p-8 text-center text-slate-500">
                                <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm sm:text-base">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer ${notification.unread ? "bg-blue-50/50 border-l-4 border-l-blue-400" : ""
                                            }`}
                                        onClick={() => handleNotificationClick(notification.id)}
                                    >
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <span className="text-xl sm:text-2xl">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                                                        {notification.title}
                                                    </h3>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                    )}
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
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
                    <div className="p-3 sm:p-4 border-t bg-slate-50">
                        <Button
                            variant="outline"
                            className="w-full text-xs sm:text-sm"
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
                <div className="fixed top-0 right-0 w-full sm:w-96 max-w-[90vw] h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                        <div>
                            <h2 className="font-bold text-lg sm:text-xl text-slate-800">All Messages</h2>
                            <p className="text-xs sm:text-sm text-slate-600">{unreadMessageCount} unread conversations</p>
                        </div>
                        <button
                            onClick={() => setShowMessagesSidebar(false)}
                            className="text-slate-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="p-6 sm:p-8 text-center text-slate-500">
                                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm sm:text-base">No messages yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {messages.map((message) => (
                                    <div key={message.id} className="relative">
                                        <div
                                            className={`p-3 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer ${message.unread ? "bg-green-50/50 border-l-4 border-l-green-400" : ""
                                                } ${activeChatId === message.conversationId ? "bg-green-100" : ""}`}
                                            onClick={() => handleMessageSelect(message.conversationId)}
                                        >
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <span className="text-2xl sm:text-3xl">{message.avatar}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                                                                {message.sender}
                                                            </h3>
                                                            {message.unread && (
                                                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-400 flex-shrink-0">{message.time}</p>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                        {message.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropdown Chat Box */}
                                        {activeChatId === message.conversationId && (
                                            <div className="border-t bg-white shadow-inner">
                                                <div className="max-h-64 overflow-y-auto p-2 sm:p-3 space-y-2">
                                                    {mockChatMessages[message.conversationId]?.map((chatMsg) => (
                                                        <div
                                                            key={chatMsg.id}
                                                            className={`flex ${chatMsg.isOwn ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-[80%] p-2 rounded-lg text-xs sm:text-sm ${chatMsg.isOwn
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-slate-100 text-slate-800'
                                                                    }`}
                                                            >
                                                                <p>{chatMsg.message}</p>
                                                                <p
                                                                    className={`text-xs mt-1 ${chatMsg.isOwn ? 'text-green-100' : 'text-slate-500'
                                                                        }`}
                                                                >
                                                                    {chatMsg.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Message Input */}
                                                <div className="p-2 sm:p-3 border-t bg-slate-50">
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
                                                            className="flex-1 text-xs sm:text-sm"
                                                        />
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSendMessage(message.conversationId)}
                                                            className="bg-green-500 hover:bg-green-600"
                                                        >
                                                            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
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
                    <div className="p-3 sm:p-4 border-t bg-slate-50">
                        <Button
                            variant="outline"
                            className="w-full text-xs sm:text-sm"
                            onClick={() => {
                                setMessages(prev => prev.map(m => ({ ...m, unread: false })));
                            }}
                        >
                            Mark All as Read
                        </Button>
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

export default Header;