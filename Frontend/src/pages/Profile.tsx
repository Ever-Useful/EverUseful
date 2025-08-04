import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Calendar, Award, Users, BookOpen, GraduationCap, Briefcase, Link, UserPlus, Edit, Plus, Trash2, Camera } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import userService from '@/services/userService';
import { EditProfile } from '@/components/EditProfile';
import InitialsAvatar from '@/components/InitialsAvatar';
import toast from "react-hot-toast";
import { MyProjects } from '@/components/MyProjects';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BackgroundUpload from '@/components/BackgroundUpload';
import { UnreadMessagesCard } from "@/components/chat/UnreadMessagesCard";
import NoImageAvailable from "@/assets/images/no image available.png";
import NoUserProfile from "@/assets/images/no user profile.png";
import { API_ENDPOINTS } from '../config/api';
// import GlobeLoader from '@/components/GlobeLoader';


// Add dummy state for conversations and selectedConversation
type Conversation = {
  id: string;
  title: string;
  // Add other properties as needed
};

const Profile = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
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
    username: '',
    mobile: '',
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
      console.log('Profile - Raw user profile data:', userProfile);
      
      // Extract data from the response structure - backend now returns reconstructed data directly
      const { auth: authData, profile: userProfileData, stats: userStats, studentData: studentInfo, education: educationArr, workExperience: workArr } = userProfile;
      
      console.log('Profile - Extracted auth data:', authData);
      console.log('Profile - Extracted profile data:', userProfileData);
      
      setProfileData({
        firstName: authData?.firstName || userProfileData?.firstName || '',
        lastName: authData?.lastName || userProfileData?.lastName || '',
        userType: (authData?.userType || userProfileData?.userType) ? 
          (authData.userType || userProfileData.userType).charAt(0).toUpperCase() + 
          (authData.userType || userProfileData.userType).slice(1) : '',
        bio: userProfileData?.bio || 'No bio available',
        avatar: userProfileData?.avatar || '',
        location: userProfileData?.location || '',
        title: userProfileData?.title || '',
        website: userProfileData?.website || '',
        mobile: authData?.mobile || authData?.phoneNumber || userProfileData?.mobile || userProfileData?.phoneNumber || '',
        username: authData?.email?.split('@')[0] || userProfileData?.username || '',
      });

      setStudentData({
        college: studentInfo?.college || '',
        degree: studentInfo?.degree || '',
        course: studentInfo?.course || '',
        year: studentInfo?.year || '',
      });

      // Get dashboard data to ensure consistent project count with Dashboard page
      let dashboardStats = null;
      try {
        const dashboardData = await userService.getDashboardData();
        dashboardStats = {
          projects: dashboardData.projectCount || 0,
          connections: dashboardData.connections || 0,
        };
      } catch (error) {
        console.log('Failed to fetch dashboard data, using profile stats:', error);
      }

      if (userStats) {
        setStats({
          followers: userStats.followersCount || 0,
          following: userStats.followingCount || 0,
          // Use dashboard project count if available, otherwise fall back to profile stats
          projects: (dashboardStats?.projects ?? userStats.projectsCount) || 0,
          likes: userStats.totalLikes || 0,
          // Use dashboard connections count if available, otherwise fall back to profile stats
          connections: (dashboardStats?.connections ?? userStats.connectionsCount) || 0,
        });
      }

      // Set skills - handle both string arrays and object arrays
      const skillsData = (userProfile as any).skills || userProfile.freelancerData?.skills || [];
      if (Array.isArray(skillsData)) {
        // Convert skill objects to strings if needed
        const skillStrings = skillsData.map(skill => {
          if (typeof skill === 'string') return skill;
          if (skill && typeof skill === 'object' && skill.name) return skill.name;
          return String(skill);
        }).filter(Boolean); // Remove any empty strings
        console.log('Profile - Processed skills:', skillStrings);
        setSkills(skillStrings);
      } else {
        console.log('Profile - No skills data found');
        setSkills([]);
      }

             // Fetch projects using the same method as Dashboard to ensure consistency
       try {
         const projectsData = await userService.getUserProjects();
         console.log('Profile - Projects data from getUserProjects:', projectsData);
         
         if (projectsData && projectsData.created && Array.isArray(projectsData.created)) {
           console.log('Profile - Projects found:', projectsData.created.length);
           setProjects(projectsData.created);
         } else {
           console.log('Profile - No projects found in getUserProjects');
           setProjects([]);
         }
       } catch (error) {
         console.error('Profile - Error fetching projects from getUserProjects:', error);
         setProjects([]);
       }

      setEducation(educationArr || []);
      setWorkExperience(workArr || []);

      // Fetch freelancerData
      const freelancerData = userProfile.freelancerData;
      console.log('Profile - Freelancer data from API:', freelancerData);
      setFreelancerData({
        hourlyRate: freelancerData?.hourlyRate || '',
        avgResponseTime: freelancerData?.avgResponseTime || '',
      });
      console.log('Profile - Set freelancer data:', {
        hourlyRate: freelancerData?.hourlyRate || '',
        avgResponseTime: freelancerData?.avgResponseTime || '',
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
      
      // Immediately update the UI by removing the project from state
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      
      // Also update the stats
      setStats(prevStats => ({
        ...prevStats,
        projects: Math.max(0, prevStats.projects - 1)
      }));
      
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

  // Get display name for profile
  const getDisplayName = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    } else if (profileData.firstName) {
      return profileData.firstName;
    } else if (profileData.username) {
      return profileData.username;
    }
    return 'User';
  };

  // Get avatar initials
  const getAvatarInitials = () => {
    const first = profileData.firstName?.charAt(0) || profileData.username?.charAt(0) || 'U';
    const last = profileData.lastName?.charAt(0) || '';
    return `${first}${last}`;
  };

  // Conditional rendering based on userType
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      {/* Hero Section */}
      <div
        className="relative h-64 md:h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Camera icon for background photo */}
        <button
          className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
          onClick={() => setShowEditProfile(true)}
          title="Change Background Photo"
        >
          <Camera className="text-slate-700 w-5 h-5" />
        </button>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 rounded-md bg-transparent my-12 sm:my-[99px] py-6 sm:py-[34px] px-3 sm:px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 w-full">
              {/* Profile Photo */}
              <div className="relative flex justify-center w-full md:w-auto mt-12 md:mt-0">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={getDisplayName()}
                    className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-white shadow-lg rounded-full object-cover mx-auto md:mx-0"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-white shadow-lg rounded-full bg-gray-300 flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-600 mx-auto md:mx-0">
                    {getAvatarInitials()}
                  </div>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-white mt-4 md:mt-0 w-full">
                <h1 className="text-4xl font-bold drop-shadow-lg mb-1.5 text-center md:text-left mobile-text-4xl">
                  {getDisplayName()}
                </h1>
                <p className="text-base text-slate-200 drop-shadow-md text-center md:text-left mobile-text-base">
                  {profileData.userType}
                </p>
                
                {/* Edit Profile Button */}
                <div className="flex flex-row items-center justify-center md:justify-start mt-4">
                  <button
                    onClick={() => { setEditSection('Basic Details'); setShowEditProfile(true); }}
                    className="flex items-center gap-2 text-white drop-shadow-md text-base sm:text-lg bg-transparent border-2 border-white hover:bg-white/10 px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Only show Hourly Rate and Avg Response Time for freelancers */}
          {(profileData.userType?.toLowerCase() === 'freelancer' || profileData.userType === 'Freelancers') && (
            <>
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancerData.hourlyRate ? `$${freelancerData.hourlyRate}` : '$0'}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{freelancerData.avgResponseTime ? freelancerData.avgResponseTime : '0'}</div>
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
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
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
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
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
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
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
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
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
                                   project.posted ? new Date(project.posted).toLocaleDateString() :
                                   project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'
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

export default Profile;