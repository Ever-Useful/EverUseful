import React, { useState, useEffect } from 'react';
import { FileCode2, UserCheck, FilePen, Users } from 'lucide-react'
import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface DropdownItem {
    href: string;
    label: string;
    description: string;
    icon?: React.ReactNode;
}

interface NavigationItem {
    title: string;
    href: string;
    items: DropdownItem[];
}

const navigationItems: NavigationItem[] = [
    {
        title: 'Marketplace',
        href: '/marketplace',
        items: [
            { label: 'Find Project', href: '/', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
            { label: 'Upload Project', href: '/trending', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
        ]
    },
    {
        title: 'Work',
        href: '/freelancing',
        items: [
            { label: 'Find an Expert', href: '/fndexpert', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
            { label: 'My Dashboard', href: '/dashboard', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
            { label: 'My Profile', href: '/profile', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
        ]
    },
    {
        title: 'Community',
        href: '/connect',
        items: [
            { label: 'AI Agents', href: '/aiagents', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
            { label: 'Sustainable', href: '/green', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
        ]
    },
    {
        title: 'About Us',
        href: '/aboutus',   
        items: [
            { label: 'Privacy Policy', href: '/privacypolicy', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
            { label: 'Terms of Service', href: '/termsofservice', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
            { label: 'Send Feedback', href: '/sendfeedback', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
        ]
    }
];

const DropdownMenu = ({ item, isOpen, onOpen, onClose }: {
    item: NavigationItem;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'left'|'right'>('left');

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const wouldOverflow = rect.right > window.innerWidth;
      setPosition(wouldOverflow ? 'right' : 'left');
    }
  }, [isOpen]);

    return (
        <div
            className="relative"
            onMouseEnter={onOpen}
        >
            <Link to={item.href}>
                <button
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        } focus:ring-0 focus:ring-offset-0`}
                >
                    {item.title}
                </button>
            </Link>
            {isOpen && (
                <div
                    className="absolute right-0 w-[30vw] mt-2 bg-white/95 backdrop-blur-md border shadow-xl rounded-xl z-50"
                    onMouseEnter={onOpen}
                    onMouseLeave={onClose}
                >
                    <div className="p-4">
                        <div className="mb-3">
                            <a className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1" href={item.href}>
                                {item.title}
                            </a>
                        </div>
                        <div className="grid gap-2">
                            {item.items.map((subItem, index) => (
                                <a
                                    key={index}
                                    href={subItem.href}
                                    className="group flex items-center p-3 rounded-lg transition-all duration-150 hover:bg-blue-50"
                                >
                                    <div className="w-8 h-8 flex items-center justify-center mr-3 text-blue-600">
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                            {subItem.icon}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                            {subItem.label}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {subItem.description || "Element description"}
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function Navigation() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    return (
        <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
                <DropdownMenu
                    key={item.title}
                    item={item}
                    isOpen={activeDropdown === item.title}
                    onOpen={() => setActiveDropdown(item.title)}
                    onClose={() => setActiveDropdown(null)}
                />
            ))}
        </nav>
    );
}

