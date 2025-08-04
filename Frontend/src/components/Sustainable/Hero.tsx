
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// Import assets correctly
import sustainableVideo from "@/assets/videos/Sustainable.mp4";
import sustainableHeroImage from "@/assets/images/sustainable-hero.jpg";

export const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleLaunchClick = () => {
    setShowVideo(true);
  };

  return (

    <section className="min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] bg-gradient-to-br from-stone-100 via-yellow-50 to-green-100 relative overflow-hidden">
      {/* Background sustainable energy image or video */}
      <div className="absolute right-0 top-0 h-full w-full md:w-1/2 opacity-90">
        {showVideo ? (
          <video
            src={sustainableVideo}
            className="h-full min-w-full object-cover"
            controls
            autoPlay
            muted
          >

            <source src="main.mp4" type="video/mp4" />
            Your browser does not support the video lala tag.
          </video>
        ) : (
          <img
            src={sustainableHeroImage}
            alt="Sustainable development and green innovation"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Main content */}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh]">
        <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left">
          <h1 className="text-[17px] sm:text-4xl font-bold text-gray-900 leading-tight mobile-text-4xl">
            Sustainable Project{" "}
            <span className="inline-flex items-center bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mx-1 sm:mx-2">
              🌱
            </span>
            Solutions
          </h1>


          <p className="text-base text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed mobile-text-base">
            Join professors and students worldwide in building revolutionary eco-friendly solutions. Contribute your innovative project ideas for a sustainable future.
          </p>

          <div className="flex justify-center md:justify-start pt-2 sm:pt-4">
            <Button
              onClick={handleLaunchClick}
              className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Launch this Winter
            </Button>
          </div>
        </div>
        
        {/* Show image/video on small screens below main content */}
        <div className="w-full mt-6 sm:mt-8 md:hidden">
          {showVideo ? (
            <video

              src="Sustainable.mp4"
              className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow-lg"
              controls
              autoPlay
              muted
            >
              <source src={sustainableVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={sustainableHeroImage}
              alt="Sustainable development and green innovation"

              className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
    </section>
  );
};