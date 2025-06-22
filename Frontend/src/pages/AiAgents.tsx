// Artificial.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiStar, FiShoppingCart, FiTrendingUp, FiAward, FiGlobe, FiZap, FiArrowRight } from 'react-icons/fi';
import { IoRocketSharp } from 'react-icons/io5';
import { TbHexagon3D, TbBrandOpenai, TbRobot } from 'react-icons/tb';
import { GiArtificialIntelligence, GiProcessor, GiCircuitry } from 'react-icons/gi';
import { BsLightningCharge } from 'react-icons/bs';
import { Header } from '@/components/Header';

const Artificial = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heroText, setHeroText] = useState('Intelligent AI Agents');
  const agentsRef = useRef<HTMLDivElement>(null);
  
  // Section refs for highlighting
  const sections = {
    intro: useRef<HTMLDivElement>(null),
    whatIs: useRef<HTMLDivElement>(null),
    marketplace: useRef<HTMLDivElement>(null),
    benefits: useRef<HTMLElement>(null),
    research: useRef<HTMLDivElement>(null),
    cta: useRef<HTMLDivElement>(null),
  };

  // Mock data
  const categories = [
    { id: 'all', name: 'All Agents' },
    { id: 'business', name: 'Business', icon: <FiTrendingUp /> },
    { id: 'education', name: 'Education', icon: <FiAward /> },
    { id: 'productivity', name: 'Productivity', icon: <FiZap /> },
    { id: 'creative', name: 'Creative', icon: <TbHexagon3D /> },
    { id: 'healthcare', name: 'Healthcare', icon: <GiProcessor /> },
  ];

  const agents = [
    {
      id: 1,
      name: 'SynthAnalytics Pro',
      creator: 'NeuroTech AI',
      price: 149.99,
      rating: 4.9,
      description: 'Advanced business intelligence agent for real-time market analysis and predictive forecasting',
      tags: ['business', 'analytics', 'finance'],
      category: 'business',
      sales: 1242,
    },
    {
      id: 2,
      name: 'EduMentor AI',
      creator: 'LearnSphere',
      price: 89.99,
      rating: 4.7,
      description: 'Personalized learning assistant that adapts to student performance and learning styles',
      tags: ['education', 'tutoring', 'adaptive'],
      category: 'education',
      sales: 876,
    },
    {
      id: 3,
      name: 'Artisynth Creative',
      creator: 'Creative Labs',
      price: 129.99,
      rating: 4.8,
      description: 'AI-powered creative assistant for designers and artists with generative capabilities',
      tags: ['creative', 'design', 'generative'],
      category: 'creative',
      sales: 541,
    },
    {
      id: 4,
      name: 'ProductiBot',
      creator: 'FlowTech',
      price: 79.99,
      rating: 4.6,
      description: 'Automate repetitive tasks and optimize workflows with intelligent task management',
      tags: ['productivity', 'automation', 'workflow'],
      category: 'productivity',
      sales: 932,
    },
    {
      id: 5,
      name: 'MediScan AI',
      creator: 'HealthTech Labs',
      price: 199.99,
      rating: 4.9,
      description: 'Medical diagnosis support system with 98% accuracy in preliminary assessments',
      tags: ['healthcare', 'diagnostics', 'medical'],
      category: 'healthcare',
      sales: 1103,
    },
    {
      id: 6,
      name: 'LangBridge AI',
      creator: 'GlobalComm',
      price: 119.99,
      rating: 4.7,
      description: 'Real-time multilingual translation agent with cultural context awareness',
      tags: ['communication', 'translation', 'nlp'],
      category: 'productivity',
      sales: 754,
    },
  ];

  const researchNews = [
    {
      id: 1,
      title: 'Breakthrough in Multi-Agent Collaboration Systems',
      excerpt: 'New framework enables AI agents to collaborate on complex tasks with human-like teamwork',
      date: 'Jun 15, 2025',
      source: 'MIT Tech Review',
      trending: true,
    },
    {
      id: 2,
      title: 'Ethical AI Agent Framework Released by Global Consortium',
      excerpt: 'Open-source framework ensures AI agents adhere to ethical guidelines and transparency standards',
      date: 'Jun 10, 2025',
      source: 'AI Ethics Journal',
      trending: true,
    },
    {
      id: 3,
      title: 'Neural Architecture Search Revolutionizes Agent Training',
      excerpt: 'New algorithm reduces training time by 60% while improving agent performance metrics',
      date: 'Jun 5, 2025',
      source: 'Neural Computing',
      trending: false,
    },
    {
      id: 4,
      title: 'AI Agents Now Handle 40% of Customer Service Interactions',
      excerpt: 'Industry report shows significant shift towards AI-powered customer service solutions',
      date: 'May 28, 2025',
      source: 'Tech Industry Watch',
      trending: true,
    },
  ];

  const aiApplications = [
    {
      icon: <FiTrendingUp className="text-3xl" />,
      title: "Business Optimization",
      description: "AI agents analyze market trends, optimize operations, and predict business outcomes with 95% accuracy."
    },
    {
      icon: <FiAward className="text-3xl" />,
      title: "Personalized Education",
      description: "Adaptive learning agents create custom educational paths based on individual student performance."
    },
    {
      icon: <GiProcessor className="text-3xl" />,
      title: "Healthcare Diagnostics",
      description: "Medical AI agents assist doctors in diagnosis, reducing errors by 40% and improving patient outcomes."
    },
    {
      icon: <TbHexagon3D className="text-3xl" />,
      title: "Creative Industries",
      description: "Generative AI agents collaborate with artists to create novel designs, music, and visual content."
    }
  ];

  const benefits = [
    {
      title: "24/7 Availability",
      description: "AI agents operate continuously without fatigue, providing constant support and monitoring."
    },
    {
      title: "Scalable Solutions",
      description: "Deploy AI agents across global operations instantly, scaling to meet demand without infrastructure limits."
    },
    {
      title: "Data-Driven Insights",
      description: "Transform raw data into actionable intelligence with cognitive processing beyond human capability."
    },
    {
      title: "Cost Efficiency",
      description: "Reduce operational costs by up to 70% by automating complex tasks and decision-making processes."
    }
  ];

  // Filter agents based on category and search query
  const filteredAgents = agents.filter(agent => {
    const matchesCategory = activeCategory === 'all' || agent.category === activeCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle scroll for section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      // Highlight section based on scroll position
      Object.entries(sections).forEach(([key, ref]) => {
        if (ref.current) {
          const sectionTop = ref.current.offsetTop;
          const sectionHeight = ref.current.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveTab(Object.keys(sections).indexOf(key));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Typewriter effect for hero text
  useEffect(() => {
    const heroTexts = [
      'Intelligent AI Agents', 
      'Adv AI Solutions', 
      'Smart AI Technology',
      'Auto AI Systems'
    ];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setHeroText(heroTexts[currentIndex]);
      currentIndex = (currentIndex + 1) % heroTexts.length;
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll to section
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    window.scrollTo({
      top: sectionRef.current?.offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 text-white overflow-x-hidden">
      <Header />
      
      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -30 }}
              animate={{ 
                scale: [0.8, 1.2, 1],
                rotate: [-30, 10, 0],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mb-8"
            >
              <TbRobot className="text-cyan-400 text-7xl" />
            </motion.div>
            
            {/* Tube light effect */}
            <div className="relative mb-8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent h-full"
              />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 relative z-10 px-8">
                AmoghNeuro
              </h1>
            </div>
            
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-medium mb-4"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Initializing neural network
              </motion.span>
            </motion.div>
            
            <motion.div 
              className="mt-8 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              NeuroMarket v2.0
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-900 rounded-full filter blur-[150px] opacity-20"></div>
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-cyan-700 rounded-full filter blur-[120px] opacity-15"></div>
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[700px] bg-violet-800 rounded-full filter blur-[130px] opacity-10"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* AI Neural Network Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const endX = Math.random() * 100;
          const endY = Math.random() * 100;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400"
              style={{
                top: `${startY}%`,
                left: `${startX}%`,
                width: '1px',
                height: '1px',
              }}
              animate={{
                top: [`${startY}%`, `${endY}%`, `${startY}%`],
                left: [`${startX}%`, `${endX}%`, `${startX}%`],
                opacity: [0.1, 0.7, 0.1],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          );
        })}
      </div>

      {/* Floating AI Robots */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <TbRobot className="text-cyan-400 opacity-20 text-4xl" />
          </motion.div>
        ))}
      </div>

      {/* Circuit Board Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 1,
            }}
          >
            <GiCircuitry className="text-emerald-400 text-5xl opacity-30" />
          </motion.div>
        ))}
      </div>

      {/* Progress Navigation */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col space-y-4">
          {Object.keys(sections).map((section, index) => (
            <button
              key={section}
              onClick={() => scrollToSection(sections[section as keyof typeof sections])}
              className={`w-3 h-3 rounded-full transition-all ${
                activeTab === index
                  ? 'bg-cyan-400 scale-150 ring-4 ring-cyan-400/30'
                  : 'bg-gray-600'
              }`}
              aria-label={`Scroll to ${section} section`}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section ref={sections.intro} className="pt-32 pb-20 px-4 md:px-8 relative min-h-screen flex items-center">
        {/* Tube light effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-800/30 border border-indigo-600 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                <span className="text-sm">THE FUTURE OF AI AGENTS IS HERE</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  Discover, Share & Monetize
                </span>
                <br />
                <motion.span
                  className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400"
                  key={heroText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {heroText.split('').map((char, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl mb-10">
                Join the world's leading marketplace for AI solutions. Access cutting-edge agents, contribute your innovations, and transform how businesses operate.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-16">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(sections.marketplace)}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-cyan-500/20 flex items-center"
                >
                  <span>Explore Agents</span>
                  <IoRocketSharp className="ml-2" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-800/70 border border-gray-700 rounded-xl font-medium hover:bg-gray-700/50 transition-all duration-300 flex items-center"
                >
                  <span>Publish Agent</span>
                  <TbHexagon3D className="ml-2" />
                </motion.button>
              </div>
              
              <div className="flex flex-wrap gap-6">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="flex items-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center mr-3">
                      <BsLightningCharge className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-cyan-400">42K+</div>
                      <div className="text-gray-400">Active Agents</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-gray-400">AI Agent Dashboard</div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-cyan-400 font-medium">SynthAnalytics Pro</div>
                      <div className="flex items-center text-yellow-400">
                        <FiStar className="fill-current" />
                        <span className="ml-1">4.9</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 mb-4">Real-time market intelligence and forecasting</div>
                    <div className="flex flex-wrap gap-2">
                      {['Business', 'Analytics', 'Finance'].map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-indigo-900/50 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 rounded-xl p-4">
                      <div className="text-cyan-400 text-sm mb-1">Revenue Forecast</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-cyan-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 1, delay: 0.8 }}
                        ></motion.div>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4">
                      <div className="text-emerald-400 text-sm mb-1">Accuracy</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1, delay: 1 }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-2xl font-bold">$149.99</div>
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-lg text-sm flex items-center">
                      <FiShoppingCart className="mr-1" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-cyan-500 filter blur-[60px] opacity-30"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-indigo-500 filter blur-[80px] opacity-20"></div>
              
              {/* Floating AI elements */}
              <motion.div
                className="absolute -top-12 left-1/4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GiArtificialIntelligence className="text-cyan-400 text-4xl opacity-50" />
              </motion.div>
              <motion.div
                className="absolute bottom-8 -right-8"
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <TbRobot className="text-purple-400 text-5xl opacity-40" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What are AI Agents? Section */}
      <section ref={sections.whatIs} className="py-20 px-4 md:px-8 relative">
        {/* Tube light effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              What are <span className="text-cyan-400">AI Agents</span>?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-3xl mx-auto"
            >
              AI agents are autonomous systems that perceive their environment, make decisions, and take actions to achieve specific goals. 
              They combine machine learning, reasoning, and problem-solving capabilities to perform complex tasks.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiApplications.map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-cyan-600/30 group-hover:to-indigo-600/30">
                  {app.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">{app.title}</h3>
                <p className="text-gray-300">{app.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">How AI Agents Transform Industries</h3>
                <p className="text-gray-300 mb-6">
                  AI agents are revolutionizing how businesses operate by automating complex decision-making processes, 
                  providing real-time insights, and enabling new levels of efficiency and innovation across all sectors.
                </p>
                <div className="flex items-center text-cyan-400 font-medium">
                  <span>Learn more about agent technology</span>
                  <FiArrowRight className="ml-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <div className="text-cyan-400 text-3xl font-bold mb-2">92%</div>
                    <div className="text-sm text-gray-300">Adoption rate in Fortune 500 companies</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section ref={sections.marketplace} className="py-20 px-4 md:px-8 relative">
        {/* Tube light effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Explore <span className="text-cyan-400">AI Agents</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Discover powerful AI solutions created by developers worldwide. Deploy in minutes to enhance your workflows.
            </motion.p>
          </div>
          
          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-700/30 to-indigo-700/30 border border-cyan-500/30'
                    : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50'
                }`}
              >
                {category.icon && <span>{category.icon}</span>}
                <span>{category.name}</span>
              </button>
            ))}
          </motion.div>
          
          {/* Search */}
          <motion.div 
            className="max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search for agents, capabilities, or industries..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
          
          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredAgent(agent.id)}
                onHoverEnd={() => setHoveredAgent(null)}
                className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 relative"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{agent.name}</h3>
                      <p className="text-gray-400 text-sm">by {agent.creator}</p>
                    </div>
                    <div className="bg-indigo-500/10 px-3 py-1 rounded-full text-sm flex items-center">
                      <span>${agent.price}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 h-16">{agent.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {agent.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-gray-800/50 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < Math.floor(agent.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{agent.rating}</span>
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <FiTrendingUp className="mr-1" />
                      <span>{agent.sales} sales</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex justify-between">
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-lg text-sm flex items-center hover:opacity-90 transition-opacity">
                    <FiShoppingCart className="mr-2" />
                    <span>Add to Cart</span>
                  </button>
                </div>
                
                <AnimatePresence>
                  {hoveredAgent === agent.id && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No agents found matching your criteria
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={sections.benefits} className="py-20 px-4 md:px-8 relative">
        {/* Tube light effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              How <span className="text-emerald-400">AI Agents</span> Transform Industries
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Discover the tangible benefits of integrating AI agents into your operations
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Real-World Impact</h3>
              <p className="text-gray-300 mb-6">
                AI agents are revolutionizing industries by automating complex processes, enhancing decision-making, 
                and enabling innovation at unprecedented scales. From healthcare diagnostics to financial forecasting, 
                AI agents are driving efficiency and creating new possibilities.
              </p>
              
              {/* Arrow graph */}
              <div className="mt-8">
                <div className="flex items-end h-32 gap-4 mb-4">
                  {[30, 65, 85, 92].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <motion.div 
                        className="w-full bg-gradient-to-t from-cyan-500 to-cyan-700 rounded-t-md"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      />
                      <div className="text-xs mt-2 text-gray-400">Q{i+1}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-cyan-400 font-medium">
                  AI Adoption Growth (2024-2025)
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-6"
                >
                  <div className="flex items-start mb-3">
                    <div className="text-cyan-400 text-2xl font-bold mr-3">0{i+1}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                  
                  {/* Mini arrow indicator */}
                  <div className="flex items-center mt-4">
                    <div className="h-0.5 bg-gray-600 flex-1 mr-2">
                      <motion.div 
                        className="h-0.5 bg-cyan-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                    <FiArrowRight className="text-cyan-400" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            className="bg-gradient-to-br from-cyan-900/20 to-indigo-900/20 border border-cyan-500/30 rounded-2xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-4">Case Study: Global Retail Transformation</h3>
                <p className="text-gray-300 mb-6">
                  A leading retail chain implemented AI agents across 2,400 stores, resulting in a 34% reduction 
                  in operational costs and a 22% increase in customer satisfaction within the first year.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl text-sm flex items-center">
                  <span>View Case Study</span>
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
              <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between mb-4">
                  <div className="text-sm text-gray-400">Performance Metrics</div>
                  <div className="text-sm text-emerald-400">+42% Efficiency</div>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Metric {i+1}</span>
                        <span>+{Math.floor(Math.random() * 40 + 10)}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-cyan-500 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.floor(Math.random() * 80 + 20)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 * i }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research & News Section */}
      <section ref={sections.research} className="py-20 px-4 md:px-8 relative">
        {/* Tube light effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              AI <span className="text-emerald-400">Research</span> & Innovation
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Stay at the forefront of artificial intelligence advancements
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Latest Research</h3>
              <div className="space-y-6">
                {researchNews.map((news) => (
                  <div key={news.id} className="pb-6 border-b border-gray-700 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold hover:text-cyan-300 cursor-pointer">{news.title}</h4>
                      {news.trending && (
                        <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded-full flex items-center">
                          <FiTrendingUp className="mr-1" />
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-3">{news.excerpt}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{news.source}</span>
                      <span className="text-gray-500">{news.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-8"
              >
                <h3 className="text-2xl font-bold mb-6">Research Spotlight</h3>
                <div className="bg-gray-900/30 rounded-xl p-6 mb-6 border border-gray-700">
                  <div className="text-emerald-400 text-sm mb-2">Featured Paper</div>
                  <h4 className="text-xl font-bold mb-3">Multi-Agent Reinforcement Learning in Complex Environments</h4>
                  <p className="text-gray-300 mb-4">
                    This groundbreaking research demonstrates how AI agents can collaborate to solve problems previously thought impossible for artificial intelligence.
                  </p>
                  <div className="flex items-center text-cyan-400">
                    <span>Read Full Paper</span>
                    <FiArrowRight className="ml-2" />
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1 pr-4 border-r border-gray-700">
                    <div className="text-lg font-bold text-cyan-400">92%</div>
                    <div className="text-sm text-gray-400">Accuracy Improvement</div>
                  </div>
                  <div className="flex-1 px-4 border-r border-gray-700">
                    <div className="text-lg font-bold text-emerald-400">40%</div>
                    <div className="text-sm text-gray-400">Faster Training</div>
                  </div>
                  <div className="flex-1 pl-4">
                    <div className="text-lg font-bold text-purple-400">15x</div>
                    <div className="text-sm text-gray-400">Scalability</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold mb-6">Upcoming Events</h3>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                      <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg px-3 py-2 mr-4">
                        <div className="text-center text-cyan-400 font-bold">JUN</div>
                        <div className="text-center text-xl font-bold">2{i+2}</div>
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Global AI Agent Summit 2025</h4>
                        <p className="text-gray-400 text-sm">Virtual Conference · 10:00 AM EST</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <button className="px-8 py-4 border border-gray-700 rounded-xl font-medium hover:bg-gray-800/50 transition-all duration-300 inline-flex items-center">
              <span>View Research Portal</span>
              <FiArrowRight className="ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={sections.cta} className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 border border-gray-700 rounded-3xl p-12 backdrop-blur-sm relative overflow-hidden">
            {/* Tube light effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
            
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-500 filter blur-[100px] opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-500 filter blur-[100px] opacity-10"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block mb-6"
              >
                <TbRobot className="text-5xl text-cyan-400 mx-auto" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to <span className="text-cyan-400">Transform</span> Your Business?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-10">
                Join thousands of developers and businesses leveraging AI agents to automate complex tasks and drive innovation.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-cyan-500/20"
                >
                  Get Started Today
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-800/70 border border-gray-700 rounded-xl font-medium hover:bg-gray-700/50 transition-all duration-300"
                >
                  Schedule a Demo
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                  <TbBrandOpenai className="text-xl" />
                </div>
                <h2 className="text-xl font-bold">NeuroMarket</h2>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                The world's leading marketplace for AI agents, connecting developers with businesses worldwide.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'github', 'linkedin', 'discord'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-gray-400"></div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            {['Products', 'Solutions', 'Developers', 'Company', 'Resources'].map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-6">{category}</h3>
                <ul className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                        {category} {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 NeuroMarket. All rights reserved. The future of AI agent distribution.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Artificial;