import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Search, Users, UserPlus, TrendingUp, MessageCircle, MapPin, Building, Settings, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import {Footer} from '@/components/Footer';
import Logo from '@/assets/Logo/Logo Main.png'; 
import UserService, { UserSearchResult } from "@/services/userService";
import relationService from "@/services/relationService";
import { socket } from "@/socket.ts";
import { useUserProfile } from '@/contexts/UserProfileContext';

type ConnectionItem = {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar?: string;
  mutualConnections: number;
  isConnected: boolean;
  skills: string[];
  sentTime?: string;
};

const mockConnections: ConnectionItem[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    mutualConnections: 15,
    isConnected: true,
    skills: ['Product Strategy', 'UX Design', 'Data Analysis']
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'Lead Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    mutualConnections: 8,
    isConnected: true,
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    title: 'Marketing Director',
    company: 'GrowthCo',
    location: 'Austin, TX',
    mutualConnections: 12,
    isConnected: true,
    skills: ['Digital Marketing', 'SEO', 'Analytics']
  },
  {
    id: '4',
    name: 'Sarah Chen',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    mutualConnections: 15,
    isConnected: true,
    skills: ['Product Strategy', 'UX Design', 'Data Analysis']
  },
  {
    id: '5',
    name: 'Marcus Johnson',
    title: 'Lead Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    mutualConnections: 8,
    isConnected: true,
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: '6',
    name: 'Elena Rodriguez',
    title: 'Marketing Director',
    company: 'GrowthCo',
    location: 'Austin, TX',
    mutualConnections: 12,
    isConnected: true,
    skills: ['Digital Marketing', 'SEO', 'Analytics']
  },
  {
    id: '7',
    name: 'Sarah Chen',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    mutualConnections: 15,
    isConnected: true,
    skills: ['Product Strategy', 'UX Design', 'Data Analysis']
  },
  {
    id: '8',
    name: 'Marcus Johnson',
    title: 'Lead Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    mutualConnections: 8,
    isConnected: true,
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: '9',
    name: 'Elena Rodriguez',
    title: 'Marketing Director',
    company: 'GrowthCo',
    location: 'Austin, TX',
    mutualConnections: 12,
    isConnected: true,
    skills: ['Digital Marketing', 'SEO', 'Analytics']
  },
  {
    id: '10',
    name: 'Sarah Chen',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    mutualConnections: 15,
    isConnected: true,
    skills: ['Product Strategy', 'UX Design', 'Data Analysis']
  },
  {
    id: '11',
    name: 'Marcus Johnson',
    title: 'Lead Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    mutualConnections: 8,
    isConnected: true,
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: '12',
    name: 'Elena Rodriguez',
    title: 'Marketing Director',
    company: 'GrowthCo',
    location: 'Austin, TX',
    mutualConnections: 12,
    isConnected: true,
    skills: ['Digital Marketing', 'SEO', 'Analytics']
  }
];

// const mockSuggestions: Connection[] = [
//   {
//     id: '4',
//     name: 'David Kim',
//     title: 'UX Designer',
//     company: 'DesignStudio',
//     location: 'Seattle, WA',
//     mutualConnections: 5,
//     isConnected: false,
//     skills: ['UI/UX', 'Figma', 'Design Systems'],
//     sentTime: 'Sent 2 weeks ago'
//   },
//   {
//     id: '5',
//     name: 'Lisa Wang',
//     title: 'Data Scientist',
//     company: 'DataTech',
//     location: 'Boston, MA',
//     mutualConnections: 3,
//     isConnected: false,
//     skills: ['Machine Learning', 'Python', 'Statistics'],
//     sentTime: 'Sent 3 weeks ago'
//   }
// ];

type TabType = 'received' | 'sent' | 'find';

const Connections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  
  const [connections, setConnections] = useState(mockConnections);
  // const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);
  // const [suggestions, setSuggestions] = useState<UserProfile[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

  const [sentUsers, setSentUsers] = useState<UserSearchResult[]>([]);
  const [receivedUsers, setReceivedUsers] = useState<UserSearchResult[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserSearchResult[]>([]);
  const [allUsers, setAllUsers] = useState<UserSearchResult[]>([]);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [myRelations, setMyRelations] = useState(null);






  const { profileData } = useUserProfile();  // logged-in user
  const loggedInUserId = profileData?.customUserId;



useEffect(() => {
  const fetchResults = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const results = await UserService.searchUsers(searchQuery);
    setSearchResults(results);
  };
  fetchResults();
}, [searchQuery])

  // Fetch all users and set suggestions (except self)
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers();
      // If response is the whole object, extract .users
      const users = Array.isArray(response) ? response : response?.users || [];
      setAllUsers(users);
      console.log("Fetched users:", users);
    } catch (err) {
      console.error("Error fetching all users:", err);
      setAllUsers([]);
    }
  };
  fetchUsers();
}, []);

// Fetch my relations (connections) ONCE loggedInUserId is ready
useEffect(() => {
  if (!loggedInUserId) {
    setMyRelations(null);
    return;
  }
  (async () => {
    try {
      const res = await relationService.getMyRelations();
      // FIX: set directly, don't unwrap `.data`
      setMyRelations(res || null);
      console.log("Fetched myRelations:", res);
    } catch (err) {
      console.error("Failed to fetch relations:", err);
      setMyRelations(null);
    }
  })();
}, [loggedInUserId]);


useEffect(() => {
  if (!loggedInUserId || !myRelations) {
    setSuggestions([]);
    return;
  }

  const connectedIds = Object.keys(myRelations.connections || {});
  const sentIds = Object.keys(myRelations.requestsSent || {});
  const receivedIds = Object.keys(myRelations.requestsReceived || {});
  const blockedIds = Object.keys(myRelations.blockedUsers || {});

  const excludeIds = new Set([
    loggedInUserId,
    ...connectedIds,
    ...sentIds,
    ...receivedIds,
    ...blockedIds,
  ]);

  console.log("loggedInUserId:", loggedInUserId);
  console.log("excludeIds:", Array.from(excludeIds));
  console.log("first user:", allUsers[0]);

  const filtered = allUsers.filter(u => {
    const id = u.customUserId;
    if (!id) {
      console.warn("User without customUserId:", u);
      return false;
    }
    return !excludeIds.has(id);
  });

  console.log("filtered suggestions:", filtered);
  setSuggestions(filtered);
}, [allUsers, loggedInUserId, myRelations]);




  // Card click navigation (used in both search and suggestions)
  const handleCardClick = (user: UserSearchResult) => {
    const id = user.customUserId;
    const type = user.profile.userType?.toLowerCase();

    if (type === "student") {
      navigate(`/studentprofile/${id}`);
    } else if (type === "business") {
      navigate(`/businessprofile/${id}`);
    } else if (type === "freelancer") {
      navigate(`/freelancerprofile/${id}`);
    } else {
      navigate(`/studentprofile/${id}`);
    }
  };

useEffect(() => {
  const fetchReceivedProfiles = async () => {
    if (!profileData?.customUserId) return;

    try {
      // Pull my relations doc, then hydrate received with full profiles
      const myRelations = await relationService.getMyRelations();
      const receivedIds: string[] = myRelations?.data?.requestsReceived
        ? Object.keys(myRelations.data.requestsReceived)
            .filter((fromId) => myRelations.data.requestsReceived[fromId]?.status === 'PENDING')
        : [];

      const receivedProfiles = await Promise.all(
        receivedIds.map(async (id: string) => {
          try {
            const user = await UserService.getUserByCustomId(id);
            return user;
          } catch {
            return null;
          }
        })
      );

      setReceivedUsers(
        receivedProfiles
          .filter(Boolean)
          .map((user: any) => ({
            customUserId: user.customUserId,
            profile: {
              firstName: user.auth?.firstName || user.profile?.firstName || "User",
              lastName: user.auth?.lastName || user.profile?.lastName || "",
              avatar: user.profile?.avatar || "",
              userType: user.auth?.userType || user.profile?.userType || "student",
              username: user.auth?.username || "",
            },
          }))
      );
    } catch (err) {
      console.error("Failed to fetch received profiles:", err);
    }
  };

  fetchReceivedProfiles();
}, [profileData?.customUserId]);

// Realtime socket updates for received/sent
useEffect(() => {
  if (!socket || !profileData?.customUserId) return;

  // ensure this user is registered for targeted room updates
  socket.emit('register', profileData.customUserId);

  const onRelationRequestReceived = async (data: { from: string, firstName?: string, lastName?: string }) => {
    try {
      const fromId = data?.from;
      if (!fromId) return;
      // Show browser notification
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          try { await Notification.requestPermission(); } catch {}
        }
        if (Notification.permission === "granted") {
          try {
            const senderFullName = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "User";
            new Notification(`${senderFullName} sent you a connection request!`, {
              body: "",
              icon: "/favicon.ico",
            });
          } catch {}
        }
      }
      // Avoid duplicates
      if (receivedUsers.some(u => u.customUserId === fromId)) return;
      const user = await UserService.getUserByCustomId(fromId);
      if (!user) return;
      setReceivedUsers(prev => [
        {
          customUserId: user.customUserId,
          profile: {
            firstName: user.auth?.firstName || user.profile?.firstName || 'User',
            lastName: user.auth?.lastName || user.profile?.lastName || '',
            avatar: user.profile?.avatar || '',
            userType: user.auth?.userType || user.profile?.userType || 'student',
            username: user.auth?.username || '',
          },
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('socket relation_request_received hydrate failed:', err);
    }
  };

const onRelationUpdate = async (data: {
  type: string;
  between?: string[];
  senderFirstName?: string;
  senderLastName?: string;
  receiverFirstName?: string;
  receiverLastName?: string;
  declinerFirstName?: string;
  declinerLastName?: string;
}) => {
  try {
    const type = data?.type;
    const between = data?.between || [];
    if (!type || between.length < 2) return;
    const myId = profileData.customUserId;
    if (!between.includes(myId)) return; // unrelated pair
    const otherId = between.find(id => id !== myId)!;

    if (type === 'ACCEPTED') {

      // Show browser notification for accepted
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          try { await Notification.requestPermission(); } catch {}
        }
        if (Notification.permission === "granted") {
          try {
            let connectedName = "";
            if (myId === between[0]) {
              // me is receiver
              connectedName = `${data.senderFirstName || ""} ${data.senderLastName || ""}`.trim() || "User";
            } else {
              // me is sender
              connectedName = `${data.receiverFirstName || ""} ${data.receiverLastName || ""}`.trim() || "User";
            }
            new Notification(`${connectedName} are now connected`, {
              body: "",
              icon: "/favicon.ico",
            });
          } catch {}
        }
      }

      // Remove from received/sent and add to connected
      setReceivedUsers(prev => prev.filter(u => u.customUserId !== otherId));
      setSentUsers(prev => prev.filter(u => u.customUserId !== otherId));

      // Hydrate if not already present, then add to connectedUsers
      const existing = connectedUsers.some(u => u.customUserId === otherId);
      if (!existing) {
        try {
          const user = await UserService.getUserByCustomId(otherId);
          if (user) {
            setConnectedUsers(prev => ([
              ...prev,
              {
                customUserId: user.customUserId,
                profile: {
                  firstName: user.auth?.firstName || user.profile?.firstName || 'User',
                  lastName: user.auth?.lastName || user.profile?.lastName || '',
                  avatar: user.profile?.avatar || '',
                  userType: user.auth?.userType || user.profile?.userType || 'student',
                  username: user.auth?.username || '',
                },
              }
            ]));
          }
        } catch {}
      }
    }

    if (type === 'DECLINED') {
      // Show browser notification for decline
      if (typeof window !== "undefined" && "Notification" in window) {
      }

      // Remove from received/sent and add to connected
      setReceivedUsers(prev => prev.filter(u => u.customUserId !== otherId));
      setSentUsers(prev => prev.filter(u => u.customUserId !== otherId));

      // Hydrate if not already present, then add to connectedUsers
      const existing = connectedUsers.some(u => u.customUserId === otherId);
      if (!existing) {
        try {
          const user = await UserService.getUserByCustomId(otherId);
          if (user) {
            setConnectedUsers(prev => ([
              ...prev,
              {
                customUserId: user.customUserId,
                profile: {
                  firstName: user.auth?.firstName || user.profile?.firstName || 'User',
                  lastName: user.auth?.lastName || user.profile?.lastName || '',
                  avatar: user.profile?.avatar || '',
                  userType: user.auth?.userType || user.profile?.userType || 'student',
                  username: user.auth?.username || '',
                },
              }
            ]));
          }
        } catch {}
      }
    }

      // Handle declines/cancellations/withdrawals if backend emits them later
      if (type === 'DECLINED' || type === 'CANCELLED' || type === 'WITHDRAWN') {
        setReceivedUsers(prev => prev.filter(u => u.customUserId !== otherId));
        setSentUsers(prev => prev.filter(u => u.customUserId !== otherId));
      }
    } catch (err) {
      console.error('socket relation_update handling failed:', err);
    }
  };

  socket.on('relation_request_received', onRelationRequestReceived);
  socket.on('relation_update', onRelationUpdate);

  return () => {
    socket.off('relation_request_received', onRelationRequestReceived);
    socket.off('relation_update', onRelationUpdate);
  };
}, [socket, profileData?.customUserId, receivedUsers, connectedUsers]);

useEffect(() => {
  const fetchSentProfiles = async () => {
    if (!profileData?.customUserId) return;

    try {
      // Use relations: pick requestsSent with status REQUESTED
      const myRelations = await relationService.getMyRelations();
      const sentIds: string[] = myRelations?.data?.requestsSent
        ? Object.keys(myRelations.data.requestsSent)
            .filter((toId) => myRelations.data.requestsSent[toId]?.status === 'REQUESTED')
        : [];

const sentProfiles = await Promise.all(
        sentIds.map(async (id: string) => {
    try {
      const user = await UserService.getUserByCustomId(id);
      return user;
    } catch {
      return null;
    }
  })
);

      setSentUsers(
        sentProfiles
          .filter(Boolean)
          .map((user: any) => ({
            customUserId: user.customUserId,
            profile: {
              firstName: user.auth?.firstName || user.profile?.firstName || 'User',
              lastName: user.auth?.lastName || user.profile?.lastName || '',
              avatar: user.profile?.avatar || '',
              userType: user.auth?.userType || user.profile?.userType || 'student',
              username: user.auth?.username || '',
            },
          }))
      );
    } catch (err) {
      console.error('Failed to fetch sent profiles:', err);
    }
  };

  fetchSentProfiles();
}, [profileData?.customUserId]);

useEffect(() => {
  const onSent = async (e: any) => {
    try {
      const toUserId = e?.detail?.toUserId;
      if (!toUserId) return;
      // Avoid duplicates
      if (sentUsers.some(u => u.customUserId === toUserId)) return;
      const user = await UserService.getUserByCustomId(toUserId);
      if (!user) return;
      setSentUsers(prev => ([
        ...prev,
        {
          customUserId: user.customUserId,
          profile: {
            firstName: user.auth?.firstName || user.profile?.firstName || 'User',
            lastName: user.auth?.lastName || user.profile?.lastName || '',
            avatar: user.profile?.avatar || '',
            userType: user.auth?.userType || user.profile?.userType || 'student',
            username: user.auth?.username || '',
          },
        }
      ]));
    } catch (err) {
      console.error('Failed to hydrate newly-sent relation:', err);
    }
  };

  window.addEventListener('relations:sent', onSent);
  return () => window.removeEventListener('relations:sent', onSent);
}, [sentUsers]);


  const handleConnect = (personId: string) => {
    setSuggestions(prev => 
      prev.map(person => 
        person.customUserId === personId
          ? { ...person, isConnected: true } as any
          : person
      )
    );
  };

  const handleSuggestionCardClick = (user: UserSearchResult) => {
  const id = user.customUserId;
  const type = user.profile.userType?.toLowerCase();

  if (type === "student") {
    navigate(`/studentprofile/${id}`);
  } else if (type === "business") {
    navigate(`/businessprofile/${id}`);
  } else if (type === "freelancer") {
    navigate(`/freelancerprofile/${id}`);
  } else {
    console.warn("Unknown userType:", type, " — defaulting to student");
    navigate(`/studentprofile/${id}`);
  }

};


  const handleWithdraw = (personId: string) => {
    setSuggestions(prev => 
      prev.filter(person => person.customUserId !== personId)
    );
  };

  
  const ConnectionItem = ({ person, showWithdrawButton = false, showConnectButton = false }: { 
    person: Connection; 
    showWithdrawButton?: boolean;
    showConnectButton?: boolean;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 mb-3 sm:mb-0">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
          <AvatarImage src={person.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm sm:text-base">
            {person.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{person.name}</h3>
          <p className="text-gray-600 text-xs sm:text-sm truncate">{person.title}</p>
          <p className="text-gray-500 text-xs truncate">{person.company}</p>
          {person.sentTime && (
            <p className="text-gray-400 text-xs mt-1">{person.sentTime}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        {showWithdrawButton && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleWithdraw(person.id)}
            className="text-gray-600 hover:text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            Withdraw
          </Button>
        )}
        {showConnectButton && !person.isConnected && (
          <Button 
            size="sm"
            onClick={() => handleConnect(person.id)}
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Connect
          </Button>
        )}
        {person.isConnected && (
          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Message</span>
          </Button>
        )}
      </div>
    </div>
  );

    // // Filter suggestions to exclude users already sent, received, or connected
    // const filteredSuggestions = suggestions.filter(
    //   user =>
    //     !sentUsers.some(u => u.customUserId === user.customUserId) &&
    //     !receivedUsers.some(u => u.customUserId === user.customUserId) &&
    //     !connectedUsers.some(u => u.customUserId === user.customUserId)
    // );

    const renderTabContent = () => {
    switch (activeTab) {
      case 'received':
  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-t-lg border border-b-0 border-gray-200 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Connection Requests</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your incoming connection requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center text-blue-800">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="text-blue-800">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
          {receivedUsers.length > 0 ? (
            receivedUsers.map(user => (
              <div
                key={user.customUserId}
                onClick={() => handleCardClick(user)}
                className="flex items-center justify-between p-3 hover:bg-gray-50 transition"
              >
                {/* Left side: user card */}
                <ConnectionItem
                  person={{
                    id: user.customUserId,
                    name: `${user.profile.firstName} ${user.profile.lastName}`,
                    title: user.profile.userType || 'student',
                    company: user.profile.username,
                    avatar: user.profile.avatar,
                    location: "",
                    mutualConnections: 0,
                    isConnected: false,
                    skills: []
                  }}
                />



                {/* Right side: action buttons */}
                <div className="flex space-x-2 ml-4">
      {/* Accept button */}
      <Button
        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        onClick={async () => {
          try {
            await relationService.accept(user.customUserId);

            //  Remove from received list → card disappears
            setReceivedUsers(prev =>
              prev.filter(u => u.customUserId !== user.customUserId)
            );

            //  Add to connected list
            setConnectedUsers(prev => [
              ...prev,
              {
                customUserId: user.customUserId,
                profile: user.profile,
              },
            ]);
          } catch (err) {
            console.error("Failed to accept request:", err);
          }
        }}
      >
        Accept
                  </Button>
        {/* Reject button */}
        <button
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          onClick={async () => {
            try {
              await relationService.decline(user.customUserId);

              // ✅ Remove from received only
              setReceivedUsers(prev =>
                prev.filter(u => u.customUserId !== user.customUserId)
              );
            } catch (err) {
              console.error("Failed to reject request:", err);
            }
          }}
        >
          Reject
        </button>
                </div>
              </div>
            ))
          ) : (
            <Card className="text-center py-12 shadow-none border-none">
              <CardContent>
                <h3 className="font-semibold text-gray-700">No connection requests</h3>
                <p className="text-gray-500 mt-1">You don’t have any pending requests.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

      case 'sent':
        return (
          <div className="flex flex-col h-full">
            {/* Sticky header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-t-lg border border-b-0 border-gray-200 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sent Invitations</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your outgoing connection requests</p>

              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 sm:self-start">
                {suggestions.length} pending
              </Badge>
            </div>
            {/* Scrollable cards */}
<div className="flex-1 overflow-y-auto scrollbar-hide">
  <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
    {sentUsers.length > 0 ? (
      sentUsers.map(user => (
        <div
          key={user.customUserId}
          className="flex items-center justify-between p-3 hover:bg-gray-50 transition"
        >
          {/* Left side: user card */}
          <ConnectionItem
            person={{
              id: user.customUserId,
                          name: `${user.profile.firstName || 'User'} ${user.profile.lastName || ''}`.trim(),
                          title: user.profile.userType || 'Student',
                          company: user.profile.username || 'N/A',
                          avatar: user.profile.avatar || '',
                          location: '',
              mutualConnections: 0,
              isConnected: false,
              skills: []
            }}
          />

                      {/* Right side: Status + Withdraw */}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200">Requested</span>
          <button
            onClick={async () => {
              try {
                              await relationService.cancel(user.customUserId);
                              setSentUsers(prev => prev.filter(u => u.customUserId !== user.customUserId));
              } catch (err) {
                              console.error('Failed to withdraw connection:', err);
              }
            }}
            className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Withdraw
          </button>
                      </div>
        </div>
      ))
    ) : (
                  <Card className="text-center py-12 shadow-none border-none">
                    <CardContent>
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <UserPlus className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-700">No pending invitations</h3>
                      <p className="text-gray-500 mt-1">All your connection requests have been accepted</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );
      case 'find':
        function handleSuggestionConnect(user: UserSearchResult) {
          throw new Error("Function not implemented.");
        }

        return (

          <div className="flex flex-col h-full">
            {/* Sticky header */}
            <div className="p-4 bg-white rounded-t-lg border border-b-0 border-gray-200 sticky top-0 z-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Connections</h2>
              <div className="relative">

                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, title, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {/* Scrollable cards */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg divide-y divide-gray-100">
                  {searchQuery ? (
                    searchResults.length > 0 ? (
                      searchResults.map(user => (
                        <div
                          key={user.customUserId}
                          onClick={() => handleCardClick(user)}
                          className="cursor-pointer hover:bg-gray-50 transition"
                        >
                        <ConnectionItem
                          key={user.customUserId}
                          person={{
                          id: user.customUserId,
                          name: `${user.profile.firstName} ${user.profile.lastName}`,
                          title: user.profile.userType,
                          company: user.profile.username,
                          avatar: user.profile.avatar,
                          location: "",
                          mutualConnections: 0,
                          isConnected: false,
                          skills: []
                      }}
                   showConnectButton
                  />
                </div>
                    ))
                  ) : (
                    <Card className="text-center py-12 shadow-none border-none">
                      <CardContent>
                        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-700">No results found</h3>
                        <p className="text-gray-500 mt-1">Try different search terms or browse suggestions</p>
                        <Button className="mt-4">Browse Suggestions</Button>
                      </CardContent>
                    </Card>
                  )
                ) : (
                  <>
                    {/* SUGGESTIONS LIST */}
                    <Card className="shadow-none border-none">
                      <CardHeader>
                        <CardTitle>Discover New Connections</CardTitle>
                        <CardDescription>
                          People you may know based on your profile and network
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Debug log for suggestions */}
                        {console.log("Suggestions before render:", suggestions)}
                        <div className="divide-y divide-gray-100">
                          {suggestions.length > 0 ? (
                            suggestions.map(user => (
                              <div
                                key={user.customUserId}
                                onClick={() => handleSuggestionCardClick(user)}
                                className="cursor-pointer hover:bg-gray-50 transition flex items-center"
                              >
                                <ConnectionItem
                                  person={{
                                    id: user.customUserId,
                                    name: `${user.profile.firstName || ""} ${user.profile.lastName || ""}`.trim(),
                                    title: user.profile.userType || "student",
                                    company: user.profile.username || "",
                                    avatar: user.profile.avatar || "",
                                    location: "",
                                    mutualConnections: 0,
                                    isConnected: false,
                                    skills: [],
                                  }}
                                  
                                />
                                {/* <Button
                                  size="sm"
                                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={e => {
                                    e.stopPropagation(); // prevent navigation
                                    handleSuggestionConnect(user);
                                  }}
                                >
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Connect
                                </Button> */}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 p-4">No suggestions right now</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        );

        
    }}


  return (
    <div className="min-h-screen bg-blue-100">
      <Header />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 mt-14">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 relative">
          {/* Mobile Navigation Tabs */}
          <div className="lg:hidden w-full order-1 mb-4">
            <div className="bg-white rounded-lg shadow-sm p-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'received'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Received</span>
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'sent'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Sent</span>
                </button>
                <button
                  onClick={() => setActiveTab('find')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'find'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>Find</span>
                </button>
              </div>
            </div>
          </div>

          {/* Left: Main Content (renderTabContent) */}
          <div className="flex-1 order-2 lg:order-1 min-h-[70vh] h-[70vh] lg:h-[80vh]">
            <div className="h-[70vh] lg:h-[80vh] overflow-y-auto pr-1 scrollbar-hide">
              {renderTabContent()}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:flex w-80 order-1 lg:order-2 flex-col h-[80vh]">
            <div className="lg:top-8 z-20">
              <Card className="border-0 shadow-sm mb-4 lg:mb-0">
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Navigation</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => setActiveTab('received')}
                    className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 text-sm sm:text-base ${
                      activeTab === 'received'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="font-medium">Received Invitations</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 text-sm sm:text-base ${
                      activeTab === 'sent'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="font-medium">Sent Invitations</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('find')}
                    className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 text-sm sm:text-base ${
                      activeTab === 'find'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="font-medium">Find People</span>
                  </button>
                </CardContent>
              </Card>
            </div>
            <div className="mt-auto lg:bottom-4 z-10">
              <Card className="border-0 shadow-sm flex flex-col items-center justify-center py-6 sm:py-8">
                <CardContent className="flex flex-col items-center">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-auto h-16 sm:h-20 mb-2 sm:mb-3"
                  />
                  <p className="text-gray-500 text-xs sm:text-sm text-center px-2">
                    Connect, grow, and collaborate with professionals on EverUseful.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Connections;