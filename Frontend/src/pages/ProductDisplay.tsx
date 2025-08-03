import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ReviewSection } from "@/components/ReviewSection";
import { 
  Star, 
  Heart, 
  Share2, 
  Download, 
  Eye, 
  Clock, 
  Users,
  CheckCircle,
  Shield,
  Award,
  Code,
  ShoppingCart
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { useAuthState } from "@/hooks/useAuthState";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import NoUserProfile from "@/assets/images/no user profile.png";
import { Skeleton } from "@/components/ui/skeleton";
import NoImageAvailable from "@/assets/images/no image available.png";

const ProductDisplay = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const MAX_LENGTH = 200;
  const { user, token, isLoading: authLoading } = useAuthState();
  const [showPopupMenu, setShowPopupMenu] = useState(false);
  const [authorCache, setAuthorCache] = useState<Record<string, any>>({});
  const [currentUserCustomId, setCurrentUserCustomId] = useState<string | null>(null);

  // Fetch current user's customUserId
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (user) {
        try {
          const userData = await userService.getUserProfile();
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
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/marketplace/projects/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        setProject(data.project);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  // Fetch author details for the project
  useEffect(() => {
    const fetchAuthor = async () => {
      if (project && project.author && !authorCache[project.author]) {
        try {
          const res = await fetch(`http://localhost:3000/api/users/${project.author}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
              setAuthorCache(prev => ({
                ...prev,
                [project.author]: data.data
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching author details:', error);
        }
      }
    };
    
    if (project) fetchAuthor();
  }, [project, authorCache]);

  // Helper to get author details
  const getAuthorDetails = (authorId: string) => {
    const user = authorCache[authorId];
    if (!user) return { name: 'Unknown', image: NoUserProfile, userType: '', id: authorId, description: '' };
    const auth = user.auth || {};
    const profile = user.profile || {};
    return {
      name: `${auth.firstName || ''} ${auth.lastName || ''}`.trim() || 'Unnamed User',
      image: profile.avatar || NoUserProfile,
      userType: auth.userType || '',
      id: user.customUserId,
      description: profile.bio || ''
    };
  };

  const goToAuthorProfile = (userType: string, id: string) => {
    // Check if current user is the author
    if (currentUserCustomId && currentUserCustomId === id) {
      // Redirect to current user's own profile
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

  const showReceipt = () => {
    navigate("/paymentSuccess")
  }

  const handleAddToCart = async (projectId: number) => {
    if (!user || !token) {
      setShowPopupMenu(true);
      return;
    }
    try {
      const userData = await userService.getUserProfile();
      if (!userData) {
        toast.error('User data not found');
        return;
      }
      await userService.addToCart(userData.customUserId, {
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error || !project) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Project not found'}</div>;
  }

  const shouldTruncate = project.description.length > MAX_LENGTH
  const displayedText = isExpanded
  ? project.description
  : project.description.slice(0, MAX_LENGTH) + (shouldTruncate ? "..." : "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 lg:px-6 py-2 xs:py-3 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="order-1">
              <div className="mb-2 xs:mb-3 sm:mb-4">
                <img 
                  src={project.images && project.images[selectedImage] ? project.images[selectedImage] : (project.image || NoImageAvailable)} 
                  alt={project.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                  onError={e => { e.currentTarget.src = NoImageAvailable; }}
                />
              </div>
              {project.images && project.images.length > 1 && (
                <div className="grid grid-cols-4 xs:grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-1 sm:gap-2">
                  {project.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded border-2 transition-all hover:scale-105 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${project.title} ${index + 1}`}
                        className="w-full h-10 xs:h-12 sm:h-16 lg:h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="order-2 justify-between">
              <Badge className="mb-2 sm:mb-3 bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm px-2 py-1">
                {project.category}
              </Badge>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight mobile-text-4xl">
                {project.title}
              </h1>
              
              <p className="text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed mobile-text-base">
                {project.subtitle}
              </p>

              <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{project.rating}</span>
                  <span className="text-gray-500 text-xs sm:text-sm">({project.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{project.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{project.downloads} downloads</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                {(!authorCache[project.author]) ? (
                  <>
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="w-32 h-5 mb-2 rounded" />
                      <Skeleton className="w-20 h-4 rounded" />
                    </div>
                  </>
                ) : (
                  <>
                    <img 
                      src={getAuthorDetails(project.author).image} 
                      alt={getAuthorDetails(project.author).name}
                      className="w-12 h-12 rounded-full cursor-pointer"
                      onError={e => { e.currentTarget.src = NoUserProfile; }}
                      onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span 
                          className="font-semibold text-gray-900 cursor-pointer"
                          style={{ transition: 'color 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.color = '#2563eb'}
                          onMouseOut={e => e.currentTarget.style.color = ''}
                          onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                        >
                          {getAuthorDetails(project.author).name}
                        </span>
                        {project.author.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{project.author.projects} projects</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-gray-300 text-gray-700 text-xs hover:bg-gray-50">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="sm:mt-20 p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="mb-2 sm:mb-0">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">${project.price}</span>
                    <span className="text-base sm:text-lg text-gray-500 line-through ml-2">{project.originalPrice}</span>
                    <span className="text-base sm:text-lg text-green-600 ml-2 font-medium">{project.discount}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm sm:text-base">{project.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Button row: always a row, stacked only if not enough space */}
                <div className="flex flex-row space-x-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3 transition-colors" onClick={showReceipt}>
                    Purchase Now
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-sm sm:text-base py-2 sm:py-3 transition-colors"
                    onClick={() => handleAddToCart(project.id)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline">&nbsp;Add to Cart</span>
                  </Button>
                  <Button variant="outline" size="icon" className="flex-none hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Safety Tags */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
          <Shield className="w-4 h-4 mr-1 text-orange-500" />
          Money-back guarantee
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
          <Award className="w-4 h-4 mr-1 text-green-500" />
          Verified creator
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
          <Users className="w-4 h-4 mr-1 text-blue-500" />
          24/7 support
        </span>
      </div>

      {/* Detailed Information */}
      <div className="container mx-auto px-2 xs:px-2 sm:px-4 lg:px-6 py-3 xs:py-3 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm h-auto p-1">
                <TabsTrigger value="overview" className="py-1 px-1 xs:py-2 xs:px-2 sm:px-4">Overview</TabsTrigger>
                <TabsTrigger value="features" className="py-1 px-1 xs:py-2 xs:px-2 sm:px-4">Features</TabsTrigger>
                <TabsTrigger value="tech" className="hidden sm:inline-flex py-1 px-1 xs:py-2 xs:px-2 sm:px-4">Tech Stack</TabsTrigger>
                <TabsTrigger value="deliverables" className="hidden sm:inline-flex py-1 px-1 xs:py-2 xs:px-2 sm:px-4">Deliverables</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-3 xs:mt-4 sm:mt-6">
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader className="pb-2 xs:pb-3 sm:pb-6 px-3 xs:px-4 sm:px-6">
                    <CardTitle className="text-gray-900 text-3xl">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-3 xs:px-4 sm:px-6">
                    <p className="text-gray-700 leading-relaxed text-xs xs:text-sm sm:text-base lg:text-lg">
                      {displayedText}
                    </p>
                    {shouldTruncate && (
                      <button className="mt-2 text-blue-600 hover:text-blue-800 hover:underline text-xs xs:text-sm transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-3 xs:mt-4 sm:mt-6">
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader className="pb-2 xs:pb-3 sm:pb-6 px-3 xs:px-4 sm:px-6">
                    <CardTitle className="text-gray-900 text-3xl">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-3 xs:px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-1 xs:gap-2 sm:gap-3">
                      {project.features && Array.isArray(project.features) ? (
                        project.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2 xs:space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-xs xs:text-sm sm:text-base leading-relaxed">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No features listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tech" className="mt-3 xs:mt-4 sm:mt-6">
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader className="pb-2 xs:pb-3 sm:pb-6 px-3 xs:px-4 sm:px-6">
                    <CardTitle className="text-gray-900 text-3xl">Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-3 xs:px-4 sm:px-6">
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-1 xs:gap-2 sm:gap-3 lg:gap-4">
                      {project.techStack && Array.isArray(project.techStack) ? (
                        project.techStack.map((tech, index) => (
                          <div key={index} className="flex items-center space-x-2 xs:space-x-3 p-2 xs:p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <Code className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-xs xs:text-sm sm:text-base">{tech}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No technology stack listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="deliverables" className="mt-3 xs:mt-4 sm:mt-6">
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader className="pb-2 xs:pb-3 sm:pb-6 px-3 xs:px-4 sm:px-6">
                    <CardTitle className="text-gray-900 text-3xl">What You'll Get</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-3 xs:px-4 sm:px-6">
                    <div className="space-y-1 xs:space-y-2 sm:space-y-3">
                      {project.deliverables && Array.isArray(project.deliverables) ? (
                        project.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex items-start space-x-2 xs:space-x-3 p-2 xs:p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-xs xs:text-sm sm:text-base leading-relaxed">{deliverable}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No deliverables listed</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Mobile-only tabs for Tech Stack and Deliverables */}
            <div className="sm:hidden mt-3 xs:mt-4 space-y-3 xs:space-y-4">
              <Card>
                <CardHeader className="pb-2 px-3">
                  <CardTitle className="text-gray-900 text-base">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3">
                  <div className="grid grid-cols-1 gap-1">
                    {project.techStack && Array.isArray(project.techStack) ? (
                      project.techStack.map((tech, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <Code className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium text-xs">{tech}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No technology stack listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 px-3">
                  <CardTitle className="text-gray-900 text-base">What You'll Get</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-3">
                  <div className="space-y-1">
                    {project.deliverables && Array.isArray(project.deliverables) ? (
                      project.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-xs leading-relaxed">{deliverable}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No deliverables listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar (desktop), About the Creator below details (mobile) */}
          <div
            className="
              space-y-4 sm:space-y-6
              order-1 lg:order-2
              hidden lg:block
            "
          >
            {/* Creator Profile - Desktop Only */}
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 sm:pb-6 px-4 sm:px-6">
                <CardTitle className="text-gray-900 text-lg sm:text-xl">About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
                {(!authorCache[project.author]) ? (
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div>
                      <Skeleton className="w-32 h-6 mb-2 rounded" />
                      <Skeleton className="w-20 h-4 rounded" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src={getAuthorDetails(project.author).image} 
                      alt={getAuthorDetails(project.author).name}
                      className="w-16 h-16 rounded-full cursor-pointer"
                      onError={e => { e.currentTarget.src = NoUserProfile; }}
                      onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 
                          className="font-semibold text-gray-900 cursor-pointer"
                          style={{ transition: 'color 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.color = '#2563eb'}
                          onMouseOut={e => e.currentTarget.style.color = ''}
                          onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                        >
                          {getAuthorDetails(project.author).name}
                        </h3>
                        {project.author.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{project.author.rating}</span>
                      </div>
                    </div>
                  </div>
                )}
                {(!authorCache[project.author]) ? (
                  <Skeleton className="w-full h-4 mb-4 rounded" />
                ) : (
                  <p className="text-sm text-gray-600 mb-4">{project.author.bio}</p>
                )}
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm transition-colors"
                  onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* About the Creator - Mobile Only, below details section */}
          <div className="block lg:hidden mt-6">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 px-4">
                <CardTitle className="text-gray-900 text-lg">About the Creator</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={getAuthorDetails(project.author).image} 
                    alt={getAuthorDetails(project.author).name}
                    className="w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110"
                    onError={e => { e.currentTarget.src = NoUserProfile; }}
                    onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 
                        className="font-semibold text-gray-900 cursor-pointer text-sm hover:text-blue-600 transition-colors truncate"
                        onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                      >
                        {getAuthorDetails(project.author).name}
                      </h3>
                      {project.author.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{project.author.rating}</span>
                    </div>
                  </div>
                </div>
                {/* Author Description */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {getAuthorDetails(project.author).description || project.author.bio || "No description available."}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm transition-colors"
                  onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8 sm:mt-12">
          <RelatedProducts />
        </div>

        {/* Reviews Section */}
        <div className="mt-8 sm:mt-12">
          <ReviewSection 
            projectId={project.id}
            averageRating={project.rating}
            totalReviews={project.reviews}
          />
        </div>
      </div>
      
      <Footer/>
      
      {/* PopupMenu for login if not authenticated */}
      {showPopupMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm mx-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Sign in to add to cart</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">Please sign in to add items to your cart and make purchases.</p>
            <div className="flex flex-col space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors" 
                onClick={() => {
                  setShowPopupMenu(false);
                  navigate('/login');
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50 transition-colors" 
                onClick={() => setShowPopupMenu(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;