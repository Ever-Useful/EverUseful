import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PopupMenu } from "@/components/PopupMenu";
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
} from "lucide-react";
import { useAuthState } from "../../hooks/useAuthState";
import { firestoreService } from "../../services/firestoreService";
import { userService } from "../../services/userService";
import { toast } from "sonner";
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
  const [showPopupMenu, setShowPopupMenu] = useState(false);
  const [targetProductPath, setTargetProductPath] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const navigate = useNavigate();
  const { user, token, isLoading: authLoading } = useAuthState();
  const location = useLocation();
  const [authorCache, setAuthorCache] = useState<Record<string, any>>({});
  const [currentUserCustomId, setCurrentUserCustomId] = useState<string | null>(null);
  const [authorsLoading, setAuthorsLoading] = useState(false);

  // Fetch current user's customUserId
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (user) {
        try {
          const userData = await firestoreService.getCurrentUserData();
          if (userData && userData.customUserId) {
            setCurrentUserCustomId(userData.customUserId);
          }
        } catch (error) {
          console.error('Error fetching current user data:', error);
        }
      }
    };
    
    fetchCurrentUserData();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }
        
        if (filters) {
          if (filters.category) queryParams.append('category', filters.category);
          if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
          if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
          if (filters.minRating) queryParams.append('minRating', filters.minRating.toString());
          if (filters.skills?.length) queryParams.append('skills', filters.skills.join(','));
          if (filters.duration) queryParams.append('duration', filters.duration);
        }

        // Add sort parameter
        queryParams.append('sort', sortBy);
        
        // Add pagination parameters
        queryParams.append('page', currentPage.toString());
        // Adjust limit based on sidebar state
        const limit = selected ? '10' : '15';
        queryParams.append('limit', limit);

        const response = await fetch(`http://localhost:3000/api/marketplace/projects?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json();
        setProjects(data.projects);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, filters, sortBy, currentPage]);

  // Memoize unique author IDs to prevent unnecessary API calls
  const uniqueAuthorIds = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.author)));
  }, [projects]);

  // Memoize uncached author IDs
  const uncachedAuthorIds = useMemo(() => {
    return uniqueAuthorIds.filter(id => id && !authorCache[id]);
  }, [uniqueAuthorIds, authorCache]);

  // Fetch author details for all projects using bulk endpoint
  useEffect(() => {
    const fetchAuthors = async () => {
      if (uncachedAuthorIds.length === 0) return;
      
      try {
        setAuthorsLoading(true);
        const response = await fetch(`http://localhost:3000/api/users/bulk/${uncachedAuthorIds.join(',')}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAuthorCache(prevCache => ({
              ...prevCache,
              ...data.data
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching authors in bulk:', error);
      } finally {
        setAuthorsLoading(false);
      }
    };
    
    fetchAuthors();
  }, [uncachedAuthorIds]);

  // Helper to get author details with loading state
  const getAuthorDetails = (authorId: string) => {
    const user = authorCache[authorId as keyof typeof authorCache];
    if (!user) {
      return { 
        name: authorsLoading ? 'Loading...' : 'Unknown', 
        image: NoUserProfile, 
        userType: '', 
        id: authorId,
        isLoading: authorsLoading
      };
    }
    const auth = user.auth || {};
    const profile = user.profile || {};
    return {
      name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Unnamed User',
      image: profile.avatar || NoUserProfile,
      userType: profile.userType || auth.userType || '',
      id: user.customUserId,
      isLoading: false
    };
  };

  // Skeleton loader for author details
  const AuthorSkeleton = () => (
    <div className="flex items-center space-x-2 mb-2">
      <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
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
      <div className="w-full flex items-center justify-center mt-8">
        <div className="flex items-center justify-center space-x-2 bg-white rounded-lg shadow-sm p-2">
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

  const handleViewDetails = async (projectId: number) => {
    if (!user || !token) {
      setTargetProductPath(`/product/${projectId}`);
      setShowPopupMenu(true);
      return;
    }

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Increment the view count
      const viewResponse = await fetch(`http://localhost:3000/api/marketplace/projects/${projectId}/view`, {
        method: 'POST',
        headers
      });
      
      if (!viewResponse.ok) throw new Error('Failed to increment view count');
      
      // Update the project views in the local state
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, views: project.views + 1 }
            : project
        )
      );

      // Navigate to the product page
      navigate(`/product/${projectId}`);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleFavorite = async (projectId: number) => {
    if (!user || !token) {
      setShowPopupMenu(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/marketplace/projects/${projectId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (!response.ok) throw new Error('Failed to toggle favorite');
      
      const data = await response.json();
      
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? {
                ...project,
                isFavorited: data.isFavorited
              }
            : project
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleAddToCart = async (projectId: number) => {
    if (!user || !token) {
      setShowPopupMenu(true);
      return;
    }

    try {
      // Get user data from Firestore to get customUserId
      const firestoreData = await firestoreService.getCurrentUserData();
      if (!firestoreData) {
        toast.error('User data not found');
        return;
      }

      // Add project to cart in userData.json (only productId, addedAt, quantity)
      await userService.addToCart(firestoreData.customUserId, {
        productId: projectId.toString(),
        addedAt: new Date().toISOString(),
        quantity: 1
      });
      
      toast.success('Project added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add project to cart');
    }
  };

  // Helper: get 2 related projects (different from selected)
  const getRelated = (id: number) => projects.filter((p) => p.id !== id).slice(0, 2);

  // Helper function to navigate to author profile based on userType
  const goToAuthorProfile = (userType: string, id: string) => {
    // Check if current user is the author
    if (currentUserCustomId && currentUserCustomId === id) {
      // Redirect to current user's own profile
      navigate('/profile');
      return;
    }
    
    const type = (userType || '').toLowerCase();
    
    // Check if user type is student or professor
    if (type === 'student' || type === 'professor') {
      navigate(`/studentprofile/${id}`);
    } 
    // Check if user type is freelancer
    else if (type === 'freelancer') {
      navigate(`/freelancerprofile/${id}`);
    } 
    // Default fallback to student profile for unknown user types
    else {
      console.warn(`Unknown user type: ${userType}, redirecting to student profile`);
      // navigate(`/studentprofile/${id}`);
    }
  };

  if (loading || authLoading) {
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
      <div className={`flex-1 transition-all duration-300 ${selected ? "pr-0 md:pr-[440px]" : ""}`}>
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
                {getAuthorDetails(project.author).isLoading ? (
                  <AuthorSkeleton />
                ) : (
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
                )}

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
                      <span>${project.price}</span>
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
                  {user ? 'Purchase Now' : 'Sign in to View'}
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

        {renderPagination()}
      </div>

      {/* Detail Panel */}
      {selected && (
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
              {getAuthorDetails(selected.author).isLoading ? (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
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
        <PopupMenu 
        isOpen={showPopupMenu}
        onClose={() => {
          setShowPopupMenu(false);
          setTargetProductPath('');
        }}
        title="Get Started with AMOGH"
        formType="login"
        redirectPath={targetProductPath || location.pathname}
      />
    </div>

  );
};


