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
import { useUserProfile } from '@/contexts/UserProfileContext';
type Connection = {
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

const mockConnections: Connection[] = [
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

const mockSuggestions: Connection[] = [
  {
    id: '4',
    name: 'David Kim',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Seattle, WA',
    mutualConnections: 5,
    isConnected: false,
    skills: ['UI/UX', 'Figma', 'Design Systems'],
    sentTime: 'Sent 2 weeks ago'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    title: 'Data Scientist',
    company: 'DataTech',
    location: 'Boston, MA',
    mutualConnections: 3,
    isConnected: false,
    skills: ['Machine Learning', 'Python', 'Statistics'],
    sentTime: 'Sent 3 weeks ago'
  }
];

type TabType = 'received' | 'sent' | 'find';

const Connections = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('received');
  
  const [connections, setConnections] = useState(mockConnections);
  // const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

  const [sentUsers, setSentUsers] = useState<UserSearchResult[]>([]);
  const [receivedUsers, setReceivedUsers] = useState<UserSearchResult[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<UserSearchResult[]>([]);






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

// Fetch suggestions on mount
useEffect(() => {
  const fetchSuggestions = async () => {
    try {
      const result = await UserService.getSuggestedUsers();
      setSuggestions(result);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  fetchSuggestions();
}, []);

// useEffect(() => {
//   const fetchReceivedProfiles = async () => {
//     if (!profileData.customUserId) return;

//     try {
//       // 1️⃣ Get logged-in user's connections (IDs)
//       const connections = await UserService.getConnectionsByUserId(profileData.customUserId);
//       console.log("Connections:", connections);

//       // 2️⃣ Take only "received" IDs
//       const receivedIds = connections.connections?.received || [];
//       if (receivedIds.length === 0) {
//         setReceivedUsers([]);
//         return;
//       }

//       // 3️⃣ Fetch full profiles for those IDs
//       const receivedProfiles = await Promise.all(
//         receivedIds.map(id => UserService.getUserByCustomId(id))
//       );

//       console.log("Received profiles:", receivedProfiles);

//       // 4️⃣ Store them in state
//       setReceivedUsers(receivedProfiles.filter(Boolean));
//     } catch (err) {
//       console.error("Failed to fetch received profiles:", err);
//     }
//   };

//   fetchReceivedProfiles();
// }, [profileData.customUserId]);

useEffect(() => {
  const fetchReceivedProfiles = async () => {
    if (!profileData?.customUserId) return;

    try {
      // Get logged-in user's connections
      const connections = await UserService.getConnectionsByUserId(profileData.customUserId);
      console.log("Connections:", connections);

      // Get full profiles for received connections with try/catch per ID
      const receivedProfiles = await Promise.all(
        (connections.connections?.received || []).map(async (id: string) => {
          console.log("Fetching received user with ID:", id);
          try {
            const user = await UserService.getUserByCustomId(id);
            console.log("Fetched user response:", user);
            return user;
          } catch {
            console.warn(`User with ID ${id} not found, skipping...`);
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

useEffect(() => {
  const fetchSentProfiles = async () => {
    if (!profileData?.customUserId) return;

    try {
      // Get logged-in user's connections
      const connections = await UserService.getConnectionsByUserId(profileData.customUserId);


const sentProfiles = await Promise.all(
  (connections.connections?.sent || []).map(async (id: string) => {
    console.log("Fetching sent user with ID:", id);
    try {
      const user = await UserService.getUserByCustomId(id);
      console.log("Fetched user response:", user);
      return user;
    } catch {
      console.warn(`User with ID ${id} not found, skipping...`);
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
              firstName: user.auth?.firstName || user.profile?.firstName || "User",
              lastName: user.auth?.lastName || user.profile?.lastName || "",
              avatar: user.profile?.avatar || "",
              userType: user.auth?.userType || "student",
              username: user.auth?.username || "",
            },
          }))
      );
    } catch (err) {
      console.error("Failed to fetch sent profiles:", err);
    }
  };

  fetchSentProfiles();
}, [profileData?.customUserId]);



  const handleConnect = (personId: string) => {
    setSuggestions(prev => 
      prev.map(person => 
        person.id === personId 
          ? { ...person, isConnected: true }
          : person
      )
    );
  };

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
    console.warn("Unknown userType:", type, " — defaulting to student");
    navigate(`/studentprofile/${id}`);
  }

};


  const handleWithdraw = (personId: string) => {
    setSuggestions(prev => 
      prev.filter(person => person.id !== personId)
    );
  };

  // const filteredConnections = connections.filter(person =>
  //   person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   person.company.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // // For the 'find' tab, filter all connections and suggestions that are not already connected
  // const filteredSearchResults = [
  //   ...connections.filter(person => !person.isConnected),
  //   ...suggestions.filter(person => !person.isConnected)
  // ].filter(person =>
  //   person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   person.company.toLowerCase().includes(searchQuery.toLowerCase())
  // );
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
                    title: user.profile.userType,
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
            // Call backend accept
            await UserService.acceptConnectionRequest(user.customUserId);

            // ✅ Remove from received list → card disappears
            setReceivedUsers(prev =>
              prev.filter(u => u.customUserId !== user.customUserId)
            );

            // ✅ Add to connected list
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
              await UserService.rejectConnectionRequest(user.customUserId);

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
              name: `${user.profile.firstName || "User"} ${user.profile.lastName || ""}`.trim(),
              title: user.profile.userType || "Student",
              company: user.profile.username || "N/A",
              avatar: user.profile.avatar || "",
              location: "",
              mutualConnections: 0,
              isConnected: false,
              skills: []
            }}
          />

          {/* Right side: Withdraw button */}
          <button
            onClick={async () => {
              try {
                await UserService.withdrawConnectionRequest(user.customUserId);

                // Remove immediately from UI
                setSentUsers(prev =>
                  prev.filter(u => u.customUserId !== user.customUserId)
                );
              } catch (err) {
                console.error("Failed to withdraw connection:", err);
              }
            }}
            className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Withdraw
          </button>
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
                    <Card className="shadow-none border-none">
                      <CardHeader>
                        <CardTitle>Discover New Connections</CardTitle>
                        <CardDescription>
                          People you may know based on your profile and network
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y divide-gray-100">
{suggestions.length > 0 ? (
  suggestions.map(user => (
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
          location: user.profile.location || "",
          mutualConnections: 0,
          isConnected: false,
          skills: []
        }}
        showConnectButton
      />
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