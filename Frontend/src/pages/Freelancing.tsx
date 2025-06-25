import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

// HERO SECTION DATA
const heroFeatures = [
  { text: "Research Guidance", color: "bg-yellow-200 text-yellow-800" },
  { text: "Global Collaboration", color: "bg-green-100 text-green-800" },
  { text: "Peer-Reviewed Experts", color: "bg-blue-100 text-blue-800" },
  { text: "Custom R&D Solutions", color: "bg-purple-100 text-purple-800" },
  { text: "Secure & Transparent", color: "bg-pink-100 text-pink-800" },
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
    color: "bg-pink-100",
    impact: "10k+ students taught",
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
  autoplay: true,
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
  const sliderRef = useRef<Slider | null>(null);

  // Update visible indexes on slide change
  const handleBeforeChange = (_: number, next: number) => {
    const slidesToShow = sliderSettings.slidesToShow as number;
    const newIndexes: number[] = [];
    for (let i = 0; i < slidesToShow; i++) {
      newIndexes.push((next + i) % stories.length);
    }
    setVisibleIndexes(newIndexes);
  };

  return (
    <main className="w-full min-h-screen bg-white">
      {/* HERO SECTION */}
      <Header />
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1600&q=80"
          alt="PhD freelancing R&D platform"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 max-w-4xl mx-auto px-8 py-24 text-center flex flex-col items-center"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 drop-shadow-[0_0_8px_rgba(250,89,84,0.7)] mb-6 leading-tight"
            variants={fadeUp}
            custom={1}
          >
            Connect with World-Class <span className="text-[#fa5954]">PhD Experts</span> for R&D and Mentorship
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl font-medium"
            variants={fadeUp}
            custom={2}
          >
            Unlock global innovation by collaborating with top PhD scholars and graduates. Access cutting-edge research, personalized mentorship, and specialized consulting—anytime, anywhere.
          </motion.p>
          <motion.div className="flex gap-6" variants={fadeUp} custom={3}>
            <Link
              
              to="/findexpert"
              className="px-8 py-3 rounded-full bg-[#fa5954] text-white font-bold shadow-lg hover:shadow-[0_0_15px_rgba(250,89,84,0.8)] transition-all duration-300 text-lg"
            >
              Find a PhD Expert
            </Link>
            <Link
              to="/become-mentor"
              className="px-8 py-3 rounded-full bg-white text-[#e0514d] font-bold border border-[#e0514d] shadow hover:shadow-[0_0_15px_rgba(224,81,77,0.8)] transition-all duration-300 text-lg"
            >
              Become a Mentor
            </Link>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-3 justify-center mt-12"
            variants={fadeUp}
            custom={4}
          >
            {heroFeatures.map((feature) => (
              <span
                key={feature.text}
                className={`text-xs px-3 py-1 rounded-full font-semibold ${feature.color} shadow-md`}
              >
                {feature.text}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* WHY WE'RE UNIQUE SECTION */}
      <section className="w-full py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Why We're Unique
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              We connect you with the world's brightest PhD minds for research, mentorship, and innovation—delivered with integrity, personalization, and global reach.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {uniquePoints.map((point, idx) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.12, ease: "easeOut" }}
                className={`flex items-start space-x-3 rounded-lg shadow-sm p-4 hover:shadow-lg transition ${point.color}`}
              >
                <div className="flex-shrink-0">{point.icon}</div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{point.title}</h3>
                  <p className="text-sm text-gray-700">{point.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES SECTION */}
      <section className="w-full py-20 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Success Stories
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Real impact, real results. Explore how PhD experts have transformed research, innovation, and mentorship for clients worldwide.
            </p>
            <div className="w-16 h-1 mx-auto mt-2 rounded-full bg-[#fa5954]/30" />
          </div>
          <div className="relative">
            <Slider
              {...sliderSettings}
              ref={sliderRef}
              beforeChange={(_: number, next: number) => {
                const slidesToShow = sliderSettings.slidesToShow as number;
                const newIndexes: number[] = [];
                for (let i = 0; i < slidesToShow; i++) {
                  newIndexes.push((next + i) % stories.length);
                }
                setVisibleIndexes(newIndexes);
              }}
            >
              {stories.map((story, idx) => (
                <div key={story.name} className="h-full flex items-stretch">
                  <motion.div
                    key={visibleIndexes.includes(idx) ? `active-${idx}` : `inactive-${idx}`}
                    initial="initial"
                    animate={visibleIndexes.includes(idx) ? "animate" : "initial"}
                    variants={cardVariants}
                    className={`
                      flex flex-col items-center justify-between
                      rounded-xl shadow-lg ${story.color}
                      border border-white/60 px-6 py-8 mx-3
                      w-[220px] h-[${cardFixedHeight}px] min-h-[${cardFixedHeight}px] max-h-[${cardFixedHeight}px]
                      transition-all
                    `}
                    style={{
                      minHeight: cardFixedHeight,
                      maxHeight: cardFixedHeight,
                      height: cardFixedHeight,
                      width: 220,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={story.img}
                        alt={story.name}
                        className="w-16 h-16 rounded-full object-cover mb-4 ring-2 ring-blue-100 shadow"
                        onError={e => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(story.name) + '&background=E0E7EF&color=374151&size=64'; }}
                      />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-bold text-gray-900">{story.name}</span>
                        <span className="text-md">{story.country}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#fa5954] mb-1 text-center">{story.title}</span>
                      <p className="text-xs text-gray-700 text-center mb-2">{story.desc}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <span className="text-xs px-3 py-1 rounded bg-white/90 text-[#fa5954] font-semibold shadow">
                        {story.impact}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
          {/* CSS for slick spacing and fixed height */}
          <style>{`
            .slick-track {
              display: flex !important;
              align-items: stretch !important;
            }
            .slick-slide {
              height: ${cardFixedHeight}px !important;
              display: flex !important;
              align-items: stretch !important;
              justify-content: center !important;
              padding: 0 12px;
              box-sizing: border-box;
            }
            .slick-list {
              margin: 0 -12px;
              padding-bottom: 8px;
            }
            .slick-dots {
              margin-top: 16px;
            }
          `}</style>
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
        <motion.div
          className="md:hidden flex overflow-x-auto gap-6 py-6 px-1"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              variants={stepVariant}
              className="flex flex-col items-center min-w-[220px] max-w-[240px] bg-gradient-to-br from-white via-[#fff6f5] to-[#fbeeea] rounded-xl shadow-lg px-5 py-6 border border-[#fa5954]/10 mx-1"
            >
              <motion.div
                className="rounded-full bg-white border-4 border-[#fa5954] shadow-lg p-2 mb-3"
                variants={orbPulse}
                animate="animate"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-base font-bold mb-1 text-gray-900">{step.title}</h3>
              <p className="text-xs text-gray-600">{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="w-8 h-1 bg-gradient-to-r from-[#fa5954]/40 to-transparent mt-4 rounded-full" />
              )}
            </motion.div>
          ))}
          {/* CTA at the end */}
          <div className="flex flex-col items-center justify-center min-w-[160px]">
            <button className="px-6 py-3 rounded-full bg-[#fa5954] text-white font-bold shadow-lg hover:shadow-[0_0_18px_rgba(250,89,84,0.7)] transition-all duration-300 text-base">
              Start Now
            </button>
            <span className="mt-2 text-gray-500 text-xs">It's free!</span>
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative w-full overflow-hidden">
        {/* Curved SVG top */}
        <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[80px] md:h-[100px]">
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
        <div className="relative z-20 max-w-3xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg"
          >
            Ready to Accelerate Your Freelance Research Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md"
          >
            Connect instantly with world-class PhD experts, get tailored guidance, and bring your R&D or academic vision to life as a freelancer or client. <br />
            <span className="font-semibold text-[#fa5954]">It's free to get started!</span>
          </motion.p>
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-10 py-4 rounded-full bg-[#fa5954] text-white font-bold text-lg shadow-xl hover:shadow-[0_0_20px_rgba(250,89,84,0.7)] hover:bg-[#e0514d] transition-all duration-300"
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