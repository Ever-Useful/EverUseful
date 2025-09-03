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
      title: "Sustainable Innovation Summit 2024",
      date: "March 15, 2024",
      speaker: "Dr. Emma Green",
      topic: "Clean Energy Solutions for the Future"
    },
    {
      title: "Green Tech Investor Meetup",
      date: "April 22, 2024",
      speaker: "Michael Foster",
      topic: "Funding Sustainable Startups"
    },
    {
      title: "Climate Change Innovation Forum",
      date: "May 18, 2024",
      speaker: "Sarah Martinez",
      topic: "Technology for Climate Action"
    },
    {
      title: "AI for Good Conference",
      date: "June 10, 2024",
      speaker: "Dr. James Chen",
      topic: "Artificial Intelligence in Healthcare"
    },
    {
      title: "EdTech Innovation Workshop",
      date: "July 8, 2024",
      speaker: "Lisa Rodriguez",
      topic: "Transforming Education with Technology"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in leading-tight px-2 sm:px-0">Upcoming Events & Speaker Talks</h2>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
            Join industry leaders and innovators at our exclusive events.
          </p>
        </div>
      
   <div className="relative">
  <div
    id="event-slider"
    {...handlers}
    ref={scrollRef}
    className="flex overflow-x-auto space-x-6 scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
  >
    {upcomingEvents.map((event, index) => (
      <div
        key={index}
        className="min-w-[300px] max-w-sm snap-start group cursor-pointer shrink-0"
      >
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-300" />
            <span className="text-blue-200 font-medium text-sm">{event.date}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <div className="flex items-start gap-3 mb-6">
            <Mic className="w-5 h-5 text-indigo-200 mt-1" />
            <div>
              <p className="font-medium text-white mb-1">{event.speaker}</p>
              <p className="text-indigo-100 text-sm">{event.topic}</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full mt-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
                onClick={() => setSelectedEvent(event.title)}
              >
                Register Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800">Register for Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Register for: <strong>{event.title}</strong>
                </p>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleRegister} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Register
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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