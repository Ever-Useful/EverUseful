import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera, DollarSign, Award, Clock, GraduationCap, UserPlus, BookOpen, Edit, Link, Briefcase, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import RecentActivity from "@/components/RecentActivity";
import SkillsSection from "@/components/Skillssection";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatBox } from "@/components/ChatBox";
import { userService } from "@/services/userService";
import NoUserProfile from "@/assets/images/no user profile.png";
import NoImageAvailable from "@/assets/images/no image available.png";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );
  const [editSection, setEditSection] = useState('');
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);


  // Fetch user data by customUserId from userData.json
  const fetchUserData = async () => {
    if (id) {
      try {
        console.log('Fetching student with ID:', id);
        // Make direct fetch call to backend without authentication for public profile
        const response = await fetch(`http://localhost:3000/api/users/${id}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Student data received:', data);
          console.log('Full data structure:', JSON.stringify(data, null, 2));
          if (data.success && data.data) {
            setUserData(data.data);
            setEducation(data.data.education || []);
            setWorkExperience(data.data.workExperience || []);
            console.log('User data set:', data.data);
            console.log('Projects object:', data.data.projects);
            console.log('Projects.created:', data.data.projects?.created);
            console.log('Is projects.created an array?', Array.isArray(data.data.projects?.created));
            // Fetch full project details for each project ID
            const projectIds = Array.isArray(data.data.projects?.created) ? data.data.projects.created : [];
            console.log('Project IDs found:', projectIds);
            console.log('Project IDs type check:', projectIds.map(id => ({ id, type: typeof id })));
            if (projectIds.length > 0) {
              const projectPromises = projectIds.map((pid) =>
                fetch(`http://localhost:3000/api/marketplace/projects/${pid}`)
                  .then(res => res.ok ? res.json() : null)
                  .then(res => res && res.project ? res.project : null)
                  .catch(() => null)
              );
              const fullProjects = (await Promise.all(projectPromises)).filter(Boolean);
              console.log('Full projects fetched:', fullProjects);
              setPortfolioProjects(fullProjects);
            } else {
              console.log('No project IDs found');
              setPortfolioProjects([]);
            }
          } else {
            console.error('Invalid response format:', data);
            setUserData({});
            setPortfolioProjects([]);
          }
        } else {
          console.error('Failed to fetch student:', response.status);
          setUserData({});
          setPortfolioProjects([]);
        }
      } catch (err) {
        console.error('Error fetching student:', err);
        setUserData({});
        setPortfolioProjects([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-100">
  //       <div className="text-xl font-semibold text-slate-700 animate-pulse">
  //         Loading your profile...
  //       </div>
  //     </div>
  //   );
  // }

  const auth = userData?.auth || {};
  const fullName = `${auth.firstName || ''} ${auth.lastName || ''}`.trim() || 'Unnamed User';

  const profile = {
    name: fullName,
    title: userData.profile?.title || "New Member",
    bio: userData.profile?.bio || "This is a new profile. Update your bio!",
    avatar: userData.profile?.avatar || NoUserProfile,
    stats: {
      followers: userData.social?.followersCount || 0,
      following: userData.social?.followingCount || 0,
      projects: userData.stats?.projectsCount || 0,
      likes: userData.stats?.totalLikes || 0,
      connections: userData.social?.connections?.length || 0,
      skills: userData.skills || [],  
    },
  };

  const MAX_LENGTH = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = profile.bio && profile.bio.length > MAX_LENGTH;
  const displayedText = shouldTruncate && !isExpanded
    ? profile.bio.slice(0, MAX_LENGTH) + "..."
    : profile.bio;

  const handleEditSection = (section: string) => {
    setEditSection(section);
    setShowEditProfile(true);
  };
  
  const academicBackground = [
    {
      degree: userData.studentData?.degree || "",
      institution: userData.studentData?.college || "",
      year: userData.studentData?.year || "",
      course: userData.studentData?.course || "",
    }
  ];

  
  const handleAddProject = () => {
    setShowMyProjects(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

  //   try {
  //     const user = auth.currentUser;
  //     if (!user) {
  //       toast.error("You must be logged in to delete a project.");
  //       return;
  //     }
  //     const token = await user.getIdToken();

  //     const response = await fetch(`http://localhost:3000/api/marketplace/projects/${projectId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Failed to delete project.");
  //     }

  //     toast.success("Project deleted successfully!");
  //     fetchUserData(); // Refresh the project list
  //   } catch (error) {
  //     toast.error(error.message);
  //     console.error("Error deleting project:", error);
  //   }
  };

  // Always use a safe array for rendering
  const safePortfolioProjects = Array.isArray(portfolioProjects) ? portfolioProjects : [];
  
  // Debug logging
  console.log('StudentProfile render data:', {
    userData,
    portfolioProjects,
    safePortfolioProjects,
    safePortfolioProjectsLength: safePortfolioProjects.length
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Hero Section */}
      <div
        className="relative h-64 sm:h-80 md:h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 rounded-md bg-transparent my-12 sm:my-[99px] py-6 sm:py-[34px] px-3 sm:px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 w-full">
              <div className="relative flex justify-center w-full md:w-auto mt-12 md:mt-0">
                <Avatar className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-white shadow-lg mx-auto md:mx-0">
                  <AvatarImage
                    src={profile.avatar}
                    alt={profile.name}
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = NoUserProfile;
                    }}
                  />
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-2xl sm:text-3xl flex items-center justify-center">
                    {profile.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-white mt-4 md:mt-0 w-full">
                <h1 className="text-2xl sm:text-4xl font-bold drop-shadow-lg mb-1.5 text-center md:text-left">{profile.name}</h1>
                <p className="text-lg sm:text-xl text-slate-200 drop-shadow-md text-center md:text-left">{profile.title}</p>
                {/* Connect Button */}
                <div className="flex flex-row items-center justify-center md:justify-start mt-4">
                  <div className="flex flex-col w-full max-w-xs h-12 items-center justify-around gap-2 text-gray-200 bg-gray-100/20 rounded-2xl">
                    <button className="flex items-center gap-2 text-white drop-shadow-md text-base sm:text-lg">
                      <UserPlus className="w-6 h-6" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-2 sm:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
            <CardContent className="p-3 sm:p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{profile.stats.projects}+</div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
            <CardContent className="p-3 sm:p-4 text-center">
              <UserPlus className="w-6 h-6 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{profile.stats.connections}+</div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Connections</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-2 sm:mr-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </span>
                    About
                  </h2>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">{displayedText}</p>
                  {shouldTruncate && (
                    <button className="mt-2 text-blue-600 hover:underline text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Academic Background */}
            {education && education.length > 0 && (
              <Card className="bg-white shadow-lg rounded-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                      <span className="bg-blue-100 p-2 rounded-lg mr-2 sm:mr-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </span>
                      Academic Background
                    </h2>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    {education.map((edu, idx) => (
                      <div key={idx} className="border rounded-lg p-3 sm:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 bg-white">
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
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                      <span className="bg-green-100 p-2 rounded-lg mr-2 sm:mr-3">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </span>
                      Work Experience
                    </h2>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    {workExperience.map((work, idx) => (
                      <div key={idx} className="border rounded-lg p-3 sm:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 bg-white">
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
            {/* Portfolio Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-2 sm:mr-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </span>
                    Research Projects & Commercial Work
                  </h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {safePortfolioProjects.length > 0 ? (
                    safePortfolioProjects.map((project, index) => (
                      <Card
                        key={project.id || index}
                        className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch min-h-[120px] sm:min-h-[140px]"
                      >
                        <div className="w-full md:w-40 lg:w-48 flex-shrink-0 h-28 md:h-auto bg-gray-100 flex items-center justify-center">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="object-cover w-full h-full rounded-l-lg"
                            onError={e => { e.currentTarget.src = NoImageAvailable; }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between p-3 sm:p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">{project.title}</h3>
                              <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {(project.skills || []).map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="secondary" className="text-xs bg-gray-100">{skill}</Badge>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-500">
                                <div><span className="font-medium text-gray-700">Price:</span> {project.price ? `₹${project.price}` : 'N/A'}</div>
                                <div><span className="font-medium text-gray-700">Duration:</span> {project.duration || 'N/A'}</div>
                                <div><span className="font-medium text-gray-700">Status:</span> {project.status || 'N/A'}</div>
                                <div><span className="font-medium text-gray-700">Date Added:</span> {
                                  project.posted ? new Date(project.posted).toLocaleDateString() : 'N/A'
                                }</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 sm:py-20">
                      <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">This student hasn't added any projects yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Skills Section */}
            <Card className="bg-white shadow-lg rounded-xl max-w-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-2 sm:mr-3">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </span>
                    Research Skills & Technical Expertise
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {profile.stats.skills && profile.stats.skills.length > 0 ? (
                    profile.stats.skills.map((skill: string, index: number) => (
                      <Badge key={index} className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-sm">No skills added yet. Click edit to add your skills.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <ChatBox
              freelancerName={profile.name}
              freelancerImage={profile.avatar}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center group cursor-pointer">
    <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
      {value}
    </div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);

export default Profile;