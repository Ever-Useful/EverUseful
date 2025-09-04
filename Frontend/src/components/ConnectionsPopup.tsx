import { useState, useEffect } from 'react';
import { X, Search, MessageCircle, UserPlus, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import userService from '@/services/userService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth } from "@/lib/firebase"; // make sure auth is imported
import { useUserProfile } from "@/contexts/UserProfileContext";



type Connection = {
  id: string;
  name: string;
  avatar?: string;
  userType: string;
  username?: string;

  // mark old fields as optional so TS won’t complain
  title?: string;
  company?: string;
  location?: string;
  mutualConnections?: number;
  isConnected?: boolean;
  email?: string;
};

interface ConnectionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  connectionCount: number;
}

const ConnectionsPopup = ({ isOpen, onClose, connectionCount }: ConnectionsPopupProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { profileData } = useUserProfile();



useEffect(() => {
  const fetchConnectedProfiles = async () => {
    if (!profileData?.customUserId) return;

    try {
      const connections = await userService.getConnectionsByUserId(profileData.customUserId);

      const connectedProfiles = await Promise.all(
        (connections.connected || []).map(async (id: string) => {
          console.log("Fetching connected user with ID:", id);
          try {
            const user = await userService.getUserByCustomId(id);
            console.log("Fetched user response:", user);
            return user;
          } catch {
            console.warn(`User with ID ${id} not found, skipping...`);
            return null;
          }
        })
      );

      setConnections(
        connectedProfiles
          .filter(Boolean)
          .map((user: any) => ({
            id: user.customUserId,
            name: `${user.auth?.firstName || user.profile?.firstName || "User"} ${user.auth?.lastName || user.profile?.lastName || ""}`.trim(),
            avatar: user.profile?.avatar || "",
            userType: user.auth?.userType || "student",
            username: user.auth?.username || user.profile?.username || "",
          }))
      );
    } catch (err) {
      console.error("Failed to fetch connected profiles:", err);
      toast.error("Failed to load connections");
    }
  };

  fetchConnectedProfiles();
}, [profileData?.customUserId]);


  // // Mock data for now - replace with actual API call
  // const mockConnections: Connection[] = [
  //   {
  //     id: '1',
  //     name: 'Sarah Chen',
  //     title: 'Senior Product Manager',
  //     company: 'TechCorp',
  //     location: 'San Francisco, CA',
  //     mutualConnections: 15,
  //     isConnected: true,
  //   },
  //   {
  //     id: '2',
  //     name: 'Marcus Johnson',
  //     title: 'Lead Developer',
  //     company: 'StartupXYZ',
  //     location: 'New York, NY',
  //     mutualConnections: 8,
  //     isConnected: true,
  //   },
  //   {
  //     id: '3',
  //     name: 'Elena Rodriguez',
  //     title: 'Marketing Director',
  //     company: 'GrowthCo',
  //     location: 'Austin, TX',
  //     mutualConnections: 12,
  //     isConnected: true,
  //   },
  //   {
  //     id: '4',
  //     name: 'David Kim',
  //     title: 'UX Designer',
  //     company: 'DesignStudio',
  //     location: 'Seattle, WA',
  //     mutualConnections: 5,
  //     isConnected: true,
  //   },
  //   {
  //     id: '5',
  //     name: 'Lisa Wang',
  //     title: 'Data Scientist',
  //     company: 'DataTech',
  //     location: 'Boston, MA',
  //     mutualConnections: 3,
  //     isConnected: true,
  //   }
  // ];

  // useEffect(() => {
  //   if (isOpen) {
  //     setLoading(true);
  //     // Simulate API call
  //     setTimeout(() => {
  //       setConnections(mockConnections);
  //       setLoading(false);
  //     }, 500);
  //   }
  // }, [isOpen]);

  const handleMessage = (connectionId: string) => {
    // Navigate to chat or open chat modal
    toast.success('Opening chat...');
  };

  const handleConnect = (connectionId: string) => {
    toast.success('Connection request sent!');
  };

  const handleCardClick = (connectionId: string) => {
    // Navigate to user's profile
    navigate(`/profile/${connectionId}`);
    onClose(); // Close the popup after navigation
  };

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Connections</h2>
            <p className="text-sm text-gray-600 mt-1">
              {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gray-100 text-blue-800"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>
          {/* Filter Bar */}
          <div className="mt-3 mb-1">
            <SearchFilterBar 
              tags={filterTags}
              onTagClick={handleFilterClick}
              className="justify-start"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredConnections.length > 0 ? (
            <div className="space-y-4">
              {filteredConnections.map((connection) => (
                <Card 
                  key={connection.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(connection.id)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Avatar and Info */}
                      <div className="flex items-center gap-4 flex-1">
<Avatar className="h-12 w-12 sm:h-16 sm:w-16">
  <AvatarImage src={connection.avatar} />
  <AvatarFallback>
    {connection.name ? connection.name.split(" ").map(n => n[0]).join("") : "U"}
  </AvatarFallback>
</Avatar>

                        <div className="flex-1 min-w-0">
<h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
  {connection.name}
</h3>

{connection.username && (
  <p className="text-gray-500 text-xs">@{connection.username}</p>
)}

<Badge variant="secondary" className="text-xs mt-1">
  {connection.userType || "student"}
</Badge>

                        </div>
                      </div>


                      {/* Actions - Desktop only */}
                      <div className="hidden sm:flex gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleMessage(connection.id);
                          }}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
                        >
                          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-700 text-lg">No connections found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? 'Try different search terms' : 'Start building your network'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredConnections.length} of {connections.length} connections
            </p>
            <Button variant="outline" onClick={onClose} className="text-blue-800 border-blue-800 hover:bg-blue-50">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPopup;
