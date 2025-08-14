import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import {
  Shield,
  Zap,
  Users,
  Target,
  BookOpen,
  Headphones,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import provideImg from "@/assets/images/provide-removebg-preview (1).png";

export const WhatWeProvide = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Memoize services array to prevent recreation on every render
  const services = useMemo(() => [
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        `Enterprise-grade encryption keeps all your work and IP protected.
        <ul style="list-style-type: disc; padding-left: 1rem; margin-top: 0.5rem;">
          <li>End to End data protection</li>
          <li>Regular Security Alerts</li>
          <li>Secure Cloud Infrastructure</li>
          <li>Role Base Access Control</li>
          <li>Encrypted File Storage</li>
          <li>Real Time Threat Monitoring</li>
        </ul>`,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      rowSpan: "row-span-2",
    },
    {
      icon: Zap,
      title: "AI Matching",
      description:
        "Smart recommendations connect you with projects and collaborators.",
      color: "from-yellow-400 to-orange-500",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      rowSpan: "row-span-1",
    },
    {
      icon: Users,
      title: "Mentorship",
      description:`
          Exclusive One to One sessions and workshops with industry leaders.
          <ul style="list-style-type: disc; padding-left: 1rem; margin-top: 0.5rem;">
            <li>Personalized career guidance</li>
            <li>Real-world project reviews</li>
            <li>Weekly mentor check-ins</li>
            <li>Access to alumni & expert network</li>
            <li>Progress tracking and feedback</li>
            <li>Resume and interview prep</li>
          </ul>
        `,
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      rowSpan: "row-span-2",
    },
    {
      icon: Target,
      title: "Project Control",
      description:
        "Boards, timelines, and progress charts to keep teams aligned.",
      color: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      rowSpan: "row-span-1",
    },
    {
      icon: BookOpen,
      title: "Resources",
      description:
        `Curated courses, tutorials, and certifications to keep you growing.\
        <ul style="list-style-type: disc; padding-left: 1rem; margin-top: 0.5rem;">
          <li>Skill specific learning paths</li>
          <li>Expert-led masterclasses</li>
          <li>Recognized Certifications</li>
          <li>Regularly updated content</li>
          <li>Weekly webinars & live Q&A</li>
          <li>Hands on project examples</li>
        </ul>`,
      color: "from-pink-500 to-rose-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      rowSpan: "row-span-2",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Human-assisted chat with AI knowledge base, always available.",
      color: "from-teal-500 to-cyan-600",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      rowSpan: "row-span-1",
    },
  ], []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { 
    once: true, 
    margin: "-50px"
  });

  // Memoize animation variants for better performance
  const mobileVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }), []);

  const desktopVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }), []);

  // Optimize hover effects for mobile
  const handleHover = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth < 640) return; // Disable hover on mobile
    // Light hover effect for desktop
  }, []);

  return (
    <section className="relative py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Enhanced Background Blobs with better colors */}
      {/* <div className="absolute top-[-120px] left-[-120px] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 rounded-full blur-[50px] sm:blur-[80px] z-0 animate-pulse"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 rounded-full blur-[30px] sm:blur-[60px] z-0 animate-pulse"></div>
      <div className="absolute top-[60%] left-[10%] w-[120px] sm:w-[400px] h-[120px] sm:h-[400px] bg-gradient-to-br from-green-400 to-emerald-400 opacity-20 rounded-full blur-[25px] sm:blur-[60px] z-0 animate-pulse"></div> */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="mt-2 text-4xl font-bold text-gray-800 leading-tight mobile-text-4xl">
            Empowering Innovation with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Creative Technology
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base text-gray-600 max-w-xl mx-auto leading-relaxed mobile-text-base">
            Tools and support to bring your ideas to life — securely, creatively, efficiently.
          </p>
        </div>

        {/* Mobile Layout - Beautiful and colorful cards */}
        <div className="sm:hidden">
          <div
            ref={mobileContainerRef}
            className="grid grid-cols-1 gap-6"
          >
            {services.map((item, idx) => {
              const stagger = Math.min(idx * 0.1, 0.5);
              return (
                <motion.div
                  key={idx}
                  variants={mobileVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ 
                    duration: 0.5,
                    delay: stagger, 
                    ease: "easeOut" 
                  }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Beautiful gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`}></div>
                  
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 text-white">
                    {/* Icon with beautiful background */}
                    <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 leading-tight">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <div
                      className="text-white/90 [&_ul]:pl-4 [&_li]:text-base [&_li]:mb-2 leading-relaxed [&_li]:text-white/80"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Desktop Layout - Enhanced Masonry Grid */}
        <div
          ref={containerRef}
          className="
            hidden sm:grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
            sm:gap-6
            lg:gap-8
            auto-rows-[120px]
            sm:auto-rows-[140px]
            lg:auto-rows-[160px]
            xl:auto-rows-[180px]
          "
        >
          {services.map((item, idx) => {
            const stagger = Math.min(idx * 0.1, 0.6);
            return (
              <motion.div
                key={idx}
                variants={desktopVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ 
                  duration: 0.6,
                  delay: stagger, 
                  ease: "easeOut" 
                }}
                onMouseEnter={handleHover}
                className={`
                  ${item.rowSpan}
                  group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2
                `}
              >
                {/* Beautiful gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`}></div>
                
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                  }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-4 sm:p-5 lg:p-6 text-white h-full flex flex-col justify-between">
                  {/* Icon with beautiful background */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${item.iconColor}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 leading-tight">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <div
                    className="text-sm sm:text-base text-white/90 [&_ul]:pl-3 sm:[&_ul]:pl-4 lg:[&_ul]:pl-5 [&_li]:text-sm sm:[&_li]:text-base [&_li]:mb-1 leading-relaxed [&_li]:text-white/80 flex-grow"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.div>
            );
          })}

          {/* Bottom-right image filling the blank space */}
          <div className="hidden sm:block">
            <img
              src={provideImg}
              alt="What We Provide"
              className="w-full h-full object-cover object-bottom-right rounded-2xl shadow-lg"
              loading="lazy"
            />
          </div>
          
          {/* Additional section for desktop to fill space - spans both columns */}
          <div className="hidden sm:block col-span-2">
            <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl p-6 flex flex-col justify-center items-center text-center text-white shadow-lg relative overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 leading-tight">Ready to Get Started?</h3>
                <p className="text-base text-white/90">Join our platform and start building amazing projects with our tools and support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
