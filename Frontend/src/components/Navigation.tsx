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
                        { name: 'AI & ML', href: '/marketplace' },
                        { name: 'Data Science', href: '/marketplace' },
                        { name: 'Sustainable', href: '/sustainable' },
                        { name: 'FinTech', href: '/marketplace' },
                        { name: 'HealthTech', href: '/marketplacelth' },
                        { name: 'EdTech', href: '/marketplace' },
                        { name: 'IoT', href: '/marketplace' },
                        { name: 'BlockChain', href: '/marketplace' },
                        { name: 'Mobile', href: '/marketplace' }
                    ],
                    featured: [
                        { name: 'TensorFlow Starter Kit', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=150&h=100&fit=crop', href: '/product/tensorflow-starter' },
                        { name: 'React Dashboard Pro', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop', href: '/product/react-dashboard' }
                    ]
                },
                // research: {
                //     subcategories: [
                //         { name: 'Computer Science', href: '/marketplace/research/computer-science' },
                //         { name: 'Mathematics', href: '/marketplace/research/mathematics' },
                //         { name: 'Physics', href: '/marketplace/research/physics' },
                //         { name: 'Biology', href: '/marketplace/research/biology' },
                //         { name: 'Chemistry', href: '/marketplace/research/chemistry' },
                //         { name: 'Economics', href: '/marketplace/research/economics' },
                //         { name: 'Psychology', href: '/marketplace/research/psychology' },
                //         { name: 'Engineering', href: '/marketplace/research/engineering' }
                //     ],
                //     featured: [
                //         { name: 'Quantum Computing Papers', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&h=100&fit=crop', href: '/product/quantum-computing-papers' },
                //         { name: 'AI Ethics Research', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=100&fit=crop', href: '/product/ai-ethics-research' }
                //     ]
                // },
                // datasets: {
                //     subcategories: [
                //         { name: 'Image Recognition', href: '/marketplace/datasets/image-recognition' },
                //         { name: 'Natural Language', href: '/marketplace/datasets/natural-language' },
                //         { name: 'Time Series', href: '/marketplace/datasets/time-series' },
                //         { name: 'Audio Processing', href: '/marketplace/datasets/audio-processing' },
                //         { name: 'Geospatial Data', href: '/marketplace/datasets/geospatial' },
                //         { name: 'Financial Data', href: '/marketplace/datasets/financial' },
                //         { name: 'Healthcare Data', href: '/marketplace/datasets/healthcare' },
                //         { name: 'Social Media', href: '/marketplace/datasets/social-media' }
                //     ],
                //     featured: [
                //         { name: 'ImageNet Dataset', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&h=100&fit=crop', href: '/product/imagenet-dataset' },
                //         { name: 'COVID-19 Research Data', image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=150&h=100&fit=crop', href: '/product/covid19-data' }
                //     ]
                // },
                // algorithms: {
                //     subcategories: [
                //         { name: 'Sorting Algorithms', href: '/marketplace/algorithms/sorting' },
                //         { name: 'Graph Algorithms', href: '/marketplace/algorithms/graph' },
                //         { name: 'Dynamic Programming', href: '/marketplace/algorithms/dynamic-programming' },
                //         { name: 'Machine Learning', href: '/marketplace/algorithms/machine-learning' },
                //         { name: 'Optimization', href: '/marketplace/algorithms/optimization' },
                //         { name: 'Cryptography', href: '/marketplace/algorithms/cryptography' },
                //         { name: 'Image Processing', href: '/marketplace/algorithms/image-processing' },
                //         { name: 'Search Algorithms', href: '/marketplace/algorithms/search' }
                //     ],
                //     featured: [
                //         { name: 'Advanced Sorting Suite', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=150&h=100&fit=crop', href: '/product/sorting-suite' },
                //         { name: 'ML Algorithm Library', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=100&fit=crop', href: '/product/ml-library' }
                //     ]
                // },
                // models: {
                //     subcategories: [
                //         { name: 'Language Models', href: '/marketplace/models/language' },
                //         { name: 'Computer Vision', href: '/marketplace/models/computer-vision' },
                //         { name: 'Reinforcement Learning', href: '/marketplace/models/reinforcement-learning' },
                //         { name: 'Generative Models', href: '/marketplace/models/generative' },
                //         { name: 'Classification', href: '/marketplace/models/classification' },
                //         { name: 'Regression', href: '/marketplace/models/regression' },
                //         { name: 'Clustering', href: '/marketplace/models/clustering' },
                //         { name: 'Neural Networks', href: '/marketplace/models/neural-networks' }
                //     ],
                //     featured: [
                //         { name: 'GPT-4 Fine-tuned', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=100&fit=crop', href: '/product/gpt4-finetuned' },
                //         { name: 'YOLO Object Detection', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=100&fit=crop', href: '/product/yolo-detection' }
                //     ]
                // },
                // tools: {
                //     subcategories: [
                //         { name: 'IDEs & Editors', href: '/marketplace/tools/ides' },
                //         { name: 'Version Control', href: '/marketplace/tools/version-control' },
                //         { name: 'Testing Frameworks', href: '/marketplace/tools/testing' },
                //         { name: 'Deployment Tools', href: '/marketplace/tools/deployment' },
                //         { name: 'Monitoring', href: '/marketplace/tools/monitoring' },
                //         { name: 'Documentation', href: '/marketplace/tools/documentation' },
                //         { name: 'Code Analysis', href: '/marketplace/tools/code-analysis' },
                //         { name: 'Performance Tools', href: '/marketplace/tools/performance' }
                //     ],
                //     featured: [
                //         { name: 'Advanced Code Editor', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=100&fit=crop', href: '/product/code-editor' },
                //         { name: 'CI/CD Pipeline Tool', image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=100&fit=crop', href: '/product/cicd-tool' }
                //     ]
                // },
                // templates: {
                //     subcategories: [
                //         { name: 'Web Templates', href: '/marketplace/templates/web' },
                //         { name: 'Mobile Templates', href: '/marketplace/templates/mobile' },
                //         { name: 'Documentation', href: '/marketplace/templates/documentation' },
                //         { name: 'Presentation', href: '/marketplace/templates/presentation' },
                //         { name: 'Email Templates', href: '/marketplace/templates/email' },
                //         { name: 'Dashboard', href: '/marketplace/templates/dashboard' },
                //         { name: 'Landing Pages', href: '/marketplace/templates/landing' },
                //         { name: 'Admin Panels', href: '/marketplace/templates/admin' }
                //     ],
                //     featured: [
                //         { name: 'Modern Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop', href: '/product/dashboard-template' },
                //         { name: 'E-commerce Template', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=100&fit=crop', href: '/product/ecommerce-template' }
                //     ]
                // },
                // apis: {
                //     subcategories: [
                //         { name: 'REST APIs', href: '/marketplace/apis/rest' },
                //         { name: 'GraphQL', href: '/marketplace/apis/graphql' },
                //         { name: 'WebSocket', href: '/marketplace/apis/websocket' },
                //         { name: 'Payment APIs', href: '/marketplace/apis/payment' },
                //         { name: 'Social Media', href: '/marketplace/apis/social-media' },
                //         { name: 'Cloud Services', href: '/marketplace/apis/cloud' },
                //         { name: 'Machine Learning', href: '/marketplace/apis/machine-learning' },
                //         { name: 'Data Analytics', href: '/marketplace/apis/analytics' }
                //     ],
                //     featured: [
                //         { name: 'Payment Gateway API', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=100&fit=crop', href: '/product/payment-api' },
                //         { name: 'ML Prediction API', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=100&fit=crop', href: '/product/ml-prediction-api' }
                //     ]
                // }
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
                // { id: 'review', label: 'Project Review', href: '/services/review' },
                // { id: 'impact', label: 'Impact Metrics', href: '/' },
                { id: 'agents', label: 'AI Agents', href: '/aiagents' },
            ],
            content: {
                greenprojects: {
                    subcategories: [
                        { name: 'Renewable Energy', href: '/sustainable/category/renewable-energy' },
                        { name: 'Carbon Tracking', href: '/sustainable/category/carbon-tracking' },
                        { name: 'Waste Management', href: '/sustainable/category/waste-management' },
                        { name: 'Water Conservation', href: '/sustainable/category/water-conservation' },
                        { name: 'Sustainable Agriculture', href: '/sustainable/category/agriculture' },
                        { name: 'Green Transportation', href: '/sustainable/category/transportation' },
                        { name: 'Eco-friendly Materials', href: '/sustainable/category/eco-materials' },
                        { name: 'Climate Monitoring', href: '/sustainable/category/climate-monitoring' }
                    ],
                    featured: [
                        { name: 'Solar Panel Optimizer', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=150&h=100&fit=crop', href: '/product/solar-optimizer' },
                        { name: 'Carbon Footprint Tracker', image: 'https://images.unsplash.com/photo-1569163139394-de44cb130c82?w=150&h=100&fit=crop', href: '/product/carbon-tracker' }
                    ]
                },
                consulting: {
                    subcategories: [
                        { name: 'Technical Architecture', href: '/consulting/technical-architecture' },
                        { name: 'Strategy Planning', href: '/consulting/strategy-planning' },
                        { name: 'Digital Transformation', href: '/consulting/digital-transformation' },
                        { name: 'AI Implementation', href: '/consulting/ai-implementation' },
                        { name: 'Security Audit', href: '/consulting/security-audit' },
                        { name: 'Performance Optimization', href: '/consulting/performance-optimization' },
                        { name: 'Process Improvement', href: '/consulting/process-improvement' },
                        { name: 'Technology Assessment', href: '/consulting/technology-assessment' }
                    ],
                    featured: [
                        { name: 'Impact Dashboard Pro', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=100&fit=crop', href: '/product/impact-dashboard' },
                        { name: 'ESG Reporting Tool', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=100&fit=crop', href: '/product/esg-reporting' }
                    ]
                },
                // review: {
                //     subcategories: [
                //         { name: 'Code Review', href: '/services/review/code' },
                //         { name: 'Architecture Review', href: '/services/review/architecture' },
                //         { name: 'Security Assessment', href: '/services/review/security' },
                //         { name: 'Performance Analysis', href: '/services/review/performance' },
                //         { name: 'Best Practices', href: '/services/review/best-practices' },
                //         { name: 'Documentation Review', href: '/services/review/documentation' },
                //         { name: 'Testing Strategy', href: '/services/review/testing' },
                //         { name: 'Deployment Review', href: '/services/review/deployment' }
                //     ],
                //     featured: [
                //         { name: 'Global Green Alliance', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=100&fit=crop', href: '/partnerships/green-alliance' },
                //         { name: 'Sustainability Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop', href: '/partnerships/sustainability-network' }
                //     ]
                // },
                // impact: {
                //     subcategories: [
                //         { name: 'Carbon Emissions', href: '/sustainable/impact/carbon-emissions' },
                //         { name: 'Energy Savings', href: '/sustainable/impact/energy-savings' },
                //         { name: 'Waste Reduction', href: '/sustainable/impact/waste-reduction' },
                //         { name: 'Water Usage', href: '/sustainable/impact/water-usage' },
                //         { name: 'Biodiversity Index', href: '/sustainable/impact/biodiversity' },
                //         { name: 'Sustainability Score', href: '/sustainable/impact/sustainability-score' },
                //         { name: 'ESG Metrics', href: '/sustainable/impact/esg-metrics' },
                //         { name: 'Environmental ROI', href: '/sustainable/impact/environmental-roi' }
                //     ],
                //     featured: [
                //         { name: 'Global Green Alliance', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=100&fit=crop', href: '/partnerships/green-alliance' },
                //         { name: 'Sustainability Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop', href: '/partnerships/sustainability-network' }
                //     ]
                // },
                agents: {
                    subcategories: [
                        { name: 'Agent Directories', href: '/aiagents' },
                        { name: 'Agent Studio', href: '/aiagents' },
                        { name: 'Custom Agents', href: '/aiagents' },
                        { name: 'Integrations', href: '/aiagents' },
                        { name: 'Analytics', href: '/aiagents' },
                        { name: 'Use Cases', href: '/aiagents' },
                        { name: 'Ethics & Safety', href: '/aiagents' },
                    ],
                    featured: [
                        { name: 'Global Green Alliance', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=100&fit=crop', href: '/partnerships/green-alliance' },
                        { name: 'Sustainability Network', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=100&fit=crop', href: '/partnerships/sustainability-network' }
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
                        { name: 'Platform', href: '/aboutus' },
                        { name: 'Stories', href: '/aboutus#stroies' },
                        { name: 'Team', href: '/aboutus#team' },
                        { name: 'Community', href: '/aboutus' },
                    ],
                    featured: [
                        { name: 'Complete API Guide', image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=150&h=100&fit=crop', href: '/resources/docs/api-guide' },
                        { name: 'Integration Handbook', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&h=100&fit=crop', href: '/resources/docs/integration-handbook' }
                    ]
                },
                connect: {
                    subcategories: [
                        { name: 'Community Hub', href: '/connect' },
                        { name: 'Events and Webinars', href: '/connect' },
                        { name: 'Collab Spaces', href: '/connect' },
                        { name: 'Mentorship', href: '/connect' },
                        { name: 'Partner Network', href: '/connect' },
                        { name: 'Showcase', href: '/connect' },
                    ],
                    featured: [
                        { name: 'ML Mastery Course', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=100&fit=crop', href: '/resources/tutorials/ml-mastery' },
                        { name: 'Web Dev Bootcamp', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=100&fit=crop', href: '/resources/tutorials/web-bootcamp' }
                    ]
                },
                legal: {
                    subcategories: [
                        { name: 'Privacy Policy', href: '/privacy-policy' },
                        { name: 'Cookie Policy', href: '/cookie-policy' },
                        { name: 'Refund Policy', href: '/refund-policy' },
                        { name: 'Accessibility', href: '/accessibility' },
                        { name: 'Delivery Policy', href: '/delivery-policy' },
                        { name: 'GDPR Compliance', href: '/sustainable#' },
                        { name: 'Security Practices', href: '/sustainable#' },
                    ],
                    featured: [
                        { name: 'Global Developer Network', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=100&fit=crop', href: '/connect/global-network' },
                        { name: 'Monthly Tech Meetup', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&h=100&fit=crop', href: '/connect/monthly-meetup' }
                    ]
                },
                feedback: {
                    subcategories: [
                        { name: 'Submit Feedback', href: '/feedback' },
                        { name: 'Feature Requests', href: '/feedback' },
                        { name: 'Bug Reports', href: '/feedback' },
                        { name: 'User Ratings', href: '/feedback' },
                        { name: 'Community Polls', href: '/feedback' },
                        { name: 'Feedback Dashboard', href: '/feedback' },
                        { name: 'Response Timeline', href: '/feedback' },
                        { name: 'Give Kudos', href: '/feedback' }
                    ],
                    featured: [
                        { name: '24/7 Expert Support', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=150&h=100&fit=crop', href: '/support/24-7' },
                        { name: 'Premium Support Plan', image: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=150&h=100&fit=crop', href: '/support/premium' }
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
                                {menuData.categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={category.href}
                                        className={`flex items-center px-3 py-3 text-sm cursor-pointer transition-all duration-200 rounded-md ${activeCategory === category.id
                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        onMouseEnter={() => setActiveCategory(category.id)}
                                    >
                                        <span className="font-medium text-sm">{category.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Subcategories */}
                    <div className="col-span-5 border-r border-gray-200">
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2">
                                {currentContent?.subcategories?.map((subcategory, index) => (
                                    <Link
                                        key={index}
                                        to={subcategory.href}
                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-md transition-colors duration-150"
                                    >
                                        {subcategory.name}
                                    </Link>
                                ))}
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

