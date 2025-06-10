
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { FreelancingHero } from "@/components/freelancing/FreelancingHero";
import { FreelancerGrid } from "@/components/freelancing/FreelancerGrid";
import { FreelanceStats } from "@/components/freelancing/FreelanceStats";

const Freelancing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Header />
      <FreelancingHero />
      <FreelanceStats />
      <FreelancerGrid />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Freelancing;
