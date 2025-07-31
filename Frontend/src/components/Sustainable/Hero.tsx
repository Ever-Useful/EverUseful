
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const handleLaunchClick = () => {
    setShowVideo(true);
  };

  return (
    <section className="min-h-[90vh] bg-gradient-to-br from-stone-100 via-yellow-50 to-green-100 relative ">
      {/* Background sustainable energy image or video */}
      <div className="absolute right-0 top-0 h-full w-full md:w-1/2 opacity-90">
        {showVideo ? (
          <video
            src="Sustainable.mp4"
            className="h-full min-w-full object-cover"
            controls
            autoPlay
            muted
          >
            <source src="Sustainable.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="image.png"
            alt="Sustainable development and green innovation"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col md:flex-row items-center min-h-[90vh]">
       <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Sustainable Project{" "}
            <span className="hidden md:inline-flex items-center bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium mx-2">
              🌱
            </span>
            Solutions
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto md:mx-0">
            Join professors and students worldwide in building revolutionary eco-friendly solutions. Contribute your innovative project ideas for a sustainable future.
          </p>

          <div className="flex justify-center md:justify-start">
            <Button
              onClick={handleLaunchClick}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              Launch this Winter
            </Button>
          </div>
        </div>
        {/* Show image/video on small screens below main content */}
        <div className="w-full mt-8 md:hidden">
          {showVideo ? (
            <video
              src="Sustainable.mp4"
              className="w-full h-48 object-cover rounded-lg"
              controls
              autoPlay
              muted
            >
              <source src="Sustainable.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src="image.png"
              alt="Sustainable development and green innovation"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </section>
  );
};