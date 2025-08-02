import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { ArrowUpDown } from "lucide-react";
import noUserProfile from "../assets/images/no user profile.png";

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
    price: "$29",
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
    desc: "Helped a biotech startup secure $2M in funding through research-backed proposals.",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    color: "bg-green-100",
    impact: "$2M funding",
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
    fetch("http://localhost:3000/api/users/all")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.users) {
          const all = Object.values(data.users);
          const onlyFreelancers = all.filter((u: any) => u.profile?.userType?.toLowerCase() === "freelancer");
          setFreelancers(onlyFreelancers);
        }
      });
  }, []);

  // Filtering and sorting
  useEffect(() => {
    let result = freelancers;
    if (skillFilter) {
      result = result.filter((f) => (f.skills || []).some((s: string) => s.toLowerCase().includes(skillFilter.toLowerCase())));
    }
    if (locationFilter) {
      result = result.filter((f) => (f.profile?.location || "").toLowerCase().includes(locationFilter.toLowerCase()));
    }
    if (search) {
      result = result.filter((f) =>
        (f.profile?.firstName + " " + f.profile?.lastName).toLowerCase().includes(search.toLowerCase()) ||
        (f.profile?.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (f.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
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
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80"
        alt="PhD freelancing R&D platform"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative z-10 max-w-4xl mx-auto px-4 xs:px-4 sm:px-8 py-16 xs:py-20 sm:py-24 text-center flex flex-col items-center"
      >
        <motion.h1
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 drop-shadow-[0_0_8px_rgba(250,89,84,0.7)] mb-4 xs:mb-6 leading-tight"
          variants={fadeUp}
          custom={1}
        >
          Connect with World-Class <span className="text-[#fa5954]">PhD Experts</span> for R&D and Mentorship
        </motion.h1>
        <motion.p
          className="text-base xs:text-lg sm:text-xl text-gray-700 mb-6 xs:mb-10 max-w-xl font-medium"
          variants={fadeUp}
          custom={2}
        >
          Unlock global innovation by collaborating with top PhD scholars and graduates. Access cutting-edge research, personalized mentorship, and specialized consulting—anytime, anywhere.
        </motion.p>
        <motion.div 
          className="flex flex-col xs:flex-row lg:flex-row xl:flex-row gap-4 xs:gap-6 w-full xs:w-auto justify-center items-center lg:flex-row lg:w-auto xl:flex-row xl:w-auto
            md:flex-row md:w-auto"
          variants={fadeUp}
          custom={3}
        >
          <Link
            to="/findexpert"
            className="w-full md:w-auto px-6 xs:px-8 py-3 rounded-full bg-[#fa5954] text-white font-bold shadow-lg hover:shadow-[0_0_15px_rgba(250,89,84,0.8)] transition-all duration-300 text-base xs:text-lg"
          >
            Find a PhD Expert
          </Link>
          <Link
            to="/become-mentor"
            className="w-full md:w-auto px-6 xs:px-8 py-3 rounded-full bg-white text-[#e0514d] font-bold border border-[#e0514d] shadow hover:shadow-[0_0_15px_rgba(224,81,77,0.8)] transition-all duration-300 text-base xs:text-lg"
          >
            Become a Mentor
          </Link>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-2 xs:gap-3 justify-center mt-8 xs:mt-12"
          variants={fadeUp}
          custom={4}
        >
          {heroFeatures.map((feature) => (
            <span
              key={feature.text}
              className={`text-[10px] xs:text-xs px-2 xs:px-3 py-1 rounded-full font-semibold ${feature.color} shadow-md`}
            >
              {feature.text}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>

    {/* HIRE THE BEST SECTION */}
    <section className="w-full bg-white py-10 xs:py-16 px-2 xs:px-4 border-b border-gray-100 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 xs:mb-6">Hire the Best Professionals</h2>
      <p className="text-base xs:text-lg text-gray-600 mb-6 xs:mb-8 max-w-2xl mx-auto">
        Check out professionals on <span className="font-bold text-[#fa5954]">AMOGH</span>, with the skills you need for your next job.
      </p>
      <a
        href="/findexpert"
        className="inline-block px-6 xs:px-10 py-2 xs:py-3 rounded-lg bg-green-600 text-white font-bold text-base xs:text-lg shadow hover:bg-green-700 transition-all duration-300 min-w-[140px] xs:min-w-[200px]"
      >
        Hire freelancers
      </a>
    </section>

    {/* FILTER BAR + GRID */}
    <section className="w-full bg-white py-6 xs:py-8 px-2 xs:px-4 flex flex-col items-center justify-center">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 mb-6 xs:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 xs:gap-4 w-full max-w-5xl">
        <div>
          <h2 className="text-lg xs:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Freelance Research Experts
          </h2>
          <p className="text-sm xs:text-lg text-gray-600 font-medium">
            {filtered.length} freelancers available for collaboration
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 xs:gap-4 w-full md:w-auto">
          <div className="flex items-center w-full md:w-auto gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 text-xs font-medium">Sort by</span>
            <select
              className="bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm w-full md:w-auto ml-1 text-xs xs:text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Highest Rating</option>
              <option value="projects">Most Projects</option>
            </select>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Filter by skill..."
              className="w-full px-3 xs:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm text-xs xs:text-sm"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Freelancer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 w-full max-w-5xl">
        {filtered.slice(0, showCount).map((f, idx) => (
          <div key={f.customUserId || idx} className="rounded-xl overflow-hidden shadow-lg transition-all flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex flex-col h-full">
              <div className="p-4 xs:p-5 flex-1 flex flex-col">
                <div className="flex justify-center mb-2 xs:mb-3">
                  <img
                    src={f.profile?.avatar || noUserProfile}
                    alt={f.profile?.firstName || 'Freelancer'}
                    className="w-16 xs:w-20 h-16 xs:h-20 rounded-full object-cover border-2 xs:border-3 border-white/80 shadow-lg"
                  />
                </div>
                <div className="text-center mb-2 xs:mb-3">
                  <h3 className="text-base xs:text-lg font-bold text-black">{f.profile?.firstName} {f.profile?.lastName}</h3>
                  <p className="text-black font-medium text-xs xs:text-sm">{f.profile?.title}</p>
                  <p className="text-black text-xs mt-1">{f.profile?.location}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mb-2 xs:mb-3">
                  {(f.skills || []).slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} className="bg-indigo-100 text-indigo-700 text-[10px] xs:text-xs font-medium px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {(f.skills || []).length > 3 && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] xs:text-xs font-medium px-2 py-1 rounded-full">
                      +{(f.skills || []).length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex justify-center mb-2 xs:mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-3 w-3 xs:h-4 xs:w-4 ${i < Math.floor(f.stats?.rating || 4.5) ? 'fill-amber-400' : 'fill-gray-200'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-700 text-xs xs:text-sm font-medium">{(f.stats?.rating || 4.5).toFixed(1)}</span>
                </div>
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg mt-auto transition text-xs xs:text-sm"
                  onClick={() => window.location.href = `/freelancerprofile/${f.customUserId}`}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length > showCount && (
        <div className="mt-6 xs:mt-8 text-center">
          <button
            className="px-6 xs:px-8 py-2 xs:py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-semibold shadow hover:bg-gray-50 transition-all text-xs xs:text-base"
            onClick={() => setShowCount(showCount + 4)}
          >
            Load More Freelancers
          </button>
        </div>
      )}
    </section>

    {/* POPULAR SKILLS SECTION */}
    <section className="w-full py-10 xs:py-20 px-2 xs:px-6 bg-gray-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 xs:mb-12 text-center"
        >
          <h2 className="text-lg xs:text-2xl md:text-3xl font-bold text-gray-900 mb-2 xs:mb-4">
            Popular Skills & Expertise
          </h2>
          <p className="text-xs xs:text-base text-gray-600 max-w-2xl mx-auto">
            Discover top PhD experts across cutting-edge fields. From AI research to biotechnology, find the perfect match for your project.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4">
          {popularSkills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className={`${skill.color} rounded-xl p-3 xs:p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:scale-105`}
            >
              <div className="text-xl xs:text-3xl mb-2 xs:mb-3">{skill.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 text-xs xs:text-base">{skill.name}</h3>
              <p className="text-xs xs:text-sm text-gray-600">{skill.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FEATURED CATEGORIES SECTION */}
    <section className="w-full py-10 xs:py-20 px-2 xs:px-6 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 xs:mb-12 text-center"
        >
          <h2 className="text-lg xs:text-2xl md:text-3xl font-bold text-gray-900 mb-2 xs:mb-4">
            Featured Categories
          </h2>
          <p className="text-xs xs:text-base text-gray-600 max-w-2xl mx-auto">
            Explore our most popular research and development categories with thousands of successful projects completed.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6">
          {featuredCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
              <div className="relative p-4 xs:p-6 text-white">
                <div className="text-2xl xs:text-4xl mb-2 xs:mb-4">{category.icon}</div>
                <h3 className="text-base xs:text-lg font-bold mb-1 xs:mb-2">{category.title}</h3>
                <p className="text-xs xs:text-sm opacity-90 mb-2 xs:mb-4">{category.description}</p>
                <div className="flex justify-between text-xs xs:text-sm">
                  <span>{category.experts} experts</span>
                  <span>{category.projects} projects</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CLIENT TESTIMONIALS SECTION */}
    <section className="w-full py-10 xs:py-20 px-2 xs:px-6 bg-gray-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 xs:mb-12 text-center"
        >
          <h2 className="text-lg xs:text-2xl md:text-3xl font-bold text-gray-900 mb-2 xs:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xs xs:text-base text-gray-600 max-w-2xl mx-auto">
            Real feedback from researchers, startups, and organizations who've found success with our PhD experts.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-8">
          {clientTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl p-4 xs:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-3 xs:mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 xs:w-12 h-10 xs:h-12 rounded-full object-cover mr-3 xs:mr-4"
                  onError={e => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.name) + '&background=E0E7EF&color=374151&size=48'; }}
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs xs:text-base">{testimonial.name}</h4>
                  <p className="text-xs xs:text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs xs:text-sm text-[#fa5954]">{testimonial.company}</p>
                </div>
              </div>
              <div className="flex mb-3 xs:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 xs:w-5 h-4 xs:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic text-xs xs:text-base">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* WHY WE'RE UNIQUE SECTION */}
    <section className="w-full py-10 xs:py-20 px-2 xs:px-6 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 xs:mb-8 text-center"
        >
          <h2 className="text-lg xs:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Why We're Unique
          </h2>
          <p className="text-xs xs:text-base text-gray-600 max-w-xl mx-auto">
            We connect you with the world's brightest PhD minds for research, mentorship, and innovation—delivered with integrity, personalization, and global reach.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-5">
          {uniquePoints.map((point, idx) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + idx * 0.12, ease: "easeOut" }}
              className={`flex items-start space-x-2 xs:space-x-3 rounded-lg shadow-sm p-3 xs:p-4 hover:shadow-lg transition ${point.color}`}
            >
              <div className="flex-shrink-0">{point.icon}</div>
              <div>
                <h3 className="text-xs xs:text-base font-semibold text-gray-900 mb-1">{point.title}</h3>
                <p className="text-xs xs:text-sm text-gray-700">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* SUCCESS STORIES SECTION */}
    <section className="w-full py-8 sm:py-10 lg:py-20 px-4 sm:px-6 bg-gray-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Success Stories
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Real impact, real results. Explore how PhD experts have transformed research, innovation, and mentorship for clients worldwide.
          </p>
          <div className="w-12 sm:w-16 lg:w-20 h-1 mx-auto mt-3 sm:mt-4 rounded-full bg-[#fa5954]/30" />
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
    <section className="w-full py-16 px-4 bg-white relative">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          How it works
        </h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto mb-10">
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
    </section>

    {/* FINAL CTA SECTION */}
    <section className="relative w-full overflow-hidden">
      {/* Curved SVG top */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] xs:h-[80px] md:h-[100px]">
          <path
            d="M0,80 C400,0 1040,0 1440,80 L1440,0 L0,0 Z"
            fill="#fff"
          />
        </svg>
      </div>
      {/* Backdrop image with blur */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
          alt="Freelancer workspace"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'blur(1px)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Inner content */}
      <div className="relative z-20 max-w-3xl mx-auto px-4 xs:px-6 py-12 xs:py-20 md:py-28 flex flex-col items-center text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="text-xl xs:text-3xl md:text-4xl font-bold mb-3 xs:mb-4 drop-shadow-lg"
        >
          Ready to Accelerate Your Freelance Research Journey?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-sm xs:text-lg md:text-xl mb-6 xs:mb-8 max-w-2xl mx-auto drop-shadow-md"
        >
          Connect instantly with world-class PhD experts, get tailored guidance, and bring your R&D or academic vision to life as a freelancer or client. <br />
          <span className="font-semibold text-[#fa5954]">It's free to get started!</span>
        </motion.p>
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="px-6 xs:px-10 py-3 xs:py-4 rounded-full bg-[#fa5954] text-white font-bold text-base xs:text-lg shadow-xl hover:shadow-[0_0_20px_rgba(250,89,84,0.7)] hover:bg-[#e0514d] transition-all duration-300"
        >
          Let&apos;s Start
        </motion.button>
      </div>
    </section>
    <Footer />
  </main>
);
};

export default Work;