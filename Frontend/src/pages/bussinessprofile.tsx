import Header from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Chatbot } from "@/components/Chatbot"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Award, TrendingUp, BookOpen, Briefcase, Settings, Home, Bell, Search, Send, UserPlus } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import userService from "@/services/userService"
import relationService from "@/services/relationService"
import { useUserProfile } from "@/contexts/UserProfileContext"
import { socket } from "@/socket.ts"
import { API_ENDPOINTS } from '../config/api'
import { getUserAvatarUrl, getBackgroundImageUrl } from '@/utils/s3ImageUtils'
import NoUserProfile from "@/assets/images/no user profile.png"

const BussinessProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [relationStatus, setRelationStatus] = useState<'NONE' | 'PENDING_OUT' | 'PENDING_IN' | 'CONNECTED' | 'BLOCKED'>('NONE');
  const { profileData: currentUser } = useUserProfile();

  const userProjects = [
    {
      title: "AI Healthcare Assistant",
      status: "Active",
      progress: 85,
      collaborators: 4,
      category: "Healthcare",
    },
    {
      title: "Sustainable Energy Monitor",
      status: "Completed",
      progress: 100,
      collaborators: 6,
      category: "Green Tech",
    },
    {
      title: "Blockchain Voting System",
      status: "In Review",
      progress: 90,
      collaborators: 3,
      category: "Blockchain",
    },
  ]

  const achievements = [
    { title: "Innovation Pioneer", description: "Led 5+ groundbreaking projects", icon: Award },
    { title: "Collaboration Master", description: "Successfully worked with 50+ team members", icon: User },
    { title: "Impact Creator", description: "Projects reached 10K+ users", icon: TrendingUp },
    { title: "Knowledge Sharer", description: "Mentored 20+ junior developers", icon: BookOpen },
  ]

  // Fetch user data by customUserId
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USER_BY_ID(id));
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      
      if (data.success && data.data) {
        setUserData(data.data);
        
        // Set background image from user profile data
        const userBackgroundImage = data.data.profile?.backgroundImage;
        if (userBackgroundImage) {
          setBackgroundImage(userBackgroundImage);
        } else {
          setBackgroundImage("https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80");
        }
      } else {
        setUserData({});
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({});
    } finally {
      setLoading(false);
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

    // Browser notification with receiver's name
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try { await Notification.requestPermission(); } catch {}
      }
      if (Notification.permission === 'granted') {
        try {
          // Get receiver's name (firstName + lastName)
          const receiverFirstName = userData?.auth?.firstName || '';
          const receiverLastName = userData?.auth?.lastName || '';
          const receiverFullName = `${receiverFirstName} ${receiverLastName}`.trim() || 'User';

          new Notification('Connection request sent', {
            body: `Your notification to ${receiverFullName} is now pending.`,
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

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, [id]);

  // Get user data for display
  const auth = userData?.auth || {};
  const fullName = `${auth.firstName || ''} ${auth.lastName || ''}`.trim() || 'Unnamed User';
  const profile = userData?.profile || {};
  const avatar = getUserAvatarUrl({ avatar: profile.avatar }) || NoUserProfile;

  // Relation button rendering
  const isSelf = currentUser?.customUserId === id;
  const showConnect = !isSelf && relationStatus === 'NONE';
  const showPendingOut = !isSelf && relationStatus === 'PENDING_OUT';
  const showPendingIn = !isSelf && relationStatus === 'PENDING_IN';
  const showConnected = !isSelf && relationStatus === 'CONNECTED';
  const isBlocked = !isSelf && relationStatus === 'BLOCKED';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-20 bg-gray-900 min-h-screen flex flex-col items-center py-8 space-y-8 border-r border-gray-800">
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
            <Home className="w-5 h-5 text-gray-300" />
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
            <Bell className="w-5 h-5 text-gray-300" />
          </div>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-gray-900" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-900 text-white">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">John Doe</span>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Profile</h1>
              <p className="text-gray-400 text-sm">View all your profile details here.</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  {/* Banner Image */}
                  <div
                    className="h-40 w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${getBackgroundImageUrl(backgroundImage)})`,
                      backgroundBlendMode: "overlay",
                      backgroundColor: "rgba(17, 24, 39, 0.7)",
                    }}
                  >
                    <div className="flex justify-end p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-900/50 border-gray-600 text-white hover:bg-gray-800"
                      >
                        Add Picture
                      </Button>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-6 relative">
                    {/* Profile Picture - Positioned to overlap the banner */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <Avatar className="w-40 h-40 border-4 border-gray-800 shadow-lg">
                          <AvatarImage src={avatar} />
                          <AvatarFallback className="text-3xl">
                            {fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "NA"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Name and Relation Buttons - Positioned below the profile picture */}
                    <div className="text-center mt-24 mb-4">
                      <h2 className="text-2xl font-semibold mb-1">{fullName}</h2>
                      <p className="text-green-400 text-sm mb-4">{(auth.userType || '').charAt(0).toUpperCase() + (auth.userType || '').slice(1) || 'Business User'}</p>

                      {/* Relation Actions */}
                      <div className="flex flex-col items-center gap-2">
                        {showConnect && (
                          <Button
                            onClick={handleConnect}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            Connect
                          </Button>
                        )}
                        {showPendingOut && (
                          <div className="flex items-center gap-2">
                            <Button
                              disabled
                              className="bg-gray-400 cursor-not-allowed text-white px-6 py-2 rounded-lg"
                            >
                              Pending
                            </Button>
                            <Button
                              onClick={handleCancel}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                        {showPendingIn && (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={handleAccept}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={handleDecline}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                        {showConnected && (
                          <div className="flex items-center gap-2">
                            <Button
                              disabled
                              className="bg-emerald-600 text-white px-6 py-2 rounded-lg"
                            >
                              Connected
                            </Button>
                            <Button
                              onClick={handleRemoveConnection}
                              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        {!isSelf && (
                          <Button
                            onClick={isBlocked ? handleUnblock : handleBlock}
                            className={`${isBlocked ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-gray-600'} text-white px-4 py-2 rounded-lg`}
                          >
                            {isBlocked ? 'Unblock' : 'Block'}
                          </Button>
                        )}
                        <Button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
                          <Send className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Bio & Details */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-6">Bio & other details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Role</p>
                        <p className="text-white">{profile.title || 'Business Professional'}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Bio</p>
                        <p className="text-white">{profile.bio || 'No bio available'}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Location</p>
                        <p className="text-white">{profile.location || 'Location not specified'}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">User Type</p>
                        <p className="text-white">{(auth.userType || '').charAt(0).toUpperCase() + (auth.userType || '').slice(1) || 'Business'}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Badges</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700">Top Collaborator</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Experience Level</p>
                        <p className="text-white">Intermediate</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Favorite Music Genre</p>
                        <p className="text-white">Trap</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Preferred Music Mood</p>
                        <p className="text-white">Melancholic</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Availability</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-400 text-sm">Available for Collaboration</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Tags</p>
                        <p className="text-white">#Drill, #Melancholic, #Trap-US</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Sections */}
            <div className="mt-8 space-y-4">
              {/* My Productions Dropdown */}
              <details className="bg-gray-800 rounded-lg">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold">My Productions</h3>
                  </div>
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="p-4 border-t border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">Title</th>
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">Timing</th>
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">No. of Recordings</th>
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userProjects.map((project, index) => (
                          <tr key={index} className="border-b border-gray-700/50">
                            <td className="py-4">
                              <div>
                                <p className="text-white font-medium">{project.title}</p>
                                <Badge className="mt-1 bg-green-600 text-white text-xs">{project.status}</Badge>
                              </div>
                            </td>
                            <td className="py-4 text-gray-300">{project.progress}% Complete</td>
                            <td className="py-4 text-gray-300">{project.collaborators}</td>
                            <td className="py-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>

              {/* Achievements Dropdown */}
              <details className="bg-gray-800 rounded-lg">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold">Achievements</h3>
                  </div>
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="p-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <achievement.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm">{achievement.title}</h4>
                          <p className="text-gray-400 text-xs">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              {/* Projects Dropdown */}
              <details className="bg-gray-800 rounded-lg">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold">Projects</h3>
                  </div>
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="p-4 border-t border-gray-700">
                  <div className="space-y-4">
                    {userProjects.map((project, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{project.title}</h4>
                          <Badge className="bg-green-600 text-white text-xs">{project.status}</Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Category: {project.category}</p>
                        <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: project.progress + '%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{project.progress}% Complete</span>
                          <span className="text-gray-300">{project.collaborators} collaborators</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default BussinessProfile