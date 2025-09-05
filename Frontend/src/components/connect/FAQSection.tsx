import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Do you only work with startups?',
    answer: 'We work with businesses of all sizes — from innovative startups to established enterprises. Our platform is designed to serve students, PhD researchers, professors, and businesses of any scale. Whether you\'re a solo entrepreneur or a Fortune 500 company, we provide tailored solutions to meet your innovation and collaboration needs.',
  },
  {
    question: 'How long does a project take?',
    answer: 'Project timelines vary based on scope and complexity. Simple collaborations can be established within days, while comprehensive research projects may take several months. We prioritize quality and thoroughness, but our streamlined platform ensures efficient project management. Most projects see significant progress within 4-8 weeks.',
  },
  {
    question: 'Do you offer post-launch support?',
    answer: 'Absolutely! We provide comprehensive post-launch support and maintenance options. Our commitment extends beyond project completion with ongoing mentorship, technical assistance, and platform updates. We offer different support tiers to match your needs, ensuring your projects continue to thrive and evolve.',
  },
  {
    question: 'What industries do you specialize in?',
    answer: 'We specialize in a wide range of industries including technology, education, e-commerce, healthcare, renewable energy, AI/ML, biotechnology, and sustainable development. Our diverse network of experts spans across traditional and emerging sectors, enabling cross-disciplinary innovation and collaboration.',
  },
  {
    question: 'Can I just get an MVP built?',
    answer: 'Yes! We specialize in MVP development and rapid prototyping. Our platform connects you with skilled developers, designers, and domain experts who can quickly turn your ideas into functional prototypes. We focus on lean development methodologies to get your MVP to market faster while maintaining quality standards.',
  },
  {
    question: 'How do you ensure quality of collaborations?',
    answer: 'We maintain high standards through verified profiles, skill assessments, and peer reviews. All participants undergo a thorough verification process, and our platform includes built-in quality control mechanisms. We also provide mentorship and guidance to ensure successful project outcomes.',
  },
];

const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#0f0f1b] text-white py-16 px-4 sm:px-6 md:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="heading-section font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Can't find the answer you're looking for? Don't worry, reach out to our support team.
          </p>
        </div>

        {/* FAQ Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="space-y-4 md:space-y-6">
            {faqData.slice(0, Math.ceil(faqData.length / 2)).map((item, index) => {
              const isOpen = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`rounded-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                    isOpen 
                      ? 'bg-gradient-to-r from-purple-600/90 to-pink-500/90 shadow-lg shadow-purple-500/25' 
                      : 'bg-[#1c1c2e]/80 hover:bg-[#1c1c2e] hover:border-gray-600'
                  }`}
                >
                  <button
                    onClick={() => toggleIndex(index)}
                    className="w-full flex justify-between items-start px-4 sm:px-6 py-4 sm:py-5 text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-xl transition-all duration-200"
                  >
                    <span className={`font-semibold text-sm sm:text-base leading-relaxed pr-4 ${
                      isOpen ? 'text-white' : 'text-gray-200 hover:text-white'
                    }`}>
                      {item.question}
                    </span>
                    <span className={`text-white text-lg sm:text-xl font-bold transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-gray-300 leading-relaxed transition-all duration-300 ${
                      isOpen ? 'block opacity-100' : 'hidden opacity-0'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {faqData.slice(Math.ceil(faqData.length / 2)).map((item, index) => {
              const actualIndex = index + Math.ceil(faqData.length / 2);
              const isOpen = actualIndex === activeIndex;
              return (
                <div
                  key={actualIndex}
                  className={`rounded-xl overflow-hidden border border-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
                    isOpen 
                      ? 'bg-gradient-to-r from-purple-600/90 to-pink-500/90 shadow-lg shadow-purple-500/25' 
                      : 'bg-[#1c1c2e]/80 hover:bg-[#1c1c2e] hover:border-gray-600'
                  }`}
                >
                  <button
                    onClick={() => toggleIndex(actualIndex)}
                    className="w-full flex justify-between items-start px-4 sm:px-6 py-4 sm:py-5 text-left focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-xl transition-all duration-200"
                  >
                    <span className={`font-semibold text-sm sm:text-base leading-relaxed pr-4 ${
                      isOpen ? 'text-white' : 'text-gray-200 hover:text-white'
                    }`}>
                      {item.question}
                    </span>
                    <span className={`text-white text-lg sm:text-xl font-bold transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-gray-300 leading-relaxed transition-all duration-300 ${
                      isOpen ? 'block opacity-100' : 'hidden opacity-0'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  );
};

export default FaqSection;
