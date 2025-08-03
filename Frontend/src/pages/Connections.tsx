import { useState } from 'react';
import { Search, Users, UserPlus, TrendingUp, MessageCircle, MapPin, Building, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import {Footer} from '@/components/Footer';
import Logo from '@/assets/Logo/Logo Main.png'; 
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
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState(mockConnections);
  const [suggestions, setSuggestions] = useState(mockSuggestions);

  const handleConnect = (personId: string) => {
    setSuggestions(prev => 
      prev.map(person => 
        person.id === personId 
          ? { ...person, isConnected: true }
          : person
      )
    );
  };

  const handleWithdraw = (personId: string) => {
    setSuggestions(prev => 
      prev.filter(person => person.id !== personId)
    );
  };

  const filteredConnections = connections.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Message
          </Button>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'received':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Manage invitations</h2>
                <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  People ({connections.length})
                </Badge>
              </div>
              <div>
                {connections.map(person => (
                  <ConnectionItem key={person.id} person={person} />
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'sent':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-gray-900 mobile-text-3xl">Manage invitations</h2>
                <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  People ({suggestions.length})
                </Badge>
              </div>
              <div>
                {suggestions.map(person => (
                  <ConnectionItem key={person.id} person={person} showWithdrawButton />
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'find':
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-3xl font-semibold text-gray-900 mobile-text-3xl">Find People</h2>
              <div className="relative mt-3 sm:mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, title, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-3 sm:p-4">
              {searchQuery ? (
                filteredConnections.length > 0 ? (
                  <div>
                    {filteredConnections.map(person => (
                      <ConnectionItem key={person.id} person={person} showConnectButton />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">No results found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">Start typing to search for people</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Header />
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-1">
            {renderTabContent()}
          </div>
          
          {/* Right Sidebar with Navigation */}
          <div className="w-full lg:w-80 order-1 lg:order-2">
            <Card className="border-0 shadow-sm mb-4 lg:mb-0 lg:sticky lg:top-8">
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

            {/* Sticky Logo Box */}
            <Card className="border-0 shadow-sm flex flex-col items-center justify-center py-6 sm:py-8 lg:sticky lg:top-44 lg:mt-6">
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
      <Footer />
    </div>
  );
};

export default Connections;