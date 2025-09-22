import { Message } from "./ChatLayout";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: Message;
  avatar: string;
  senderName: string;
}

export const MessageBubble = ({ message, avatar, senderName }: MessageBubbleProps) => {
  const isMe = message.sender === "me";

  const bubbleAlignment = isMe ? "flex-row-reverse" : "flex-row";
  const bubbleStyles = isMe
    ? "bg-blue-600 text-white rounded-br-none"
    : "bg-white text-foreground rounded-bl-none";

  return (
    <div className={cn("flex items-start gap-3 mb-4", bubbleAlignment)}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={senderName} />
        <AvatarFallback>{senderName.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className={cn("rounded-lg px-3 py-2 max-w-[75%] shadow-sm", bubbleStyles)}>
        <p className="text-sm break-words">{message.text}</p>
        <p className={cn("text-xs text-right mt-1", isMe ? "text-blue-100" : "text-muted-foreground")}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};