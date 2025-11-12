import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MoreVertical, MessageSquare } from "lucide-react";
import { Conversation, Message } from "./ChatLayout";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";
import chatBackground from "@/assets/images/chatbg.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatAreaProps {
  conversation?: Conversation;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onHeaderClick: () => void;
}

export const ChatArea = ({
  conversation,
  messages,
  onSendMessage,
  onHeaderClick,
}: ChatAreaProps) => {
  const [messageText, setMessageText] = useState("");

  const userAvatar = "https://picsum.photos/seed/currentUser/150";
  const userName = "Me";

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };
  
  // --- Functions moved inside the component ---
  const handleBlock = () => {
    if (!conversation) return;
    alert(`${conversation.name} has been blocked.`);
  };

  const handleReport = () => {
    if (!conversation) return;
    alert(`${conversation.name} has been reported.`);
  };

  const chatBackgroundStyle = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${chatBackground})`,
    backgroundSize: 'cover',
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-slate-50">
        <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-lg">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <Card className="flex-1 h-full flex flex-col rounded-none border-0">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-background">
        <div className="flex items-center cursor-pointer" onClick={onHeaderClick}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>{conversation.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="font-semibold text-foreground">{conversation.name}</p>
            <p className={cn("text-sm", conversation.online ? "text-green-500" : "text-gray-500")}>
              {conversation.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onHeaderClick}>View Contact</DropdownMenuItem>
            <DropdownMenuItem>Search</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-background">Clear Chat</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:bg-red-50 focus:text-red-600"
              onClick={handleReport}
            >
              Report
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:bg-red-50 focus:text-red-600"
              onClick={handleBlock}
            >
              Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4" style={chatBackgroundStyle}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            avatar={msg.sender === 'me' ? userAvatar : conversation.avatar}
            senderName={msg.sender === 'me' ? userName : conversation.name}
          />
        ))}
      </CardContent>

      <CardFooter className="p-4 border-t bg-background">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
