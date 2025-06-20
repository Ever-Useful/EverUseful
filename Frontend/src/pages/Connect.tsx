import HeroSection from "@/components/connect/HeroSection";
import CommunityLinks from "@/components/connect/CommunityLinks";
import ValuesSection from "@/components/connect/ValueSection";
import CultureGallery from "@/components/connect/CultureGallery";
import JobListings from "@/components/connect/JobListings";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Header } from "@/components/Header";
const Connect= () => {
  return (
    <div className="min-h-screen">
      <Header/>
      <HeroSection />
      <ValuesSection />
      
      <JobListings />
      <CultureGallery />
      <CommunityLinks />
      <Footer />
      <Chatbot/>
    </div>
  );
};

export default Connect;