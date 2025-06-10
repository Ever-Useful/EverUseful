
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { CommunityConnect } from "@/components/CommunityConnect";
import { CareerSection } from "@/components/CareerSection";

const Community = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <Header />
      <CommunityConnect />
      <CareerSection />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Community;
