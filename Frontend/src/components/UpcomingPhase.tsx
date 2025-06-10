import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaRegCalendarAlt,
  FaHammer,
  FaRocket,
  FaLeaf,
  FaSeedling,
  FaSolarPanel,
} from "react-icons/fa";
import { Badge } from "./ui/badge";
import { Leaf } from "lucide-react";
import backdropImage from '@/assets/images/green.jpg';

const projectDetails = [
  {
    title: "Solar Community Grid",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Urban Green Spaces",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Clean Water Initiative",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];

const features = [
  {
    icon: <FaLeaf className="text-green-600 text-lg md:text-3xl" />,
    title: "Eco-Friendly",
    description: "Every project reduces carbon and supports green energy.",
    bg: "bg-green-50"
  },
  {
    icon: <FaSeedling className="text-green-500 text-lg md:text-3xl" />,
    title: "Community Powered",
    description: "Local impact, global change. You help shape the future.",
    bg: "bg-teal-50"
  },
  {
    icon: <FaSolarPanel className="text-teal-500 text-lg md:text-3xl" />,
    title: "Next-Gen Tech",
    description: "AI, IoT, and solar—tech that’s ready for tomorrow.",
    bg: "bg-emerald-50"
  },
];

// --- Timeline (mobile: vertical, slightly stretched, compact) ---
// const Timeline: React.FC = () => (
//   <div className="w-full flex flex-col items-center mt-2 mb-6 md:mb-10">
//     <div className="flex md:flex-row flex-col md:items-end items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto relative gap-0">
//       {timelineSteps.map((step, idx) => (
//         <React.Fragment key={step.label}>
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: idx * 0.2, type: "spring" }}
//             className="flex flex-row md:flex-col items-center md:items-center relative z-10"
//           >
//             <div
//               className={`
//                 w-7 h-7 md:w-14 md:h-14 flex items-center justify-center rounded-full border-4 shadow-lg transition-all duration-300 mb-0 md:mb-1 mr-2 md:mr-0
//                 ${idx === currentStep
//                   ? `${step.dot} scale-110 ring-2 md:ring-4 ring-teal-200 animate-pulse`
//                   : idx < currentStep
//                   ? `${step.dot} opacity-90`
//                   : "bg-gray-100 border-gray-200 opacity-70"}
//               `}
//             >
//               {step.icon}
//             </div>
//             <div className="flex flex-col items-start md:items-center">
//               <span
//                 className={`
//                   text-[10px] md:mt-2 md:text-xs font-bold text-center uppercase tracking-wide
//                   ${idx === currentStep ? "text-teal-600" : "text-gray-600"}`}
//               >
//                 {step.label}
//               </span>
//               <span className="text-[9px] md:hidden text-gray-500 font-semibold text-left">
//                 {step.desc}
//               </span>
//             </div>
//           </motion.div>
//           {/* Connector: vertical on mobile, horizontal on desktop */}
//           {idx < timelineSteps.length - 1 && (
//             <motion.div
//               initial={{ scaleY: 0 }}
//               animate={{ scaleY: 1 }}
//               transition={{ delay: idx * 0.2 + 0.2, type: "spring" }}
//               className={`
//                 md:h-2 md:w-12 h-8 w-1
//                 ${idx < currentStep ? "bg-teal-200" : "bg-gray-200"}
//                 rounded transition-all duration-300 z-0 mx-0 md:mx-1 my-1 md:my-0
//                 ${"md:origin-left origin-top"}
//               `}
//             />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//     {/* Desktop: show descriptions in a row below */}
//     <div className="hidden md:flex mt-4 w-full max-w-2xl mx-auto justify-between text-xs text-gray-500 font-semibold">
//       {timelineSteps.map((step, idx) => (
//         <span
//           key={step.label}
//           className={`w-1/4 text-center ${idx === currentStep ? "text-teal-600 font-bold" : ""}`}
//         >
//           {step.desc}
//         </span>
//       ))}
//     </div>
//   </div>
// );

// --- ProjectCards: Mobile stacked, Desktop zig-zag (original untouched for desktop) ---
const ProjectCards: React.FC = () => (
  <>
    {/* Mobile: stacked cards */}
    <div className="flex flex-col md:hidden gap-2 w-full max-w-[320px] mx-auto">
      {projectDetails.map((project, idx) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: idx * 0.18 }}
          className="shadow-xl bg-white rounded-2xl overflow-hidden"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-20 object-cover"
          />
          <h4 className={`text-sm font-extrabold py-2 text-center tracking-wide ${
            idx === 0 ? "text-green-700"
            : idx === 1 ? "text-teal-700"
            : "text-pink-600"
          }`}>{project.title}</h4>
        </motion.div>
      ))}
    </div>
    {/* Desktop: original zig-zag */}
    <div className="relative hidden md:flex justify-center items-end mt-40 min-h-[340px] w-full max-w-3xl mx-auto">
      {/* Left card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.7, delay: 0.18 }}
        className="relative z-10 shadow-xl hover:scale-105 transition-all duration-300"
        style={{ left: 0, top: 24 }}
      >
        <div className="bg-white rounded-2xl overflow-hidden w-56 shadow-xl">
          <img
            src={projectDetails[0].image}
            alt={projectDetails[0].title}
            className="w-full h-52 object-cover"
          />
          <h4 className="text-lg font-extrabold text-green-700 py-4 text-center tracking-wide">{projectDetails[0].title}</h4>
        </div>
      </motion.div>
      {/* Center card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1.08 }}
        transition={{ type: "spring", duration: 0.7, delay: 0.36 }}
        className="relative z-20 shadow-2xl hover:scale-110 transition-all duration-300 mx-4"
        style={{ bottom: 0, zIndex: 20 }}
      >
        <div className="bg-white rounded-2xl overflow-hidden w-60 shadow-2xl">
          <img
            src={projectDetails[1].image}
            alt={projectDetails[1].title}
            className="w-full h-60 object-cover"
          />
          <h4 className="text-xl font-extrabold text-teal-700 py-5 text-center tracking-wide">{projectDetails[1].title}</h4>
        </div>
      </motion.div>
      {/* Right card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.7, delay: 0.54 }}
        className="relative z-10 shadow-xl hover:scale-105 transition-all duration-300"
        style={{ right: 0, top: 24 }}
      >
        <div className="bg-white rounded-2xl overflow-hidden w-56 shadow-xl">
          <img
            src={projectDetails[2].image}
            alt={projectDetails[2].title}
            className="w-full h-52 object-cover"
          />
          <h4 className="text-lg font-extrabold text-pink-600 py-4 text-center tracking-wide">{projectDetails[2].title}</h4>
        </div>
      </motion.div>
    </div>
  </>
);

// --- Features (smaller in mobile) ---
const Features: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-12">
    {features.map((feature, idx) => (
      <div
        key={idx}
        className={`flex flex-col items-center rounded-2xl shadow p-2 md:p-6 hover:shadow-lg transition min-h-[70px] md:min-h-[160px] ${feature.bg}`}
      >
        <div className="mb-1 md:mb-3">{feature.icon}</div>
        <h4 className="text-xs md:text-lg font-semibold text-teal-800 mb-0.5 md:mb-1">{feature.title}</h4>
        <p className="text-gray-600 text-[11px] md:text-sm text-center">{feature.description}</p>
      </div>
    ))}
  </div>
);

// --- Pre-Book Form ---
const PreJoinForm: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "" });
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="relative w-full max-w-[320px] sm:max-w-sm md:max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl mt-6 md:mt-8 mb-2 md:mb-4 bg-white"
    >
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-2 md:gap-4 p-3 md:p-8"
        autoComplete="off"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 md:mb-2">
          <span className="inline-block bg-gradient-to-r from-teal-400 to-green-400 text-white px-2 py-1 rounded-full font-bold text-xs shadow uppercase tracking-wider">
            Join Now
          </span>
          <span className="text-teal-600 font-bold text-xs md:text-sm animate-pulse">
            Limited Early Access
          </span>
        </div>
        <h3 className="text-gray-900 text-base md:text-2xl font-extrabold mb-1 md:mb-2 text-center drop-shadow-lg">
          Reserve Your Spot for the Next Big Leap
        </h3>
        <p className="text-center text-gray-700 text-xs md:text-sm mb-1 md:mb-2">
          Be among the first to unlock our next-generation sustainable solutions.
          <span className="block text-teal-600 font-semibold mt-1">
            No payment required—just your curiosity and passion!
          </span>
        </p>
        <input
          name="name"
          required
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="px-2 py-2 md:px-4 md:py-3 rounded-lg bg-white outline-none focus:ring-2 ring-teal-300 text-gray-800 font-medium text-xs md:text-base transition"
          disabled={submitted}
        />
        <input
          name="email"
          required
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="px-2 py-2 md:px-4 md:py-3 rounded-lg bg-white outline-none focus:ring-2 ring-teal-300 text-gray-800 font-medium text-xs md:text-base transition"
          disabled={submitted}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-teal-400 to-green-400 hover:from-green-400 hover:to-teal-400 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition shadow-lg text-base md:text-lg tracking-wide"
          disabled={submitted}
        >
          {submitted ? "Pre-Booked!" : "Reserve My Spot"}
        </button>
        {submitted && (
          <div className="text-green-700 text-center font-semibold mt-2 animate-fade-in text-xs md:text-base">
            🎉 Thank you! You’re now on the priority list.
          </div>
        )}
      </form>
    </motion.div>
  );
};

export const UpcomingPhase: React.FC = () => (
  <section
    className="relative min-h-screen overflow-x-hidden"
    id="sustainable-projects"
    style={{
      background: "#f8fafc",
      backgroundAttachment: "fixed",
    }}
  >
    {/* Animated blurred blobs */}
    <motion.div
      className="absolute inset-0 -z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 md:w-36 md:h-36 bg-teal-100 opacity-30 rounded-full blur-2xl"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 md:right-16 w-24 h-24 md:w-48 md:h-48 bg-green-100 opacity-40 rounded-full blur-2xl"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/6 md:right-1/4 w-14 h-14 md:w-28 md:h-28 bg-pink-100 opacity-40 rounded-full blur-xl"
        animate={{ y: [0, 16, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "url('https://www.transparenttextures.com/patterns/grunge-wall.png') repeat",
          opacity: 0.04,
        }}
      />
    </motion.div>

    <div className="relative z-10 max-w-[340px] sm:max-w-2xl md:max-w-6xl mx-auto px-1 sm:px-4 py-4 md:py-12">
      {/* Header + Timeline */}
      <div className="flex flex-col items-center mb-2 md:mb-4">
        <Badge className="mb-2 md:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white animate-pulse text-xs md:text-base">
            <Leaf className="w-3 h-3 mr-1 animate-bounce" />
            Upcoming Phase
          </Badge>
      </div>
      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-24 items-center">
        {/* Left: Info, Form */}
        <div>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 md:mb-4 drop-shadow-lg leading-tight">
            Sustainable Projects
            <br />
            for a Brighter Future
          </h2>
          <p className="text-sm sm:text-lg text-gray-800 mb-3 md:mb-6 max-w-xl drop-shadow">
            <span className="block mb-1">
              Ready to be part of something bigger?
            </span>
            Join Early for your spot to be among the first to access our next-generation, eco-powered community solutions.
            <span className="block mt-2 text-teal-600 font-bold">
              No payment. No risk. Just pure anticipation and exclusive updates.
            </span>
          </p>
          <PreJoinForm />
        </div>
        {/* Right: Zig-Zag Collage Cards */}
        <div className="flex flex-col items-center">
          <ProjectCards />
          <div className="mt-4 md:mt-24 text-center text-gray-800 font-semibold text-xs md:text-base bg-white rounded-xl px-2 py-2 md:px-6 md:py-3 shadow">
            <span className="text-teal-700 font-extrabold">
              Why these projects?
            </span>
            <br />
            Each project is handpicked for its real-world impact, innovation, and the excitement it brings to our community.
            <span className="block mt-1 text-green-600">
              By pre-booking, you’re joining a movement for a sustainable tomorrow.
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* --- FULL-WIDTH BACKDROP FOR FEATURES SECTION --- */}
    <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mt-4 md:mt-12">
      {/* Backdrop image: full width, solid, no blur, higher opacity */}
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          background: `url(${backdropImage}) center/cover no-repeat`,
          opacity: 0.8,
        }}
      />
      {/* Centralized content container */}
      <div className="max-w-[340px] sm:max-w-2xl md:max-w-6xl mx-auto py-2 md:py-4">
        <Features />
        <div className="flex justify-center mt-4 md:mt-10">
          <span className="inline-block px-3 py-2 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-teal-100 via-green-100 to-white text-teal-900 font-semibold text-xs md:text-base shadow animate-pulse">
            🚀 Launching Summer 2025 — Secure Your Place Now!
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default UpcomingPhase;
