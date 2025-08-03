import { useState } from "react";
import { ConversationList } from "./ConversationList";
import { ChatArea } from "./ChatArea";

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar: string;
  online: boolean;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "me" | "other";
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    lastMessage: "Hey! How's the project going?",
    timestamp: "2 min ago",
    unread: true,
    avatar: "SJ",
    online: true,
  },
  {
    id: "2",
    name: "Team Updates",
    lastMessage: "Meeting scheduled for tomorrow at 3 PM",
    timestamp: "1 hour ago",
    unread: true,
    avatar: "TU",
    online: false,
  },
  {
    id: "3",
    name: "Alex Chen",
    lastMessage: "Thanks for the quick response!",
    timestamp: "3 hours ago",
    unread: false,
    avatar: "AC",
    online: true,
  },
  {
    id: "4",
    name: "Design Team",
    lastMessage: "New mockups are ready for review",
    timestamp: "Yesterday",
    unread: false,
    avatar: "DT",
    online: false,
  },
  {
    id: "5",
    name: "Michael Rodriguez",
    lastMessage: "Let's catch up this weekend",
    timestamp: "2 days ago",
    unread: false,
    avatar: "MR",
    online: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hey! How's the project going?",
      timestamp: "2:30 PM",
      sender: "other",
    },
    {
      id: "2",
      text: "It's going really well! We're making great progress on the UI components.",
      timestamp: "2:32 PM",
      sender: "me",
    },
    {
      id: "3",
      text: "That's awesome! Can't wait to see the final result.",
      timestamp: "2:33 PM",
      sender: "other",
    },
  ],
  "2": [
    {
      id: "1",
      text: "Meeting scheduled for tomorrow at 3 PM",
      timestamp: "1:15 PM",
      sender: "other",
    },
    {
      id: "2",
      text: "Perfect! I'll be there.",
      timestamp: "1:16 PM",
      sender: "me",
    },
  ],
};

export const ChatLayout = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, unread: false } : conv
      )
    );
  };

  const handleSendMessage = (text: string) => {
    if (!selectedConversation) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "me",
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }));

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: text, timestamp: "now" }
          : conv
      )
    );
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  return (
    <div className="flex h-full bg-white shadow-2xl">
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversation}
        onSelect={handleSelectConversation}
      />
      <ChatArea
        conversation={selectedConv}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};