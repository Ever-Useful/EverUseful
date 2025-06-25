import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, User, Settings, LogOut, Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/assets/Logo/Logo Side.png';

const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const navigationItems = [
        {
            title: 'Marketplace',
            items: [
                { label: 'Browse Projects', href: '/projects' },
                { label: 'Trending', href: '/trending' },
                { label: 'Categories', href: '/categories' },
                { label: 'Featured', href: '/featured' },
            ]
        },
        {
            title: 'Services',
            items: [
                { label: 'Freelance Hub', href: '/freelance' },
                { label: 'Mentorship', href: '/mentorship' },
                { label: 'Project Review', href: '/review' },
                { label: 'Consulting', href: '/consulting' },
            ]
        },
        {
            title: 'Sustainability',
            items: [
                { label: 'Green Projects', href: '/green-projects' },
                { label: 'Impact Metrics', href: '/impact' },
                { label: 'Partnerships', href: '/partnerships' },
                { label: 'Success Stories', href: '/stories' },
            ]
        },
        {
            title: 'Resources',
            items: [
                { label: 'Documentation', href: '/docs' },
                { label: 'Tutorials', href: '/tutorials' },
                { label: 'Community', href: '/community' },
                { label: 'Support', href: '/support' },
            ]
        }
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <img src={Logo} alt="AMOGH" className="h-12 w-auto md:h-8" />
                            <div className="py-6 hidden w-4 pr-8 h-4 text-xs px-1 sm:inline-flex text-purple-700">
                                Beta
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex mx-4 flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects, services..."
                                className="flex h-9 w-full rounded-full border border-gray-200 bg-transparent py-2 pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => (
                            <DropdownMenu
                                key={item.title}
                                onOpenChange={(open) => setActiveDropdown(open ? item.title : null)}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${activeDropdown === item.title ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                            } focus:ring-0 focus:ring-offset-0`}
                                    >
                                        {item.title}
                                        <ChevronDown
                                            className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === item.title ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-64 mt-2 bg-white/95 backdrop-blur-md border shadow-xl rounded-xl"
                                    sideOffset={8}
                                >
                                    <div className="p-2">
                                        <div className="mb-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                                                {item.title}
                                            </p>
                                        </div>
                                        {item.items.map((subItem, index) => (
                                            <DropdownMenuItem
                                                key={index}
                                                className="px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 focus:ring-0"
                                            >
                                                <a href={subItem.href} className="w-full">
                                                    {subItem.label}
                                                </a>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ))}
                    </nav>

                    {/* Profile Section */}
                    <div className="flex items-center space-x-3">
                        {/* Mobile Search */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden p-2"
                        >
                            <Search className="h-5 w-5 text-gray-600" />
                        </Button>

                        {/* Notifications */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative p-2 hover:bg-gray-100 rounded-full focus:ring-0"
                        >
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white"></span>
                        </Button>

                        {/* Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-9 w-9 rounded-full hover:bg-gray-100 transition-colors focus:ring-0"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                                        <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-72 mt-2 bg-white/95 backdrop-blur-md border shadow-xl rounded-xl"
                                align="end"
                                sideOffset={8}
                            >
                                <div className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" />
                                            <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-gray-900">John Doe</p>
                                            <p className="text-sm text-gray-500">PhD Scholar</p>
                                            <p className="text-xs text-blue-600">MIT</p>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <div className="p-2">
                                    <DropdownMenuItem className="px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-50 focus:ring-0">
                                        <User className="mr-3 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-50 focus:ring-0">
                                        <Settings className="mr-3 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-2" />
                                    <DropdownMenuItem className="px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:ring-0">
                                        <LogOut className="mr-3 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;