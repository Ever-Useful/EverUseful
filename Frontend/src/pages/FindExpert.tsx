// src/FindExpert.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Link } from 'react-router-dom';

// Define types for freelancer data
type Freelancer = {
  id: number;
  name: string;
  title: string;
  skills: string[];
  rate: string;
  experience: string;
  image: string;
  rating: number;
  completedProjects: number;
  isAvailable: boolean;
  location: string;
  responseTime: string;
  portfolio: string;
  university: string;
  researchFocus: string;
  publications: number;
};

// Sample PhD freelancer data
const freelancers: Freelancer[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Biomedical Research Scientist",
    skills: ["CRISPR", "Gene Editing", "Molecular Biology", "Data Analysis"],
    rate: "$120/hr",
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500",
    rating: 4.9,
    completedProjects: 87,
    isAvailable: true,
    location: "Boston, USA",
    responseTime: "1 hour",
    portfolio: "sarahjohnson-research.org",
    university: "Harvard University",
    researchFocus: "Genetic Engineering",
    publications: 42,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "Machine Learning Researcher",
    skills: ["Deep Learning", "Computer Vision", "Python", "TensorFlow"],
    rate: "$150/hr",
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    rating: 4.8,
    completedProjects: 64,
    isAvailable: true,
    location: "San Francisco, USA",
    responseTime: "2 hours",
    portfolio: "michaelchen.ai",
    university: "Stanford University",
    researchFocus: "AI Ethics",
    publications: 28,
  },
  {
    id: 3,
    name: "Dr. Emma Rodriguez",
    title: "Quantum Physicist",
    skills: ["Quantum Computing", "Quantum Mechanics", "Simulations", "Algorithms"],
    rate: "$180/hr",
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=500",
    rating: 4.9,
    completedProjects: 52,
    isAvailable: true,
    location: "Geneva, Switzerland",
    responseTime: "4 hours",
    portfolio: "emmarodriguez-physics.com",
    university: "ETH Zurich",
    researchFocus: "Quantum Algorithms",
    publications: 36,
  },
  {
    id: 4,
    name: "Dr. David Kim",
    title: "Neuroscience Researcher",
    skills: ["fMRI Analysis", "Cognitive Neuroscience", "Python", "Data Visualization"],
    rate: "$140/hr",
    experience: "9 years",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    rating: 4.7,
    completedProjects: 47,
    isAvailable: true,
    location: "Seoul, South Korea",
    responseTime: "6 hours",
    portfolio: "davidkimneuro.org",
    university: "Seoul National University",
    researchFocus: "Cognitive Development",
    publications: 31,
  },
  {
    id: 5,
    name: "Dr. Olivia Williams",
    title: "Environmental Scientist",
    skills: ["Climate Modeling", "Sustainability", "Data Analysis", "GIS"],
    rate: "$130/hr",
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
    rating: 4.8,
    completedProjects: 39,
    isAvailable: true,
    location: "Vancouver, Canada",
    responseTime: "3 hours",
    portfolio: "oliviawilliams-science.com",
    university: "University of British Columbia",
    researchFocus: "Climate Change",
    publications: 25,
  },
  {
    id: 6,
    name: "Dr. James Taylor",
    title: "Materials Science Expert",
    skills: ["Nanomaterials", "SEM/TEM", "Materials Characterization", "Polymers"],
    rate: "$160/hr",
    experience: "11 years",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    rating: 4.9,
    completedProjects: 58,
    isAvailable: true,
    location: "Berlin, Germany",
    responseTime: "2 hours",
    portfolio: "jamestaylormatsci.com",
    university: "Technical University of Munich",
    researchFocus: "Nanomaterials",
    publications: 48,
  },
  {
    id: 7,
    name: "Dr. Sophia Patel",
    title: "Computational Biologist",
    skills: ["Bioinformatics", "Genomics", "Python/R", "Machine Learning"],
    rate: "$155/hr",
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500",
    rating: 4.8,
    completedProjects: 41,
    isAvailable: true,
    location: "Bangalore, India",
    responseTime: "5 hours",
    portfolio: "sophiapatel-bio.org",
    university: "Indian Institute of Science",
    researchFocus: "Cancer Genomics",
    publications: 22,
  },
  {
    id: 8,
    name: "Dr. Benjamin Carter",
    title: "Economics Researcher",
    skills: ["Econometrics", "Data Analysis", "Stata/R", "Policy Evaluation"],
    rate: "$145/hr",
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500",
    rating: 4.7,
    completedProjects: 36,
    isAvailable: true,
    location: "London, UK",
    responseTime: "3 hours",
    portfolio: "benjamincarter-econ.com",
    university: "London School of Economics",
    researchFocus: "Behavioral Economics",
    publications: 19,
  },
   {
    id: 8,
    name: "Dr. Benjamin Carter",
    title: "Economics Researcher",
    skills: ["Econometrics", "Data Analysis", "Stata/R", "Policy Evaluation"],
    rate: "$145/hr",
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500",
    rating: 4.7,
    completedProjects: 36,
    isAvailable: true,
    location: "London, UK",
    responseTime: "3 hours",
    portfolio: "benjamincarter-econ.com",
    university: "London School of Economics",
    researchFocus: "Behavioral Economics",
    publications: 19,
  }
];

// Academic categories for filtering
const categories = [
  { id: 'all', name: 'All Experts', icon: '👥' },
  { id: 'science', name: 'Natural Sciences', icon: '🔬' },
  { id: 'engineering', name: 'Engineering', icon: '⚙' },
  { id: 'health', name: 'Health Sciences', icon: '⚕' },
  { id: 'social', name: 'Social Sciences', icon: '🌐' },
  { id: 'humanities', name: 'Humanities', icon: '📚' },
  { id: 'business', name: 'Business', icon: '💼' },
];

const stats = [
  { id: 1, value: "2,500+", label: "PhD Experts", icon: "🎓" },
  { id: 2, value: "95%", label: "Success Rate", icon: "🏆" },
  { id: 3, value: "32h", label: "Avg. Response", icon: "⏱" },
  { id: 4, value: "4.9/5", label: "Satisfaction", icon: "⭐" },
];

const FindExpert = () => {
  const [selectedExpert, setSelectedExpert] = useState<Freelancer | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExperts, setFilteredExperts] = useState<Freelancer[]>(freelancers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  // Filter experts based on category and search query
  useEffect(() => {
    let result = [...freelancers];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(expert => 
        expert.title.toLowerCase().includes(activeCategory) || 
        expert.skills.some(skill => skill.toLowerCase().includes(activeCategory)) ||
        expert.researchFocus.toLowerCase().includes(activeCategory)
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(expert => 
        expert.name.toLowerCase().includes(query) ||
        expert.title.toLowerCase().includes(query) ||
        expert.skills.some(skill => skill.toLowerCase().includes(query)) ||
        expert.researchFocus.toLowerCase().includes(query) ||
        expert.university.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'projects') {
        return b.completedProjects - a.completedProjects;
      } else if (sortBy === 'rate') {
        return parseFloat(b.rate.replace('$', '')) - parseFloat(a.rate.replace('$', ''));
      } else if (sortBy === 'publications') {
        return b.publications - a.publications;
      }
      return 0;
    });

    setFilteredExperts(result);
  }, [activeCategory, searchQuery, sortBy]);

  const handleExpertSelect = (expert: Freelancer) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
  };

  const handleHire = () => {
    if (selectedExpert) {
      alert(`Hiring process started for ${selectedExpert.name}!`);
      setIsModalOpen(false);
      setSelectedExpert(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Header />
    <div className="relative bg-gradient-to-br from-[#0a192f] to-[#800020] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#0a192f]/30 to-[#800020]/20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Connect with <span className="text-amber-400">PhD Experts</span> for Research & Mentorship
              </h1>
              <p className="text-xl text-indigo-100 mb-8 max-w-xl">
                Access specialized knowledge from PhD researchers and academics. Collaborate on research projects, receive expert mentorship, and accelerate your R&D initiatives.
              </p>
            </motion.div>
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by research field, university, or expertise..."
                  className="w-full px-5 py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-indigo-200 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-5 rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 w-3 h-3 rounded-full mr-2"></div>
                  <span className="text-green-400 text-sm">Online Researchers</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {freelancers.slice(0, 4).map((expert, index) => (
                    <motion.div
                      key={expert.id}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <img
                          src={expert.image}
                          alt={expert.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                        />
                        <div className="ml-2">
                          <h3 className="text-white font-medium text-sm">{expert.name.split(' ')[0]}</h3>
                          <p className="text-indigo-200 text-xs">{expert.title.split(' ')[0]}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center bg-indigo-700/50 px-4 py-2 rounded-full">
                    <span className="text-amber-400 mr-2">★</span>
                    <span className="text-sm">4.8 average rating from academic clients</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Stats Section - Improved UX */}
    <div className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="text-3xl text-indigo-600 mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-indigo-900">{stat.value}</div>
              <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Domain Section - Improved UX */}
    <div className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Research Domains</h2>
          <p className="text-gray-600">Find experts in specific academic disciplines</p>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, backgroundColor: "#4f46e5", color: "#fff" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all bg-white text-gray-700 shadow-sm border border-gray-200 ${
                activeCategory === category.id ? "bg-indigo-600 text-white" : ""
              }`}
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="font-medium text-xs text-center">{category.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            PhD Research Experts
          </h2>
          <p className="text-gray-600 text-sm">
            {filteredExperts.length} experts available for collaboration
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center w-full md:w-auto">
            <span className="text-gray-600 mr-2">Sort by:</span>
            <select
              className="bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Highest Rating</option>
              <option value="projects">Most Projects</option>
              <option value="publications">Most Publications</option>
              <option value="rate">Highest Rate</option>
            </select>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Filter by expertise..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Experts Grid - Compact with 4 per row */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredExperts.map((expert) => (
        <motion.div
          key={expert.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className={`rounded-xl overflow-hidden shadow-lg transition-all flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50`}
        >
          {/* Parent wrapper for all card content */}
          <div className="flex flex-col h-full">
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-center mb-3">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-20 h-20 rounded-full object-cover border-3 border-white/80 shadow-lg"
                />
              </div>
              <div className="text-center mb-3">
                <h3 className={`text-lg font-bold text-black`}>{expert.name}</h3>
                <p className={`text-black font-medium text-sm`}>{expert.title}</p>
                <p className={`text-black text-xs mt-1`}>{expert.university}</p>
              </div>
              <div className="flex justify-center mb-3">
                <div className="flex text-amber-200">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        i < Math.floor(expert.rating)
                          ? "text-amber-200"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={`ml-1 text-black text-xs`}>
                  {expert.rating} ({expert.completedProjects})
                </span>
              </div>
              <div className="mb-3 text-center">
                <h4 className={`text-xs font-semibold text-black mb-1`}>Research Focus</h4>
                <p className={`text-black text-sm`}>{expert.researchFocus}</p>
              </div>
              <div className="mt-auto pt-3 flex justify-between items-center border-t border-white/30">
                <div className="flex items-center text-white/80 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {expert.location}
                </div>
                <div className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded">
                  {expert.rate}
                </div>
              </div>
            </div>
            <div className="px-5 pb-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExpertSelect(expert)}
                className="w-full bg-white/90 hover:bg-white text-gray-900 font-medium py-2 px-4 rounded-lg shadow-md"
              >
                View Profile
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredExperts.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any experts matching your search. Try adjusting your filters or search terms.
            </p>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredExperts.length > 0 && (
          <div className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-6 rounded-lg shadow-sm transition-all"
            >
              Load More Experts
            </motion.button>
          </div>
        )}
      </div>

      {/* Enhanced Additional Sections with Real Images */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Explore Our Academic Ecosystem
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Connect with resources to advance your research and career
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Community Section */}
            <motion.div 
              className="relative rounded-xl overflow-hidden h-72 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Academic Community" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white mb-2">Academic Community</h3>
                <p className="text-indigo-100 mb-4">Connect with fellow researchers and academics</p>
                <a href="#" className="text-white font-medium flex items-center group">
                  Join Community
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
            
            {/* Careers Section */}
            <motion.div 
              className="relative rounded-xl overflow-hidden h-72 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Research Careers" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white mb-2">Research Careers</h3>
                <p className="text-purple-100 mb-4">Opportunities for PhDs in academia and industry</p>
                <a href="#" className="text-white font-medium flex items-center group">
                  Browse Careers
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
            
            {/* Marketplace Section */}
            <motion.div 
              className="relative rounded-xl overflow-hidden h-72 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1581093458799-ef0d1c3d3f5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Research Marketplace" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white mb-2">Research Marketplace</h3>
                <p className="text-amber-100 mb-4">Tools, equipment, and research services</p>
                <a href="#" className="text-white font-medium flex items-center group">
                  Visit Marketplace
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expert Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedExpert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={`p-8 bg-gradient-to-br from-blue-50 to-purplr-50 bg-opacity-90`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="relative">
                      <img
                        src={selectedExpert.image}
                        alt={selectedExpert.name}
                        className="w-24 h-24 rounded-xl object-cover border-3 border-white/80 shadow-lg"
                      />
                    </div>
                    <div className="ml-6">
                      <h2 className="text-2xl font-bold text-white">{selectedExpert.name}</h2>
                      <p className="text-white/90 font-medium text-lg">{selectedExpert.title}</p>
                      <p className="text-white/80 text-sm mt-1">{selectedExpert.university}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex text-amber-200">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 ${
                                i < Math.floor(selectedExpert.rating)
                                  ? "text-amber-200"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-white/80">
                          {selectedExpert.rating} rating ({selectedExpert.completedProjects} projects)
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  <div className="lg:col-span-2">
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">Research Focus</h3>
                      <p className="text-white/90">
                        {selectedExpert.researchFocus}
                      </p>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExpert.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">Academic Background</h3>
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mr-4" />
                          <div>
                            <h4 className="font-bold text-white">{selectedExpert.university}</h4>
                            <p className="text-white/80 text-sm">PhD in {selectedExpert.title.split(' ')[0]}</p>
                          </div>
                        </div>
                        <p className="text-white/90">
                          {selectedExpert.name} has published {selectedExpert.publications} peer-reviewed papers in top academic journals. Their research has been cited over {Math.floor(selectedExpert.publications * 25)} times.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-6 border border-white/30">
                    <h3 className="text-xl font-semibold text-white mb-4">Collaborate with {selectedExpert.name.split(' ')[0]}</h3>
                    
                    <div className="space-y-5">
                      <div className="flex justify-between items-center py-2 border-b border-white/30">
                        <div className="flex items-center text-white/90">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Hourly Rate:</span>
                        </div>
                        <span className="font-bold text-lg text-white">{selectedExpert.rate}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-white/30">
                        <div className="flex items-center text-white/90">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Location:</span>
                        </div>
                        <span className="font-bold text-white">{selectedExpert.location}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-white/30">
                        <div className="flex items-center text-white/90">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Response Time:</span>
                        </div>
                        <span className="font-bold text-white">{selectedExpert.responseTime}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-white/30">
                        <div className="flex items-center text-white/90">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Experience:</span>
                        </div>
                        <span className="font-bold text-white">{selectedExpert.experience}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center text-white/90">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Publications:</span>
                        </div>
                        <span className="font-bold text-white">{selectedExpert.publications}</span>
                      </div>
                      
                      <div className="pt-6">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleHire}
                          className={`w-full py-4 rounded-lg font-bold text-gray-900 shadow-lg ${
                            selectedExpert.isAvailable 
                              ? 'bg-white hover:bg-gray-100' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!selectedExpert.isAvailable}
                        >
                          {selectedExpert.isAvailable ? 'Start Collaboration' : 'Not Available'}
                        </motion.button>
                        
                        <button className="w-full mt-4 py-3 rounded-lg font-medium text-white border border-white hover:bg-white/10">
                          Request Consultation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default FindExpert;