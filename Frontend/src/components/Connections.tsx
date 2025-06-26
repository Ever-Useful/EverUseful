import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, UserPlus } from 'lucide-react';

type Connections = {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  mutualConnections: number;
  isConnected: boolean;
};

interface ConnectionCardProps {
  person: Connections;
  onConnect?: (personId: string) => void;
  onMessage?: (personId: string) => void;
  showConnectButton?: boolean;
}

const Connections = ({ person, onConnect, onMessage, showConnectButton = true }: ConnectionCardProps) => {
  const [isConnected, setIsConnected] = useState(person.isConnected);

  const handleConnect = () => {
    setIsConnected(true);
    onConnect?.(person.id);
  };

  const handleMessage = () => {
    onMessage?.(person.id);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 flex">
        <Avatar className="h-14 w-14">
          <AvatarImage src={person.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-base">
            {person.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-gray-900">{person.name}</h3>
          <p className="text-gray-600 text-xs">{person.title}</p>
          <p className="text-gray-500 text-xs">{person.company}</p>
          {/* <p className="text-gray-400 text-xs mt-1">{person.mutualConnections} mutual connections</p> */}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {showConnectButton && !isConnected && (
          <Button
            onClick={handleConnect}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-base text-white"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Connect
          </Button>
        )}
        
        {(isConnected || !showConnectButton) && (
          <Button
            onClick={handleMessage}
            size="sm"
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 text-base"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </Button>
        )}
      </div>
    </div>
  );
};

export default Connections;