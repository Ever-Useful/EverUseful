import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { ArrowUpDown, Star, Users, TrendingUp, Globe, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import noUserProfile from "../assets/images/no user profile.png";
import ctaMeshBg from "../assets/images/cta-mesh-bg.svg";
import { API_ENDPOINTS } from '../config/api';
import { getUserAvatarUrl } from '@/utils/s3ImageUtils';
import freelancerImage from "../assets/images/freelancer.jpg";

// HERO SECTION DATA
const heroFeatures = [
  { text: "Research Guidance", color: "bg-yellow-200 text-yellow-800" },
  { text: "Global Collaboration", color: "bg-green-100 text-green-800" },
  { text: "Peer-Reviewed Experts", color: "bg-blue-100 text-blue-800" },
  { text: "Custom R&D Solutions", color: "bg-purple-100 text-purple-800" },
  { text: "Secure & Transparent", color: "bg-pink-100 text-pink-800" },
];

// POPULAR SKILLS DATA (NEW)
const popularSkills = [
  { name: "Machine Learning", icon: "🤖", count: "2.3k+ experts", color: "bg-blue-50 border-blue-200" },
  { name: "Data Science", icon: "📊", count: "1.8k+ experts", color: "bg-green-50 border-green-200" },
  { name: "AI Research", icon: "🧠", count: "1.5k+ experts", color: "bg-purple-50 border-purple-200" },
  { name: "Biotechnology", icon: "🧬", count: "950+ experts", color: "bg-pink-50 border-pink-200" },
  { name: "Quantum Computing", icon: "⚛️", count: "320+ experts", color: "bg-indigo-50 border-indigo-200" },
  { name: "Blockchain", icon: "🔗", count: "780+ experts", color: "bg-orange-50 border-orange-200" },
  { name: "Cybersecurity", icon: "🔒", count: "1.2k+ experts", color: "bg-red-50 border-red-200" },
  { name: "Robotics", icon: "🤖", count: "650+ experts", color: "bg-gray-50 border-gray-200" },
];

// FEATURED CATEGORIES DATA (NEW)
const featuredCategories = [
  {
    title: "Research & Development",
    description: "Cutting-edge research projects and innovation consulting",
    icon: "🔬",
    experts: "3.2k+",
    projects: "12.5k+",
    color: "from-blue-500 to-purple-600",
  },
  {
    title: "Academic Mentorship",
    description: "PhD-level guidance for students and researchers",
    icon: "🎓",
    experts: "2.8k+",
    projects: "8.9k+",
    color: "from-green-500 to-teal-600",
  },
  {
    title: "Industry Consulting",
    description: "Expert consultation for business and technology",
    icon: "💼",
    experts: "1.9k+",
    projects: "15.2k+",
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Technical Writing",
    description: "Research papers, documentation, and technical content",
    icon: "✍️",
    experts: "1.5k+",
    projects: "6.7k+",
    color: "from-purple-500 to-pink-600",
  },
];

// CLIENT TESTIMONIALS DATA (NEW)
const clientTestimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Research Director",
    company: "TechCorp Labs",
    content: "The PhD experts on this platform helped us develop breakthrough algorithms that reduced our processing time by 60%. Exceptional quality and professionalism.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    company: "InnovateAI",
    content: "Found the perfect AI researcher for our startup. The collaboration was seamless, and the results exceeded our expectations. Highly recommended!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Dr. Elena Rodriguez",
    role: "University Professor",
    company: "MIT",
    content: "As an academic, I needed specialized expertise for my research. The platform connected me with brilliant minds from around the world.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
  },
];

// PRICING PLANS DATA (NEW)
const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for exploring the platform",
    features: [
      "Browse expert profiles",
      "Post project requirements",
      "Basic messaging",
      "Standard support",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
            price: "₹29",
    period: "/month",
    description: "For serious research projects",
    features: [
      "Everything in Basic",
      "Priority expert matching",
      "Advanced project tools",
      "Priority support",
      "Analytics dashboard",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "Team collaboration tools",
      "Advanced security features",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

// WHY UNIQUE DATA
const uniquePoints = [
  {
    title: "Peer-Reviewed PhD Talent",
    description:
      "Work with rigorously verified PhD scholars and graduates, ensuring world-class expertise and research integrity for your projects.",
    color: "bg-orange-50",
    icon: (
      <svg className="w-7 h-7 text-[#fa5954]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Tailored R&D Solutions",
    description:
      "Access custom research and development solutions, from academic research to industry innovation, designed for your unique challenges.",
    color: "bg-red-50",
    icon: (
      <svg className="w-7 h-7 text-[#e0514d]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2l4-4" />
      </svg>
    ),
  },
  {
    title: "Global Collaboration",
    description:
      "Collaborate with PhD experts from top universities and research institutions worldwide. Break boundaries and accelerate innovation.",
    color: "bg-blue-50",
    icon: (
      <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
      </svg>
    ),
  },
  {
    title: "Transparent, Secure Platform",
    description:
      "Enjoy clear pricing, secure transactions, and dedicated support—ensuring a seamless, trustworthy experience for both clients and mentors.",
    color: "bg-yellow-50",
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

// SUCCESS STORIES DATA
const stories = [
  {
    name: "Dr. Ayesha Khan",
    country: "🇬🇧",
    title: "AI for Healthcare",
    desc: "Helped a European startup develop an AI-driven diagnostic tool, resulting in a 30% faster diagnosis rate.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    color: "bg-orange-100",
    impact: "30% faster diagnosis",
  },
  {
    name: "Dr. Marco Rossi",
    country: "🇮🇹",
    title: "Materials Science Innovation",
    desc: "Guided a US-based R&D team to patent a new eco-friendly composite material.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    color: "bg-red-100",
    impact: "Patent granted",
  },
  {
    name: "Dr. Li Wei",
    country: "🇨🇳",
    title: "Quantum Computing Mentorship",
    desc: "Mentored graduate students worldwide, leading to 5+ published papers in top journals.",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    color: "bg-blue-100",
    impact: "5+ papers published",
  },
  {
    name: "Dr. Sophia Müller",
    country: "🇩🇪",
    title: "Biotech Startup Success",
            desc: "Helped a biotech startup secure ₹2M in funding through research-backed proposals.",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    color: "bg-green-100",
            impact: "₹2M funding",
  },
  {
    name: "Dr. Ahmed El-Sayed",
    country: "🇪🇬",
    title: "Renewable Energy Consulting",
    desc: "Consulted for African governments on solar grid deployment, improving access for 100k+ people.",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
    color: "bg-yellow-100",
    impact: "100k+ people reached",
  },
  {
    name: "Dr. Maria Garcia",
    country: "🇪🇸",
    title: "Global Education Impact",
    desc: "Designed an online curriculum for Latin American universities, reaching 10,000+ students.",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    color: "bg-purple-100",
    impact: "10k+ students taught",
  },
  {
    name: "Dr. James Chen",
    country: "🇺🇸",
    title: "M L Breakthrough",
    desc: "Developed an advanced ML algorithm that improved prediction accuracy by 45% for a Fortune 500 company.",
    img: "https://randomuser.me/api/portraits/men/28.jpg",
    color: "bg-indigo-100",
    impact: "45% better accuracy",
  },
  {
    name: "Dr. Elena Petrova",
    country: "🇷🇺",
    title: "Climate Research Leadership",
    desc: "Led international climate research team, publishing findings that influenced policy in 15 countries.",
    img: "https://randomuser.me/api/portraits/women/33.jpg",
    color: "bg-teal-100",
    impact: "15 countries influenced",
  },
  {
    name: "Dr. Rajesh Kumar",
    country: "🇮🇳",
    title: "Digital Transformation Expert",
    desc: "Transformed traditional manufacturing processes for 50+ companies using IoT and AI technologies.",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    color: "bg-cyan-100",
    impact: "50+ companies transformed",
  },
  {
    name: "Dr. Sarah Johnson",
    country: "🇨🇦",
    title: "Sustainable Development",
    desc: "Designed sustainable urban planning solutions that reduced carbon emissions by 60% in major cities.",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    color: "bg-emerald-100",
    impact: "60% emissions reduction",
  },
  {
    name: "Dr. Carlos Rodriguez",
    country: "🇲🇽",
    title: "Agricultural Innovation",
    desc: "Developed smart farming solutions that increased crop yields by 75% for small-scale farmers.",
    img: "https://randomuser.me/api/portraits/men/67.jpg",
    color: "bg-lime-100",
    impact: "75% yield increase",
  },
  {
    name: "Dr. Yuki Tanaka",
    country: "🇯🇵",
    title: "Robotics & Automation",
    desc: "Created advanced robotics systems that improved manufacturing efficiency by 80% for automotive industry.",
    img: "https://randomuser.me/api/portraits/women/78.jpg",
    color: "bg-rose-100",
    impact: "80% efficiency gain",
  },
  {
    name: "Dr. Pierre Dubois",
    country: "🇫🇷",
    title: "Aerospace Engineering",
    desc: "Led development of lightweight materials for aerospace applications, reducing fuel consumption by 25%.",
    img: "https://randomuser.me/api/portraits/men/89.jpg",
    color: "bg-sky-100",
    impact: "25% fuel reduction",
  },
  {
    name: "Dr. Anna Kowalski",
    country: "🇵🇱",
    title: "Cybersecurity Innovation",
    desc: "Developed next-generation cybersecurity protocols protecting over 1 million users from cyber threats.",
    img: "https://randomuser.me/api/portraits/women/90.jpg",
    color: "bg-violet-100",
    impact: "1M+ users protected",
  },
  {
    name: "Dr. Miguel Santos",
    country: "🇧🇷",
    title: "Biomedical Engineering",
    desc: "Invented medical devices that improved patient recovery rates by 40% in clinical trials.",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    color: "bg-amber-100",
    impact: "40% recovery improvement",
  },
];

// SLIDER SETTINGS
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 900,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  autoplaySpeed: 3200,
  cssEase: "cubic-bezier(0.4,0,0.2,1)",
  pauseOnHover: true,
  swipeToSlide: true,
  touchMove: true,
  rtl: false,
  responsive: [
    {
      breakpoint: 1536,
      settings: { slidesToShow: 4 },
    },
    {
      breakpoint: 1280,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 900,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 1 },
    },
  ],
};

const cardFixedHeight = 320; // px

// FRAMER MOTION ANIMATIONS
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// HOW IT WORKS DATA (NEW, OPTIMIZED)
const steps = [
  {
    title: "Describe Your Need",
    desc: "Tell us about your research, project, or mentorship requirement. The more details, the better!",
    icon: (
      <svg width="44" height="44" fill="none" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#ECFDF5" />
        <path d="M14 22h16M22 14v16" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    color: "from-[#34D399] to-[#A7F3D0]",
  },
  {
    title: "Match with PhD Experts",
    desc: "We'll instantly recommend top PhD mentors and consultants tailored to your topic.",
    icon: (
      <svg width="44" height="44" fill="none" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#EFF6FF" />
        <path d="M22 16a6 6 0 100 12 6 6 0 000-12z" stroke="#3B82F6" strokeWidth="2.5" />
        <path d="M22 28v4" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    color: "from-[#3B82F6] to-[#DBEAFE]",
  },
  {
    title: "Collaborate Securely",
    desc: "Chat, share files, and track progress—all on our secure, transparent platform.",
    icon: (
      <svg width="44" height="44" fill="none" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#FEF3C7" />
        <rect x="15" y="17" width="14" height="10" rx="3" stroke="#FBBF24" strokeWidth="2.5" />
        <path d="M19 21h6" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    color: "from-[#FBBF24] to-[#FDE68A]",
  },
  {
    title: "Achieve & Review",
    desc: "Complete your project, rate your experience, and grow your professional network.",
    icon: (
      <svg width="44" height="44" fill="none" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="#F3F0FF" />
        <path d="M17 27l5-5 5 5" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 17v10" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    color: "from-[#8B5CF6] to-[#DDD6FE]",
  },
];

// Animation variants for steps
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};
const stepVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.38, duration: 0.8 } },
};
const orbPulse = {
  animate: {
    boxShadow: [
      "0 0 0 0 #fa595455",
      "0 0 0 12px #fa595400",
      "0 0 0 0 #fa595455"
    ],
    transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
  }
};

const Work: React.FC = () => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([0, 1, 2, 3, 4]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentHowItWorksSlide, setCurrentHowItWorksSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  
  // Auto-sliding functionality
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (isPaused) return;
    
    const totalSlides = stories.length - 4; // Show 5 cards, so total slides = total stories - 4
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [stories.length, isPaused]);

  // Auto-sliding for How It Works section
  useEffect(() => {
    if (isPaused) return;
    
    const totalSlides = steps.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    const interval = setInterval(() => {
      setCurrentHowItWorksSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [steps.length, isPaused]);
  const [filters, setFilters] = useState({});
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showCount, setShowCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USERS + "/all");
      if (!response.ok) {
        throw new Error('Failed to fetch freelancers');
      }
      const data = await response.json();
      console.log('Freelancing - Fetched users data:', data);
      
      // Handle different response structures
      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data && Array.isArray(data.users)) {
        users = data.users;
      } else if (data && Array.isArray(data.data)) {
        users = data.data;
      } else {
        console.warn('Unexpected response structure:', data);
        users = [];
      }
      
      setFreelancers(users);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
      setError('Failed to load freelancers');
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  // Update visible indexes on slide change
  const handleBeforeChange = (_: number, next: number) => {
    const slidesToShow = sliderSettings.slidesToShow as number;
    const newIndexes: number[] = [];
    for (let i = 0; i < slidesToShow; i++) {
      newIndexes.push((next + i) % stories.length);
    }
    setVisibleIndexes(newIndexes);
  };

  // Fetch all users and filter for freelancers
  useEffect(() => {
    fetchFreelancers();
  }, []);

  // Filtering and sorting
  useEffect(() => {
    let result = freelancers || [];
    
    // Ensure result is always an array
    if (!Array.isArray(result)) {
      console.warn('Freelancers data is not an array:', result);
      result = [];
    }
    
    // Filter for freelancers only
    result = result.filter((f) => {
      const userType = f.auth?.userType || f.profile?.userType || '';
      return userType.toLowerCase().includes('freelancer');
    });
    
    if (skillFilter) {
      result = result.filter((f) => {
        const skills = f.skills || [];
        return Array.isArray(skills) && skills.some((s: string) => s.toLowerCase().includes(skillFilter.toLowerCase()));
      });
    }
    if (locationFilter) {
      result = result.filter((f) => (f.profile?.location || "").toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (search) {
      result = result.filter((f) =>
        (f.profile?.firstName + " " + f.profile?.lastName).toLowerCase().includes(search.toLowerCase()) ||
        (f.profile?.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (f.skills || []).some((s: any) => (typeof s === 'string' ? s : s.name).toLowerCase().includes(search.toLowerCase()))
      );
    }
    // Sort
    if (sortBy === "rating") {
      result = result.slice().sort((a, b) => (b.stats?.rating || 4.5) - (a.stats?.rating || 4.5));
    } else if (sortBy === "projects") {
      result = result.slice().sort((a, b) => (b.stats?.projectsCount || 0) - (a.stats?.projectsCount || 0));
    }
    setFiltered(result);
  }, [freelancers, skillFilter, locationFilter, search, sortBy]);

  return (
    <main className="w-full min-h-screen bg-white">
    <Header />
    {/* HERO SECTION */}
    <section className="relative py-16 sm:py-20 px-4 lg:px-8 min-h-[70vh] sm:min-h-[80vh] flex items-center overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content Area */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
            className="space-y-8"
        >
          {/* Badge */}
          <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full border border-blue-200 shadow-sm"
            variants={fadeUp}
            custom={1}
          >
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 text-sm font-semibold">World-Class PhD Experts</span>
          </motion.div>

            {/* Main Headline */}
          <motion.h1
              className="text-4xl font-bold text-slate-900 leading-tight"
            variants={fadeUp}
            custom={2}
          >
              Connect with World-Class <span className="text-[#fa5954]">PhD Experts</span> for R&D and Mentorship
          </motion.h1>

            {/* Sub-text */}
          <motion.p
              className="text-base text-slate-600 leading-relaxed"
            variants={fadeUp}
            custom={3}
          >
            Unlock global innovation by collaborating with top PhD scholars and graduates. Access cutting-edge research, personalized mentorship, and specialized consulting—anytime, anywhere.
          </motion.p>

            {/* Search removed per request */}

            {/* Feature Tags */}
          <motion.div 
              className="flex flex-wrap gap-3"
            variants={fadeUp}
              custom={5}
            >
              {heroFeatures.map((feature, index) => (
                <span
                  key={feature.text}
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${feature.color} shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {feature.text}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeUp}
              custom={6}
          >
            <Link
              to="/findexpert"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Find a PhD Expert
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/become-mentor"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Become a Mentor
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Large Circular Graphic */}
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Main Circle Background */}
              <div className="absolute inset-0 bg-[#fa5954] rounded-full shadow-2xl"></div>
              
              {/* Decorative Squiggly Line */}
              <div className="absolute -top-4 -left-4 w-16 h-16">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  <path 
                    d="M10 20 Q20 10 30 20 T50 20" 
                    stroke="black" 
                    strokeWidth="2" 
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Profile image (copyright-safe Unsplash) */}
              <div className="absolute inset-8 flex items-center justify-center">
                <img
                  src={freelancerImage}
                  alt="Professional portrait"
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                />
              </div>

              {/* Floating Profile Cards */}
              {/* Top Rated Card */}
              <motion.div
                initial={{ opacity: 0, y: -20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-6 -left-6 bg-white rounded-lg shadow-xl p-3 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">Top Rated</span>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Jane Doe Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute top-20 -left-8 bg-white rounded-lg shadow-xl p-4 border border-slate-100 min-w-[200px]"
              >
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm">Jane Doe</h4>
                  <p className="text-xs text-slate-600">Network & Security Engineer</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-xs text-slate-600 ml-1">5.0</span>
                  </div>
                </div>
          </motion.div>

              {/* Additional Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-100 rounded-full border-2 border-blue-200 flex items-center justify-center"
              >
                <Globe className="w-8 h-8 text-blue-600" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute top-1/2 -right-8 w-12 h-12 bg-green-100 rounded-full border-2 border-green-200 flex items-center justify-center"
              >
                <TrendingUp className="w-6 h-6 text-green-600" />
        </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* HIRE THE BEST SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full border border-slate-200 shadow-sm mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="text-slate-700 text-sm font-semibold">Top Talent Available</span>
        </div>
        
        <h2 className="heading-section font-bold text-slate-800 mb-6">
          Hire the Best Professionals
        </h2>
        
        <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Check out professionals on <span className="font-bold text-blue-600">AMOGH</span>, with the skills you need for your next job.
        </p>
        
        <Link
          to="/findexpert"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Hire freelancers
        </Link>
      </div>
    </section>

    {/* FREELANCER GRID SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm mb-6">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 text-sm font-semibold">Featured Professionals</span>
          </div>
          
          <h2 className="heading-section font-bold text-slate-800 mb-4">
            Freelance Research Experts
          </h2>
          
          <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {filtered.length} freelancers available for collaboration
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="mb-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-3">
                  <ArrowUpDown className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600 text-sm font-medium">Sort by</span>
                  <select
                    className="bg-white border border-slate-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="projects">Most Projects</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filter by skill..."
                    className="w-full sm:w-64 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Freelancer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.slice(0, showCount).map((f, idx) => (
            <Card key={f.customUserId || idx} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={getUserAvatarUrl({ avatar: f.profile?.avatar }) || noUserProfile}
                      alt={f.profile?.firstName || 'Freelancer'}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="text-center mb-4 flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {f.auth?.firstName || f.profile?.firstName} {f.auth?.lastName || f.profile?.lastName}
                  </h3>
                  <p className="text-slate-600 font-medium text-sm mb-2">
                    {f.profile?.title || 'Freelancer'}
                  </p>
                  <p className="text-slate-500 text-sm mb-3">
                    {f.profile?.location || 'Remote'}
                  </p>

                  {/* Rate & Response */}
                  <div className="flex justify-center items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      ${f.freelancerData?.hourlyRate || '50'}/hr
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {f.freelancerData?.avgResponseTime || '2'}h response
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {(f.skills || []).slice(0, 3).map((skill: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                    {(f.skills || []).length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                        +{(f.skills || []).length - 3}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(f.stats?.rating || 4.5) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-slate-200 text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-600 text-sm font-medium">
                      {(f.stats?.rating || 4.5).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className="w-full group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = `/freelancerprofile/${f.customUserId}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    View Profile
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filtered.length > showCount && (
          <div className="text-center mt-12">
            <button
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => setShowCount(showCount + 4)}
            >
              Load More Freelancers
              <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>

    {/* POPULAR SKILLS SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full border border-slate-200 shadow-sm mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 text-sm font-semibold">In-Demand Expertise</span>
          </div>
          
          <h2 className="heading-section font-bold text-slate-800 mb-4">
            Popular Skills & Expertise
          </h2>
          
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover top PhD experts across cutting-edge fields. From AI research to biotechnology, find the perfect match for your project.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {popularSkills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
            >
              <Card className={`group cursor-pointer md:hover:shadow-2xl md:hover:scale-105 transition-all duration-300 border-2 ${skill.color.split(' ')[0]} ${skill.color.split(' ')[1]} bg-gradient-to-br from-white to-slate-50/50`}>
                <CardContent className="p-4 md:p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="text-2xl md:text-4xl mb-2 md:mb-4 md:group-hover:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1 md:mb-2 md:group-hover:text-blue-600 transition-colors text-sm md:text-base">
                      {skill.name}
                    </h3>
                  </div>
                  <div className="mt-auto">
                    <p className="text-xs md:text-sm text-slate-600 font-medium">
                      {skill.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FEATURED CATEGORIES SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm mb-6">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 text-sm font-semibold">Service Categories</span>
          </div>
          
          <h2 className="heading-section font-bold text-slate-800 mb-4">
            Featured Categories
          </h2>
          
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore our most popular research and development categories with thousands of successful projects completed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            >
              <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg h-full">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                
                {/* Content */}
                <CardContent className="relative p-6 text-white h-full flex flex-col">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  
                  <CardTitle className="text-lg font-bold mb-2 text-white group-hover:scale-105 transition-transform duration-300">
                    {category.title}
                  </CardTitle>
                  
                  <CardDescription className="text-white/90 text-sm mb-4 flex-1 leading-relaxed">
                    {category.description}
                  </CardDescription>
                  
                  <div className="flex justify-between items-center text-sm font-medium text-white/80 mt-auto">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {category.experts} experts
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {category.projects} projects
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CLIENT TESTIMONIALS SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full border border-slate-200 shadow-sm mb-6">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-slate-700 text-sm font-semibold">Client Success Stories</span>
          </div>
          
          <h2 className="heading-section font-bold text-slate-800 mb-4">
            What Our Clients Say
          </h2>
          
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Real feedback from researchers, startups, and organizations who've found success with our PhD experts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clientTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: "easeOut" }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg h-full bg-gradient-to-br from-white via-slate-50/30 to-blue-50/30">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header with Avatar and Info */}
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                        onError={e => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.name) + '&background=E0E7EF&color=374151&size=48'; }}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-slate-800 text-base">{testimonial.name}</h4>
                      <p className="text-sm text-slate-600 font-medium">{testimonial.role}</p>
                      <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <CardDescription className="text-slate-700 italic text-base leading-relaxed flex-1">
                    "{testimonial.content}"
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* WHY WE'RE UNIQUE SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 text-sm font-semibold">Our Advantage</span>
          </div>
          
          <h2 className="heading-section font-bold text-slate-800 mb-4">
            Why We're Unique
          </h2>
          
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We connect you with the world's brightest PhD minds for research, mentorship, and innovation—delivered with integrity, personalization, and global reach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {uniquePoints.map((point, idx) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.12, ease: "easeOut" }}
            >
              <Card className={`group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg h-full ${point.color}`}>
                <CardContent className="p-6 h-full flex items-start gap-4">
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {point.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {point.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed text-base">
                      {point.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* SUCCESS STORIES SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full border border-slate-200 shadow-sm mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-slate-700 text-sm font-semibold">Impact Stories</span>
          </div>
          
          <h2 className="heading-section font-bold text-slate-800 mb-4">
            Success Stories
          </h2>
          
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Real impact, real results. Explore how PhD experts have transformed research, innovation, and mentorship for clients worldwide.
          </p>
          
          <div className="w-20 h-1 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" />
        </div>

        {/* Slideshow Container */}
        <div className="relative w-full max-w-7xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={() => {
              const totalSlides = stories.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
              setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
            }}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => {
              const totalSlides = stories.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
              setCurrentSlide((currentSlide + 1) % totalSlides);
            }}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          </button>

          {/* Slideshow */}
          <div 
            className="relative overflow-hidden rounded-xl sm:rounded-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentSlide * (window.innerWidth < 640 ? 100 : window.innerWidth < 1024 ? 50 : 20)}%)` 
              }}
            >
              {stories.map((story, idx) => (
                <div 
                  key={story.name} 
                  className={`flex-shrink-0 px-1 sm:px-2 ${
                    window.innerWidth < 640 ? 'w-full' : 
                    window.innerWidth < 1024 ? 'w-1/2' : 'w-1/5'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`
                      flex flex-col items-center justify-between
                      rounded-lg sm:rounded-xl shadow-lg ${story.color}
                      border border-white/60 px-3 sm:px-4 py-4 sm:py-6
                      h-48 sm:h-56 lg:h-64 transition-all duration-300 hover:shadow-xl hover:scale-105
                    `}
                  >
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={story.img}
                        alt={story.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mb-2 sm:mb-3 ring-2 ring-white/50 shadow-md"
                        onError={e => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(story.name) + '&background=E0E7EF&color=374151&size=64'; }}
                      />
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">{story.name}</span>
                        <span className="text-xs text-gray-600">{story.country}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#fa5954] mb-2 text-center leading-tight">{story.title}</span>
                      <p className="text-xs text-gray-700 text-center leading-relaxed mb-3 line-clamp-3">{story.desc}</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-white/90 text-[#fa5954] font-semibold shadow">
                        {story.impact}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
            {Array.from({ 
              length: stories.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4) 
            }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                  currentSlide === idx 
                    ? 'bg-[#fa5954] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* HOW IT WORKS SECTION */}
    <section className="relative py-20 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm mb-6">
            <ArrowRight className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 text-sm font-semibold">Simple Process</span>
          </div>
          
          <h2 className="heading-section font-bold text-slate-800 mb-4">
            How it works
          </h2>
          
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your journey to world-class research and mentorship starts here. Just follow these simple steps!
          </p>
        </div>
        
        {/* Timeline for desktop */}
        <motion.ol
          className="hidden md:flex flex-col items-center relative max-w-3xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
        {/* Animated vertical line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-1 z-0">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-b from-[#fa5954] via-[#fa5954]/10 to-transparent rounded-full"
          />
        </div>
        {steps.map((step, idx) => (
          <motion.li
            key={step.title}
            variants={stepVariant}
            className="relative flex items-center w-full mb-0 z-10"
          >
            <div className={`flex-1 ${idx % 2 === 0 ? "justify-end flex pr-8" : "hidden"}`}>
              <div className={`bg-gradient-to-br ${step.color} rounded-xl shadow-lg px-7 py-6 text-left max-w-md w-full border border-[#fa5954]/10`}>
                <h3 className="text-lg font-bold mb-1 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
            {/* Timeline orb */}
            <div className="flex flex-col items-center relative z-20">
              <motion.div
                className="rounded-full bg-white border-4 border-[#fa5954] shadow-lg p-2 mb-2"
                variants={orbPulse}
                animate="animate"
              >
                {step.icon}
              </motion.div>
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: 54 }}
                  transition={{ delay: idx * 0.17 + 0.3, duration: 0.5, ease: "easeInOut" }}
                  className="w-1 bg-[#fa5954]/20"
                  style={{ minHeight: 54 }}
                />
              )}
            </div>
            <div className={`flex-1 ${idx % 2 !== 0 ? "justify-start flex pl-8" : "hidden"}`}>
              <div className={`bg-gradient-to-bl ${step.color} rounded-xl shadow-lg px-7 py-6 text-left max-w-md w-full border border-[#fa5954]/10`}>
                <h3 className="text-lg font-bold mb-1 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          </motion.li>
        ))}
        {/* CTA at the end */}
        <motion.div
          variants={stepVariant}
          className="mt-12 flex flex-col items-center"
        >
          <button className="px-8 py-3 rounded-full bg-[#fa5954] text-white font-bold shadow-lg hover:shadow-[0_0_18px_rgba(250,89,84,0.7)] transition-all duration-300 text-lg">
            Start Your Project
          </button>
          <span className="mt-2 text-gray-500 text-sm">It's free to post a requirement!</span>
        </motion.div>
      </motion.ol>
      {/* Horizontal scroll for mobile */}
      {/* Slideshow for mobile */}
      <div className="md:hidden relative w-full max-w-4xl mx-auto">
        {/* Navigation Arrows */}
        <button
          onClick={() => {
            const totalSlides = steps.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
            setCurrentHowItWorksSlide(currentHowItWorksSlide === 0 ? totalSlides - 1 : currentHowItWorksSlide - 1);
          }}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => {
            const totalSlides = steps.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
            setCurrentHowItWorksSlide((currentHowItWorksSlide + 1) % totalSlides);
          }}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slideshow Container */}
        <div 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${currentHowItWorksSlide * (window.innerWidth < 640 ? 100 : window.innerWidth < 1024 ? 50 : 20)}%)` 
            }}
          >
            {steps.map((step, idx) => (
              <div 
                key={step.title} 
                className={`flex-shrink-0 px-1 sm:px-2 ${
                  window.innerWidth < 640 ? 'w-full' : 
                  window.innerWidth < 1024 ? 'w-1/2' : 'w-1/5'
                }`}
              >
                <motion.div
                  variants={stepVariant}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="flex flex-col items-center bg-gradient-to-br from-white via-[#fff6f5] to-[#fbeeea] rounded-lg sm:rounded-xl shadow-lg px-4 sm:px-5 py-4 sm:py-6 border border-[#fa5954]/10 h-48 sm:h-56 lg:h-64 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <motion.div
                    className="rounded-full bg-white border-4 border-[#fa5954] shadow-lg p-2 mb-3 sm:mb-4"
                    variants={orbPulse}
                    animate="animate"
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 text-center">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">{step.desc}</p>
                  {idx < steps.length - 1 && (
                    <div className="w-8 h-1 bg-gradient-to-r from-[#fa5954]/40 to-transparent mt-3 sm:mt-4 rounded-full" />
                  )}
                </motion.div>
              </div>
            ))}
            {/* CTA Card */}
            <div 
              className={`flex-shrink-0 px-1 sm:px-2 ${
                window.innerWidth < 640 ? 'w-full' : 
                window.innerWidth < 1024 ? 'w-1/2' : 'w-1/5'
              }`}
            >
              <motion.div
                variants={stepVariant}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-[#fa5954] to-[#e0514d] rounded-lg sm:rounded-xl shadow-lg px-4 sm:px-5 py-4 sm:py-6 border border-[#fa5954]/20 h-48 sm:h-56 lg:h-64 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="text-center">
                  <h3 className="text-sm sm:text-base font-bold mb-2 text-white">Ready to Start?</h3>
                  <p className="text-xs sm:text-sm text-white/90 mb-4">Begin your journey today!</p>
                  <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white text-[#fa5954] font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm">
                    Start Your Project
                  </button>
                  <p className="mt-2 text-white/80 text-xs">It's free to post!</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
          {Array.from({ 
            length: steps.length - (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4) + 1 
          }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHowItWorksSlide(idx)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                currentHowItWorksSlide === idx 
                  ? 'bg-[#fa5954] scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
      </div>
    </section>

    {/* FINAL CTA SECTION */}
    <section className="relative py-12 sm:py-16 px-4 lg:px-8 overflow-hidden -mt-6 md:-mt-10">
      {/* Enhanced Background with Mesh Gradient SVG */}
      <div className="absolute inset-0">
        <img src={ctaMeshBg} alt="Soft mesh gradient background" className="w-full h-full object-cover" />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-15 sm:opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 sm:w-40 sm:h-40 bg-white rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 sm:w-36 sm:h-36 bg-white rounded-full blur-xl sm:blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-blue-300 rounded-full blur-lg sm:blur-xl animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 sm:w-28 sm:h-28 bg-purple-300 rounded-full blur-lg sm:blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 opacity-10 sm:opacity-15">
        <div className="absolute top-20 right-1/4 w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-200 rotate-45 animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-8 h-8 sm:w-12 sm:h-12 border-2 border-gray-200 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/3 left-1/3 w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-200 rotate-12 animate-float delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center text-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-lg mb-6">
            <Sparkles className="w-5 h-5 text-slate-700" />
            <span className="text-slate-700 text-sm font-semibold">Start Your Journey</span>
          </div>

          <h2 className="heading-section font-bold text-slate-900 mb-6 px-4">
            Ready to Accelerate Your Freelance Research Journey?
          </h2>

          <p className="text-base text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Connect instantly with world-class PhD experts, get tailored guidance, and bring your R&D or academic vision to life as a freelancer or client.
            <br />
            <span className="font-semibold text-slate-900">It's free to get started!</span>
          </p>

          <Link
            to="/findexpert"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-black transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl text-lg"
          >
            Let's Start
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
    <Footer />
  </main>
);
};

export default Work;