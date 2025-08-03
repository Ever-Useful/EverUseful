// src/FindExpert.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '../components/Footer';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import noUserProfile from '../assets/images/no user profile.png';

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
  profile: any;
  customUserId: string;
};

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
  { id: 1, value: "PhD Experts", label: "Research Specialists", icon: "🎓" },
  { id: 2, value: "95%", label: "Success Rate", icon: "🏆" },
  { id: 3, value: "32h", label: "Avg. Response", icon: "⏱" },
  { id: 4, value: "4.9/5", label: "Satisfaction", icon: "⭐" },
];

const FindExpert = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExperts, setFilteredExperts] = useState<Freelancer[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [phdExperts, setPhdExperts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/users/all')
      .then(res => res.json())
      .then(data => {
        if (data && data.users) {
          const phdUsers = Object.values(data.users).filter((user: any) => {
            // Check if user has education data
            if (!user.education || !Array.isArray(user.education)) {
              return false;
            }
            
            // Look for PhD in education array - only check qualification attribute
            const hasPhd = user.education.some((edu: any) => {
              if (!edu || !edu.qualification) {
                return false;
              }
              
              // Check if qualification is "PhD" or "Doctorate"
              const qualification = edu.qualification.toLowerCase();
              return qualification === 'phd' || qualification === 'doctorate';
            });
            
            return hasPhd;
          });
          
          console.log('PhD Users found:', phdUsers.length);
          setPhdExperts(phdUsers);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Filter experts based on category and search query
  useEffect(() => {
    // Transform backend data to match Freelancer type with fallback values
    let result = phdExperts.map((user, index) => ({
      id: user.customUserId || `user-${index}`,
      name: `${user.profile?.firstName || 'Dr.'} ${user.profile?.lastName || 'Researcher'}`,
      title: user.profile?.title || 'Research Expert',
      skills: user.skills || [],
      rate: '$50/hr',
      experience: '5+ years',
      image: user.profile?.avatar || noUserProfile,
      rating: 4.5,
      completedProjects: 10,
      isAvailable: true,
      location: user.profile?.location || 'University',
      responseTime: '2 hours',
      portfolio: '',
      university: user.profile?.university || 'Research University',
      researchFocus: user.profile?.researchFocus || 'Academic Research',
      publications: 5,
      // Keep original user properties for profile navigation
      profile: user.profile,
      customUserId: user.customUserId
    }));
    
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
  }, [activeCategory, searchQuery, sortBy, phdExperts]);

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

  // Profile redirect logic (from ProductDisplay)
  const goToProfile = (userType: string, id: string) => {
    if (!id) return;
    const type = (userType || '').toLowerCase();
    if (type === 'freelancer') {
      navigate(`/freelancerprofile/${id}`);
    } else if (type === 'professor') {
      navigate(`/studentprofile/${id}`); // or `/professorprofile/${id}` if you have that route
    } else {
      navigate(`/studentprofile/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-[#0a192f] to-[#800020] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#0a192f]/30 to-[#800020]/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-10 xs:py-14 sm:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xs:gap-10 lg:gap-12">
            {/* Left: Title, Desc, Search */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl font-bold mb-4 xs:mb-6 leading-tight">
                  Connect with <span className="text-amber-400">PhD Experts</span> for Research & Mentorship
                </h1>
                <p className="text-base text-indigo-100 mb-5 xs:mb-8 max-w-xl">
                  Access specialized knowledge from verified PhD researchers and academics. Collaborate on research projects, receive expert mentorship, and accelerate your R&D initiatives with qualified doctoral experts.
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
                    placeholder="Search by PhD research field, university, or expertise..."
                    className="w-full px-4 xs:px-5 py-3 xs:py-4 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-indigo-200 focus:ring-2 focus:ring-amber-400 focus:outline-none shadow-lg text-xs xs:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="absolute right-2 top-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-1.5 xs:py-2 px-4 xs:px-5 rounded-lg transition-colors text-xs xs:text-base">
                    Search
                  </button>
                </div>
              </motion.div>
            </div>
            {/* Right: Online Researchers */}
            <motion.div
              className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <div className="relative w-full max-w-md">
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl xs:rounded-3xl border border-white/20 p-4 xs:p-6 shadow-2xl">
                  <div className="flex items-center mb-3 xs:mb-4">
                    <div className="bg-green-500 w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full mr-2"></div>
                    <span className="text-green-400 text-xs xs:text-sm">Online Researchers</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 xs:gap-4">
                    {phdExperts.slice(0, 4).map((user, index) => (
                      <motion.div
                        key={user.customUserId || `user-${index}`}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-2 xs:p-3 border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center">
                          <img
                            src={user.profile?.avatar || noUserProfile}
                            alt={user.profile?.firstName || 'PhD'}
                            className="w-8 h-8 xs:w-10 xs:h-10 rounded-full object-cover border-2 border-white/30"
                          />
                          <div className="ml-2">
                            <h3 className="text-white font-medium text-xs xs:text-sm">{user.profile?.firstName} {user.profile?.lastName}</h3>
                            <p className="text-indigo-200 text-[10px] xs:text-xs">{user.profile?.title}</p>
                          </div>
                        </div>
                        <button
                          className="mt-2 w-full bg-amber-400 hover:bg-amber-500 text-white text-[10px] xs:text-xs font-semibold py-1 px-2 rounded"
                          onClick={() => goToProfile(user.profile?.userType, user.customUserId)}
                        >
                          View Profile
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 xs:mt-6 text-center">
                    <div className="inline-flex items-center bg-indigo-700/50 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm">
                      <span className="text-amber-400 mr-2">★</span>
                      <span>4.8 average rating from academic clients</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    {/* Stats Section */}
    <div className="py-6 xs:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 xs:grid-cols-4 gap-3 xs:gap-5"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 xs:p-5 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="text-xl xs:text-3xl text-indigo-600 mb-1 xs:mb-2">{stat.icon}</div>
              <div className="text-lg xs:text-2xl font-bold text-indigo-900">{stat.value}</div>
              <div className="text-gray-600 text-xs xs:text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Domain Section */}
    <div className="py-6 xs:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 xs:mb-6 text-center"
        >
                          <h2 className="text-3xl font-bold text-gray-900 mb-1 xs:mb-2">Browse Research Domains</h2>
          <p className="text-xs xs:text-base text-gray-600">Find experts in specific academic disciplines</p>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 xs:gap-3"
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
              className={`flex flex-col items-center justify-center p-2 xs:p-3 rounded-lg transition-all bg-white text-gray-700 shadow-sm border border-gray-200 ${
                activeCategory === category.id ? "bg-indigo-600 text-white" : ""
              }`}
            >
              <span className="text-lg xs:text-2xl mb-0.5 xs:mb-1">{category.icon}</span>
              <span className="font-medium text-[10px] xs:text-xs text-center">{category.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Filter Bar */}
    <div className="max-w-7xl mx-auto px-2 xs:px-4 py-6 xs:py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm p-3 xs:p-4 mb-6 xs:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 xs:gap-4">
        <div>
          <h2 className="text-base xs:text-xl font-bold text-gray-900">
            PhD Research Experts
          </h2>
          <p className="text-gray-600 text-xs xs:text-sm">
            {filteredExperts.length} PhD experts available for collaboration
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 xs:gap-4 w-full md:w-auto">
          <div className="flex items-center w-full md:w-auto gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 text-xs font-medium">Sort by</span>
            <select
              className="bg-white border border-gray-300 rounded-lg py-1.5 xs:py-2 px-2 xs:px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm w-full md:w-auto ml-1 text-xs xs:text-sm"
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
              placeholder="Filter by PhD expertise..."
              className="w-full px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm text-xs xs:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Experts Grid */}
      <motion.div
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredExperts.map((expert) => (
            <motion.div
              key={expert.id}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="rounded-xl overflow-hidden shadow-lg transition-all flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50"
            >
              <div className="flex flex-col h-full">
                <div className="p-3 xs:p-5 flex-1 flex flex-col">
                  <div className="flex justify-center mb-2 xs:mb-3">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-14 xs:w-20 h-14 xs:h-20 rounded-full object-cover border-2 xs:border-3 border-white/80 shadow-lg"
                    />
                  </div>
                  <div className="text-center mb-2 xs:mb-3">
                    <h3 className="text-base xs:text-lg font-bold text-black">{expert.name}</h3>
                    <p className="text-black font-medium text-xs xs:text-sm">{expert.title}</p>
                    <p className="text-black text-[10px] xs:text-xs mt-1">{expert.university}</p>
                  </div>
                  <div className="flex justify-center mb-2 xs:mb-3">
                    <div className="flex text-amber-200">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={`${expert.id}-star-${i}`}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-3 w-3 xs:h-4 xs:w-4 ${
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
                    <span className="ml-1 text-black text-xs xs:text-sm">
                      {expert.rating} ({expert.completedProjects})
                    </span>
                  </div>
                  <div className="mb-2 xs:mb-3 text-center">
                    <h4 className="text-[10px] xs:text-xs font-semibold text-black mb-1">Research Focus</h4>
                    <p className="text-black text-xs xs:text-sm">{expert.researchFocus}</p>
                  </div>
                  <div className="mt-auto pt-2 xs:pt-3 flex justify-between items-center border-t border-white/30">
                    <div className="flex items-center text-white/80 text-[10px] xs:text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 xs:h-4 xs:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {expert.location}
                    </div>
                    <div className="bg-white/20 text-white text-[10px] xs:text-xs font-medium px-2 py-1 rounded">
                      {expert.rate}
                    </div>
                  </div>
                </div>
                <div className="px-3 xs:px-5 pb-3 xs:pb-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToProfile(expert.profile?.userType, expert.customUserId)}
                    className="w-full bg-white/90 hover:bg-white text-gray-900 font-medium py-1.5 xs:py-2 px-3 xs:px-4 rounded-lg shadow-md text-xs xs:text-sm"
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
          className="text-center py-10 xs:py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 xs:h-16 xs:w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base xs:text-xl font-medium text-gray-900 mb-2">No experts found</h3>
          <p className="text-gray-600 max-w-md mx-auto text-xs xs:text-base">
            We couldn't find any experts matching your search. Try adjusting your filters or search terms.
          </p>
        </motion.div>
      )}

      {/* Load More Button */}
      {filteredExperts.length > 0 && (
        <div className="mt-6 xs:mt-10 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 xs:py-2.5 xs:px-6 rounded-lg shadow-sm transition-all text-xs xs:text-base"
          >
            Load More Experts
          </motion.button>
        </div>
      )}
    </div>

    {/* Enhanced Additional Sections with Real Images */}
    <div className="py-10 xs:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 xs:mb-12">
          <motion.h2 
                            className="text-2xl font-bold text-gray-900 mb-2 xs:mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Academic Ecosystem
          </motion.h2>
          <motion.p 
            className="text-xs xs:text-base text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Connect with resources to advance your research and career
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 xs:gap-8">
          {/* Community Section */}
          <motion.div 
            className="relative rounded-xl overflow-hidden h-52 xs:h-72 shadow-lg"
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
            <div className="absolute bottom-0 left-0 p-4 xs:p-6 z-20">
              <h3 className="text-base xs:text-xl font-bold text-white mb-1 xs:mb-2">Academic Community</h3>
              <p className="text-indigo-100 mb-2 xs:mb-4 text-xs xs:text-base">Connect with fellow researchers and academics</p>
              <a href="#" className="text-white font-medium flex items-center group text-xs xs:text-base">
                Join Community
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </motion.div>
          
          {/* Careers Section */}
          <motion.div 
            className="relative rounded-xl overflow-hidden h-52 xs:h-72 shadow-lg"
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
            <div className="absolute bottom-0 left-0 p-4 xs:p-6 z-20">
              <h3 className="text-base xs:text-xl font-bold text-white mb-1 xs:mb-2">Research Careers</h3>
              <p className="text-purple-100 mb-2 xs:mb-4 text-xs xs:text-base">Opportunities for PhDs in academia and industry</p>
              <a href="#" className="text-white font-medium flex items-center group text-xs xs:text-base">
                Browse Careers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </motion.div>
          
          {/* Marketplace Section */}
          <motion.div 
            className="relative rounded-xl overflow-hidden h-52 xs:h-72 shadow-lg"
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
            <div className="absolute bottom-0 left-0 p-4 xs:p-6 z-20">
              <h3 className="text-base xs:text-xl font-bold text-white mb-1 xs:mb-2">Research Marketplace</h3>
              <p className="text-amber-100 mb-2 xs:mb-4 text-xs xs:text-base">Tools, equipment, and research services</p>
              <a href="#" className="text-white font-medium flex items-center group text-xs xs:text-base">
                Visit Marketplace
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
)};

export default FindExpert;