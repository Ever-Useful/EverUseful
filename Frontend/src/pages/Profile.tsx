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

const Profile = () => {
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
      degree: studentData.degree || "Bachelor's Degree",
      institution: studentData.college || "University",
      year: studentData.year || "2020 - 2024",
      course: studentData.course || "Computer Science",
    }
  ];

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userProfile = await userService.getUserProfile();
      const { auth: authData, profile: userProfileData, stats: userStats, studentData: studentInfo } = userProfile;
      
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

      // Fetch skills
      try {
        const userSkills = await userService.getUserSkills();
        setSkills(userSkills || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]);
      }

      // Fetch projects
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated for fetching projects");
        const token = await user.getIdToken();

        const userProjectsResponse = await userService.getUserProjects();
        const projectIds = userProjectsResponse.created || [];

        if (projectIds.length > 0) {
          const projectPromises = projectIds.map(id =>
            fetch(`http://localhost:3000/api/marketplace/projects/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.ok ? res.json() : Promise.reject(`Failed to fetch project ${id}`))
          );
          
          const results = await Promise.all(projectPromises);
          const fullProjects = results.map(res => res.project).filter(Boolean);
          setProjects(fullProjects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${backgroundImage})`
      }}>
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
                  {profileData.title || 'Title'}
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">$50</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.projects}+</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Avg Response Time</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-600 to-orange-500 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.followers}</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Followers</div>
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
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection('Education')}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
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
                        {item.course && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Course:</span> {item.course}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </span>
                    Research Projects & Commercial Work
                  </h2>
                  <Button
                    onClick={handleAddProject}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Project
                  </Button>
                </div>
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <Card key={project.id || index} className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img
                              src={project.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=200&fit=crop"}
                              alt={project.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-5 md:w-2/3">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.title}</h3>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeleteProject(project.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-gray-600 mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(project.skills || project.tags || []).map((tech, techIndex) => (
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
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Click "Add Project" to showcase your work.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Research Interests */}
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
                    onClick={() => handleEditSection('Skills')}
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
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

            {/* Availability Card */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="bg-amber-100 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </span>
                  Research Availability
                </h3>
                <Badge className="mb-4 text-sm px-3 py-1 rounded-lg bg-green-100 text-green-800 border-green-200">
                  Currently Accepting Projects
                </Badge>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Average response time: <span className="font-medium">5 hours</span></span>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                    <span>Timezone: <span className="font-medium">GMT</span></span>
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
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Edit Profile Sidebar */}
      {showEditProfile && (
        <EditProfile onClose={handleEditProfileClose} initialSection={editSection} />
      )}

      {/* My Projects Sidebar */}
      {showMyProjects && (
        <MyProjects onClose={handleMyProjectsClose} onProjectCreated={fetchUserData} />
      )}
    </div>
  );
};

export default Profile;