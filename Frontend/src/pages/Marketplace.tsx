import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    skills: undefined,
    duration: undefined,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <Header />
      <MarketplaceHero 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <FilterSidebar onFiltersChange={handleFiltersChange} />
          <ProductGrid searchQuery={searchQuery} filters={filters} />
        </div>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Marketplace;
