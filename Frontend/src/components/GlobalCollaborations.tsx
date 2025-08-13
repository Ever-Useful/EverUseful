import React, { useRef } from 'react';
import partnersImage from '@/assets/images/team.png'; // Adjust path as needed
import { Link } from 'react-router-dom';
import cfLogo from '@/assets/images/chainfly.png';

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
    name: 'Chainfly',
    tagline: 'Solar Asset Management',
    description: 'AI-Powered Solar Asset Intelligence',
    imageUrl: cfLogo,
    href: 'https://www.chainfly.co/'
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
          <div
            className="flex w-[100vw] gap-4 sm:gap-6 items-center justify-evenly"
          >
            {partnersRow.map((partner, idx) => (
              <div
                key={`bottom-${idx}-${partner.id}`}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 min-w-[400px] max-w-[400px] sm:min-w-[400px] sm:max-w-[400px] mx-1 flex flex-row items-center p-0 transition hover:shadow-2xl hover:border-cyan-400"
                style={{
                  boxShadow:
                    '0 2px 16px 0 rgba(55, 151, 255, 0.07), 0 1.5px 6px 0 rgba(0,0,0,0.04)'
                }}
              >
                {/* use image of resolution max 600*450 */}
                <div className="w-full h-full sm:h-36 rounded-t-2xl overflow-hidden">
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="w-full h-full object-cover transition-transform duration-300 scale-105 group-hover:scale-110"
                  />
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 w-full">
                  <h5 className="text-xl font-bold text-gray-900 mb-0.5 text-left mobile-text-lg">{partner.name}</h5>
                  <p className="text-sm text-cyan-600 font-medium mb-0.5 text-left mobile-text-sm">{partner.tagline}</p>
                  <p className="text-sm text-gray-500 mb-2 text-left line-clamp-2 mobile-text-sm">{partner.description}</p>
                  <div className="flex right text-cyan-700 text-xs sm:text-base font-semibold underline hover:text-red-600 transition">
                    <Link
                      to={partner.href}
                      tabIndex={0}
                    >
                      Learn More &rarr;
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
            <h2 className="text-4xl font-bold text-white mb-2 mobile-text-3xl">Ready to Collaborate?</h2>
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