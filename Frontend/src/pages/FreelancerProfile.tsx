import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Heart, ArrowLeft, Calendar, Award, Users, BookOpen, GraduationCap, Briefcase, Link, UserPlus } from "lucide-react";
import { getFreelancerById } from "@/utils/freelancerData";
import { ChatBox } from "@/components/ChatBox";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";

const FreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const freelancer = getFreelancerById(Number(id));
  const [backgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );

  const MAX_LENGTH = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = freelancer && freelancer.about && freelancer.about.length > MAX_LENGTH;
  const displayedText =
    shouldTruncate && !isExpanded
      ? freelancer.about.slice(0, MAX_LENGTH) + "..."
      : freelancer.about;

  if (!freelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Freelancer not found</h1>
          <p className="text-gray-600 mb-6">The requested profile doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700 px-6 py-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const portfolioProjects = [
    {
      title: "AI-Powered Educational Platform",
      description: "Developed a machine learning system to personalize learning paths for students in STEM fields.",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=200&fit=crop",
      technologies: ["Python", "TensorFlow", "React"],
      university: "Stanford University",
      publication: "Published in Journal of Educational Technology"
    },
    {
      title: "Sustainable Energy Monitoring System",
      description: "Created IoT sensors and dashboard to track energy consumption in campus buildings.",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=300&h=200&fit=crop",
      technologies: ["IoT", "Node.js", "D3.js"],
      university: "MIT",
      award: "Winner of Green Tech Challenge 2023"
    },
    {
      title: "Biomedical Data Analysis Tool",
      description: "Statistical analysis platform for genomic research with visualization capabilities.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&h=200&fit=crop",
      technologies: ["R", "Shiny", "Bioinformatics"],
      university: "Johns Hopkins University",
      patent: "Patent pending"
    },
  ];

  const academicBackground = [
    {
      degree: "PhD in Computer Science",
      institution: "Stanford University",
      year: "2022 - Present",
      research: "Machine Learning in Education"
    },
    {
      degree: "MSc in Data Science",
      institution: "University of California, Berkeley",
      year: "2020 - 2022",
      thesis: "Predictive Models for Student Performance"
    },
    {
      degree: "BSc in Computer Engineering",
      institution: "MIT",
      year: "2016 - 2020",
      honors: "Summa Cum Laude"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Header />
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${backgroundImage})`
      }}>
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
          <div className="w-full py-8 px-6 md:px-8 flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Left side with avatar */}
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <div className="relative">
                <img
                  src={freelancer.image}
                  alt={freelancer.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${freelancer.availability === "Available" ? "bg-green-500" : "bg-yellow-500"
                  }`}>
                  <span className="text-white text-xs font-bold">
                    {freelancer.availability === "Available" ? "A" : "B"}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle section with profile info */}
            <div className="flex-1 text-white">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">{freelancer.name}</h1>
                    <p className="text-xl md:text-2xl font-medium mb-4 text-grey-300 drop-shadow-md">{freelancer.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 mr-1 text-white" />
                    <span className="text-sm text-white">{freelancer.location}</span>
                  </div>
                  <div className="flex items-center bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-white">{freelancer.rating}</span>
                    <span className="ml-1 text-gray-200 text-sm">({freelancer.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-200">
                  <UserPlus className="w-5 h-5 text-white drop-shadow-md" />
                  <span className="text-white drop-shadow-md">{freelancer.connections}+ Connections</span>
                </div>
              </div>
            </div>

            {/* Right side with connect button */}
            <div className="flex items-center md:items-end">
              <button className="mt-10 bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full font-semibold drop-shadow-md transition-all duration-200 flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.hourlyRate}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.completedProjects}+</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.responseTime || 5}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Avg Response Time</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-600 to-orange-500 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.reviews}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Reviews</div>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-purple-100 p-2 rounded-lg mr-3">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </span>
                  About
                </h2>
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
              </CardContent>
            </Card>

            {/* Academic Background */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </span>
                  Academic Background
                </h2>
                <div className="space-y-6">
                  {academicBackground.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-blue-500" />
                        </div>
                        {index < academicBackground.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.degree}</h3>
                        <p className="text-gray-600">{item.institution} • {item.year}</p>
                        {item.research && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Research:</span> {item.research}
                          </p>
                        )}
                        {item.thesis && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Thesis:</span> {item.thesis}
                          </p>
                        )}
                        {item.honors && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Honors:</span> {item.honors}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </span>
                  Research Projects & Commercial Work
                </h2>
                <div className="h-[500px] overflow-y-auto pr-2 space-y-6">
                  {portfolioProjects.map((project, index) => (
                    <Card key={index} className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-5 md:w-2/3">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.title}</h3>
                          <p className="text-gray-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs bg-gray-100">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {project.university && (
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Institution:</span> {project.university}
                              </p>
                            )}
                            {project.publication && (
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Publication:</span> {project.publication}
                              </p>
                            )}
                            {project.award && (
                              <p className="text-sm text-green-600 font-medium">
                                <Award className="w-4 h-4 inline mr-1" /> {project.award}
                              </p>
                            )}
                            {project.patent && (
                              <p className="text-sm text-blue-600 font-medium">
                                <Link className="w-4 h-4 inline mr-1" /> {project.patent}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Research Interests */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Star className="w-5 h-5 text-indigo-600" />
                  </span>
                  Research Skills & Technical Expertise
                </h3>
                <div className="flex flex-wrap gap-3">
                  {freelancer.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-amber-100 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </span>
                  Research Availability
                </h3>
                <Badge
                  className={`mb-4 text-sm px-3 py-1 rounded-lg ${freelancer.availability === "Available"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                >
                  {freelancer.availability === "Available" ? "Currently Accepting Projects" : "Limited Availability"}
                </Badge>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Average response time: <span className="font-medium">{freelancer.responseTime}</span></span>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Timezone: <span className="font-medium">{freelancer.location.includes('CA') ? 'PST' : freelancer.location.includes('NY') ? 'EST' : 'GMT'}</span></span>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Preferred project duration: <span className="font-medium">3-6 months</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collaboration Options */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-purple-800 mb-2">Consultation</h4>
                  <p className="text-sm text-gray-600 mb-3">Expert advice on your research project or technical challenge</p>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-100 rounded-lg">
                    Request Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ChatBox */}
            <ChatBox
              freelancerName={freelancer.name}
              freelancerImage={freelancer.image}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FreelancerProfile;

