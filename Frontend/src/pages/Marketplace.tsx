
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <Header />
      <MarketplaceHero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <FilterSidebar />
          <ProductGrid />
        </div>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Marketplace;
