import { useState } from "react";
import { HeroSection } from "@/components/consultation/HeroSection";
import { ServicesSection } from "@/components/consultation/ServicesSection";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { BenefitsSection } from "@/components/consultation/BenefitsSection";
import { NewsletterSection } from "@/components/consultation/NewsletterSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Consultation = () => {
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);

  const handleBookConsultation = () => {
    setIsConsultationFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsConsultationFormOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header/>
      <HeroSection onBookConsultation={handleBookConsultation} />
      <ServicesSection />
      <BenefitsSection />
      <NewsletterSection />
      <Footer />
      
      <ConsultationForm 
        isOpen={isConsultationFormOpen} 
        onClose={handleCloseForm} 
      />
    </div>
  );
};

export default Consultation;