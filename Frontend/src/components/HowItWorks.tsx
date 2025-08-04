import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  UserPlus,
  Search,
  Handshake,
  Rocket,
  Star,
  LucideIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import mainVideo from "@/assets/videos/promotion.mp4";
import bgImage from "@/assets/images/howitworks.jpg";
import { Link } from 'react-router-dom';

type Step = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconColor: string;
  bgColor: string;
};

const steps: Step[] = [
  {
    icon: UserPlus,
    title: "Create Profile",
    subtitle: "Tell us who you are and what you're looking for.",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Search,
    title: "Browse Opportunities",
    subtitle: "Find projects, teams, or businesses that match your skills.",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Handshake,
    title: "Connect & Collaborate",
    subtitle: "Reach out, chat, and form your dream team.",
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Rocket,
    title: "Launch Your Project",
    subtitle: "Build, deploy, and grow with our support.",
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    icon: Star,
    title: "Earn & Showcase",
    subtitle: "Get recognized and rewarded for your achievements.",
    iconColor: "text-pink-600",
    bgColor: "bg-pink-100",
  },
];

export const HowItWorks: React.FC<{ deferVideo?: boolean }> = ({ deferVideo = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playVideo, setPlayVideo] = useState(!deferVideo);

  useEffect(() => {
    if (!deferVideo) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => observer.disconnect();
  }, [deferVideo]);

  const handleMuteToggle = () => {
    setMuted((prev) => {
      if (videoRef.current) {
        videoRef.current.muted = !prev;
      }
      return !prev;
    });
  };

  return (
    <section className="relative py-0 px-0 overflow-hidden">
      <style>
        {`
          .video-shadow-wrap {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .video-shadow {
            position: absolute;
            left: 50%;
            bottom: -18px;
            width: 80%;
            height: 38px;
            pointer-events: none;
            transform: translateX(-50%);
            z-index: 0;
            background: radial-gradient(ellipse at center, rgba(30,41,59,0.28) 0%, rgba(30,41,59,0.10) 60%, rgba(30,41,59,0.01) 100%);
            opacity: 0.85;
            filter: blur(2.5px);
          }
          .realistic-mute-btn {
            transition: background 0.2s cubic-bezier(.4,0,.2,1), transform 0.2s cubic-bezier(.4,0,.2,1);
          }
          .realistic-mute-btn:hover {
            background: rgba(30,64,175,0.8);
            transform: scale(1.1);
          }
        `}
      </style>
      <div className="flex flex-col md:flex-row min-h-[320px]">
        {/* Left: Video with image background */}
        <div
          className="md:w-1/2 w-full flex flex-col items-center justify-center relative"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 320,
          }}
        >
          {/* Overlay for contrast */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div className="relative z-10 w-full flex flex-col items-center justify-center py-8 sm:py-12 px-3 sm:px-6">
            <div className="video-shadow-wrap w-full max-w-xs sm:max-w-xl mx-auto">
              <video
                ref={videoRef}
                src={mainVideo}
                autoPlay={playVideo}
                loop
                muted={muted}
                playsInline
                className="w-full h-44 sm:h-64 md:h-[320px] object-cover bg-black rounded-2xl relative z-10"
                style={{ background: "#000" }}
              />
              {/* Soft shadow below video */}
              <div className="video-shadow"></div>
              {/* Mute/Unmute Button */}
              <button
                onClick={handleMuteToggle}
                className="realistic-mute-btn absolute bottom-3 right-3 sm:bottom-6 sm:right-6 bg-black/70 text-white rounded-full p-2 shadow-lg z-20"
                aria-label={muted ? "Unmute video" : "Mute video"}
                tabIndex={0}
              >
                {muted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
            {/* Button below video */}
            <Link to="/consulting" className="mt-6 sm:mt-8 flex justify-center w-full">
              <Button
                size="lg"
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg bg-white text-black hover:bg-blue-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center font-semibold rounded-full mobile-text-base"
              >
                consult... <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: Steps/content with solid background */}
        <div className="md:w-1/2 w-full flex flex-col justify-center bg-slate-100 py-10 sm:py-16 px-4 sm:px-8">
          <h3 className="text-[17px] sm:text-2xl md:text-4xl font-semibold text-gray-800 mb-3 sm:mb-4 mt-0 mobile-text-2xl md:mobile-text-4xl">
            How you start here...
          </h3>
          <ol className="space-y-5 sm:space-y-7">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start group">
                <span className="flex-shrink-0 mt-1 mr-3 sm:mr-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${step.bgColor} ${step.iconColor} shadow-md group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${step.iconColor}`} />
                  </span>
                </span>
                <span>
                  <h5 className="text-lg font-semibold text-slate-800 mobile-text-lg">{step.title}</h5>
                  <p className="text-base text-slate-600 mobile-text-base">{step.subtitle}</p>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
