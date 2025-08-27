import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Navigation({ mobile = false, isLoggedIn = false }: { mobile?: boolean, isLoggedIn?: boolean }) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Handle clicking outside to close mega menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.mega-menu-container') && !target.closest('nav')) {
                setActiveDropdown(null);
                setActiveCategory(null);
            }
        };

        if (activeDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    const megaMenuData = {
        Marketplace: {
            categories: [
                { id: 'explore', label: 'Projects', href: '/marketplace' },
                ...(isLoggedIn ? [{ id: 'new project', label: 'Add New Project', href: '/profile#projects' }] : []),
                // { id: 'datasets', label: 'Datasets', href: '/marketplace/datasets' },
                // { id: 'algorithms', label: 'Algorithms', href: '/marketplace/algorithms' },
                // { id: 'models', label: 'AI Models', href: '/marketplace/models' },
                // { id: 'tools', label: 'Development Tools', href: '/marketplace/tools' },
                // { id: 'templates', label: 'Templates', href: '/marketplace/templates' },
                // { id: 'apis', label: 'APIs', href: '/services#apis' },
            ],
            content: {
                explore: {
                    subcategories: [
                        { name: 'AI & ML'},
                        { name: 'Data Science'},
                        { name: 'Sustainable'},
                        { name: 'FinTech'},
                        { name: 'HealthTech'},
                        { name: 'EdTech'},
                        { name: 'IoT'},
                        { name: 'BlockChain'},
                        { name: 'Mobile'}
                    ],
                    featured: [
                        { name: 'TensorFlow Starter Kit', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=150&h=100&fit=crop'},
                        { name: 'React Dashboard Pro', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop'}
                    ]
                },
            }
        },
        Work: {
            categories: [
                { id: 'freelance', label: 'Find Freelancers', href: '/freelancing' },
                { id: 'mentorship', label: 'Find Expert', href: '/findexpert' },
                ...(isLoggedIn ? [
                    { id: 'dashboard', label: 'My Dashboard', href: '/dashboard' },
                    { id: 'profile', label: 'My Profile', href: '/profile' },
                ] : []),
            ],
            content: {
                freelance: {
                    subcategories: [
                        { name: 'Web Development', href: '/freelancing/category/web-development' },
                        { name: 'Mobile Development', href: '/freelancing/category/mobile-development' },
                        { name: 'Data Science', href: '/freelancing/category/data-science' },
                        { name: 'AI/ML Services', href: '/freelancing/category/ai-ml' },
                        { name: 'Design Services', href: '/freelancing/category/design' },
                        { name: 'Writing & Translation', href: '/freelancing/category/writing' },
                        { name: 'Marketing', href: '/freelancing/category/marketing' },
                        { name: 'Business Strategy', href: '/freelancing/category/business-strategy' }
                    ],
                    featured: [
                        { name: 'Top Rated Developers', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=100&fit=crop', href: '/findexpert' },
                        { name: 'Enterprise Solutions', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=100&fit=crop', href: '/services/enterprise' }
                    ]
                },
                mentorship: {
                    subcategories: [
                        { name: 'Career Guidance', href: '/mentorship/career-guidance' },
                        { name: 'Technical Skills', href: '/mentorship/technical-skills' },
                        { name: 'Research Methods', href: '/mentorship/research-methods' },
                        { name: 'PhD Support', href: '/mentorship/phd-support' },
                        { name: 'Industry Transition', href: '/mentorship/industry-transition' },
                        { name: 'Startup Advice', href: '/mentorship/startup-advice' },
                        { name: 'Academic Writing', href: '/mentorship/academic-writing' },
                        { name: 'Grant Applications', href: '/mentorship/grant-applications' }
                    ],
                    featured: [
                        { name: 'PhD Mentorship Program', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=100&fit=crop', href: '/mentorship/phd-program' },
                        { name: 'Industry Expert Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop', href: '/mentorship/expert-network' }
                    ]
                },
                dashboard: {
                    subcategories: [
                        { name: 'Weekly Growth', href: '/dashboard' },
                        { name: 'Monthly Growth', href: '/dashboard' },
                        { name: 'My Deals', href: '/dashboard' },
                        { name: 'My Projects', href: '/dashboard' },
                    ],
                    featured: [
                        { name: 'AI Strategy Consulting', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=100&fit=crop', href: '/consulting/ai-strategy' },
                        { name: 'Tech Architecture Review', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=100&fit=crop', href: '/consulting/architecture-review' }
                    ]
                },
                review: {
                    subcategories: [
                    ],
                    featured: [
                        { name: 'Expert Code Review', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=100&fit=crop', href: '/services/review/expert-code' },
                        { name: 'Security Audit Service', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=150&h=100&fit=crop', href: '/services/review/security-audit' }
                    ]
                }
            }
        },
        Services: {
            categories: [
                { id: 'greenprojects', label: 'Sustainable', href: '/sustainable' },
                { id: 'consulting', label: 'Consulting', href: '/consulting' },
                { id: 'agents', label: 'AI Agents', href: '/aiagents' },
                { id: 'campus', label: 'Campus Ambassadors', href: '/campus-ambassador' }
            ],
            content: {
                greenprojects: {
                    subcategories: [
                        { name: 'Renewable Energy'},
                        { name: 'Carbon Tracking'},
                        { name: 'Waste Management'},
                        { name: 'Water Conservation'},
                        { name: 'Sustainable Agriculture'},
                        { name: 'Green Transportation'},
                        { name: 'Eco-friendly Materials'},
                        { name: 'Climate Monitoring'}
                    ],
                    featured: [
                        { name: 'Solar Panel Optimizer', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=150&h=100&fit=crop'},
                        { name: 'Carbon Footprint Tracker', image: 'https://images.unsplash.com/photo-1569163139394-de44cb130c82?w=150&h=100&fit=crop'}
                    ]
                },
                consulting: {
                    subcategories: [
                        { name: 'Technical Architecture'},
                        { name: 'Strategy Planning'},
                        { name: 'Digital Transformation'},
                        { name: 'AI Implementation'},
                        { name: 'Security Audit'},
                        { name: 'Performance Optimization'},
                        { name: 'Process Improvement'},
                        { name: 'Technology Assessment'}
                    ],
                    featured: [
                        { name: 'Impact Dashboard Pro', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop'},
                        { name: 'ESG Reporting Tool', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=100&fit=crop'}
                    ]
                },
                agents: {
                    subcategories: [
                        { name: 'Agent Directories'},
                        { name: 'Agent Studio'},
                        { name: 'Custom Agents'},
                        { name: 'Integrations'},
                        { name: 'Analytics'},
                        { name: 'Use Cases'},
                        { name: 'Ethics & Safety'},
                    ],
                    featured: [
                        { name: 'Global Green Alliance', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=100&fit=crop'},
                        { name: 'Sustainability Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop'}
                    ]
                },
                campus: {
                    subcategories: [
                        { name: 'Student Leaderboard'},
                        { name: 'Competitions'},
                        { name: 'Hackathons'},
                        { name: 'Workshops'},
                        { name: 'Awareness Campaigns'},
                        { name: 'Sustainability Initiatives'},
                        { name: 'Eco-Friendly Practices'},
                    ],
                    featured: [
                        { name: 'Global Green Alliance', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=100&fit=crop'},
                        { name: 'Sustainability Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop'}
                    ]
                },
            }
        },
        Community: {
            categories: [
                { id: 'aboutus', label: 'About Us', href: '/aboutus' },
                { id: 'connect', label: 'Connect', href: '/connect' },
                { id: 'legal', label: 'Terms of Service', href: '/terms-conditions' },
                { id: 'feedback', label: 'Send Feedback', href: '/sendfeedback' },
            ],
            content: {
                aboutus: {
                    subcategories: [
                        { name: 'Platform'},
                        { name: 'Stories'},
                        { name: 'Team'},
                        { name: 'Community'},
                    ],
                    featured: [
                        { name: 'Complete API Guide', image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=150&h=100&fit=crop'},
                        { name: 'Integration Handbook', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&h=100&fit=crop'}
                    ]
                },
                connect: {
                    subcategories: [
                        { name: 'Community Hub'},
                        { name: 'Events and Webinars'},
                        { name: 'Collab Spaces'},
                        { name: 'Mentorship'},
                        { name: 'Partner Network'},
                        { name: 'Showcase'},
                    ],
                    featured: [
                        { name: 'ML Mastery Course', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=100&fit=crop'},
                        { name: 'Web Dev Bootcamp', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=100&fit=crop'}
                    ]
                },
                legal: {
                    subcategories: [
                        { name: 'Privacy Policy', href: '/privacy-policy' },
                        { name: 'Cookie Policy', href: '/cookie-policy' },
                        { name: 'Refund Policy', href: '/refund-policy' },
                        { name: 'Accessibility', href: '/accessibility' },
                        { name: 'Delivery Policy', href: '/delivery-policy' },
                    ],
                    featured: [
                        { name: 'Global Developer Network', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=100&fit=crop'},
                        { name: 'Monthly Tech Meetup', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&h=100&fit=crop'}
                    ]
                },
                feedback: {
                    subcategories: [
                        { name: 'Submit Feedback'},
                        { name: 'Feature Requests'},
                        { name: 'Bug Reports'},
                        { name: 'User Ratings'},
                        { name: 'Community Polls'},
                        { name: 'Feedback Dashboard'},
                        { name: 'Response Timeline'},
                        { name: 'Give Kudos'}
                    ],
                    featured: [
                        { name: '24/7 Expert Support', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=150&h=100&fit=crop'},
                        { name: 'Premium Support Plan', image: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=150&h=100&fit=crop'}
                    ]
                }
            }
        }
    };

    // Helper for mobile: open/close navigation and categories
    const handleNavClick = (menuKey: string) => {
        setActiveDropdown(activeDropdown === menuKey ? null : menuKey);
        setActiveCategory(null);
    };

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId);
    };

    const handleNavButtonClick = (e: React.MouseEvent, menuKey: string, href: string) => {
        // Prevent the dropdown from toggling when clicking the main button
        e.stopPropagation();
        // Navigate to the main page
        window.location.href = href;
    };

    const handleDropdownToggle = (e: React.MouseEvent, menuKey: string) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === menuKey ? null : menuKey);
        setActiveCategory(null);
    };

    // MOBILE NAVIGATION
    if (mobile) {
        return (
            <nav className="flex flex-col w-full space-y-2">
                {/* Home Button - Only show when not on home page */}
                {!isHomePage && (
                    <Link
                        to="/"
                        className="flex items-center w-full px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-semibold text-base hover:bg-blue-100 transition"
                    >
                        Home
                    </Link>
                )}
                {Object.keys(megaMenuData).map((menuKey) => {
                    const menuData = megaMenuData[menuKey];
                    const isNavOpen = activeDropdown === menuKey;
                    // Get the main href for this menu (use the first category's href as default)
                    const mainHref = menuData.categories[0]?.href || '/';
                    
                    return (
                        <div key={menuKey} className="w-full">
                            <div className="flex items-center w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-800 font-semibold text-base focus:outline-none focus:bg-blue-50 transition">
                                <button
                                    className="flex-1 text-left"
                                    onClick={(e) => handleNavButtonClick(e, menuKey, mainHref)}
                                >
                                    {menuKey}
                                </button>
                                <button
                                    className="ml-2 p-1 rounded hover:bg-gray-200 transition"
                                    onClick={(e) => handleDropdownToggle(e, menuKey)}
                                    aria-expanded={isNavOpen}
                                    aria-label={`Toggle ${menuKey} submenu`}
                                >
                                    <ChevronDown className={`w-5 h-5 transition-transform ${isNavOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            {isNavOpen && (
                                <div className="pl-2 py-2 space-y-1">
                                    {menuData.categories.map((category) => {
                                        const isCatOpen = activeCategory === category.id;
                                        return (
                                            <div key={category.id} className="w-full">
                                                <div className="flex items-center w-full px-4 py-2 rounded-md bg-white text-gray-700 font-medium text-sm focus:outline-none focus:bg-blue-50 transition">
                                                    <Link
                                                        to={category.href}
                                                        className="flex-1 text-left"
                                                    >
                                                        {category.label}
                                                    </Link>
                                                    {menuData.content &&
                                                        menuData.content[category.id] &&
                                                        menuData.content[category.id].subcategories &&
                                                        menuData.content[category.id].subcategories.length > 0 && (
                                                        <button
                                                            className="ml-2 p-1 rounded hover:bg-gray-200 transition"
                                                            onClick={() => handleCategoryClick(category.id)}
                                                            aria-expanded={isCatOpen}
                                                            aria-label={`Toggle ${category.label} subcategories`}
                                                        >
                                                            <ChevronRight className={`w-4 h-4 transition-transform ${isCatOpen ? 'rotate-90' : ''}`} />
                                                        </button>
                                                    )}
                                                </div>
                                                {isCatOpen && (
                                                    <div className="pl-4 py-1 space-y-1">
                                                        {menuData.content &&
                                                            menuData.content[category.id] &&
                                                            menuData.content[category.id].subcategories &&
                                                            menuData.content[category.id].subcategories.map((subcat, idx) => (
                                                                <Link
                                                                    key={idx}
                                                                    to={subcat.href}
                                                                    className="block px-3 py-2 rounded text-gray-600 hover:bg-blue-50 hover:text-blue-700 text-sm transition"
                                                                >
                                                                    {subcat.name}
                                                                </Link>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        );
    }

    // DESKTOP NAVIGATION
    return (
        <nav className="hidden md:flex items-center space-x-1 text-sm">
            {/* Home Button - Only show when not on home page */}
            {!isHomePage && (
                <Link to="/">
                    <Button
                        variant="ghost"
                        size='sm'
                        className="px-6 py-2 font-medium transition-all duration-200 hover:bg-transparent hover:text-gray-900 text-gray-700 shadow-none"
                    >
                        Home
                    </Button>
                </Link>
            )}
            {Object.keys(megaMenuData).map((menuKey) => {
                const isOpen = activeDropdown === menuKey;
                return (
                                         <div
                         key={menuKey}
                         className="relative"
                         onMouseLeave={() => {
                             setTimeout(() => {
                                 if (!document.querySelector('.mega-menu-container:hover')) {
                                     setActiveDropdown(null);
                                     setActiveCategory(null);
                                 }
                             }, 100);
                         }}
                     >
                                                 <Button
                             variant="ghost"
                             size='sm'
                             className={`relative px-6 py-2 font-medium transition-all duration-200 shadow-none hover:bg-transparent hover:text-gray-900 text-gray-700 ${isOpen ? 'text-blue-700' : ''}`}
                             onMouseEnter={() => {
                                 setActiveDropdown(menuKey);
                                 // Set default active category for each menu
                                 switch (menuKey) {
                                     case 'Marketplace':
                                         setActiveCategory('explore');
                                         break;
                                     case 'Work':
                                         setActiveCategory('freelance');
                                         break;
                                     case 'Services':
                                         setActiveCategory('greenprojects');
                                         break;
                                     case 'Community':
                                         setActiveCategory('aboutus');
                                         break;
                                     default:
                                         setActiveCategory('explore');
                                 }
                             }}
                             onClick={() => {
                                 // Toggle dropdown on click
                                 if (activeDropdown === menuKey) {
                                     setActiveDropdown(null);
                                     setActiveCategory(null);
                                 } else {
                                     setActiveDropdown(menuKey);
                                     // Set default active category for each menu
                                     switch (menuKey) {
                                         case 'Marketplace':
                                             setActiveCategory('explore');
                                             break;
                                         case 'Work':
                                             setActiveCategory('freelance');
                                             break;
                                         case 'Services':
                                             setActiveCategory('greenprojects');
                                             break;
                                         case 'Community':
                                             setActiveCategory('aboutus');
                                             break;
                                         default:
                                             setActiveCategory('explore');
                                     }
                                 }
                             }}
                         >
                             {menuKey}
                         </Button>
                                                 {isOpen && (
                             <div
                                 className="mega-menu-container fixed left-1/2 top-14 z-[100] w-[90vw] max-w-6xl p-0 border-0 shadow-none bg-transparent -translate-x-1/2 rounded-lg"
                                 style={{ pointerEvents: 'auto' }}
                                 onMouseEnter={() => {
                                     // Keep menu open when hovering over the mega menu content
                                 }}
                                 onMouseLeave={() => {
                                     // Close menu when mouse leaves the mega menu area
                                     setActiveDropdown(null);
                                     setActiveCategory(null);
                                 }}
                             >
                                 {renderMegaMenu(menuKey as keyof typeof megaMenuData)}
                             </div>
                         )}
                    </div>
                );
            })}
        </nav>
    );

    // Desktop mega menu rendering (unchanged)
    function renderMegaMenu(menuKey: keyof typeof megaMenuData) {
        const menuData = megaMenuData[menuKey];
        let currentContent: { subcategories?: { name: string; href: string }[]; featured?: { name: string; image: string; href: string }[] } | undefined;
        if ('content' in menuData) {
            currentContent = menuData.content[activeCategory as keyof typeof menuData.content] as {
                subcategories?: { name: string; href: string }[];
                featured?: { name: string; image: string; href: string }[];
            };
        }
        return (
            <div className="w-screen max-w-6xl mx-auto bg-white border border-gray-200 shadow-2xl text-sm relative z-[101]">
                <div className="grid grid-cols-12 min-h-[400px]">
                    {/* Left Column - Categories */}
                    <div className="col-span-3 bg-gray-50 border-r border-gray-200">
                        <div className="p-4">
                            <div className="space-y-1">
                                {menuData.categories.map((category) => {
                                    const isAddNew = category.id === 'newproject';
                                    return (
                                        <a
                                            key={category.id}
                                            href={category.href}
                                            onClick={(e) => {
                                                if (isAddNew) {
                                                    e.preventDefault();
                                                    window.dispatchEvent(new CustomEvent('open-myprojects'));
                                                }
                                            }}
                                            className={`flex items-center px-3 py-3 text-sm cursor-pointer transition-all duration-200 rounded-md ${activeCategory === category.id
                                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                            onMouseEnter={() => setActiveCategory(category.id)}
                                        >
                                            <span className="font-medium text-sm">{category.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Subcategories */}
                    <div className="col-span-5 border-r border-gray-200">
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2">
                                {currentContent?.subcategories?.map((subcategory: any, index: number) => {
                                    const isWorkMenu = menuKey === 'Work';
                                    const commonClasses = "px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-md transition-colors duration-150";
                                    if (isWorkMenu || !subcategory?.href) {
                                        return (
                                            <a
                                                key={index}
                                                href="#"
                                                onClick={(e) => e.preventDefault()}
                                                className={commonClasses}
                                            >
                                                {subcategory.name}
                                            </a>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={index}
                                            to={subcategory.href}
                                            className={commonClasses}
                                        >
                                            {subcategory.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Featured Items */}
                    <div className="col-span-4 bg-gray-50">
                        <div className="p-4">
                            <div className="space-y-4">
                                {currentContent?.featured?.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.href}
                                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-12 object-cover rounded-md"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Featured Product</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

