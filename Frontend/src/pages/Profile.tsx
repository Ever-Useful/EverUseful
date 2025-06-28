import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Calendar, Award, Users, BookOpen, GraduationCap, Briefcase, Link, UserPlus, Edit, Plus, Trash2, Camera } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userService } from '@/services/userService';
import { EditProfile } from '@/components/EditProfile';
import InitialsAvatar from '@/components/InitialsAvatar';
import toast from "react-hot-toast";
import { MyProjects } from '@/components/MyProjects';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BackgroundUpload from '@/components/BackgroundUpload';
import { UnreadMessagesCard } from "@/components/chat/UnreadMessagesCard";
import NoImageAvailable from "@/assets/images/no image available.png";
import NoUserProfile from "@/assets/images/no user profile.png";
import GlobeLoader from '@/components/GlobeLoader';


// Add dummy state for conversations and selectedConversation
type Conversation = {
  id: string;
  title: string;
  // Add other properties as needed
};

const StudentProfessorProfileView = ({
  profileData,
  studentData,
  stats,
  skills,
  projects,
  loading,
  showEditProfile,
  showMyProjects,
  editSection,
  setShowEditProfile,
  setEditSection,
  setShowMyProjects,
  handleEditProfileClose,
  handleMyProjectsClose,
  handleEditSection,
  handleAddProject,
  handleDeleteProject,
  displayedText,
  shouldTruncate,
  isExpanded,
  setIsExpanded,
  academicBackground,
  educationList,
  workList,
  handleBackgroundChange,
  backgroundImage,
  showAddProjectSidebar,
  setShowAddProjectSidebar,
  showEditProjectSidebar,
  setShowEditProjectSidebar,
  editingProject,
  setEditingProject,
  fetchUserData,
  freelancerData
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        {/* Camera icon for background photo */}
        <button
          className="absolute top-6 right-6 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
          onClick={() => setShowEditProfile(true)}
          title="Change Background Photo"
        >
          <Camera className="text-slate-700 w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-8 rounded-md bg-transparent my-[99px] py-[34px] px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="relative">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt={`${profileData.firstName} ${profileData.lastName}`} className="w-36 h-36 border-4 border-white shadow-lg rounded-full object-cover" />
                ) : (
                  <div className="w-36 h-36 border-4 border-white shadow-lg rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-600">
                    {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold drop-shadow-lg mb-1.5">{`${profileData.firstName} ${profileData.lastName}`}</h1>
                <p className="text-xl text-slate-200 drop-shadow-md">{profileData.userType}</p>
                {/* Edit Profile Button */}
                <button
                  onClick={() => { setEditSection('Basic Details'); setShowEditProfile(true); }}
                  className="mt-4 bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-2 rounded-full font-semibold drop-shadow-md transition-all duration-200 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Only show Hourly Rate and Avg Response Time for freelancers */}
          {profileData.userType?.toLowerCase() === 'freelancer' && (
            <>
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancerData.hourlyRate ? `$${freelancerData.hourlyRate}` : 'N/A'}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancerData.avgResponseTime ? freelancerData.avgResponseTime : 'N/A'}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Avg Response Time (hrs)</div>
                </CardContent>
              </Card>
            </>
          )}
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.projects}+</div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
            <CardContent className="p-4 text-center">
              <UserPlus className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.connections}+</div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Connections</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </span>
                    About
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => { setEditSection('About'); setShowEditProfile(true); }} className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50">
                    <Edit className="w-2 h-2 mr-1" />Edit
                  </Button>
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
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-blue-100 p-2 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </span>
                    Academic Background
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => { setEditSection('Education'); setShowEditProfile(true); }} className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50">
                    <Edit className="w-2 h-2 mr-1" />Edit
                  </Button>
                </div>
                <div className="space-y-6">
                  {(educationList && educationList.length > 0) ? (
                    educationList.map((edu, idx) => (
                      <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                        <div>
                          <div className="font-semibold text-gray-900">{edu.qualification} - {edu.course}</div>
                          <div className="text-gray-700 text-sm">{edu.college} | {edu.startYear} - {edu.endYear}</div>
                          {edu.specialization && <div className="text-gray-500 text-xs mt-1">{edu.specialization}</div>}
                          {edu.description && <div className="text-gray-500 text-xs mt-1">{edu.description}</div>}
                          {edu.skills && <div className="text-gray-500 text-xs mt-1">Skills: {edu.skills}</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No education added yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Work Experience Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </span>
                    Work Experience
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => { setEditSection('Work Experience'); setShowEditProfile(true); }} className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50">
                    <Edit className="w-2 h-2 mr-1" />Edit
                  </Button>
                </div>
                <div className="space-y-6">
                  {(workList && workList.length > 0) ? (
                    workList.map((work, idx) => (
                      <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                        <div>
                          <div className="font-semibold text-gray-900">{work.designation} - {work.organization}</div>
                          <div className="text-gray-700 text-sm">{work.startDate} - {work.currentlyWorking ? 'Present' : work.endDate}</div>
                          <div className="text-gray-500 text-xs mt-1">{work.employmentType}</div>
                          {work.description && <div className="text-gray-500 text-xs mt-1">{work.description}</div>}
                          {work.skills && <div className="text-gray-500 text-xs mt-1">Skills: {work.skills}</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No work experience added yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Portfolio Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </span>
                    Research Projects & Commercial Work
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMyProjects(true)}
                    className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />Add Project
                  </Button>
                </div>
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <Card
                        key={project.id || index}
                        className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch min-h-[140px]"
                      >
                        <div className="w-full md:w-48 flex-shrink-0 h-36 md:h-auto bg-gray-100 flex items-center justify-center">
                          <img
                            src={project.image || NoImageAvailable}
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
                                {(project.skills || project.tags || []).map((tech, techIndex) => (
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
                            <div className="flex flex-col gap-2 items-end ml-2">
                              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700" onClick={() => { setEditingProject(project); setShowEditProjectSidebar(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 bg-white hover:bg-red-500 hover:bg-opacity-80 hover:text-white transition-colors shadow-sm"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Click "Add Project" to showcase your work.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Section */}
            <Card className="bg-white shadow-lg rounded-xl max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </span>
                    Research Skills & Technical Expertise
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => { setEditSection('Skills'); setShowEditProfile(true); }} className="-translate-y-[20px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50">
                    <Edit className="w-2 h-2 mr-1" />Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <Badge key={index} className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet. Click edit to add your skills.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <UnreadMessagesCard />
          </div>
        </div>
      </div>
      {/* EditProfile Sidebar */}
      {showEditProfile && (
        <EditProfile onClose={handleEditProfileClose} initialSection={editSection} onProfileUpdated={fetchUserData} />
      )}
      <Footer />
      {showMyProjects && (
        <MyProjects onClose={handleMyProjectsClose} onProjectCreated={fetchUserData} />
      )}
      {showEditProjectSidebar && editingProject && (
        <MyProjects onClose={() => { setShowEditProjectSidebar(false); setEditingProject(null); }} editMode={true} projectToEdit={editingProject} onProjectCreated={fetchUserData} />
      )}
    </div>
  );
};

const Profile = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Dummy handler for selecting a conversation
  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
  };
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    userType: '',
    bio: '',
    avatar: '',
    location: '',
    title: '',
    website: '',
  });
  const [studentData, setStudentData] = useState({
    college: '',
    degree: '',
    course: '',
    year: '',
  });
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    projects: 0,
    likes: 0,
    connections: 0,
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [editSection, setEditSection] = useState('');

  // Camera functionality state
  const [showCamera, setShowCamera] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const MAX_LENGTH = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = profileData.bio && profileData.bio.length > MAX_LENGTH;
  const displayedText = shouldTruncate && !isExpanded
    ? profileData.bio.slice(0, MAX_LENGTH) + "..."
    : profileData.bio;

  // Mock academic background - in real app, this would come from database
  const academicBackground = [
    {
      degree: studentData.degree || '',
      institution: studentData.college || '',
      year: studentData.year || '',
      course: studentData.course || '',
    }
  ];
  const hasAcademicBackground = academicBackground.some(
    (item) => item.degree || item.institution || item.year || item.course
  );

  const [showAddProjectSidebar, setShowAddProjectSidebar] = useState(false);
  const [showEditProjectSidebar, setShowEditProjectSidebar] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [freelancerData, setFreelancerData] = useState({ hourlyRate: '', avgResponseTime: '' });

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userProfile = await userService.getUserProfile();
      const { auth: authData, profile: userProfileData, stats: userStats, studentData: studentInfo, education: educationArr, workExperience: workArr } = userProfile;
      
      setProfileData({
        firstName: authData.firstName || '',
        lastName: authData.lastName || '',
        userType: authData.userType ? authData.userType.charAt(0).toUpperCase() + authData.userType.slice(1) : '',
        bio: userProfileData.bio || 'No bio available',
        avatar: userProfileData.avatar || '',
        location: userProfileData.location || '',
        title: userProfileData.title || '',
        website: userProfileData.website || '',
      });

      setStudentData({
        college: studentInfo?.college || '',
        degree: studentInfo?.degree || '',
        course: studentInfo?.course || '',
        year: studentInfo?.year || '',
      });

      if (userStats) {
        setStats({
          followers: userStats.followersCount || 0,
          following: userStats.followingCount || 0,
          projects: userStats.projectsCount || 0,
          likes: userStats.totalLikes || 0,
          connections: userStats.connectionsCount || 0,
        });
      }

      // Set skills directly from userProfile
      setSkills(
        ((userProfile as any).skills && Array.isArray((userProfile as any).skills)) ? (userProfile as any).skills :
        ((userProfile as any).freelancerData && Array.isArray((userProfile as any).freelancerData.skills)) ? (userProfile as any).freelancerData.skills :
        []
      );

      // Fetch projects robustly
      if ((userProfile as any).projects && Array.isArray((userProfile as any).projects.created)) {
        const projectIds = (userProfile as any).projects.created;
        console.log('Profile - Project IDs found:', projectIds);
        console.log('Profile - Project IDs type check:', projectIds.map(id => ({ id, type: typeof id })));
        if (projectIds.length > 0) {
          const projectPromises = projectIds.map((pid: string | number) => {
            console.log(`Profile - Fetching project with ID: ${pid} (type: ${typeof pid})`);
            return fetch(`http://localhost:3000/api/marketplace/projects/${pid}`)
              .then(res => {
                console.log(`Profile - Response for project ${pid}:`, res.status, res.ok);
                return res.ok ? res.json() : null;
              })
              .then(res => {
                console.log(`Profile - Project data for ${pid}:`, res);
                return res && res.project ? res.project : null;
              })
              .catch(error => {
                console.error(`Profile - Error fetching project ${pid}:`, error);
                return null;
              });
          });
          const fullProjects = (await Promise.all(projectPromises)).filter(Boolean);
          console.log('Profile - Full projects fetched:', fullProjects);
          setProjects(fullProjects);
        } else {
          console.log('Profile - No project IDs found');
          setProjects([]);
        }
      } else {
        console.log('Profile - No projects object or created array');
        setProjects([]);
      }

      setEducation(educationArr || []);
      setWorkExperience(workArr || []);

      // Fetch freelancerData
      setFreelancerData({
        hourlyRate: userProfile.freelancerData?.hourlyRate || '',
        avgResponseTime: userProfile.freelancerData?.avgResponseTime || '',
      });

    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
      } else {
        setLoading(false);
        navigate('/signin');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEditSection = (section: string) => {
    setEditSection(section);
    setShowEditProfile(true);
  };

  const handleAddProject = () => {
    setShowMyProjects(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to delete a project.");
        return;
      }
      const token = await user.getIdToken();

      const response = await fetch(`http://localhost:3000/api/marketplace/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project.");
      }

      toast.success("Project deleted successfully!");
      fetchUserData(); // Refresh the project list
    } catch (error) {
      toast.error(error.message);
      console.error("Error deleting project:", error);
    }
  };

  const handleEditProfileClose = () => {
    setShowEditProfile(false);
    setEditSection('');
    // Refresh data after edit
    fetchUserData();
  };

  const handleMyProjectsClose = () => {
    setShowMyProjects(false);
    fetchUserData(); // Refresh data after adding a project
  };

  // Camera functionality handlers
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setImageSrc(imageData);
        setShowCamera(false);
        setShowCropper(true);
      }
    }
  };

  const handleCropComplete = (cropArea: any) => {
    // Handle crop completion
  };

  const handleCropDone = () => {
    setShowCropper(false);
    // Handle the cropped image
  };

  const handleBackgroundChange = (newBackground: string) => {
    setBackgroundImage(newBackground);
  };

  const handleRemoveAvatar = () => {
    setProfileData(prev => ({ ...prev, avatar: '' }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Conditional rendering based on userType
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <GlobeLoader />
      </div>
    );
  }

  if (profileData.userType?.toLowerCase() === 'student' || profileData.userType?.toLowerCase() === 'professor') {
    return (
      <StudentProfessorProfileView
        profileData={profileData}
        studentData={studentData}
        stats={stats}
        skills={skills}
        projects={projects}
        loading={loading}
        showEditProfile={showEditProfile}
        showMyProjects={showMyProjects}
        editSection={editSection}
        setShowEditProfile={setShowEditProfile}
        setEditSection={setEditSection}
        setShowMyProjects={setShowMyProjects}
        handleEditProfileClose={handleEditProfileClose}
        handleMyProjectsClose={handleMyProjectsClose}
        handleEditSection={handleEditSection}
        handleAddProject={handleAddProject}
        handleDeleteProject={handleDeleteProject}
        displayedText={displayedText}
        shouldTruncate={shouldTruncate}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        academicBackground={academicBackground}
        educationList={education}
        workList={workExperience}
        handleBackgroundChange={handleBackgroundChange}
        backgroundImage={backgroundImage}
        showAddProjectSidebar={showAddProjectSidebar}
        setShowAddProjectSidebar={setShowAddProjectSidebar}
        showEditProjectSidebar={showEditProjectSidebar}
        setShowEditProjectSidebar={setShowEditProjectSidebar}
        editingProject={editingProject}
        setEditingProject={setEditingProject}
        fetchUserData={fetchUserData}
        freelancerData={freelancerData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${backgroundImage})`
      }}>
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center space-y-4 p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-64 h-64 rounded-lg border-4 border-white object-cover"
            />
            <canvas ref={canvasRef} width={200} height={200} style={{ display: "none" }} />

            <div className="flex space-x-4">
              <button onClick={handleCapture} className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md">
                Capture Photo
              </button>
              <button onClick={() => setShowCamera(false)} className="text-white border border-white hover:bg-white/10 px-4 py-2 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cropper Modal */}
        {showCropper && (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center space-y-6 p-4">
            <div className="relative w-80 h-80 bg-black">
              <img src={imageSrc} alt="Crop preview" className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-4">
              <button onClick={handleCropDone} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">
                Set Photo
              </button>
              <button onClick={() => setShowCropper(false)} className="text-white border border-white hover:bg-white/10 px-4 py-2 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Background Upload Button */}
        <div className="absolute top-4 right-4 group z-10">
          <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors">
            <Camera className="text-slate-700 w-5 h-5" />
          </button>
          <div className="absolute right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <BackgroundUpload onBackgroundChange={handleBackgroundChange} />
          </div>
        </div>

        {/* Profile Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
          <div className="w-full py-8 px-6 md:px-8 flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <div className="relative">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                    className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-600">
                    {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                  </div>
                )}
                <button
                  onClick={() => document.getElementById('upload-avatar')?.click()}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
                >
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
                <input
                  id="upload-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 text-white">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">
                  {`${profileData.firstName} ${profileData.lastName}`}
                </h1>
                <p className="text-xl md:text-2xl font-medium mb-4 text-gray-200 drop-shadow-md">
                  {profileData.userType ? profileData.userType.charAt(0).toUpperCase() + profileData.userType.slice(1) : ''}
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {profileData.location && (
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4 mr-1 text-white" />
                      <span className="text-sm text-white">{profileData.location || 'Location'}</span>
                    </div>
                  )}
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => handleEditSection('Basic Details')}
                  className="mt-4 bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-2 rounded-full font-semibold drop-shadow-md transition-all duration-200 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>

              <div className="flex flex-row items-center justify-between">
                <div className="-translate-x-[0px] mt-8 flex flex-col px-6 py-2 items-center justify-around gap-2 text-gray-200 bg-gray-100/20 rounded-2xl">
                  <a href="/connection">
                    <button className="flex items-center gap-2 text-white drop-shadow-md text-lg">
                      <UserPlus className="w-6 h-6" />
                      Add Connections
                    </button>
                  </a>
                </div>
                <div className="-translate-x-[200px] mt-8 flex flex-col px-6 py-2 items-center justify-around gap-2 text-gray-200 bg-gray-100/20 rounded-2xl">
                  <a href="/connection">
                    <button className="flex items-center gap-2 text-white drop-shadow-md text-lg">
                      <UserPlus className="w-6 h-6" />
                      See Your Connections
                    </button>
                  </a>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Only show Hourly Rate and Avg Response Time for freelancers */}
              {profileData.userType?.toLowerCase() === 'freelancer' && (
                <>
                  <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{freelancerData.hourlyRate ? `$${freelancerData.hourlyRate}` : 'N/A'}</div>
                      <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-xl">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{freelancerData.avgResponseTime ? freelancerData.avgResponseTime : 'N/A'}</div>
                      <div className="text-xs opacity-90 uppercase tracking-wider">Avg Response Time (hrs)</div>
                    </CardContent>
                  </Card>
                </>
              )}
              <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.projects}+</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <UserPlus className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.connections}+</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Connections</div>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </span>
                    About
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection('About')}
                    className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />
                    Edit
                  </Button>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {displayedText}
                  </p>
                  {shouldTruncate && (
                    <button 
                      className="mt-2 text-blue-600 hover:underline text-sm" 
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Background */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-blue-100 p-2 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </span>
                    Academic Background
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => { setEditSection('Education'); setShowEditProfile(true); }} className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50">
                    <Edit className="w-2 h-2 mr-1" />Edit
                  </Button>
                </div>
                <div className="space-y-6">
                  {(education && education.length > 0) ? (
                    education.map((edu, idx) => (
                      <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                        <div>
                          <div className="font-semibold text-gray-900">{edu.degree} - {edu.course}</div>
                          <div className="text-gray-700 text-sm">{edu.institution} | {edu.year}</div>
                          <div className="text-gray-500 text-xs mt-1">{edu.specialization}</div>
                          {edu.description && <div className="text-gray-500 text-xs mt-1">{edu.description}</div>}
                          {edu.skills && <div className="text-gray-500 text-xs mt-1">Skills: {edu.skills}</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No education added yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </span>
                    Work Experience
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => { setEditSection('Work Experience'); setShowEditProfile(true); }} className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50">
                    <Edit className="w-2 h-2 mr-1" />Edit
                  </Button>
                </div>
                <div className="space-y-6">
                  {(workExperience && workExperience.length > 0) ? (
                    workExperience.map((work, idx) => (
                      <div key={idx} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
                        <div>
                          <div className="font-semibold text-gray-900">{work.designation} - {work.organization}</div>
                          <div className="text-gray-700 text-sm">{work.startDate} - {work.currentlyWorking ? 'Present' : work.endDate}</div>
                          <div className="text-gray-500 text-xs mt-1">{work.employmentType}</div>
                          {work.description && <div className="text-gray-500 text-xs mt-1">{work.description}</div>}
                          {work.skills && <div className="text-gray-500 text-xs mt-1">Skills: {work.skills}</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No work experience added yet.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </span>
                    Research Projects & Commercial Work
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddProjectSidebar(true)}
                    className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />Add Project
                  </Button>
                </div>
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <Card
                        key={project.id || index}
                        className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch min-h-[140px]"
                      >
                        <div className="w-full md:w-48 flex-shrink-0 h-36 md:h-auto bg-gray-100 flex items-center justify-center">
                          <img
                            src={project.image || NoImageAvailable}
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
                                {(project.skills || project.tags || []).map((tech, techIndex) => (
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
                            <div className="flex flex-col gap-2 items-end ml-2">
                              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700" onClick={() => { setEditingProject(project); setShowEditProjectSidebar(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 bg-white hover:bg-red-500 hover:bg-opacity-80 hover:text-white transition-colors shadow-sm"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-sm text-gray-500">No research or commercial projects found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Photo Section */}
            {/* Skills Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </span>
                    Research Skills & Technical Expertise
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setEditSection('Skills'); setShowEditProfile(true); }}
                    className="-translate-y-[20px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet. Click edit to add your skills.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <UnreadMessagesCard/>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Edit Profile Sidebar */}
      {showEditProfile && (
        <EditProfile onClose={handleEditProfileClose} initialSection={editSection} onProfileUpdated={fetchUserData} />
      )}

      {/* My Projects Sidebar */}
      {showAddProjectSidebar && (
        <MyProjects onClose={() => setShowAddProjectSidebar(false)} onProjectCreated={fetchUserData} />
      )}
      {showEditProjectSidebar && editingProject && (
        <MyProjects onClose={() => { setShowEditProjectSidebar(false); setEditingProject(null); }} editMode={true} projectToEdit={editingProject} onProjectCreated={fetchUserData} />
      )}
    </div>
  );
};

export default Profile;