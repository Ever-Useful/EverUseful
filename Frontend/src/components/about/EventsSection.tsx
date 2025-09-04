import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Mic } from "lucide-react";
import { useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";

// Inside your component

const EventsSection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");


  const scrollRef = useRef<HTMLDivElement | null>(null);

const handleSwipe = (dir: "left" | "right") => {
  if (scrollRef.current) {
    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === "left" ? amount : -amount,
      behavior: "smooth",
    });
  }
};

const handlers = useSwipeable({
  onSwipedLeft: () => handleSwipe("left"),
  onSwipedRight: () => handleSwipe("right"),
  preventScrollOnSwipe: true,
  trackMouse: true, // for testing swipe with mouse on desktop
});

  const handleRegister = () => {
    if (email && name && selectedEvent) {
      console.log("Registration details:", { name, email, phone, event: selectedEvent });
      setEmail("");
      setName("");
      setPhone("");
      setSelectedEvent("");
      // Here you would typically send the data to your backend
    }
  };

  const upcomingEvents = [
    {
      title: "The Ultimate Drone Workshop",
      date: "1st September 2025",
      speaker: "Chainfly & Amogh Partnership",
      topic: "Turn your ideas into reality and watch your own drone take flight. 4-week, 20-day hands-on program.",
      special: true,
      registrationLink: "https://forms.gle/Api4NgdeM8Je6a918",
      skills: ["Drone Aerodynamics & Design", "Composite Fabrication", "3D Printing & Assembly", "Flight Testing & Calibration"],
      eligibility: "Engineering students, UAV enthusiasts, and anyone eager to gain real-world drone-building skills",
      limitedSeats: true
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Events Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-white">Upcoming Events & Speaker Talks</h2>
          <p className="text-indigo-100 text-base sm:text-lg max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            Join industry leaders and innovators at our exclusive events.
          </p>
        </div>
      
    <div className="relative flex justify-center">
      <div
        id="event-slider"
        {...handlers}
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 sm:space-x-6 scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide justify-center w-full"
      >
        {upcomingEvents.map((event, index) => (
          <div
            key={index}
            className={`min-w-[320px] sm:min-w-[600px] lg:min-w-[800px] max-w-[320px] sm:max-w-[600px] lg:max-w-4xl snap-start group cursor-pointer shrink-0`}
          >
            <div className={`bg-white/10 border-white/20 backdrop-blur-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-xl h-full flex flex-col`}>
              {/* Content */}
              <div className="flex-1">
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-orange-500 text-white">
                    🚁 Limited Seats Only
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                  <span className="text-blue-200 font-medium text-sm sm:text-base">{event.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{event.title}</h3>
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200 mt-1" />
                  <div>
                    <p className="font-medium text-white mb-1 text-sm sm:text-base">{event.speaker}</p>
                    <p className="text-indigo-100 text-sm sm:text-base">{event.topic}</p>
                  </div>
                </div>
                
                <div className="mb-4 space-y-2 sm:space-y-3">
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base mb-2">What You'll Learn:</h4>
                    <ul className="space-y-1">
                      {event.skills?.map((skill, idx) => (
                        <li key={idx} className="text-indigo-100 text-xs sm:text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base mb-1">Who Can Join:</h4>
                    <p className="text-indigo-100 text-xs sm:text-sm">{event.eligibility}</p>
                  </div>
                </div>
              </div>

              {/* Registration Button - Centered Below Content */}
              <div className="flex justify-center mt-4 sm:mt-6">
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center text-sm sm:text-base min-w-[160px]"
                >
                  Register Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      </div>
    </section>
  );
};

export default EventsSection;