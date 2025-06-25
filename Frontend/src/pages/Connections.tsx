import { useState } from 'react';
import { Search, Users, UserPlus, TrendingUp, MessageCircle, UserCheck, MapPin, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';


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
    skills: ['UI/UX', 'Figma', 'Design Systems']
  },
  {
    id: '5',
    name: 'Lisa Wang',
    title: 'Data Scientist',
    company: 'DataTech',
    location: 'Boston, MA',
    mutualConnections: 3,
    isConnected: false,
    skills: ['Machine Learning', 'Python', 'Statistics']
  }
];

type TabType = 'connections' | 'find' | 'recommended';

const Connections = () => {
  const [activeTab, setActiveTab] = useState<TabType>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState(mockConnections);
  const [suggestions, setSuggestions] = useState(mockSuggestions);
    const navigate = useNavigate(); 
  const handleConnect = (personId: string) => {
    setSuggestions(prev => 
      prev.map(person => 
        person.id === personId 
          ? { ...person, isConnected: true }
          : person
      )
    );
  };

  const filteredConnections = connections.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ConnectionCard = ({ person, showConnectButton = false }: { person: Connection; showConnectButton?: boolean }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {person.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{person.name}</h3>
              <p className="text-gray-600 font-medium">{person.title}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Building className="h-4 w-4 mr-1" />
                <span>{person.company}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{person.location}</span>
              </div>
            </div>
          </div>
          {showConnectButton && !person.isConnected && (
            <Button 
              onClick={() => handleConnect(person.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
          {person.isConnected && (
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              <UserCheck className="h-4 w-4 mr-2" />
              Connected
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {person.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{person.mutualConnections} mutual connections</span>
          </div>
          {person.isConnected && (
            <Button onClick={() => navigate('/chat')} variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'connections':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Connections</h2>
              <Badge variant="outline" className="px-3 py-1">
                {connections.length} connections
              </Badge>
            </div>
            <div className="grid gap-4">
              {filteredConnections.map(person => (
                <ConnectionCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        );
      
      case 'find':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Find People</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, title, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid gap-4">
              {searchQuery ? (
                filteredConnections.length > 0 ? (
                  filteredConnections.map(person => (
                    <ConnectionCard key={person.id} person={person} showConnectButton />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Start typing to search for people</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'recommended':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Recommended Connections</h2>
              <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <p className="text-gray-600 mb-6">People you might know based on your network and interests</p>
            <div className="grid gap-4">
              {suggestions.map(person => (
                <ConnectionCard key={person.id} person={person} showConnectButton />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        
        {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
          
          {/* Right Sidebar with Tabs */}
          <div className="w-80">
            <Card className="sticky top-8 border-0 shadow-lg">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-gray-900">Navigation</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'connections'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">My Connections</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('find')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'find'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Search className="h-5 w-5" />
                  <span className="font-medium">Find People</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === 'recommended'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Recommended</span>
                </button>
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