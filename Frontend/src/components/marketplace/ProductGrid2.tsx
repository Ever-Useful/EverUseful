import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  DollarSign,
  Heart,
  Eye,
  ArrowRight,
  ShoppingCart,
  X,
  Users,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterSidebar } from "./FilterSidebar";
import NoImageAvailable from "@/assets/images/no image available.png";
import NoUserProfile from "@/assets/images/no user profile.png";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  author: string;
  status: string;
  posted: string;
  teamSize: number;
  tags: string[];
  skills: string[];
  views: number;
  isFavorited: boolean;
}

interface ProductGridProps {
  searchQuery: string;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    skills?: string[];
    duration?: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const ProductGrid = ({ searchQuery, filters }: ProductGridProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Mobile specific states
  const [showSortTab, setShowSortTab] = useState(false);
  const [showFilterTab, setShowFilterTab] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(filters);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [authorCache, setAuthorCache] = useState<Record<string, any>>({});
  const [currentUserCustomId, setCurrentUserCustomId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Mock data for demonstration
  const mockProjects: Project[] = [
    {
      id: 1,
      title: "AI-Powered Learning Platform",
      description: "Revolutionary educational platform using machine learning to personalize student experiences",
      image: "",
      category: "AI & ML",
      price: 2500,
      duration: "3-6m",
      rating: 4.8,
      reviews: 127,
      author: "user123",
      status: "Active",
      posted: "2 days ago",
      teamSize: 4,
      tags: ["AI", "Education", "ML"],
      skills: ["React", "Python", "ML"],
      views: 342,
      isFavorited: false,
    },
    {
      id: 2,
      title: "Sustainable Energy Management System",
      description: "IoT-based system for monitoring and optimizing energy consumption in smart buildings",
      image: "",
      category: "Sustainable",
      price: 3200,
      duration: "2-3m",
      rating: 4.6,
      reviews: 89,
      author: "user456",
      status: "New",
      posted: "1 week ago",
      teamSize: 3,
      tags: ["IoT", "Sustainability", "Smart City"],
      skills: ["JavaScript", "IoT", "Cloud"],
      views: 234,
      isFavorited: true,
    }
  ];

  useEffect(() => {
    // Mock fetch implementation
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProjects(mockProjects);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProjects: mockProjects.length,
          hasNextPage: false,
          hasPrevPage: false
        });
      } catch (err) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, filters, sortBy, currentPage, selected, isMobile]);

  // Helper to get author details (mock implementation)
  const getAuthorDetails = (authorId: string) => {
    return {
      name: `User ${authorId}`,
      image: NoUserProfile,
      userType: 'freelancer',
      id: authorId
    };
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    if (isMobile) {
      setShowSortTab(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          className={`w-8 h-8 p-0 ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className={`w-full flex items-center justify-center mt-8 ${isMobile ? 'mb-20' : ''}`}>
        <div className="flex items-center justify-center space-x-2 p-2">
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={() => handlePageChange(1)}
              >
                1
              </Button>
              {startPage > 2 && <span className="text-gray-500">...</span>}
            </>
          )}
          {pages}
          {endPage < pagination.totalPages && (
            <>
              {endPage < pagination.totalPages - 1 && <span className="text-gray-500">...</span>}
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                {pagination.totalPages}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const handleViewDetails = (projectId: number) => {
    navigate(`/product/${projectId}`);
  };

  const handleFavorite = (projectId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, isFavorited: !project.isFavorited }
          : project
      )
    );
  };

  const handleAddToCart = (projectId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    console.log('Added to cart:', projectId);
  };

  // Helper: get 2 related projects (different from selected)
  const getRelated = (id: number) => projects.filter((p) => p.id !== id).slice(0, 2);

  // Helper function to navigate to author profile based on userType
  const goToAuthorProfile = (userType: string, id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (currentUserCustomId && currentUserCustomId === id) {
      navigate('/profile');
      return;
    }
    
    const type = (userType || '').toLowerCase();
    if (type === 'freelancer') {
      navigate(`/freelancerprofile/${id}`);
    } else {
      navigate(`/studentprofile/${id}`);
    }
  };

  // Handle mobile tabs
  const handleSortTabToggle = () => {
    setShowFilterTab(false);
    setShowSortTab(!showSortTab);
  };

  const handleFilterTabToggle = () => {
    setShowSortTab(false);
    setShowFilterTab(!showFilterTab);
  };

  // Mobile filter change handler
  const handleMobileFiltersChange = (newFilters: typeof filters) => {
    setMobileFilters(newFilters);
    // Apply filters logic here
    console.log('Mobile filters applied:', newFilters);
  };

  // Mobile Product Card Component
  const MobileProductCard = ({ project }: { project: Project }) => (
    <div 
      className="flex items-start space-x-3 p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
      onClick={() => handleViewDetails(project.id)}
    >
      <div className="relative flex-shrink-0">
        <img
          src={project.image || NoImageAvailable}
          alt={project.title}
          className="w-20 h-20 object-cover rounded-lg"
          onError={e => { e.currentTarget.src = NoImageAvailable; }}
        />
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-white/90 hover:bg-white shadow-sm rounded-full"
          onClick={(e) => handleFavorite(project.id, e)}
        >
          <Heart className={`w-3 h-3 ${project.isFavorited ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} />
        </Button>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <img
            src={getAuthorDetails(project.author).image || NoUserProfile}
            alt={getAuthorDetails(project.author).name}
            className="w-5 h-5 rounded-full border border-gray-200"
            onError={e => { e.currentTarget.src = NoUserProfile; }}
          />
          <span className="text-xs text-gray-600 truncate">
            {getAuthorDetails(project.author).name}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-500 text-xs">{project.rating}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
          {project.title}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {project.skills.slice(0, 3).map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-[10px] border-gray-200 text-gray-600 bg-gray-50 font-medium px-1 py-0"
            >
              {skill}
            </Badge>
          ))}
          {project.skills.length > 3 && (
            <span className="text-[10px] text-gray-400">+{project.skills.length - 3}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-green-600" />
              <span className="text-sm font-semibold text-green-600">${project.price}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">{project.duration}</span>
            </div>
          </div>
          <Badge className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5">
            {project.category}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="text-center py-8">No projects found</div>;
  }

  return (
    <div className="flex-1 font-sans flex" style={{ minHeight: "100vh" }}>
      {/* Product Grid */}
      <div className={`flex-1 transition-all duration-300 ${selected && !isMobile ? "pr-0 md:pr-[440px]" : ""}`}>
        {/* Desktop Header */}
        {!isMobile && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Featured Projects</h2>
            <div className="flex items-center space-x-3">
              <select 
                className="bg-white border border-gray-300 text-gray-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 px-4">Featured Projects</h2>
          </div>
        )}

        {/* Desktop Grid */}
        {!isMobile && (
          <div className={`grid ${selected ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"} gap-8`}>
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-102 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <img
                    src={project.image || NoImageAvailable}
                    alt={project.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    loading="lazy"
                    onClick={() => setSelected(project)}
                    onError={e => { e.currentTarget.src = NoImageAvailable; }}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-gray-900/90 text-white font-semibold px-2 py-0.5 text-[10px] rounded shadow">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-7 h-7 p-0 bg-white/70 hover:bg-white/90 shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(project.id);
                      }}
                    >
                      <Heart className={`w-4 h-4 ${project.isFavorited ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} />
                    </Button>
                    <div className="flex items-center space-x-1 bg-white/70 rounded px-1 py-0.5 shadow">
                      <Eye className="w-3 h-3 text-gray-700" />
                      <span className="text-gray-700 text-[10px]">{project.views}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={getAuthorDetails(project.author).image || NoUserProfile}
                      alt={getAuthorDetails(project.author).name}
                      className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer"
                      onError={e => { e.currentTarget.src = NoUserProfile; }}
                      onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                    />
                    <span
                      className="text-gray-700 text-xs cursor-pointer"
                      style={{ transition: 'color 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.color = '#2563eb'}
                      onMouseOut={e => e.currentTarget.style.color = ''}
                      onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                    >
                      {getAuthorDetails(project.author).name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-500 text-xs">{project.rating}</span>
                      <span className="text-gray-400 text-[10px]">({project.reviews})</span>
                    </div>
                  </div>

                  <h3 
                    className="text-base font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => setSelected(project)}
                  >
                    {project.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-[10px] border-gray-200 text-gray-600 bg-gray-100 font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm font-sm font-semibold text-gray-500">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{project.price}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Fixed Buttons at Card Bottom */}
                <div className="px-4 pb-4 mt-auto flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-lg shadow transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    style={{ width: "85%" }}
                    onClick={() => handleViewDetails(project.id)}
                  >
                    <ArrowRight className="mr-2 w-4 h-4" />
                    Purchase Now
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                    style={{ width: "15%", minWidth: 0, padding: 0 }}
                    aria-label="Add to Cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(project.id);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mx-auto" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Mobile List */}
        {isMobile && (
          <div className="bg-white">
            {projects.map((project) => (
              <MobileProductCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {renderPagination()}
      </div>

      {/* Desktop Detail Panel */}
      {selected && !isMobile && (
        <aside
          className="fixed right-0 z-40 top-0 bg-white shadow-2xl border-l border-gray-200 flex flex-col"
          style={{
            maxWidth: 440,
            minWidth: 320,
            width: "100%",
            height: `calc(100vh - 64px)`,
            top: 64,
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Badge
                className={`text-xs px-2 py-0.5 rounded ${
                  selected.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : selected.status === "New"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {selected.status}
              </Badge>
              <span className="text-xs text-gray-400 ml-2">Posted {selected.posted}</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-gray-700"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="overflow-y-auto flex-1 px-6 py-4">
            <img
              src={selected.image || NoImageAvailable}
              alt={selected.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
              onError={e => { e.currentTarget.src = NoImageAvailable; }}
            />

            <div className="flex items-center mb-4">
              <img
                src={getAuthorDetails(selected.author).image || NoUserProfile}
                alt={getAuthorDetails(selected.author).name}
                className="w-8 h-8 rounded-full border border-gray-200 mr-3 cursor-pointer"
                onError={e => { e.currentTarget.src = NoUserProfile; }}
                onClick={() => goToAuthorProfile(getAuthorDetails(selected.author).userType, selected.author)}
              />
              <div>
                <div
                  className="text-sm font-semibold text-gray-800 cursor-pointer"
                  style={{ transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#2563eb'}
                  onMouseOut={e => e.currentTarget.style.color = ''}
                  onClick={() => goToAuthorProfile(getAuthorDetails(selected.author).userType, selected.author)}
                >
                  {getAuthorDetails(selected.author).name}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-500">{selected.rating}</span>
                  <span>({selected.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-4 h-4" />
                Team Size: <span className="font-semibold text-gray-700">{selected.teamSize}</span>
              </div>
            </div>

            <Badge className="bg-gray-900/90 text-white font-semibold px-2 py-0.5 text-[10px] rounded shadow mb-4">
              {selected.category}
            </Badge>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{selected.title}</h3>
            <div className="flex flex-wrap gap-1 mb-3">
              {selected.skills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-[10px] border-gray-200 text-gray-600 bg-gray-100 font-medium"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {selected.tags.map((tag, idx) => (
                <Badge key={idx} className="bg-blue-50 text-blue-700 text-[10px] font-medium rounded">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>${selected.price}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{selected.duration}</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">{selected.description}</p>

            <div className="flex gap-2 mb-6">
              <Button size="sm" variant="outline" className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-100">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-100">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-300 mb-6"
              onClick={() => handleViewDetails(selected.id)}
            >
              Let's Connect
            </Button>

            {/* Related Projects */}
            <div>
              <div className="text-xs text-gray-500 mb-2 font-semibold">Related Projects</div>
              <div className="flex flex-col gap-3">
                {getRelated(selected.id).map((rel) => (
                  <div key={rel.id} className="flex items-center gap-3 bg-gray-50 rounded p-2">
                    <img src={rel.image || NoImageAvailable} alt={rel.title} className="w-12 h-12 object-cover rounded" onError={e => { e.currentTarget.src = NoImageAvailable; }} />
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-gray-700">{rel.title}</div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <DollarSign className="w-3 h-3" />
                        ${rel.price}
                        <Clock className="w-3 h-3 ml-2" />
                        {rel.duration}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      onClick={() => setSelected(rel)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Bottom Tabs */}
      {isMobile && (
        <>
          {/* Sticky Bottom Tabs */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex">
            <button
              onClick={handleSortTabToggle}
              className={`flex-1 flex items-center justify-center py-3 px-4 ${
                showSortTab ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              <SortAsc className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Sort</span>
            </button>
            <div className="w-px bg-gray-200"></div>
            <button
              onClick={handleFilterTabToggle}
              className={`flex-1 flex items-center justify-center py-3 px-4 ${
                showFilterTab ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>

          {/* Sort Full Screen Modal */}
          {showSortTab && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Sort By</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSortTab(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  {[
                    { value: 'recent', label: 'Most Recent' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortTab(false);
                      }}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        sortBy === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter Full Screen Modal */}
          {showFilterTab && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilterTab(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <FilterSidebar onFiltersChange={handleMobileFiltersChange} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};