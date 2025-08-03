import { useRef } from "react";
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
  // Assign unique solid bg colors and card heights using grid row spans
  const services = [
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        `Enterprise-grade encryption keeps all your work and IP protected.
        <ul style="list-style-type: disc; padding-left: 1rem; margin-top: 0.5rem;">
          <li>End to End data protection</li>
          <li>regular Security Alerts</li>
          <li>Secure Cloud Infrastructure</li>
          <li>Role Base Access Control</li>
          <li>Encrypted File Storage</li>
          <li>Real Time Threat Monitoring</li>
        </ul>`,
      color: "bg-blue-500",
      rowSpan: "row-span-2",
    },
    {
      icon: Zap,
      title: "AI Matching",
      description:
        "Smart recommendations connect you with projects and collaborators.",
      color: "bg-yellow-400",
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
      color: "bg-purple-500",
      rowSpan: "row-span-2",
    },
    {
      icon: Target,
      title: "Project Control",
      description:
        "Boards, timelines, and progress charts to keep teams aligned.",
      color: "bg-green-500",
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
          <li>Recognised Certifications</li>
          <li>Regularly updated content</li>
          <li>Weekly webinars & live QnA</li>
          <li>Hands on project exaples</li>
        </ul>`,
      color: "bg-pink-500",
      rowSpan: "row-span-2",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Human-assisted chat with AI knowledge base, always available.",
      color: "bg-teal-500",
      rowSpan: "row-span-1",
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-300 opacity-30 rounded-full blur-[70px] sm:blur-[120px] z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-pink-300 opacity-30 rounded-full blur-[50px] sm:blur-[100px] z-0" />
      <div className="absolute top-[60%] left-[10%] w-[120px] sm:w-[400px] h-[120px] sm:h-[400px] bg-blue-200 opacity-20 rounded-full blur-[40px] sm:blur-[90px] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="mt-2 text-4xl font-bold text-gray-800 leading-tight">
            Empowering Innovation with{" "}
            <span className="text-indigo-600">Creative Technology</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            Tools and support to bring your ideas to life — securely, creatively, efficiently.
          </p>
        </div>

        {/* Responsive Masonry Cards Grid */}
        <div
          ref={containerRef}
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            sm:gap-6
            lg:gap-8
            auto-rows-[120px]
            sm:auto-rows-[140px]
            lg:auto-rows-[160px]
            xl:auto-rows-[180px]
          "
        >
          {services.map((item, idx) => {
            const stagger = idx * 0.1;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: stagger, ease: "easeOut" }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 30px rgba(0,0,0,0.08)",
                }}
                className={`
                  ${item.rowSpan}
                  rounded-xl
                  sm:rounded-2xl
                  p-5
                  sm:p-5
                  lg:p-6
                  ${item.color}
                  bg-opacity-90
                  border border-gray-200
                  shadow-sm
                  transition duration-300
                  flex flex-col
                  justify-between
                  relative
                  overflow-hidden
                  min-h-[140px]
                  sm:min-h-[160px]
                  lg:min-h-[180px]
                `}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 flex items-center justify-center rounded-lg sm:rounded-xl mb-3 sm:mb-3 lg:mb-4 bg-white/60">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2 sm:mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <div
                    className="text-xs sm:text-sm lg:text-base text-white/90 [&_ul]:pl-3 sm:[&_ul]:pl-4 lg:[&_ul]:pl-5 [&_ul]:mt-1 sm:[&_ul]:mt-2 [&_li]:text-xs sm:[&_li]:text-sm lg:[&_li]:text-base [&_li]:mb-1 sm:[&_li]:mb-1 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </motion.div>
            );
          })}

          {/* Bottom-right image filling the blank space */}
          <div className="hidden sm:block">
            <img
              src={provideImg}
              alt="What We Provide"
              className="w-full h-full object-cover object-bottom-right rounded-xl sm:rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
