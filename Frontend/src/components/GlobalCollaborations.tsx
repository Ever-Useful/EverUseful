import React, { useRef } from 'react';
import partnersImage from '@/assets/images/team.png'; // Adjust path as needed
import { Link } from 'react-router-dom';
import cfLogo from '@/assets/images/chainfly.png';
import rlLogo from '@/assets/images/reslink.jpg';

type Partner = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  href?: string;
};

const partners: Partner[] = [
  {
    id: 1,
    name: 'Chainfly',
    tagline: 'Solar Asset Management',
    description: 'AI-Powered Solar Asset Intelligence',
    imageUrl: cfLogo,
    href: 'https://www.chainfly.co/'
  },
  {
    id: 2,
    name: 'Reslink',
    tagline: 'Semiconductor Inventions',
    description: 'Material Science for Sustainability',
    imageUrl: rlLogo,
    href: 'https://www.reslink.org/'
  },
];

export const GlobalCollaborations: React.FC = () => {
  // Duplicate partners for seamless marquee
  const partnersRow = [...partners];

  // Touch sensitivity for marquee rows
  const topMarqueeRef = useRef<HTMLDivElement>(null);
  const bottomMarqueeRef = useRef<HTMLDivElement>(null);

  // Helper for touch drag scroll
  const enableTouchScroll = (ref: React.RefObject<HTMLDivElement>) => {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - (ref.current?.offsetLeft || 0);
      scrollLeft = ref.current?.scrollLeft || 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDown || !ref.current) return;
      const x = e.touches[0].pageX - ref.current.offsetLeft;
      const walk = (x - startX) * 1.2; // Sensitivity
      ref.current.scrollLeft = scrollLeft - walk;
    };

    const onTouchEnd = () => {
      isDown = false;
    };

    React.useEffect(() => {
      const node = ref.current;
      if (!node) return;
      node.addEventListener('touchstart', onTouchStart, { passive: false });
      node.addEventListener('touchmove', onTouchMove, { passive: false });
      node.addEventListener('touchend', onTouchEnd, { passive: false });
      return () => {
        node.removeEventListener('touchstart', onTouchStart);
        node.removeEventListener('touchmove', onTouchMove);
        node.removeEventListener('touchend', onTouchEnd);
      };
    }, [ref.current]);
  };

  enableTouchScroll(topMarqueeRef);
  enableTouchScroll(bottomMarqueeRef);

  return (
    <section
      className="relative py-12 px-0"
      style={{
        background: 'linear-gradient(135deg, #f8fcff 0%, #e6f0fa 100%)'
      }}
    >
      {/* Inject marquee keyframes and CTA mobile CSS */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with image */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-8">
          <div className="flex-1 text-left">
            <h2 className="text-[17px] sm:text-4xl font-extrabold text-slate-800 mb-2 md:mb-3 tracking-tight mobile-text-4xl">
              Our <span className="text-cyan-500">Trusted Partners</span>
            </h2>
            <p className="text-base text-slate-600 max-w-xl mobile-text-base">
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

        {/* Bottom Row - right to left */}
        <div className="overflow-x-auto w-full" ref={bottomMarqueeRef} style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
          <div className="flex w-[100vw] gap-4 sm:gap-6 items-center justify-evenly py-4">
            {partnersRow.map((partner, idx) => (
              <div
                key={`bottom-${idx}-${partner.id}`}
                className="bg-white rounded-xl shadow-lg border border-gray-100 min-w-[320px] max-w-[320px] sm:min-w-[500px] sm:max-w-[500px] mx-1 flex flex-row items-stretch transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 group overflow-hidden"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                {/* Logo/image container - fixed width */}
                <div className="w-32 sm:w-40 flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      className="w-full h-auto max-h-24 object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Text content container - flexible width */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">
                      {partner.name}
                    </h5>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Partner
                    </span>
                  </div>

                  <p className="text-sm text-blue-600 font-medium mb-2 line-clamp-1">
                    {partner.tagline}
                  </p>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {partner.description}
                  </p>

                  <div className="mt-auto">
                    <Link
                      to={partner.href}
                      className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Learn more
                    </Link>
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
          className="rounded-2xl shadow-xl px-4 sm:px-8 py-6 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 w-full max-w-7xl cta-mobile-center cta-mobile-py max-w-[85vw]"
          style={{
            background: 'linear-gradient(90deg, #ef4444 0%, #2563eb 80%, #0f172a 100%)'
          }}
        >
          {/* Hide this on mobile */}
          <div className="flex-1 cta-mobile-hide">
            <h2 className="text-3xl font-bold text-white mb-2 mobile-text-3xl">Ready to Collaborate?</h2>
            <ul className="space-y-1 text-cyan-100 text-base mb-2 mobile-text-base">
              <li>• Access global expertise and innovation</li>
              <li>• Work with industry leaders</li>
              <li>• Build a sustainable future together</li>
            </ul>
          </div>
          {/* On mobile, only show button and one line */}
          <div className="flex-1 flex flex-col items-center">
            <Link to="/consulting" className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-cyan-700 font-bold text-base rounded-full shadow hover:bg-cyan-50 transition mb-2 mobile-text-base">
              Let's Collaborate
            </Link>
            <p className="text-base text-cyan-50 text-center max-w-xs mobile-text-base">
              Join our network and make a global impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};