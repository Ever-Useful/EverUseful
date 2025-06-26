import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Heart, ArrowLeft, Calendar, Award, Users, BookOpen, GraduationCap, Briefcase, Link, UserPlus, Edit } from "lucide-react";
import { ChatBox } from "@/components/ChatBox";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import NoUserProfile from "@/assets/images/no user profile.png";
import NoImageAvailable from "@/assets/images/no image available.png";

const VisitingProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const MAX_LENGTH = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);

  useEffect(() => {
    const fetchFreelancer = async () => {
      if (id) {
        try {
          console.log('Fetching freelancer with ID:', id);
          // Make direct fetch call to backend without authentication for public profile
          const response = await fetch(`http://localhost:3000/api/users/${id}`);
          console.log('Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Freelancer data received:', data);
            console.log('Freelancer full response data:', JSON.stringify(data, null, 2));
            if (data.success && data.data) {
              setFreelancer(data.data);
              setEducation(data.data.education || []);
              setWorkExperience(data.data.workExperience || []);
              console.log('Freelancer projects object:', data.data.projects);
              console.log('Freelancer projects.created:', data.data.projects?.created);
              console.log('Is projects.created an array?', Array.isArray(data.data.projects?.created));
              // Fetch full project details for each project ID
              const projectIds = Array.isArray(data.data.projects?.created) ? data.data.projects.created : [];
              console.log('Freelancer Project IDs found:', projectIds);
              console.log('Freelancer Project IDs type check:', projectIds.map(id => ({ id, type: typeof id })));
              if (projectIds.length > 0) {
                const projectPromises = projectIds.map((pid: string) => {
                  console.log(`Freelancer fetching project with ID: ${pid} (type: ${typeof pid})`);
                  return fetch(`http://localhost:3000/api/marketplace/projects/${pid}`)
                    .then(res => {
                      console.log(`Freelancer response for project ${pid}:`, res.status, res.ok);
                      return res.ok ? res.json() : null;
                    })
                    .then(res => {
                      console.log(`Freelancer project data for ${pid}:`, res);
                      return res && res.project ? res.project : null;
                    })
                    .catch(error => {
                      console.error(`Freelancer error fetching project ${pid}:`, error);
                      return null;
                    });
                });
                const fullProjects = (await Promise.all(projectPromises)).filter(Boolean);
                console.log('Freelancer full projects fetched:', fullProjects);
                setPortfolioProjects(fullProjects);
              } else {
                console.log('Freelancer no project IDs found');
                setPortfolioProjects([]);
              }
            } else {
              console.error('Invalid response format:', data);
              setFreelancer(null);
              setPortfolioProjects([]);
            }
          } else {
            console.error('Failed to fetch freelancer:', response.status);
            setFreelancer(null);
            setPortfolioProjects([]);
          }
        } catch (err) {
          console.error('Error fetching freelancer:', err);
          setFreelancer(null);
          setPortfolioProjects([]);
        }
      }
      setLoading(false);
    };
    fetchFreelancer();
  }, [id]);

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

  // Map data safely
  const profile = freelancer.profile || {};
  const auth = freelancer.auth || {};
  const fullName = `${auth.firstName || ''} ${auth.lastName || ''}`.trim() || 'Unnamed User';
  const about = profile.bio || 'No bio available';
  const avatar = profile.avatar || NoUserProfile;
  const title = profile.title || '';
  const location = profile.location || '';
  const userType = auth.userType || '';
  const skills = freelancer.skills || [];
  const educationData = freelancer.studentData || {};

  // Debug logging
  console.log('Freelancer data structure:', {
    profile,
    education: educationData,
    projects: portfolioProjects,
    skills
  });

  const shouldTruncate = about.length > MAX_LENGTH;
  const displayedText = shouldTruncate && !isExpanded ? about.slice(0, MAX_LENGTH) + "..." : about;

  // Map education data from backend
  const academicBackground = educationData ? [
    {
      degree: educationData.degree || '',
      institution: educationData.college || '',
      year: educationData.year || '',
      course: educationData.course || '',
    }
  ].filter(item => item.degree || item.institution || item.year || item.course) : [];

  // Always use a safe array for rendering
  const safePortfolioProjects = Array.isArray(portfolioProjects) ? portfolioProjects : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Header />
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${backgroundImage})`
      }}>
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
          <div className="w-full py-2 px-6 md:px-8 flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Left side with avatar */}
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <div className="relative">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = NoUserProfile;
                  }}
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${userType === "Available" ? "bg-green-500" : "bg-yellow-500"
                  }`}>
                  <span className="text-white text-xs font-bold">
                    {userType === "Available" ? "A" : "B"}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle section with profile info */}
            <div className="flex-1 text-white">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">{fullName}</h1>
                    <p className="text-xl md:text-2xl font-medium mb-4 text-grey-300 drop-shadow-md">{title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4 mr-1 text-white" />
                    <span className="text-sm text-white">{location}</span>
                  </div>
                  <div className="flex items-center bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400"/>
                    <span className="ml-1 font-semibold text-white">{freelancer.rating || 4.5}</span>
                    <span className="ml-1 text-gray-200 text-sm">({freelancer.reviews || 12} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-200">
                  <UserPlus className="w-5 h-5 text-white drop-shadow-md" />
                  <span className="text-white drop-shadow-md">{freelancer.connections || 150}+ Connections</span>
                </div>
              </div>
              
              <div className="-translate-x-[0px] mt-8 flex flex-col w-[200px] h-12 items-center justify-around gap-2 text-gray-200 bg-gray-100/20 rounded-2xl">
                <button className="flex items-center gap-2 text-white drop-shadow-md text-2xl">
                  <UserPlus className="w-6 h-6" />
                  Connect
                </button>
              </div>
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
                  <div className="text-2xl font-bold">{freelancer.hourlyRate || '$50'}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancer.completedProjects || 25}+</div>
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
                  <div className="text-2xl font-bold">{freelancer.reviews || 12}</div>
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
            {education && education.length > 0 && (
              <Card className="bg-white shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="bg-blue-100 p-2 rounded-lg mr-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </span>
                      Academic Background
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {education.map((edu, idx) => (
                      <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                        <div>
                          <div className="font-semibold text-gray-900">{edu.qualification} - {edu.course}</div>
                          <div className="text-gray-700 text-sm">{edu.college} | {edu.startYear} - {edu.endYear}</div>
                          {edu.specialization && <div className="text-gray-500 text-xs mt-1">{edu.specialization}</div>}
                          {edu.description && <div className="text-gray-500 text-xs mt-1">{edu.description}</div>}
                          {edu.skills && <div className="text-gray-500 text-xs mt-1">Skills: {edu.skills}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Experience Section */}
            {workExperience && workExperience.length > 0 && (
              <Card className="bg-white shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="bg-green-100 p-2 rounded-lg mr-3">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </span>
                      Work Experience
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {workExperience.map((work, idx) => (
                      <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                        <div>
                          <div className="font-semibold text-gray-900">{work.designation} - {work.organization}</div>
                          <div className="text-gray-700 text-sm">{work.startDate} - {work.currentlyWorking ? 'Present' : work.endDate}</div>
                          <div className="text-gray-500 text-xs mt-1">{work.employmentType}</div>
                          {work.description && <div className="text-gray-500 text-xs mt-1">{work.description}</div>}
                          {work.skills && <div className="text-gray-500 text-xs mt-1">Skills: {work.skills}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Research Projects & Commercial Work */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </span>
                  Research Projects & Commercial Work
                </h2>
                <div className="space-y-4">
                  {safePortfolioProjects.length > 0 ? (
                    safePortfolioProjects.map((project, index) => (
                      <Card
                        key={project.id || index}
                        className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch min-h-[140px]"
                      >
                        <div className="w-full md:w-48 flex-shrink-0 h-36 md:h-auto bg-gray-100 flex items-center justify-center">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="object-cover w-full h-full rounded-l-lg"
                            onError={e => { e.currentTarget.src = NoImageAvailable; }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{project.title}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {(project.technologies || []).map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="secondary" className="text-xs bg-gray-100">{tech}</Badge>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-500">
                                <div><span className="font-medium text-gray-700">Price:</span> {project.price ? `₹${project.price}` : 'N/A'}</div>
                                <div><span className="font-medium text-gray-700">Duration:</span> {project.duration || 'N/A'}</div>
                                <div><span className="font-medium text-gray-700">Status:</span> {project.status || 'N/A'}</div>
                                <div><span className="font-medium text-gray-700">Date Added:</span> {
                                  project.dateAdded ? new Date(project.dateAdded).toLocaleDateString() : 
                                  project.posted ? new Date(project.posted).toLocaleDateString() : 'N/A'
                                }</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-sm text-gray-500">This freelancer hasn't added any projects yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Award className="w-5 h-5 text-orange-600" />
                  </span>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability & Details */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </span>
                  Availability & Details
                </h3>
                <Badge
                  className={`mb-4 text-sm px-3 py-1 rounded-lg ${userType === "Available"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}
                >
                  {userType === "Available" ? "Currently Accepting Projects" : "Limited Availability"}
                </Badge>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Response Time: <span className="font-medium">{freelancer.responseTime || 5} hours</span></span>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Timezone: <span className="font-medium">{location.includes('CA') ? 'PST' : location.includes('NY') ? 'EST' : 'GMT'}</span></span>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Hourly Rate: <span className="font-medium">{freelancer.hourlyRate || '$50'}</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ChatBox */}
            <ChatBox
              freelancerName={fullName}
              freelancerImage={avatar}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VisitingProfile;

