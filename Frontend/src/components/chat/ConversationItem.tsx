import { cn } from "@/lib/utils";
import type { Conversation } from "./ChatLayout";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50",
        isSelected && "bg-green-50 border-r-2 border-blue-600"
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {conversation.avatar}
        </div>
        {conversation.online && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={cn(
            "font-medium text-gray-900 truncate",
            conversation.unread && "font-semibold"
          )}>
            {conversation.name}
          </h3>
          <span className={cn(
            "text-xs text-gray-500",
            conversation.unread && "text-green-600 font-medium"
          )}>
            {conversation.timestamp}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm text-gray-600 truncate",
            conversation.unread && "font-medium text-gray-900"
          )}>
            {conversation.lastMessage}
          </p>
          {conversation.unread && (
            <div className="w-2 h-2 bg-green-600 rounded-full ml-2 flex-shrink-0"></div>
          )}
        </div>
      </div>
    </div>
  );
};