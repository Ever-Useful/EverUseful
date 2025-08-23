import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";
import { ChatbotPopup } from "./ChatbotPopup";

export const Chatbot = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleChatbotClick = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Button - Restored old design */}
        <Button
          onClick={handleChatbotClick}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-slow relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-gradient-shift"></div>
          <MessageCircle className="w-7 h-7 text-white relative z-10" />
          <Sparkles className="w-4 h-4 text-white absolute top-2 right-2 animate-ping" />
        </Button>
      </div>

      {/* Chatbot Popup */}
      <ChatbotPopup 
        isOpen={isPopupOpen}
        onClose={handleClose}
      />
    </>
  );
};