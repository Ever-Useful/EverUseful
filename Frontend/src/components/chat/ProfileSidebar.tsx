import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Ban, AlertTriangle } from "lucide-react";
import { Conversation } from "./ChatLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileSidebarProps {
  conversation: Conversation | undefined;
  onClose: () => void;
}

export const ProfileSidebar = ({ conversation, onClose }: ProfileSidebarProps) => {
  if (!conversation) return null;

  const handleBlock = () => {
    alert(`${conversation.name} has been blocked.`);
  };

  const handleReport = () => {
    alert(`${conversation.name} has been reported.`);
  };

  return (
    <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-[300px] md:w-[350px] bg-white border-l z-40 flex flex-col shadow-lg">
      <header className="flex items-center p-4 border-b bg-slate-50">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5 text-blue-600" />
        </Button>
        <h2 className="ml-4 font-semibold text-lg">Contact Info</h2>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center p-6 border-b">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>{conversation.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <p className="font-semibold text-xl">{conversation.name}</p>
          <p className={cn("text-sm", conversation.online ? "text-green-500" : "text-gray-500")}>
            {conversation.online ? "Online" : "Offline"}
          </p>
        </div>

        <div className="p-4 border-b">
          <p className="text-sm text-gray-500 mb-1">About</p>
          <p className="text-md">Focused on creating beautiful user experiences.</p>
        </div>

        <div className="p-2 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleBlock}
          >
            <Ban className="mr-2 h-4 w-4" />
            Block {conversation.name}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleReport}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report {conversation.name}
          </Button>
        </div>

      </div>
    </div>
  );
};