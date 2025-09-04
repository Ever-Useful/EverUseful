import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Globe, Mail, Phone, GraduationCap, Briefcase, Award, Users, Eye, Heart, Download, Share2, MessageCircle, Send, Linkedin, Github, Twitter, Instagram, Facebook, Youtube, Globe as GlobeIcon, UserPlus, BookOpen, Star } from 'lucide-react';
import userService from '@/services/userService';
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatBox } from "@/components/ChatBox";
import NoUserProfile from "@/assets/images/no user profile.png";
import NoImageAvailable from "@/assets/images/no image available.png";
import { API_ENDPOINTS } from '../config/api';
import { getUserAvatarUrl, getBackgroundImageUrl } from '@/utils/s3ImageUtils';
import { useUserProfile } from "@/contexts/UserProfileContext";
import { socket } from "@/socket.ts";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [editSection, setEditSection] = useState('');
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const { profileData: currentUser } = useUserProfile(); 




  // Fetch user data by customUserId from userData.json
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USER_BY_ID(id));
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      console.log('StudentProfile - Raw API response:', data);
      
      if (data.success && data.data) {
        setUserData(data.data);
        setEducation(data.data.education || []);
        setWorkExperience(data.data.workExperience || []);
        
        // Set background image from user profile data
        const userBackgroundImage = data.data.profile?.backgroundImage;
        if (userBackgroundImage) {
          setBackgroundImage(userBackgroundImage);
        } else {
          // Fallback to default background
          setBackgroundImage("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80");
        }
        console.log('StudentProfile - User data set:', data.data);
        console.log('StudentProfile - Projects object:', data.data.projects);
        console.log('StudentProfile - Projects.created:', data.data.projects?.created);
        console.log('StudentProfile - Is projects.created an array?', Array.isArray(data.data.projects?.created));
        
        // Fetch full project details for each project ID
        const projectIds = Array.isArray(data.data.projects?.created) ? data.data.projects.created : [];
        console.log('StudentProfile - Project IDs found:', projectIds);
        console.log('StudentProfile - Project IDs type check:', projectIds.map(id => ({ id, type: typeof id })));
        
        if (projectIds.length > 0) {
          console.log('StudentProfile - Attempting to fetch projects:', projectIds);
          const projectPromises = projectIds.map((pid) =>
            fetchProjectData(pid)
          );
          const fullProjects = (await Promise.all(projectPromises)).filter(Boolean);
          console.log('StudentProfile - Full projects fetched:', fullProjects);
          console.log('StudentProfile - Project details:', fullProjects.map(p => ({
            id: p.id,
            title: p.title,
            image: p.image,
            hasImage: !!p.image
          })));
          setPortfolioProjects(fullProjects);
        } else {
          console.log('StudentProfile - No project IDs found');
          setPortfolioProjects([]);
        }
      } else {
        console.log('StudentProfile - No user data found or API error');
        setUserData({});
        setPortfolioProjects([]);
      }
    } catch (error) {
      console.error('StudentProfile - Error fetching user data:', error);
      setError('Failed to load user profile');
      setUserData({});
      setPortfolioProjects([]);
    } finally {
      setLoading(false);
    }
  };

// useEffect(() => {
//   const fetchConnectionStatus = async () => {
//     try {
//       const connections = await userService.getConnections();

//       if (connections.sent.includes(id)) {
//         setConnectionStatus("pending"); // request sent by me
//       } else if (connections.received.includes(id)) {
//         setConnectionStatus("pending"); // request received, still pending
//       } else if (connections.connected.includes(id)) {
//         setConnectionStatus("connected"); // already connected
//       } else {
//         setConnectionStatus("none"); // no relation
//       }
//     } catch (err) {
//       console.error("Failed to fetch connection status:", err);
//     }
//   };

//   if (currentUser?.customUserId && id) {
//     fetchConnectionStatus();
//   }
// }, [currentUser, id]);


// // Ye wala final hai
// useEffect(() => {
//   if (!currentUser?.customUserId || !id) return;

//   (async () => {
//     try {
//       const resp = await userService.getConnections();
//       const payload = resp?.data ?? resp; // support both shapes

//       const sent: string[] = payload?.sent ?? [];
//       const received: string[] = payload?.received ?? [];
//       const connected: string[] = payload?.connected ?? [];

//       if (connected.includes(id)) {
//         setConnectionStatus('connected');
//       } else if (sent.includes(id) || received.includes(id)) {
//         setConnectionStatus('pending');
//       } else {
//         setConnectionStatus('none');
//       }
//     } catch (err) {
//       console.error('Failed to fetch connection status:', err);
//     }
//   })();
// }, [currentUser?.customUserId, id]);

// 🔹 Fetch connection status on mount / refresh
useEffect(() => {
  const fetchConnectionStatus = async () => {
    try {
      const res = await userService.getConnections(); 
      // NOTE: res is { success: true, data: { sent, received, connected } }
      const connections = res.data;

      if (connections.sent.includes(id)) {
        setConnectionStatus("pending"); // request sent by me
      } else if (connections.received.includes(id)) {
        setConnectionStatus("pending"); // request received, still pending
      } else if (connections.connected.includes(id)) {
        setConnectionStatus("connected"); // already connected
      } else {
        setConnectionStatus("none");
      }
    } catch (err) {
      console.error("Failed to fetch connection status:", err);
    }
  };

  if (currentUser?.customUserId && id) {
    fetchConnectionStatus();
  }
}, [currentUser, id]);




  useEffect(() => {
    if (currentUser?.customUserId) {
      socket.emit("register", currentUser.customUserId);
      console.log("Registered socket for user:", currentUser.customUserId);
    }
  }, [currentUser?.customUserId]);

  useEffect(() => {
  socket.on("connection_request", (data) => {
    console.log("New connection request received:", data);

    if (data.from === id) {
      setConnectionStatus("pending"); // show immediately
    }
  });

  socket.on("connection_update", (data) => {
    console.log("Connection update:", data);

    if (data.connected?.includes(id)) {
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("none");
    }
  });

  return () => {
    socket.off("connection_request");
    socket.off("connection_update");
  };
}, [id]);

  




// const handleConnect = async () => {
//   if (!id) return;

//   // Optimistic UI
//   setConnectionStatus("pending");

//   try {
//     const response = await userService.sendConnectionRequest(id);

//     if (response?.success === false) {
//       setConnectionStatus("none"); // revert
//       alert(`Failed to send request: ${response.message || "Unknown error"}`);
//       return;
//     }

//     // Emit socket event (real-time notification)
//     socket.emit("connectionRequest", {
//       from: currentUser.customUserId,
//       to: id,
//       message: `${currentUser.firstName || "Someone"} sent you a connection request.`,
//     });

//     // Show notification/alert
//     if ("Notification" in window && Notification.permission === "granted") {
//       new Notification("Connection request sent!", {
//         body: "Your request is now pending.",
//         icon: "/favicon.ico",
//       });
//     } else {
//       alert("Connection request sent!");
//     }
//   } catch (err: any) {
//     setConnectionStatus("none"); // revert if error
//     console.error("Error sending connection request:", err);

//     const message =
//       err?.response?.data?.message ||
//       err?.message ||
//       "Failed to send connection request due to an unknown error.";

//     alert(`Connection request failed: ${message}`);
//   }
// };

   

// 🔹 Handle connect click
const handleConnect = async () => {
  try {
    const response = await userService.sendConnectionRequest(id);

    if (response?.success === false) {
      alert(`Failed to send request: ${response.message || "Unknown error"}`);
      return;
    }

    setConnectionStatus("pending"); // update UI immediately

    socket.emit("connectionRequest", {
      from: currentUser.customUserId,
      to: id,
      message: `${currentUser.firstName || "Someone"} sent you a connection request.`,
    });

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Connection request sent!", {
        body: "Your request is now pending.",
        icon: "/favicon.ico",
      });
    } else {
      alert("Connection request sent!");
    }
  } catch (err: any) {
    console.error("Error sending connection request:", err);
    alert(`Connection request failed: ${err.message || "Unknown error"}`);
  }
};



  const fetchProjectData = async (pid: string) => {
    try {
      console.log(`StudentProfile - Fetching project ${pid}...`);
      const response = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(pid));
      if (!response.ok) {
        console.log(`StudentProfile - Project ${pid} not found (${response.status})`);
        return null;
      }
      const data = await response.json();
      return data && data.project ? data.project : null;
    } catch (error) {
      console.error(`StudentProfile - Error fetching project ${pid}:`, error);
      return null;
    }
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
    title: userData?.profile?.title || "New Member",
    bio: userData?.profile?.bio || "This is a new profile. Update your bio!",
    avatar: userData?.profile?.avatar || NoUserProfile,
    stats: {
      followers: userData?.social?.followersCount || 0,
      following: userData?.social?.followingCount || 0,
      projects: userData?.stats?.projectsCount || 0,
      likes: userData?.stats?.totalLikes || 0,
      connections: userData?.social?.connections?.length || 0,
      skills: userData?.skills || [],  
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

  // 🔹 Button rendering
const isSelf = currentUser?.customUserId === id;
const disabled = isSelf || connectionStatus !== "none";
const label =
  connectionStatus === "none"
    ? "Connect"
    : connectionStatus === "pending"
    ? "Pending"
    : "Connected";


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Hero Section */}
      <div
        className="relative h-64 sm:h-80 md:h-96 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${getBackgroundImageUrl(backgroundImage)})`,
          backgroundColor: '#1e293b' // Fallback color if image fails to load
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 rounded-md bg-transparent my-6 sm:my-[99px] py-4 sm:py-[34px] px-3 sm:px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-3 md:gap-6 w-full">
              <div className="relative flex justify-start w-auto mt-0">
                <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-white shadow-lg mx-auto md:mx-0">
                  <AvatarImage
                    src={getUserAvatarUrl({ avatar: profile.avatar })}
                    alt={fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-2xl sm:text-3xl flex items-center justify-center">
                    {profile.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-white mt-1 md:mt-0 w-full">
                <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg mb-1 text-left">{profile.name}</h1>
                <p className="text-xs sm:text-sm text-slate-200 drop-shadow-md text-left">{(userData?.auth?.userType || '').charAt(0).toUpperCase() + (userData?.auth?.userType || '').slice(1) || profile.title}</p>
                {/* Connect Button */}
                <div className="flex flex-row items-center justify-start mt-2">
                  <button
  onClick={handleConnect}
  disabled={disabled}
  className={`flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 ${
    disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {label}
</button>
                  <button className="ml-2 p-2 rounded-full bg-gray-100/20 text-white">
                    <Send className="w-4 h-4" />
                  </button>
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
                                <div className="text-2xl font-bold">{profile.stats.projects}+</div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
            <CardContent className="p-3 sm:p-4 text-center">
              <UserPlus className="w-6 h-6 mx-auto mb-2" />
                                <div className="text-2xl font-bold">{profile.stats.connections}+</div>
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
            {/* Skills Section - Mobile Only - Moved to top for mobile */}
            <Card className="bg-white shadow-lg rounded-xl lg:hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">

                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-2 sm:mr-3">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </span>
                    Skills
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {profile.stats.skills && profile.stats.skills.length > 0 ? (
                    profile.stats.skills.map((skill: any, index: number) => (
                      <Badge key={index} className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg">
                        {typeof skill === 'string' ? skill : (skill as any)?.name || (skill as any)?.expertise || 'Unknown Skill'}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-sm">No skills added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 flex items-center">

                    <span className="bg-purple-100 p-2 rounded-lg mr-2 sm:mr-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </span>
                    About
                  </h3>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-base">{displayedText}</p>
                  {shouldTruncate && (
                    <button className="mt-2 text-blue-600 hover:underline text-xs sm:text-sm" onClick={() => setIsExpanded(!isExpanded)}>
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

                    <h3 className="text-base sm:text-xl font-bold text-gray-900 flex items-center">

                      <span className="bg-blue-100 p-2 rounded-lg mr-2 sm:mr-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </span>
                      Academic Background
                    </h3>
                  </div>
                  <div className="space-y-3 sm:space-y-6">
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

                    <h3 className="text-base sm:text-xl font-bold text-gray-900 flex items-center">

                      <span className="bg-green-100 p-2 rounded-lg mr-2 sm:mr-3">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </span>
                      Work Experience
                    </h3>
                  </div>
                  <div className="space-y-3 sm:space-y-6">
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
                    <h3 className="heading-card-2xl font-bold text-gray-900 flex items-center">
                      <span className="bg-green-100 p-2 rounded-lg mr-2 sm:mr-3">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </span>
                      Research Projects & Commercial Work
                    </h3>
                  </div>
                <div className="space-y-3 sm:space-y-4">
                  {safePortfolioProjects.length > 0 ? (
                    safePortfolioProjects.map((project, index) => (
                      <Card
                        key={project.id || index}
                        className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch min-h-[120px] sm:min-h-[140px] cursor-pointer"
                        onClick={() => navigate(`/product/${project.id}`)}
                      >
                        <div className="w-full md:w-40 lg:w-48 flex-shrink-0 h-28 md:h-auto bg-gray-100 flex items-center justify-center">
                          <img
                            src={project.image || NoImageAvailable}
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
                                  <Badge key={skillIndex} variant="secondary" className="text-xs bg-gray-100">
                                    {typeof skill === 'string' ? skill : (skill as any)?.name || (skill as any)?.expertise || 'Unknown Skill'}
                                  </Badge>
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
            <Card className="bg-white shadow-lg rounded-xl max-w-full hidden lg:block">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-2 sm:mr-3">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </span>
                    Skills
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {profile.stats.skills && profile.stats.skills.length > 0 ? (
                    profile.stats.skills.map((skill: any, index: number) => (
                      <Badge key={index} className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg">
                        {typeof skill === 'string' ? skill : (skill as any)?.name || (skill as any)?.expertise || 'Unknown Skill'}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-sm">No skills added yet. Click edit to add your skills.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="hidden md:block">
              <ChatBox
                freelancerName={profile.name}
                freelancerImage={getUserAvatarUrl({ avatar: profile.avatar })}
              />
            </div>
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
