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
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-300 opacity-30 rounded-full blur-[90px] sm:blur-[120px] z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-pink-300 opacity-30 rounded-full blur-[70px] sm:blur-[100px] z-0" />
      <div className="absolute top-[60%] left-[10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-blue-200 opacity-20 rounded-full blur-[60px] sm:blur-[90px] z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="mt-2 text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-800">
            Empowering Innovation with{" "}
            <span className="text-indigo-600">Creative Technology</span>
          </h2>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Tools and support to bring your ideas to life — securely, creatively, efficiently.
          </p>
        </div>

        {/* Responsive Masonry Cards Grid */}
        <div
          ref={containerRef}
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
            sm:gap-8
            auto-rows-[120px]
            sm:auto-rows-[160px]
            lg:auto-rows-[180px]
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
                  scale: 1.03,
                  boxShadow: "0 20px 30px rgba(0,0,0,0.08)",
                }}
                className={`
                  ${item.rowSpan}
                  rounded-2xl
                  p-3
                  sm:p-6
                  ${item.color}
                  bg-opacity-90
                  border border-gray-200
                  shadow-sm
                  transition duration-300
                  flex flex-col
                  justify-between
                  relative
                  overflow-hidden
                `}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl mb-2 sm:mb-4 bg-white/60">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-white-800 mb-1">
                    {item.title}
                  </h3>
                  <div
                    className="text-xs sm:text-lg text-white-700"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />

                </div>
              </motion.div>
            );
          })}

          {/* Bottom-right image filling the blank space */}
          <div
            // className="
            //   row-span-2
            //   rounded-2xl
            //   overflow-hidden
            //   flex items-center justify-center
            //   border border-gray-200
            //   shadow-sm
            //   bg-white
            // "
          >
            <img
              src={provideImg}
              alt="What We Provide"
              className="w-full h-full object-cover object-bottom-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
