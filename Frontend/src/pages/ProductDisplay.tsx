import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

const ProductDisplay = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const MAX_LENGTH = 200;
  
  const project = {
    id: 1,
    title: "AI-Powered Climate Change Prediction Model",
    subtitle: "Advanced machine learning system for environmental forecasting",
    description: "Revolutionary machine learning system for predicting climate patterns and environmental changes with 95% accuracy. This comprehensive solution combines satellite data, weather patterns, and historical climate information to provide actionable insights for governments, researchers, and environmental organizations.",
    category: "AI & Sustainability",
    price: "$2,500",
    originalPrice: "$3,200",
    discount: "22%",
    duration: "2 months",
    rating: 4.9,
    reviews: 127,
    downloads: 1540,
    likes: 284,
    views: 8920,
    author: {
      name: "Dr. Sarah Chen",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true,
      rating: 4.9,
      projects: 24,
      bio: "Climate scientist and AI researcher with 10+ years experience in environmental modeling."
    },
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1569163139394-de44aa8c3cc0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop"
    ],
    skills: ["Machine Learning", "Python", "Climate Science", "TensorFlow", "Data Analytics"],
    features: [
      "95% prediction accuracy",
      "Real-time data processing",
      "Global climate modeling",
      "Historical data analysis",
      "API integration ready",
      "Custom alerts system"
    ],
    techStack: ["Python", "TensorFlow", "Pandas", "NumPy", "Matplotlib", "Jupyter"],
    deliverables: [
      "Complete source code",
      "Documentation",
      "Training dataset",
      "API endpoints",
      "Deployment guide",
      "30-day support"
    ]
  };

  const showReceipt = () => {
    navigate("/paymentSuccess")
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
                  src={project.images[selectedImage]} 
                  alt={project.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {project.images.map((image, index) => (
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
                  src={project.author.image} 
                  alt={project.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{project.author.name}</span>
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

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{project.price}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">{project.originalPrice}</span>
                    <span className="text-lg text-gray-500 ml-2">{project.discount} off</span>
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
                  <Button className="flex-1 items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600">
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
                    src={project.author.image} 
                    alt={project.author.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{project.author.name}</h3>
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
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
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
    </div>
  );
};

export default ProductDisplay;
