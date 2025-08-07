
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  const handleJoinAmogh = () => {
    navigate('/connect');
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Live background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
        }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10 px-2 sm:px-4 lg:px-6">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-lg">
          Build. Scale. Dominate.
        </h2>
        <p className="text-xl sm:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Whether you're a student ready to pitch, a professional eager to mentor, or an investor seeking new talent — Amogh welcomes you.
          Be part of a platform that doesn't just showcase ideas — it empowers them.
        </p>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-white/20"
          onClick={handleJoinAmogh}
        >
          Join Amogh Today
        </Button>
      </div>
    </section>
  );
};

export default CTASection;