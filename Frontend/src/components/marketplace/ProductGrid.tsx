import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";


// Demo data
const projects = [
  {
    id: 1,
    title: "AI-Powered Climate Change Prediction Model",
    description:
      "Advanced machine learning system for predicting climate patterns and environmental changes with 95% accuracy.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    category: "AI & Sustainability",
    price: "$2,500",
    duration: "2 months",
    rating: 4.9,
    reviews: 127,
    author: "Dr. Sarah Chen",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    authorBio:
      "PhD in Environmental Science, 10+ years in AI research. Passionate about climate solutions.",
    status: "Active",
    posted: "2025-06-01",
    teamSize: 6,
    tags: ["AI", "Climate", "Prediction", "Sustainability"],
    skills: ["Machine Learning", "Python", "Climate Science"],
    views: 1540,
    
  },
  {
    id: 2,
    title: "Blockchain-Based Supply Chain Tracker",
    description:
      "Transparent supply chain management system using blockchain technology for ethical sourcing verification.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    category: "Blockchain",
    price: "$3,200",
    duration: "3 months",
    rating: 4.8,
    reviews: 89,
    author: "Michael Rodriguez",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    authorBio:
      "Blockchain enthusiast and full-stack developer. Loves building transparent systems.",
    status: "New",
    posted: "2025-06-06",
    teamSize: 4,
    tags: ["Blockchain", "Supply Chain", "Transparency"],
    skills: ["Blockchain", "Solidity", "React"],
    views: 2100,
    
  },
  {
    id: 3,
    title: "Smart Health Monitoring IoT Device",
    description:
      "Wearable device that monitors vital signs and provides real-time health analytics using advanced sensors.",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    category: "HealthTech",
    price: "$1,800",
    duration: "6 weeks",
    rating: 4.7,
    reviews: 156,
    author: "Lisa Johnson",
    authorImage: "https://randomuser.me/api/portraits/women/65.jpg",
    authorBio:
      "Hardware and IoT specialist. Building smart devices for better health.",
    status: "Completed",
    posted: "2025-05-20",
    teamSize: 5,
    tags: ["IoT", "Healthcare", "Wearable"],
    skills: ["IoT", "Hardware", "Mobile App"],
    views: 980,
    
  },
  {
    id: 4,
    title: "Sustainable Energy Management System",
    description:
      "Smart grid solution for optimizing renewable energy distribution and reducing carbon footprint.",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    category: "Sustainable Tech",
    price: "$4,500",
    duration: "4 months",
    rating: 5.0,
    reviews: 78,
    author: "Dr. Raj Patel",
    authorImage: "https://randomuser.me/api/portraits/men/54.jpg",
    authorBio:
      "Energy systems researcher. Focused on sustainable infrastructure.",
    status: "Active",
    posted: "2025-06-10",
    teamSize: 8,
    tags: ["Energy", "Grid", "Sustainability"],
    skills: ["Energy Systems", "Python", "Data Analytics"],
    views: 1765,
    
  },
  {
    id: 5,
    title: "Educational VR Platform for Remote Learning",
    description:
      "Immersive virtual reality platform that enhances online education with interactive 3D environments.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    category: "EdTech",
    price: "$2,800",
    duration: "10 weeks",
    rating: 4.6,
    reviews: 203,
    author: "Emma Watson",
    authorImage: "https://randomuser.me/api/portraits/women/68.jpg",
    authorBio: "VR developer and educator. Making learning immersive.",
    status: "Active",
    posted: "2025-06-03",
    teamSize: 7,
    tags: ["VR", "Education", "3D"],
    skills: ["VR Development", "Unity", "3D Modeling"],
    views: 1320,
    
  },
  {
    id: 6,
    title: "Fintech Mobile Payment Solution",
    description:
      "Secure peer-to-peer payment app with advanced encryption and seamless user experience.",
    image:
      "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=400&q=80",
    category: "FinTech",
    price: "$3,800",
    duration: "12 weeks",
    rating: 4.8,
    reviews: 167,
    author: "James Wilson",
    authorImage: "https://randomuser.me/api/portraits/men/76.jpg",
    authorBio: "Mobile fintech architect. Secure and scalable solutions.",
    status: "Active",
    posted: "2025-06-08",
    teamSize: 6,
    tags: ["FinTech", "Payments", "Security"],
    skills: ["React Native", "Cybersecurity", "API Development"],
    views: 2240,
    
  },
  {
    id: 7,
    title: "Personal Finance Analytics Dashboard",
    description:
      "A dashboard for tracking expenses, investments, and savings with AI-driven insights.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
    category: "FinTech",
    price: "$1,200",
    duration: "8 weeks",
    rating: 4.5,
    reviews: 110,
    author: "Sophie Turner",
    authorImage: "https://randomuser.me/api/portraits/women/72.jpg",
    authorBio: "Data visualization expert. Making finance simple.",
    status: "Completed",
    posted: "2025-05-28",
    teamSize: 3,
    tags: ["Finance", "Analytics", "Dashboard"],
    skills: ["Finance", "React", "Data Visualization"],
    views: 890,
    
  },
  {
    id: 8,
    title: "Remote Patient Monitoring App",
    description:
      "Mobile app for doctors to monitor patients remotely with real-time alerts and secure data.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    category: "HealthTech",
    price: "$2,000",
    duration: "7 weeks",
    rating: 4.7,
    reviews: 99,
    author: "Oliver Smith",
    authorImage: "https://randomuser.me/api/portraits/men/21.jpg",
    authorBio: "Healthcare app developer. Bridging tech and care.",
    status: "Active",
    posted: "2025-06-02",
    teamSize: 4,
    tags: ["Health", "Remote", "Monitoring"],
    skills: ["Mobile App", "Healthcare", "Security"],
    views: 1450,
    
  },
  {
    id: 9,
    title: "IoT Smart Home Automation",
    description:
      "Complete IoT solution for home automation, energy saving, and security.",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    category: "IoT",
    price: "$2,900",
    duration: "9 weeks",
    rating: 4.6,
    reviews: 134,
    author: "Ava Lee",
    authorImage: "https://randomuser.me/api/portraits/women/14.jpg",
    authorBio: "IoT specialist. Building smarter homes.",
    status: "New",
    posted: "2025-06-09",
    teamSize: 5,
    tags: ["IoT", "Home", "Automation"],
    skills: ["IoT", "Home Automation", "Security"],
    views: 1680,
    
  },
  {
    id: 10,
    title: "Sustainable Urban Farming Platform",
    description:
      "Digital platform for urban farming communities to share resources and optimize yields.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    category: "Sustainable Tech",
    price: "$1,700",
    duration: "5 weeks",
    rating: 4.4,
    reviews: 77,
    author: "Lucas Brown",
    authorImage: "https://randomuser.me/api/portraits/men/43.jpg",
    authorBio: "Agri-tech innovator. Growing food for the future.",
    status: "Active",
    posted: "2025-06-07",
    teamSize: 6,
    tags: ["Farming", "Urban", "Sustainability"],
    skills: ["Agriculture", "Data Science", "Community"],
    views: 780,
    
  },
];
export const ProductGrid = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();


  // Helper: get 2 related projects (different from selected)
  const getRelated = (id) => projects.filter((p) => p.id !== id).slice(0, 2);


  // Navbar height (adjust if your navbar is different)
  const NAVBAR_HEIGHT = 64;


  return (
    <div className="flex-1 font-sans flex" style={{ minHeight: "100vh" }}>
      {/* Product Grid */}
      <div className={`flex-1 transition-all duration-300 ${selected ? "pr-0 md:pr-[440px]" : ""}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Featured Projects</h2>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 text-xs">Showing {projects.length} of 2,540 projects</span>
            <select className="bg-white border border-gray-300 text-gray-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option>Most Recent</option>
              <option>Highest Rated</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
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
                  src={project.image}
                  alt={project.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-gray-900/90 text-white font-semibold px-2 py-0.5 text-[10px] rounded shadow">
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button size="icon" variant="ghost" className="w-7 h-7 p-0 bg-white/70 hover:bg-white/90 shadow">
                    <Heart className="w-4 h-4 text-pink-500" />
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
                    src={project.authorImage}
                    alt={project.author}
                    className="w-6 h-6 rounded-full border border-gray-200"
                  />
                  <span className="text-gray-700 text-xs">{project.author}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-500 text-xs">{project.rating}</span>
                    <span className="text-gray-400 text-[10px]">({project.reviews})</span>
                  </div>
                </div>


                <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
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
                  onClick={() => setSelected(project)}
                >
                  <ArrowRight className="mr-2 w-4 h-4" />
                  View Details
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                  style={{ width: "15%", minWidth: 0, padding: 0 }}
                  aria-label="Add to Cart"
                >
                  <ShoppingCart className="w-5 h-5 mx-auto" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold rounded-lg"
          >
            Load More Projects
          </Button>
        </div>
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
              src={selected.image}
              alt={selected.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />


            <div className="flex items-center mb-4">
              <img
                src={selected.authorImage}
                alt={selected.author}
                className="w-8 h-8 rounded-full border border-gray-200 mr-3"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">{selected.author}</div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-500">{selected.rating}</span>
                  <span>({selected.reviews} reviews)</span>
                </div>
              </div>
            </div>


            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Author Bio</div>
              <div className="text-gray-700 text-xs mb-2">{selected.authorBio}</div>
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
                <span>{selected.price}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{selected.duration}</span>
              </div>
              <div className="flex items-center space-x-1 text-pink-500">
                <Heart className="w-3 h-3" />
                <span>{selected.likes}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{selected.views}</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">{selected.description}</p>


            <div className="flex gap-2 mb-6">
              <Button size="sm" variant="outline" className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-100">
                <Share2 className="w-4 h-4" /> Share
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-100">
                <Download className="w-4 h-4" /> Download Brochure
              </Button>
            </div>


            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-300 mb-6"
            onClick={() => navigate(`/product/${selected.id}`)}
            >
              Let's Connect
            </Button>


            {/* Related Projects */}
            <div>
              <div className="text-xs text-gray-500 mb-2 font-semibold">Related Projects</div>
              <div className="flex flex-col gap-3">
                {getRelated(selected.id).map((rel) => (
                  <div key={rel.id} className="flex items-center gap-3 bg-gray-50 rounded p-2">
                    <img src={rel.image} alt={rel.title} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-gray-700">{rel.title}</div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <DollarSign className="w-3 h-3" />
                        {rel.price}
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
    </div>
  );
};


