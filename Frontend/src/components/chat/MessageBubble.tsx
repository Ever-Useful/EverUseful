import { cn } from "@/lib/utils";
import type { Message } from "./ChatLayout";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isMe = message.sender === "me";

  return (
    <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm",
          isMe
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-purple-600 text-white rounded-bl-md border border-gray-200"
        )}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p
          className={cn(
            "text-xs mt-1",
            isMe ? "text-green-100" : "text-white"
          )}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};