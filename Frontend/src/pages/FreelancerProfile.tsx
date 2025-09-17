import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, DollarSign, Heart, ArrowLeft, Calendar, Award, Users, BookOpen, GraduationCap, Briefcase, Link, UserPlus, Edit, Send } from "lucide-react";
import { ChatBox } from "@/components/ChatBox";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import userService from "@/services/userService";
import relationService from "@/services/relationService";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { socket } from "@/socket.ts";
import NoUserProfile from "@/assets/images/no user profile.png";
import { getUserAvatarUrl, getBackgroundImageUrl } from "@/utils/s3ImageUtils";
import NoImageAvailable from "@/assets/images/no image available.png";
import { API_ENDPOINTS } from '../config/api';
import LoadingAnimation from '@/components/LoadingAnimation';

const VisitingProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const MAX_LENGTH = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [relationStatus, setRelationStatus] = useState<'NONE' | 'PENDING_OUT' | 'PENDING_IN' | 'CONNECTED' | 'BLOCKED'>('NONE');
  const { profileData: currentUser } = useUserProfile();

  const fetchProjectData = async (pid: string) => {
    try {
      console.log(`FreelancerProfile - Fetching ${itemType} ${itemId}...`);
      
      let response;
      if (itemType === 'agent') {
        response = await fetch(API_ENDPOINTS.AGENT(itemId));
      } else {
        response = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(itemId));
      }
      
      if (!response.ok) {
        // Silently handle 404s - project/agent may have been deleted
        if (response.status === 404) {
          console.log(`FreelancerProfile - ${itemType} ${itemId} not found (deleted or unpublished)`);
        } else {
          console.log(`FreelancerProfile - ${itemType} ${itemId} error (${response.status})`);
        }
        return null;
      }
      
      const data = await response.json();
      const item = itemType === 'agent' ? data.agent : data.project;
      
      if (item) {
        // Normalize the item data to match the expected format
        return {
          ...item,
          title: item.title || item.name,
          type: itemType
        };
      }
      
      return null;
    } catch (error) {
      console.error(`FreelancerProfile - Error fetching ${itemType} ${itemId}:`, error);
      return null;
    }
  };

  // Fetch relation status
  useEffect(() => {
    const fetchRelationStatus = async () => {
      try {
        if (!id) return;
        const res = await relationService.getStatus(id);
        const status = (res?.data?.relation || res?.relation || 'NONE') as any;
        setRelationStatus(status);
      } catch (err) {
        console.error('Failed to fetch relation status:', err);
        setRelationStatus('NONE');
      }
    };

    if (currentUser?.customUserId && id) {
      fetchRelationStatus();
    }
  }, [currentUser, id]);

  // Socket registration
useEffect(() => {
  if (currentUser?.customUserId) {
    socket.emit("register", currentUser.customUserId);
    console.log("Registered socket for user:", currentUser.customUserId);
  }
}, [currentUser?.customUserId]);

useEffect(() => {
  // --- relation_request_received ---
  const onRelationRequestReceived = (data: any) => {
    console.log('Relation request received:', data);
    if (data?.from === id) {
      setRelationStatus('PENDING_IN');
    }
  };

  // --- relation_update ---
  const onRelationUpdate = (data: any) => {
    console.log('Relation update:', data);

    // Accept logic (if you want to keep it)
    if (data?.type === 'ACCEPTED' && data?.between?.includes(id)) {
      setRelationStatus('CONNECTED');
    }

    // Block notification
    if (data?.type === 'BLOCKED') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          try { Notification.requestPermission(); } catch {}
        }
        if (Notification.permission === 'granted') {
          try {
            // Blocked user's name
            const blockedName = `${data.blockedFirstName || ""} ${data.blockedLastName || ""}`.trim() || "this user";
            new Notification("User Blocked", {
              body: `You have blocked ${blockedName}`,
              icon: "/favicon.ico",
            });
          } catch {}
        }
      }
      setRelationStatus('BLOCKED');
    }

    // Unblock notification
    if (data?.type === 'UNBLOCKED') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          try { Notification.requestPermission(); } catch {}
        }
        if (Notification.permission === 'granted') {
          try {
            // Unblocked user's name
            const unblockedName = `${data.blockedFirstName || ""} ${data.blockedLastName || ""}`.trim() || "this user";
            new Notification("User Unblocked", {
              body: `You have unblocked ${unblockedName}`,
              icon: "/favicon.ico",
            });
          } catch {}
        }
      }
      setRelationStatus('NONE');
    }
  };

  // Register listeners
  socket.on('relation_request_received', onRelationRequestReceived);
  socket.on('relation_update', onRelationUpdate);

  // Cleanup on unmount
  return () => {
    socket.off('relation_request_received', onRelationRequestReceived);
    socket.off('relation_update', onRelationUpdate);
  };
}, [id, socket]);

  // Relation actions
  const handleConnect = async () => {
    try {
      if (!id) return;
      // Prevent duplicate sends if any relation already exists
      if (relationStatus && relationStatus !== 'NONE') return;

      await relationService.send(id);
      setRelationStatus('PENDING_OUT');

      // Notify other parts of the app (Connections page) to update Sent list
      try {
        window.dispatchEvent(new CustomEvent('relations:sent', { detail: { toUserId: id } }));
      } catch {}

      // Console log for debugging
      console.log('Connection request sent:', {
        from: currentUser?.customUserId,
        to: id,
        timestamp: Date.now(),
      });

      // Browser notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          try { await Notification.requestPermission(); } catch {}
        }
        if (Notification.permission === 'granted') {
          try {
            new Notification('Connection request sent', {
              body: 'Your request is now pending.',
              icon: '/favicon.ico',
            });
          } catch {}
        }
      }
    } catch (err: any) {
      console.error('Error sending relation request:', err);
      alert(err?.message || 'Failed to send request');
    }
  };

  const handleAccept = async () => {
    try {
      if (!id) return;
      await relationService.accept(id);
      setRelationStatus('CONNECTED');
    } catch (err: any) {
      console.error('Error accepting request:', err);
      alert(err?.message || 'Failed to accept request');
    }
  };

  const handleDecline = async () => {
    try {
      if (!id) return;
      await relationService.decline(id);
      setRelationStatus('NONE');
    } catch (err: any) {
      console.error('Error declining request:', err);
      alert(err?.message || 'Failed to decline request');
    }
  };

  const handleCancel = async () => {
    try {
      if (!id) return;
      await relationService.cancel(id);
      setRelationStatus('NONE');
    } catch (err: any) {
      console.error('Error cancelling request:', err);
      alert(err?.message || 'Failed to cancel request');
    }
  };

  const handleRemoveConnection = async () => {
    try {
      if (!id) return;
      await relationService.removeConnection(id);
      setRelationStatus('NONE');
    } catch (err: any) {
      console.error('Error removing connection:', err);
      alert(err?.message || 'Failed to remove connection');
    }
  };

  const handleBlock = async () => {
    try {
      if (!id) return;
      await relationService.block(id);
      setRelationStatus('BLOCKED');
    } catch (err: any) {
      console.error('Error blocking user:', err);
      alert(err?.message || 'Failed to block user');
    }
  };

  const handleUnblock = async () => {
    try {
      if (!id) return;
      await relationService.unblock(id);
      setRelationStatus('NONE');
    } catch (err: any) {
      console.error('Error unblocking user:', err);
      alert(err?.message || 'Failed to unblock user');
    }
  };

  useEffect(() => {
    const fetchFreelancer = async () => {
      if (id) {
        try {
          const response = await fetch(API_ENDPOINTS.USER_BY_ID(id));
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setFreelancer(data.data);
              setEducation(data.data.education || []);
              setWorkExperience(data.data.workExperience || []);
              
              // Set background image from user profile data
              const userBackgroundImage = data.data.profile?.backgroundImage;
              if (userBackgroundImage) {
                setBackgroundImage(userBackgroundImage);
              } else {
                // Fallback to default background
                setBackgroundImage("https://amogh-assets.s3.ap-south-1.amazonaws.com/content/photo-1470071459604-3b5ec3a7fe05_11zon.jpg");
              }
              // Use projects data from the user response (no authentication required)
              try {
                const projects = data.data.projects?.created || [];
                console.log('FreelancerProfile - Projects found:', projects.length);
                
                // Fetch both projects and agents
                const allItems = [];
                
                // Fetch projects from the user's projects array
                if (projects.length > 0) {
                  console.log('FreelancerProfile - Attempting to fetch projects:', projects);
                  const projectPromises = projects.map((item) => {
                    // Handle both old format (string IDs) and new format (objects with id and type)
                    const itemId = typeof item === 'string' ? item : item.id;
                    const itemType = typeof item === 'object' ? item.type : 'project';
                    return fetchItemData(itemId, itemType);
                  });
                  const fetchedProjects = (await Promise.all(projectPromises)).filter(Boolean);
                  allItems.push(...fetchedProjects);
                  console.log(`FreelancerProfile - Successfully loaded ${fetchedProjects.length} projects`);
                }
                
                // Fetch user agents directly
                const userAgents = await fetchUserAgents(id);
                allItems.push(...userAgents);
                console.log(`FreelancerProfile - Successfully loaded ${userAgents.length} agents`);
                
                console.log(`FreelancerProfile - Total items loaded: ${allItems.length}`);
                setPortfolioProjects(allItems);
                setProjectsCount(allItems.length);
                
              } catch (error) {
                console.error('FreelancerProfile - Error processing projects and agents:', error);
                setPortfolioProjects([]);
                setProjectsCount(0);
              }
            } else {
              setFreelancer(null);
              setPortfolioProjects([]);
            }
          } else {
            setFreelancer(null);
            setPortfolioProjects([]);
          }
        } catch (err) {
          setFreelancer(null);
          setPortfolioProjects([]);
        }
      }
      setLoading(false);
    };
    fetchFreelancer();
  }, [id]);

  // Loading state
  if (loading) {
    return <LoadingAnimation fullScreen={true} />;
  }

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
  const avatar = getUserAvatarUrl({ avatar: profile.avatar }) || "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/no+user+profile_11zon.png";
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

  // Relation button rendering
  const isSelf = currentUser?.customUserId === id;
  const showConnect = !isSelf && relationStatus === 'NONE';
  const showPendingOut = !isSelf && relationStatus === 'PENDING_OUT';
  const showPendingIn = !isSelf && relationStatus === 'PENDING_IN';
  const showConnected = !isSelf && relationStatus === 'CONNECTED';
  const isBlocked = !isSelf && relationStatus === 'BLOCKED';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Header />
      {/* Hero Section */}
      <div
        className="relative h-64 sm:h-80 md:h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getBackgroundImageUrl(backgroundImage)})`,
          backgroundColor: '#1e293b' // Fallback color if image fails to load
        }}
      >
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6 sm:pb-12">
          <div className="w-full py-2 px-4 sm:px-6 md:px-8 flex items-end space-x-3 relative z-20">
            {/* Left side with avatar */}
            <div className="flex items-center shrink-0">
              <div className="relative">
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-20 h-20 sm:w-24 md:w-36 sm:h-24 md:h-36 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/no+user+profile_11zon.png";
                  }}
                />
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-white flex items-center justify-center ${userType === "Available" ? "bg-green-500" : "bg-yellow-500"
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
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 text-white drop-shadow-md">{fullName}</h1>
                <p className="text-xs sm:text-sm font-medium mb-2 text-grey-200 drop-shadow-md">{(auth.userType || '').charAt(0).toUpperCase() + (auth.userType || '').slice(1) || title}</p>

                {/* Remove location/reviews/connections in mobile parity */}
              </div>
              
              <div className="mt-2 sm:mt-3 flex items-center relative z-30">
                {/* Relation Actions */}
                {showConnect && (
                  <button
                    onClick={handleConnect}
                    className="flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 rounded-2xl px-3 py-1.5"
                  >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Connect
                </button>
                )}
                {showPendingOut && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      className="flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 bg-gray-400 cursor-not-allowed"
                    >
                      Pending
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 bg-amber-600 hover:bg-amber-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {showPendingIn && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAccept}
                      className="flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={handleDecline}
                      className="flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 bg-red-600 hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {showConnected && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled
                      className="flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 bg-emerald-600"
                    >
                      Connected
                    </button>
                    <button
                      onClick={handleRemoveConnection}
                      className="flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 bg-slate-600 hover:bg-slate-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {!isSelf && (
                  <button
                    onClick={isBlocked ? handleUnblock : handleBlock}
                    className={`ml-2 flex items-center gap-2 text-white drop-shadow-md text-xs sm:text-sm rounded-2xl px-3 py-1.5 ${isBlocked ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-gray-800'}`}
                  >
                    {isBlocked ? 'Unblock' : 'Block'}
                  </button>
                )}
                <button className="ml-2 p-2 rounded-full bg-gray-100/20 text-white hover:bg-gray-100/30 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-2 sm:px-8 -mt-4 sm:-mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {freelancer.freelancerData?.hourlyRate ? `$${freelancer.freelancerData.hourlyRate}` : 'N/A'}
              </div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {projectsCount}
              </div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-xl shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {freelancer.freelancerData?.avgResponseTime ? freelancer.freelancerData.avgResponseTime : 'N/A'}
              </div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Avg Response Time (hrs)</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-600 to-orange-500 text-white rounded-xl shadow-lg">
            <CardContent className="p-3 sm:p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {freelancer.stats?.connectionsCount || 0}
              </div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Connections</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
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
                  {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg"
                      >
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
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="bg-purple-100 p-2 rounded-lg mr-3">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </span>
                  About
                </h2>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {displayedText}
                  </p>
                  {shouldTruncate && (
                    <button className="mt-2 text-blue-600 hover:underline text-xs sm:text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </CardContent>
              </CardContent>
            </Card>

            {/* Academic Background */}
            {education && education.length > 0 && (
              <Card className="bg-white shadow-lg rounded-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                      <span className="bg-blue-100 p-2 rounded-lg mr-3">
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
                      <span className="bg-green-100 p-2 rounded-lg mr-3">
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

            {/* Research Projects & Commercial Work */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </span>
                  <span className="sm:hidden">Projects</span>
                  <span className="hidden sm:inline">Research Projects & Commercial Work</span>
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {safePortfolioProjects.length > 0 ? (
                    safePortfolioProjects.map((project, index) => (
                      <Card
                        key={project.id || index}
                        className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch min-h-[120px] sm:min-h-[140px] cursor-pointer"
                        onClick={() => navigate(`/product/${project.id}`)}
                      >
                        <div className="w-full md:w-48 flex-shrink-0 h-28 md:h-auto bg-gray-100 flex items-center justify-center">
                          <img
                            src={project.image || "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/no+image+available_11zon.png"}
                            alt={project.title || project.name}
                            className="object-cover w-full h-full rounded-l-lg"
                            onError={e => { e.currentTarget.src = "https://amogh-assets.s3.ap-south-1.amazonaws.com/content/no+image+available_11zon.png"; }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between p-3 sm:p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">{project.title || project.name}</h3>
                              <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {(project.technologies || project.skills || project.tags || []).map((tech, techIndex) => (
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
                    <div className="text-center py-10 sm:py-20">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">This freelancer hasn't added any projects yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Section */}
            <Card className="bg-white shadow-lg rounded-xl hidden lg:block">
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
                      {typeof skill === 'string' ? skill : (skill as any)?.name || (skill as any)?.expertise || 'Unknown Skill'}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability & Details - hidden on mobile */}
            <div className="hidden md:block">
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
                      <span>Hourly Rate: <span className="font-medium">{freelancer.hourlyRate || '₹50'}</span></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ChatBox - hidden on mobile */}
            <div className="hidden md:block">
              <ChatBox
                freelancerName={fullName}
                freelancerImage={avatar}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VisitingProfile;

