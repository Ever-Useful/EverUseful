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
import { Header } from "@/components/Header";
import { useAuthState } from "@/hooks/useAuthState";
import { firestoreService } from "@/services/firestoreService";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import NoUserProfile from "@/assets/images/no user profile.png";

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
    if (!user) return { name: 'Unknown', image: NoUserProfile, userType: '', id: authorId };
    const auth = user.auth || {};
    const profile = user.profile || {};
    return {
      name: `${auth.firstName || ''} ${auth.lastName || ''}`.trim() || 'Unnamed User',
      image: profile.avatar || NoUserProfile,
      userType: auth.userType || '',
      id: user.customUserId
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
      const firestoreData = await firestoreService.getCurrentUserData();
      if (!firestoreData) {
        toast.error('User data not found');
        return;
      }
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
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="mb-4">
                <img 
                  src={project.images ? project.images[selectedImage] : project.image} 
                  alt={project.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
              {project.images && project.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {project.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded border-2 transition-all ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${project.title} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-200">
                {project.category}
              </Badge>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-4">
                {project.subtitle}
              </p>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{project.rating}</span>
                  <span className="text-gray-500">({project.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{project.views} views</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Download className="w-4 h-4" />
                  <span>{project.downloads} downloads</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6">
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
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-gray-300 text-gray-700">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${project.price}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">{project.originalPrice}</span>
                    <span className="text-lg text-gray-500 ml-2">{project.discount}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{project.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={showReceipt}>
                    Purchase Now
                  </Button>
                  <Button className="flex-1 items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600" onClick={() => handleAddToCart(project.id)}>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="tech">Tech Stack</TabsTrigger>
                <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {displayedText}
                    </p>
                    {shouldTruncate && (
                      <button className="mt-2 text-blue-600 hover:underline text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tech" className="mt-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.techStack.map((tech, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <Code className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700 font-medium">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="deliverables" className="mt-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-gray-900">What You'll Get</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {project.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <ReviewSection 
                  projectId={project.id}
                  averageRating={project.rating}
                  totalReviews={project.reviews}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Profile */}
            <Card className="border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
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
                <p className="text-sm text-gray-600 mb-4">{project.author.bio}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => goToAuthorProfile(getAuthorDetails(project.author).userType, project.author)}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-orange-300">
              <CardHeader>
                <CardTitle className="text-black">Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-black" />
                  <span className="text-sm text-black">Money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-black" />
                  <span className="text-sm text-black">Verified creator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-black" />
                  <span className="text-sm text-black">24/7 support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <RelatedProducts />
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Sign in to add to cart</h2>
            <Button onClick={() => setShowPopupMenu(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
