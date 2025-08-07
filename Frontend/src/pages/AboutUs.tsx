
import { useEffect, useState, useRef } from "react"
import Header from "@/components/Header";
import HeroSection from "@/components/about/HeroSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
// import WhoWeServeSection from "@/components/about/WhoWeServeSection";
import ComparisonSection from "@/components/about/ComparisonSection";
import TeamSection from "@/components/about/TeamSection";
import EventsSection from "@/components/about/EventsSection";
import FAQSection from "@/components/about/FAQSection";
// import TestimonialsSection from "@/components/about/TestimonialsSection";
import CTASection from "@/components/about/CTASection";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Globe,
  Lightbulb,
  Target,
  Heart,
  Zap,
  Award,
  MapPin,
  Play,
  ArrowRight,
  Edit,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 animate-gradient-live text-white">
      <Header />
      <HeroSection />
      <MissionVisionSection />
      {/* <WhoWeServeSection /> */}
      <ComparisonSection />
      <TeamSection />
      {/* <UpcomingPhaseSection /> */}
      <EventsSection />
        <FAQSection /> 
      {/* <TestimonialsSection />  */}
       <CTASection />
      {/* <test deployment /> */}
      <Footer />
    </div>
  );
};

export default About;