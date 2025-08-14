import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, Sliders, Filter, SortAsc } from "lucide-react";

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

  // Sorting state lifted up for mobile
  const [sortBy, setSortBy] = useState("recent");
  const [showSortTab, _setShowSortTab] = useState(false);
  const [showFilterTab, setShowFilterTab] = useState(false);

  const isMobile = useIsMobile();

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const setShowSortTab = (value: boolean) => {
    // Only allow one modal (sort or filter) to be open at a time
    if (value) {
      setShowFilterTab(false);
    }
    // Open or close the sort modal
    _setShowSortTab(value); // Use a different state setter to avoid recursion
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
          {/* Hide sidebar on mobile, show as modal */}
          {!isMobile && <FilterSidebar onFiltersChange={handleFiltersChange} />}
          <div className="flex-1">
            <ProductGrid
              searchQuery={searchQuery}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showSortTab={showSortTab}
              setShowSortTab={setShowSortTab}
              showFilterTab={showFilterTab}
              setShowFilterTab={setShowFilterTab}
            />
          </div>
        </div>
      </div>
      <Footer />
      <Chatbot />

      {/* Sticky bottom tabs for mobile */}
      {isMobile && (
        <>
          {/* Sticky Tabs */}
          <div className="fixed bottom-0 left-0 w-full max-w-[100vw] mx-auto z-40 flex bg-white border-t border-gray-200 shadow-lg"
               style={{ boxSizing: "border-box" }}>
            <div className="container mx-auto flex px-0">
              <button
                className={`flex-1 py-2 flex flex-col items-center justify-center text-blue-700 text-xs font-semibold ${showFilterTab ? "bg-blue-50" : ""}`}
                onClick={() => {
                  setShowFilterTab(true);
                  setShowSortTab(false);
                }}
              >
                <Filter className="w-4 h-4 mb-1" />
                Filter
              </button>
            </div>
            <div className="container mx-auto flex px-0">
              <button
                className={`flex-1 py-2 flex flex-col items-center justify-center text-blue-700 text-xs font-semibold ${showSortTab ? "bg-blue-50" : ""}`}
                onClick={() => {
                  setShowFilterTab(false);
                  setShowSortTab(true);
                }}
              >
                <SortAsc className="w-4 h-4 mb-1" />
                Sort
              </button>
            </div>
          </div>

          {/* Fullscreen Filter Modal */}
          {showFilterTab && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <span className="font-semibold text-lg">Filters</span>
                <button onClick={() => setShowFilterTab(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FilterSidebar
                  onFiltersChange={handleFiltersChange}
                  onClose={() => setShowFilterTab(false)}
                  disableMobileDropdown={true}
                />
              </div>
            </div>
          )}

          {/* Fullscreen Sort Modal */}
          {showSortTab && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <span className="font-semibold text-lg">Sort By</span>
                <button onClick={() => setShowSortTab(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <button
                  className={`py-3 px-4 rounded text-left text-base hover:bg-blue-50 ${sortBy === "recent" ? "bg-blue-100 font-semibold" : ""}`}
                  onClick={() => {
                    setSortBy("recent");
                    setShowSortTab(false);
                  }}
                >
                  Most Recent
                </button>
                <button
                  className={`py-3 px-4 rounded text-left text-base hover:bg-blue-50 ${sortBy === "rating" ? "bg-blue-100 font-semibold" : ""}`}
                  onClick={() => {
                    setSortBy("rating");
                    setShowSortTab(false);
                  }}
                >
                  Highest Rated
                </button>
                <button
                  className={`py-3 px-4 rounded text-left text-base hover:bg-blue-50 ${sortBy === "price_asc" ? "bg-blue-100 font-semibold" : ""}`}
                  onClick={() => {
                    setSortBy("price_asc");
                    setShowSortTab(false);
                  }}
                >
                  Price: Low to High
                </button>
                <button
                  className={`py-3 px-4 rounded text-left text-base hover:bg-blue-50 ${sortBy === "price_desc" ? "bg-blue-100 font-semibold" : ""}`}
                  onClick={() => {
                    setSortBy("price_desc");
                    setShowSortTab(false);
                  }}
                >
                  Price: High to Low
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
