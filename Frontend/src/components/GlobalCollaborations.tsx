import React from 'react';
import partnersImage from '@/assets/images/team.png'; // Adjust path as needed

type Partner = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
};

const partners: Partner[] = [
 {
    id: 1,
    name: 'TechNova',
    tagline: 'AI Solutions Pioneer',
    description: 'Leading provider of enterprise AI solutions',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'GreenScape',
    tagline: 'Sustainable Technology',
    description: 'Innovators in eco-friendly tech solutions',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'QuantumLeap',
    tagline: 'Quantum Computing',
    description: 'Frontiers of computational technology',
    imageUrl: 'https://images.unsplash.com/photo-1609151376730-f246ec0b99e5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 4,
    name: 'Nexus Dynamics',
    tagline: 'Enterprise Solutions',
    description: 'End-to-end business transformation',
    imageUrl: 'https://images.unsplash.com/photo-1605868587355-5acbe10a8fab?q=80&w=2017&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 5,
    name: 'AeroSystems',
    tagline: 'Aviation Technology',
    description: 'Next-gen aerospace solutions',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    name: 'BioGenius',
    tagline: 'Healthcare Innovation',
    description: 'Revolutionizing medical technology',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 7,
    name: 'SolarFlare',
    tagline: 'Renewable Energy',
    description: 'Clean energy for tomorrow',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 8,
    name: 'CryptoChain',
    tagline: 'Blockchain Solutions',
    description: 'Secure decentralized technology',
    imageUrl: 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];

// Marquee keyframes for smooth horizontal movement
const marqueeAnimation = `
@keyframes marqueeLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marqueeRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

/* Responsive tweaks for CTA on mobile */
@media (max-width: 640px) {
  .cta-mobile-hide {
    display: none !important;
  }
  .cta-mobile-center {
    align-items: center !important;
    text-align: center !important;
    justify-content: center !important;
  }
  .cta-mobile-py {
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
  }
}
`;

export const GlobalCollaborations: React.FC = () => {
  // Duplicate partners for seamless marquee
  const partnersRow = [...partners, ...partners];

  return (
    <section
      className="relative py-12 px-0"
      style={{
        background: 'linear-gradient(135deg, #f8fcff 0%, #e6f0fa 100%)'
      }}
    >
      {/* Inject marquee keyframes and CTA mobile CSS */}
      <style>{marqueeAnimation}</style>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with image */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8">
          <div className="flex-1 text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mb-2 md:mb-3 tracking-tight">
              Our <span className="text-cyan-500">Trusted Partners</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl">
              Partnering with global innovators to shape the future of technology and business.
            </p>
          </div>
          <div className="flex-1 flex justify-end gap-4">
            <img
              src={partnersImage}
              alt="Global Partners 1"
              className="h-20 sm:h-28 md:h-44 w-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Marquee Rows */}
      <div className="space-y-6 sm:space-y-8 w-full">
        {/* Top Row - left to right */}
        <div className="overflow-hidden w-full">
          <div
            className="flex w-[200vw] gap-4 sm:gap-6"
            style={{
              animation: 'marqueeLeft 90s linear infinite'
            }}
          >
            {partnersRow.map((partner, idx) => (
              <div
                key={`top-${idx}-${partner.id}`}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 min-w-[170px] max-w-[170px] sm:min-w-[220px] sm:max-w-[220px] mx-1 flex flex-col items-center p-0 transition hover:shadow-2xl hover:border-cyan-400"
                style={{
                  boxShadow:
                    '0 2px 16px 0 rgba(55, 151, 255, 0.07), 0 1.5px 6px 0 rgba(0,0,0,0.04)'
                }}
              >
                <div className="w-full h-24 sm:h-36 rounded-t-2xl overflow-hidden">
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="w-full h-full object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                  />
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 w-full">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 text-center">{partner.name}</h3>
                  <p className="text-cyan-600 font-medium text-xs sm:text-sm mb-0.5 text-center">{partner.tagline}</p>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 text-center line-clamp-2">{partner.description}</p>
                  <div className="flex justify-center">
                    <a
                      href="#"
                      className="text-cyan-700 text-xs sm:text-sm font-semibold underline hover:text-red-600 transition"
                      tabIndex={0}
                    >
                      Learn More &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Row - right to left */}
        <div className="overflow-hidden w-full">
          <div
            className="flex w-[200vw] gap-4 sm:gap-6"
            style={{
              animation: 'marqueeRight 110s linear infinite'
            }}
          >
            {partnersRow.map((partner, idx) => (
              <div
                key={`bottom-${idx}-${partner.id}`}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 min-w-[170px] max-w-[170px] sm:min-w-[220px] sm:max-w-[220px] mx-1 flex flex-col items-center p-0 transition hover:shadow-2xl hover:border-cyan-400"
                style={{
                  boxShadow:
                    '0 2px 16px 0 rgba(55, 151, 255, 0.07), 0 1.5px 6px 0 rgba(0,0,0,0.04)'
                }}
              >
                <div className="w-full h-24 sm:h-36 rounded-t-2xl overflow-hidden">
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="w-full h-full object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                  />
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 w-full">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 text-center">{partner.name}</h3>
                  <p className="text-cyan-600 font-medium text-xs sm:text-sm mb-0.5 text-center">{partner.tagline}</p>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 text-center line-clamp-2">{partner.description}</p>
                  <div className="flex justify-center">
                    <a
                      href="#"
                      className="text-cyan-700 text-xs sm:text-sm font-semibold underline hover:text-red-600 transition"
                      tabIndex={0}
                    >
                      Learn More &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Container */}
      <div className="mt-10 sm:mt-16 w-full flex justify-center">
        <div
          className="rounded-2xl shadow-xl px-4 sm:px-8 py-6 sm:py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8 w-full max-w-7xl cta-mobile-center cta-mobile-py"
          style={{
            background: 'linear-gradient(90deg, #ef4444 0%, #2563eb 80%, #0f172a 100%)'
          }}
        >
          {/* Hide this on mobile */}
          <div className="flex-1 cta-mobile-hide">
            <h4 className="text-lg sm:text-2xl font-bold text-white mb-2">Ready to Collaborate?</h4>
            <ul className="space-y-1 text-cyan-100 text-sm sm:text-base mb-2">
              <li>• Access global expertise and innovation</li>
              <li>• Work with industry leaders</li>
              <li>• Build a sustainable future together</li>
            </ul>
          </div>
          {/* On mobile, only show button and one line */}
          <div className="flex-1 flex flex-col items-center">
            <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-cyan-700 font-bold text-base sm:text-lg rounded-full shadow hover:bg-cyan-50 transition mb-2">
              Let's Collaborate
            </button>
            <p className="text-cyan-50 text-xs sm:text-sm text-center max-w-xs">
              Join our network and make a global impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
