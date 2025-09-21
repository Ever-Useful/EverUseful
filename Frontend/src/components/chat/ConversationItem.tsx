import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "./ChatLayout";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ConversationItem = ({ conversation, isSelected, onSelect }: ConversationItemProps) => {
  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "flex items-center p-3 cursor-pointer rounded-lg transition-colors",
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.avatar} alt={conversation.name} />
          <AvatarFallback>{conversation.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        {conversation.online && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800">{conversation.name}</p>
          <p className="text-xs text-gray-500">{conversation.timestamp}</p>
        </div>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-600 truncate w-40">{conversation.lastMessage}</p>
          {conversation.unread && (
            <Badge className="bg-blue-500 text-white">New</Badge>
          )}
        </div>
      </div>
    </div>
  );
};