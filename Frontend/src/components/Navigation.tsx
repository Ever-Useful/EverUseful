import React, { useState, useEffect } from 'react';
import { FileCode2, UserCheck, FilePen, Users } from 'lucide-react'
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

// const navigationItems: NavigationItem[] = [
//     {
//         title: 'Marketplace',
//         href: '/marketplace',
//         items: [
//             { label: 'Find Project', href: '/', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//             { label: 'Upload Project', href: '/trending', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//         ]
//     },
//     {
//         title: 'Work',
//         href: '/freelancing',
//         items: [
//             { label: 'Find an Expert', href: '/fndexpert', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//             { label: 'My Dashboard', href: '/dashboard', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//             { label: 'My Profile', href: '/profile', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//         ]
//     },
//     {
//         title: 'Community',
//         href: '/connect',
//         items: [
//             { label: 'AI Agents', href: '/aiagents', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//             { label: 'Sustainable', href: '/green', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//         ]
//     },
//     {
//         title: 'About Us',
//         href: '/aboutus',
//         items: [
//             { label: 'Privacy Policy', href: '/privacypolicy', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//             { label: 'Terms of Service', href: '/termsofservice', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//             { label: 'Send Feedback', href: '/sendfeedback', description: '', icon: <FileCode2 className="w-5 h-5 text-blue-500" /> },
//         ]
//     }
// ];

// const DropdownMenu = ({ item, isOpen, onOpen, onClose }: {
//     item: NavigationItem;
//     isOpen: boolean;
//     onOpen: () => void;
//     onClose: () => void;
// }) => {
//     const ref = useRef<HTMLDivElement>(null);
//     const [position, setPosition] = useState<'left' | 'right'>('left');

//     useEffect(() => {
//         if (isOpen && ref.current) {
//             const rect = ref.current.getBoundingClientRect();
//             const wouldOverflow = rect.right > window.innerWidth;
//             setPosition(wouldOverflow ? 'right' : 'left');
//         }
//     }, [isOpen]);

//     return (
//         <div
//             className="relative"
//             onMouseEnter={onOpen}
//         >
//             <Link to={item.href}>
//                 <button
//                     className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
//                         } focus:ring-0 focus:ring-offset-0`}
//                 >
//                     {item.title}
//                 </button>
//             </Link>
//             {isOpen && (
//                 <div
//                     className="absolute right-0 w-[30vw] mt-2 bg-white/95 backdrop-blur-md border shadow-xl rounded-xl z-50"
//                     onMouseEnter={onOpen}
//                     onMouseLeave={onClose}
//                 >
//                     <div className="p-4">
//                         <div className="mb-3">
//                             <a className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1" href={item.href}>
//                                 {item.title}
//                             </a>
//                         </div>
//                         <div className="grid gap-2">
//                             {item.items.map((subItem, index) => (
//                                 <a
//                                     key={index}
//                                     href={subItem.href}
//                                     className="group flex items-center p-3 rounded-lg transition-all duration-150 hover:bg-blue-50"
//                                 >
//                                     <div className="w-8 h-8 flex items-center justify-center mr-3 text-blue-600">
//                                         <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
//                                             {subItem.icon}
//                                         </p>
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
//                                             {subItem.label}
//                                         </p>
//                                         <p className="text-xs text-gray-500 truncate">
//                                             {subItem.description || "Element description"}
//                                         </p>
//                                     </div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                     </svg>
//                                 </a>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

export default function Navigation() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('projects');
    
    const megaMenuData = {
        Marketplace: {
            categories: [
                { id: 'projects', label: 'Projects' },
                { id: 'research', label: 'Research Papers' },
                { id: 'datasets', label: 'Datasets' },
                { id: 'algorithms', label: 'Algorithms' },
                { id: 'models', label: 'AI Models' },
                { id: 'tools', label: 'Development Tools' },
                { id: 'templates', label: 'Templates' },
                { id: 'apis', label: 'APIs' },
            ],
            content: {
                projects: {
                    subcategories: [
                        'Machine Learning',
                        'Data Science',
                        'Web Development',
                        'Mobile Apps',
                        'IoT Projects',
                        'Blockchain',
                        'AR/VR',
                        'Game Development'
                    ],
                    featured: [
                        { name: 'TensorFlow Starter Kit', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=150&h=100&fit=crop' },
                        { name: 'React Dashboard Pro', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop' }
                    ]
                },
                research: {
                    subcategories: [
                        'Computer Science',
                        'Mathematics',
                        'Physics',
                        'Biology',
                        'Chemistry',
                        'Economics',
                        'Psychology',
                        'Engineering'
                    ],
                    featured: [
                        { name: 'Quantum Computing Papers', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&h=100&fit=crop' },
                        { name: 'AI Ethics Research', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=100&fit=crop' }
                    ]
                },
                datasets: {
                    subcategories: [
                        'Image Recognition',
                        'Natural Language',
                        'Time Series',
                        'Audio Processing',
                        'Geospatial Data',
                        'Financial Data',
                        'Healthcare Data',
                        'Social Media'
                    ],
                    featured: [
                        { name: 'ImageNet Dataset', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&h=100&fit=crop' },
                        { name: 'COVID-19 Research Data', image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=150&h=100&fit=crop' }
                    ]
                },
                algorithms: {
                    subcategories: [
                        'Sorting Algorithms',
                        'Graph Algorithms',
                        'Dynamic Programming',
                        'Machine Learning',
                        'Optimization',
                        'Cryptography',
                        'Image Processing',
                        'Search Algorithms'
                    ],
                    featured: [
                        { name: 'Advanced Sorting Suite', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=150&h=100&fit=crop' },
                        { name: 'ML Algorithm Library', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=100&fit=crop' }
                    ]
                },
                models: {
                    subcategories: [
                        'Language Models',
                        'Computer Vision',
                        'Reinforcement Learning',
                        'Generative Models',
                        'Classification',
                        'Regression',
                        'Clustering',
                        'Neural Networks'
                    ],
                    featured: [
                        { name: 'GPT-4 Fine-tuned', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=100&fit=crop' },
                        { name: 'YOLO Object Detection', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=100&fit=crop' }
                    ]
                },
                tools: {
                    subcategories: [
                        'IDEs & Editors',
                        'Version Control',
                        'Testing Frameworks',
                        'Deployment Tools',
                        'Monitoring',
                        'Documentation',
                        'Code Analysis',
                        'Performance Tools'
                    ],
                    featured: [
                        { name: 'Advanced Code Editor', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=100&fit=crop' },
                        { name: 'CI/CD Pipeline Tool', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=100&fit=crop' }
                    ]
                },
                templates: {
                    subcategories: [
                        'Web Templates',
                        'Mobile Templates',
                        'Documentation',
                        'Presentation',
                        'Email Templates',
                        'Dashboard',
                        'Landing Pages',
                        'Admin Panels'
                    ],
                    featured: [
                        { name: 'Modern Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop' },
                        { name: 'E-commerce Template', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=100&fit=crop' }
                    ]
                },
                apis: {
                    subcategories: [
                        'REST APIs',
                        'GraphQL',
                        'WebSocket',
                        'Payment APIs',
                        'Social Media',
                        'Cloud Services',
                        'Machine Learning',
                        'Data Analytics'
                    ],
                    featured: [
                        { name: 'Payment Gateway API', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=100&fit=crop' },
                        { name: 'ML Prediction API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=100&fit=crop' }
                    ]
                }
            }
        },
        Services: {
            categories: [
                { id: 'freelance', label: 'Freelance Hub' },
                { id: 'mentorship', label: 'Mentorship' },
                { id: 'consulting', label: 'Consulting' },
                { id: 'review', label: 'Project Review' },
            ],
            content: {
                freelance: {
                    subcategories: [
                        'Web Development',
                        'Mobile Development',
                        'Data Science',
                        'AI/ML Services',
                        'Design Services',
                        'Writing & Translation',
                        'Marketing',
                        'Business Strategy'
                    ],
                    featured: [
                        { name: 'Top Rated Developers', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=100&fit=crop' },
                        { name: 'Enterprise Solutions', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=100&fit=crop' }
                    ]
                },
                mentorship: {
                    subcategories: [
                        'Career Guidance',
                        'Technical Skills',
                        'Research Methods',
                        'PhD Support',
                        'Industry Transition',
                        'Startup Advice',
                        'Academic Writing',
                        'Grant Applications'
                    ],
                    featured: [
                        { name: 'PhD Mentorship Program', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=100&fit=crop' },
                        { name: 'Industry Expert Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop' }
                    ]
                },
                consulting: {
                    subcategories: [
                        'Technical Architecture',
                        'Strategy Planning',
                        'Digital Transformation',
                        'AI Implementation',
                        'Security Audit',
                        'Performance Optimization',
                        'Process Improvement',
                        'Technology Assessment'
                    ],
                    featured: [
                        { name: 'AI Strategy Consulting', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=100&fit=crop' },
                        { name: 'Tech Architecture Review', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=100&fit=crop' }
                    ]
                },
                review: {
                    subcategories: [
                        'Code Review',
                        'Architecture Review',
                        'Security Assessment',
                        'Performance Analysis',
                        'Best Practices',
                        'Documentation Review',
                        'Testing Strategy',
                        'Deployment Review'
                    ],
                    featured: [
                        { name: 'Expert Code Review', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=100&fit=crop' },
                        { name: 'Security Audit Service', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=150&h=100&fit=crop' }
                    ]
                }
            }
        },
        Sustainability: {
            categories: [
                { id: 'green-projects', label: 'Green Projects' },
                { id: 'impact', label: 'Impact Metrics' },
                { id: 'partnerships', label: 'Partnerships' },
                { id: 'stories', label: 'Success Stories' },
            ],
            content: {
                'green-projects': {
                    subcategories: [
                        'Renewable Energy',
                        'Carbon Tracking',
                        'Waste Management',
                        'Water Conservation',
                        'Sustainable Agriculture',
                        'Green Transportation',
                        'Eco-friendly Materials',
                        'Climate Monitoring'
                    ],
                    featured: [
                        { name: 'Solar Panel Optimizer', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=150&h=100&fit=crop' },
                        { name: 'Carbon Footprint Tracker', image: 'https://images.unsplash.com/photo-1569163139394-de44cb130c82?w=150&h=100&fit=crop' }
                    ]
                },
                impact: {
                    subcategories: [
                        'Carbon Emissions',
                        'Energy Savings',
                        'Waste Reduction',
                        'Water Usage',
                        'Biodiversity Index',
                        'Sustainability Score',
                        'ESG Metrics',
                        'Environmental ROI'
                    ],
                    featured: [
                        { name: 'Impact Dashboard Pro', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop' },
                        { name: 'ESG Reporting Tool', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=100&fit=crop' }
                    ]
                },
                partnerships: {
                    subcategories: [
                        'NGO Collaborations',
                        'Corporate Partners',
                        'Government Initiatives',
                        'Academic Alliances',
                        'Startup Incubators',
                        'Funding Opportunities',
                        'Policy Advocacy',
                        'Community Programs'
                    ],
                    featured: [
                        { name: 'Global Green Alliance', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=100&fit=crop' },
                        { name: 'Sustainability Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop' }
                    ]
                },
                stories: {
                    subcategories: [
                        'Case Studies',
                        'Impact Stories',
                        'Innovation Spotlights',
                        'Award Winners',
                        'Community Heroes',
                        'Breakthrough Projects',
                        'Global Initiatives',
                        'Future Visions'
                    ],
                    featured: [
                        { name: 'Clean Energy Success', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=150&h=100&fit=crop' },
                        { name: 'Ocean Cleanup Project', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=100&fit=crop' }
                    ]
                }
            }
        },
        Resources: {
            categories: [
                { id: 'docs', label: 'Documentation' },
                { id: 'tutorials', label: 'Tutorials' },
                { id: 'community', label: 'Community' },
                { id: 'support', label: 'Support' },
            ],
            content: {
                docs: {
                    subcategories: [
                        'API Documentation',
                        'Getting Started',
                        'Best Practices',
                        'Architecture Guides',
                        'Integration Guides',
                        'Troubleshooting',
                        'FAQ',
                        'Release Notes'
                    ],
                    featured: [
                        { name: 'Complete API Guide', image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=150&h=100&fit=crop' },
                        { name: 'Integration Handbook', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&h=100&fit=crop' }
                    ]
                },
                tutorials: {
                    subcategories: [
                        'Beginner Tutorials',
                        'Advanced Techniques',
                        'Video Courses',
                        'Interactive Labs',
                        'Code Examples',
                        'Project Walkthroughs',
                        'Live Workshops',
                        'Certification Prep'
                    ],
                    featured: [
                        { name: 'ML Mastery Course', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=100&fit=crop' },
                        { name: 'Web Dev Bootcamp', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=100&fit=crop' }
                    ]
                },
                community: {
                    subcategories: [
                        'Discussion Forums',
                        'Slack Channels',
                        'Discord Server',
                        'Local Meetups',
                        'Study Groups',
                        'Peer Reviews',
                        'Collaboration Hub',
                        'Events Calendar'
                    ],
                    featured: [
                        { name: 'Global Developer Network', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=100&fit=crop' },
                        { name: 'Monthly Tech Meetup', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&h=100&fit=crop' }
                    ]
                },
                support: {
                    subcategories: [
                        'Technical Support',
                        'Account Help',
                        'Billing Support',
                        'Bug Reports',
                        'Feature Requests',
                        'Priority Support',
                        'Enterprise Support',
                        'Training Services'
                    ],
                    featured: [
                        { name: '24/7 Expert Support', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=150&h=100&fit=crop' },
                        { name: 'Premium Support Plan', image: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=150&h=100&fit=crop' }
                    ]
                }
            }
        }
    };

    const renderMegaMenu = (menuKey: keyof typeof megaMenuData) => {
        const menuData = megaMenuData[menuKey];
        const currentContent = menuData.content[activeCategory as keyof typeof menuData.content] as {
            subcategories?: string[];
            featured?: { name: string; image: string }[];
        };

        return (
            <div className="w-screen max-w-6xl mx-auto bg-white border border-gray-200 shadow-2xl">
                <div className="grid grid-cols-12 min-h-[400px]">
                    {/* Left Column - Categories */}
                    <div className="col-span-3 bg-gray-50 border-r border-gray-200">
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Categories
                            </h3>
                            <div className="space-y-1">
                                {menuData.categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`flex items-center px-3 py-3 text-sm cursor-pointer transition-all duration-200 rounded-md ${activeCategory === category.id
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        onMouseEnter={() => setActiveCategory(category.id)}
                                    >
                                        <span className="font-medium">{category.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Subcategories */}
                    <div className="col-span-5 border-r border-gray-200">
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Subcategories
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {currentContent?.subcategories?.map((subcategory, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-md transition-colors duration-150"
                                    >
                                        {subcategory}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Featured Items */}
                    <div className="col-span-4 bg-gray-50">
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Featured
                            </h3>
                            <div className="space-y-4">
                                {currentContent?.featured?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-12 object-cover rounded-md"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Featured Product</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <nav className="hidden md:flex items-center space-x-1">
            {Object.keys(megaMenuData).map((menuKey) => {
                const isOpen = activeDropdown === menuKey;
                return (
                    <div
                        key={menuKey}
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(menuKey)}
                        // onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <Button
                            variant="ghost"
                            className={`relative px-6 py-2 text-sm font-medium transition-all duration-200 hover:bg-transparent hover:text-gray-900 text-gray-700 ${isOpen ? 'text-blue-700' : ''}`}
                            onMouseEnter={() => setActiveCategory('projects')}
                        >
                            {menuKey}
                        </Button>
                        {isOpen && (
                            <div
                                className="fixed left-1/2 top-14 z-50 w-[90vw] max-w-6xl p-0 border-0 shadow-none bg-transparent -translate-x-1/2 rounded-lg"
                                onMouseEnter={() => setActiveDropdown(menuKey)}
                                onMouseLeave={() => setActiveDropdown(null)}
                                style={{ pointerEvents: 'auto' }}
                            >
                                {renderMegaMenu(menuKey as keyof typeof megaMenuData)}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

