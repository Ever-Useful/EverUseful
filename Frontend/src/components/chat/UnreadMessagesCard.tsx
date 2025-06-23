import { useState } from "react";
import { MessageSquare, X, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


interface UnreadMessage {
  id: string;
  sender: string;
  avatar: string;
  preview: string;
  time: string;
  unreadCount: number;
  fullMessage: string;
}

export const UnreadMessagesCard = (): JSX.Element => {
  const [selectedMessage, setSelectedMessage] = useState<UnreadMessage | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Sample unread messages data
  const unreadMessages: UnreadMessage[] = [
    {
      id: "1",
      sender: "John Doe",
      avatar: "JD",
      preview: "Hey, are we still meeting tomorrow?",
      time: "10:30 AM",
      unreadCount: 3,
      fullMessage: "Hey, are we still meeting tomorrow? I need to confirm my schedule for the afternoon."
    },
    {
      id: "2",
      sender: "Sarah Smith",
      avatar: "SS",
      preview: "I've sent you the documents...",
      time: "Yesterday",
      unreadCount: 1,
      fullMessage: "I've sent you the documents for review. Please let me know if you need any changes."
    },
    {
      id: "3",
      sender: "Team Updates",
      avatar: "TU",
      preview: "Weekly team meeting moved to...",
      time: "Mar 15",
      unreadCount: 5,
      fullMessage: "Weekly team meeting moved to Thursday at 2 PM due to client availability."
    }
  ];

  const handleMessageClick = (message: UnreadMessage): void => {
    setSelectedMessage(message);
    setIsPopupOpen(true);
  };

  const closePopup = (): void => {
    setIsPopupOpen(false);
    setSelectedMessage(null);
  };

  const handleViewAllChats = (): void => {
    navigate("/chat");
  };

  const totalUnreadCount = unreadMessages.reduce((sum: number, msg) => sum + msg.unreadCount, 0);

  return (
    <div className="relative">
      <Card className="bg-white shadow-lg rounded-xl w-full max-w-md">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="text-blue-600" size={18} />
              Unread Messages
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {totalUnreadCount}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {unreadMessages.map((message: UnreadMessage) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-medium">
                  {message.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-medium truncate">{message.sender}</h4>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                </div>
                {message.unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {message.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button 
            variant="ghost"
            className="w-full text-white bg-blue-500 flex items-center justify-center gap-1 py-2"
            onClick={handleViewAllChats}
          >
            View All Chats <ChevronRight size={16} />
          </Button>
        </div>
      </Card>

      {isPopupOpen && selectedMessage && (
        <Card className="absolute bottom-0 left-0 w-full max-w-sm bg-white shadow-xl rounded-t-lg border border-gray-200 z-10">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-medium">
                {selectedMessage.avatar}
              </div>
              <h3 className="font-medium">{selectedMessage.sender}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={closePopup}
            >
              <X size={16} />
            </Button>
          </div>
          <div className="p-4 max-h-60 overflow-y-auto">
            <div className="bg-blue-50 text-gray-800 p-3 rounded-lg">
              {selectedMessage.fullMessage}
            </div>
          </div>
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a reply..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Send
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};