import { ChatLayout } from "@/components/chat/ChatLayout";
import Header from "@/components/Header";

const Chat = () => {
  return (
    <div className="h-screen bg-gray-50">
      <Header />
      <div className="pt-14 h-full"> {/* Add padding to account for the fixed header */}
        <ChatLayout />
      </div>
    </div>
  );
};

export default Chat;