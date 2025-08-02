import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Do you only work with startups?',
    answer: 'We work with businesses of all sizes — not just startups!',
  },
  {
    question: 'How long does a project take?',
    answer: 'Scope-dependent. But we move fast.',
  },
  {
    question: 'Do you offer post-launch support?',
    answer: 'Yes! We provide ongoing support and maintenance options.',
  },
  {
    question: 'What industries do you specialize in?',
    answer: 'Tech, education, e-commerce, healthcare, and more.',
  },
  {
    question: 'Can I just get an MVP built?',
    answer: 'Absolutely — we specialize in MVP development.',
  },
];

const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="bg-[#0f0f1b] text-white py-16 px-6 sm:px-12 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left Column */}
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 mb-6">
            Can’t find the answer you are looking for? Don’t worry, reach out to us.
          </p>
          {/* <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-6 rounded-full font-medium transition-all">
            Start a Project →
          </button> */}
        </div>

        {/* Right Column */}
        <div className="md:w-1/2 space-y-4">
          {faqData.map((item, index) => {
            const isOpen = index === activeIndex;
            return (
              <div
                key={index}
                className={`rounded-lg overflow-hidden border border-gray-700 ${
                  isOpen ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-[#1c1c2e]'
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none"
                >
                  <span className={`font-medium ${isOpen ? 'text-white' : 'text-gray-200'}`}>
                    {item.question}
                  </span>
                  <span className="text-white text-lg">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  className={`px-5 pb-4 text-sm text-white transition-all duration-300 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
