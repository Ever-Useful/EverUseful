import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const heroImage =
  "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1200&q=80";

const steps = [
  {
    icon: (
      <svg className="w-8 h-8 text-[#fa5954]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2l4-4" />
      </svg>
    ),
    title: "Apply Online",
    desc: "Share your expertise and mentoring interests.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#fa5954]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M16 12a4 4 0 01-8 0" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    ),
    title: "Get Verified",
    desc: "We review your credentials for authenticity.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#fa5954]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

const countries = [
  "United States", "United Kingdom", "India", "Germany", "Canada", "Australia", "France", "China", "Japan", "Other"
];

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
        <Header/>
      {/* Sleek Hero Section */}
      <section className="w-full flex flex-col items-center justify-center min-h-[60vh] py-8 xs:py-12 px-2 xs:px-4 overflow-hidden relative">
        <img
          src={heroImage}
          alt="Mentor workspace"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" style={{zIndex:1}} />
        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 xs:mb-4 drop-shadow-lg leading-tight"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.38)" }}
          >
            Become a Mentor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base xs:text-lg md:text-xl text-white mb-5 xs:mb-7"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.28)" }}
          >
            Share your expertise, guide innovators, and earn by mentoring global research projects and students.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleShowForm}
            className="w-full xs:w-auto px-6 xs:px-8 py-3 rounded-full bg-[#fa5954] text-white font-bold shadow-lg hover:bg-[#e0514d] transition-all duration-300 text-base xs:text-lg"
          >
            Apply as a Mentor
          </motion.button>
        </div>
      </section>

      {/* Steps/Benefits */}
      <section className="w-full py-8 xs:py-10 px-2 xs:px-4 bg-gradient-to-br from-white via-[#fff6f5] to-[#fbeeea]">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 xs:gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center bg-white rounded-xl shadow-md px-4 xs:px-6 py-6 xs:py-8 w-full max-w-xs border border-[#fa5954]/10 mb-3 md:mb-0"
              >
                <div className="mb-2 xs:mb-3">{step.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-xs xs:text-sm text-gray-600 text-center">{step.desc}</p>
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
            className="w-full py-8 xs:py-14 px-2 xs:px-4 flex flex-col items-center bg-[#f8fafc] border-t border-[#fa5954]/10"
          >
            <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-xl p-4 xs:p-6 sm:p-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 xs:mb-6 text-center mobile-text-4xl">
                Mentor Application
              </h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center text-green-600 font-semibold py-8"
                >
                  Thank you for applying!<br />Our team will review your profile and get in touch soon.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
                  {/* Personal Info */}
                  <div className="space-y-3 xs:space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Full Name *</label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full px-3 xs:px-4 py-2 rounded-lg border ${errors.name ? "border-red-400" : "border-gray-300"} focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm`}
                        placeholder="Your name"
                      />
                      {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Email *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-3 xs:px-4 py-2 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-300"} focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm`}
                        placeholder="you@email.com"
                      />
                      {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-3 xs:px-4 py-2 rounded-lg border border-gray-300 focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Country</label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-3 xs:px-4 py-2 rounded-lg border border-gray-300 focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm"
                      >
                        <option value="">Select</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">LinkedIn Profile</label>
                      <input
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        className="w-full px-3 xs:px-4 py-2 rounded-lg border border-gray-300 focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                  {/* Academic/Professional & Mentoring */}
                  <div className="space-y-3 xs:space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Highest Degree *</label>
                      <input
                        required
                        name="degree"
                        value={form.degree}
                        onChange={handleChange}
                        className={`w-full px-3 xs:px-4 py-2 rounded-lg border ${errors.degree ? "border-red-400" : "border-gray-300"} focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm`}
                        placeholder="e.g. PhD in Physics"
                      />
                      {errors.degree && <div className="text-xs text-red-500 mt-1">{errors.degree}</div>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Institution *</label>
                      <input
                        required
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                        className={`w-full px-3 xs:px-4 py-2 rounded-lg border ${errors.institution ? "border-red-400" : "border-gray-300"} focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm`}
                        placeholder="Your university or institute"
                      />
                      {errors.institution && <div className="text-xs text-red-500 mt-1">{errors.institution}</div>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Expertise / Field *</label>
                      <input
                        required
                        name="expertise"
                        value={form.expertise}
                        onChange={handleChange}
                        className={`w-full px-3 xs:px-4 py-2 rounded-lg border ${errors.expertise ? "border-red-400" : "border-gray-300"} focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm`}
                        placeholder="e.g. AI, Biology, Engineering"
                      />
                      {errors.expertise && <div className="text-xs text-red-500 mt-1">{errors.expertise}</div>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Years of Experience</label>
                      <input
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        className="w-full px-3 xs:px-4 py-2 rounded-lg border border-gray-300 focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm"
                        placeholder="e.g. 5"
                        type="number"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Mentoring Type *</label>
                      <select
                        required
                        name="mentoringType"
                        value={form.mentoringType}
                        onChange={handleChange}
                        className={`w-full px-3 xs:px-4 py-2 rounded-lg border ${errors.mentoringType ? "border-red-400" : "border-gray-300"} focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm`}
                      >
                        <option value="">Select</option>
                        <option value="Academic Guidance">Academic Guidance</option>
                        <option value="Industry R&D">Industry R&D</option>
                        <option value="Career Coaching">Career Coaching</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.mentoringType && <div className="text-xs text-red-500 mt-1">{errors.mentoringType}</div>}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Languages Spoken</label>
                      <input
                        name="languages"
                        value={form.languages}
                        onChange={handleChange}
                        className="w-full px-3 xs:px-4 py-2 rounded-lg border border-gray-300 focus:border-[#fa5954] focus:outline-none text-xs xs:text-sm"
                        placeholder="e.g. English, Hindi"
                      />
                    </div>
                  </div>
                  {/* Full width: Short Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1 text-xs xs:text-sm">Short Bio *</label>
                    <textarea
                      required
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-3 xs:px-4 py-2 rounded-lg border ${errors.bio ? "border-red-400" : "border-gray-300"} focus:border-[#fa5954] focus:outline-none resize-none text-xs xs:text-sm`}
                      placeholder="Tell us about your background, achievements, and why you want to mentor."
                    />
                    {errors.bio && <div className="text-xs text-red-500 mt-1">{errors.bio}</div>}
                  </div>
                  <div className="md:col-span-2 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="mt-2 px-6 xs:px-10 py-2 xs:py-3 rounded-full bg-[#fa5954] text-white font-bold shadow-lg hover:bg-[#e0514d] transition-all duration-300 text-base xs:text-lg"
                    >
                      Submit Application
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <Footer/>
    </main>
  );
};

export default BecomeMentor;