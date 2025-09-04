import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDropdownOptions } from '../utils/dropdownUtils';
import { Star, Users, TrendingUp, Globe, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1200&q=80";

const steps = [
  {
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#fa5954]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2l4-4" />
      </svg>
    ),
    title: "Apply Online",
    desc: "Share your expertise and mentoring interests.",
  },
  {
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#fa5954]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M16 12a4 4 0 01-8 0" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    ),
    title: "Get Verified",
    desc: "We review your credentials for authenticity.",
  },
  {
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#fa5954]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Start Mentoring",
    desc: "Connect, guide, and earn on your terms.",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  linkedin: "",
  degree: "",
  institution: "",
  expertise: "",
  experience: "",
  mentoringType: "",
  languages: "",
  bio: "",
};

const countries = getDropdownOptions('countries').map(option => option.value);

const BecomeMentor: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const formRef = useRef<HTMLDivElement>(null);

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // Simple validation
  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.degree) newErrors.degree = "Degree is required";
    if (!form.institution) newErrors.institution = "Institution is required";
    if (!form.expertise) newErrors.expertise = "Expertise is required";
    if (!form.mentoringType) newErrors.mentoringType = "Please select a mentoring type";
    if (!form.bio) newErrors.bio = "Short bio is required";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
    // Here, you would send data to your backend
    setTimeout(() => setForm(initialForm), 1500);
  };

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden bg-white">
        <img
          src={heroImage}
          alt="Mentor workspace"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200 shadow-lg mb-4 sm:mb-6"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#fa5954]" />
            <span className="text-slate-700 text-xs sm:text-sm font-semibold">Join Our Expert Network</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
          >
            Become a <span className="text-[#fa5954]">Mentor</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 lg:mb-10 px-4"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
          >
            Share your expertise, guide innovators, and earn by mentoring global research projects and students. Join our network of world-class PhD experts.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowForm}
            className="group inline-flex items-center gap-2 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#fa5954] to-[#e0514d] text-white font-semibold rounded-full hover:from-[#e0514d] hover:to-[#fa5954] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Apply as a Mentor
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-[#fff6f5] to-[#fbeeea]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm mb-4 sm:mb-6">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-slate-700 text-xs sm:text-sm font-semibold">Simple Process</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-6 leading-tight">
              How to Get Started
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
              Your journey to becoming a mentor is just three simple steps away. Start making an impact today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                className="relative"
              >
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 h-full border border-slate-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 sm:w-10 sm:h-10 bg-[#fa5954] text-white rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg">
                    {idx + 1}
                  </div>
                  
                  <div className="flex flex-col items-center text-center h-full pt-4">
                    <div className="mb-3 sm:mb-4 lg:mb-6">{step.icon}</div>
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 lg:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <AnimatePresence>
        {showForm && (
          <motion.section
            ref={formRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] border-t border-[#fa5954]/10"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mb-8 sm:mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm mb-4 sm:mb-6">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#fa5954]" />
                  <span className="text-slate-700 text-xs sm:text-sm font-semibold">Application Form</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3 sm:mb-4 lg:mb-6 leading-tight">
                  Mentor Application
                </h2>
                
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
                  Complete the form below to start your journey as a mentor. Our team will review your application and get back to you within 48 hours.
                </p>
              </motion.div>

              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 xl:p-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 sm:py-16"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 sm:mb-4">
                      Application Submitted!
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
                      Thank you for applying! Our team will review your profile and get in touch within 48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Personal Info */}
                    <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4 lg:mb-6 border-b border-slate-200 pb-2">
                        Personal Information
                      </h3>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base ${errors.name ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"}`}
                          placeholder="Your full name"
                        />
                        {errors.name && <div className="text-sm text-red-500 mt-1 sm:mt-2">{errors.name}</div>}
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base ${errors.email ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"}`}
                          placeholder="you@email.com"
                        />
                        {errors.email && <div className="text-sm text-red-500 mt-1 sm:mt-2">{errors.email}</div>}
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Country
                        </label>
                        <select
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base"
                        >
                          <option value="">Select your country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          LinkedIn Profile
                        </label>
                        <input
                          name="linkedin"
                          value={form.linkedin}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>

                    {/* Academic/Professional & Mentoring */}
                    <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4 lg:mb-6 border-b border-slate-200 pb-2">
                        Academic & Professional
                      </h3>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Highest Degree <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          name="degree"
                          value={form.degree}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base ${errors.degree ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"}`}
                          placeholder="e.g. PhD in Computer Science"
                        />
                        {errors.degree && <div className="text-sm text-red-500 mt-1 sm:mt-2">{errors.degree}</div>}
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Institution <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          name="institution"
                          value={form.institution}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base ${errors.institution ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"}`}
                          placeholder="Your university or institute"
                        />
                        {errors.institution && <div className="text-sm text-red-500 mt-1 sm:mt-2">{errors.institution}</div>}
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Expertise/Field <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          name="expertise"
                          value={form.expertise}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base ${errors.expertise ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"}`}
                          placeholder="e.g. AI, Machine Learning, Biology"
                        />
                        {errors.expertise && <div className="text-sm text-red-500 mt-1 sm:mt-2">{errors.expertise}</div>}
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Years of Experience
                        </label>
                        <input
                          name="experience"
                          value={form.experience}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base"
                          placeholder="e.g. 5"
                          type="number"
                          min={0}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Mentoring Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          name="mentoringType"
                          value={form.mentoringType}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base ${errors.mentoringType ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"}`}
                        >
                          <option value="">Select mentoring type</option>
                          {getDropdownOptions('mentoringTypes').map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {errors.mentoringType && <div className="text-sm text-red-500 mt-1 sm:mt-2">{errors.mentoringType}</div>}
                      </div>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Languages Spoken
                        </label>
                        <input
                          name="languages"
                          value={form.languages}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none transition-colors text-sm sm:text-base"
                          placeholder="e.g. English, Hindi, Spanish"
                        />
                      </div>
                    </div>

                    {/* Full width: Short Bio */}
                    <div className="lg:col-span-2">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4 lg:mb-6 border-b border-slate-200 pb-2">
                        About You
                      </h3>
                      
                      <div>
                        <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                          Short Bio <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          name="bio"
                          value={form.bio}
                          onChange={handleChange}
                          rows={5}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-[#fa5954]/20 focus:border-[#fa5954] focus:outline-none resize-none transition-colors text-sm sm:text-base ${errors.bio ? "border-red-400 bg-red-50" : "border-slate-300 hover:border-slate-400"}`}
                          placeholder="Tell us about your background, achievements, research interests, and why you want to become a mentor. (Minimum 100 characters)"
                        />
                        {errors.bio && <div className="text-sm text-red-500 mt-1 sm:mt-2">{errors.bio}</div>}
                        <div className="text-xs text-slate-500 mt-1 sm:mt-2">
                          {form.bio.length}/500 characters
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 flex justify-center pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="group inline-flex items-center gap-2 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#fa5954] to-[#e0514d] text-white font-semibold rounded-full hover:from-[#e0514d] hover:to-[#fa5954] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        Submit Application
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      <Footer />
    </main>
  );
};

export default BecomeMentor;