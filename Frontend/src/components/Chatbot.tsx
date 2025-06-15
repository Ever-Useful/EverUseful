import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Sparkles, Zap } from "lucide-react";
import { PopupMenu } from "./PopupMenu";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopupMenu, setShowPopupMenu] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm AMOGH AI Assistant ✨ How can I help you explore our platform today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    "Tell me about projects",
    "How to join community?",
    "Freelancing opportunities",
    "Career guidance"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    handleSendMessage();
  };

  const handleChatbotClick = () => {
    setShowPopupMenu(true);
  };

  const getBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("project")) {
      return "🚀 Our marketplace features 2,500+ innovative projects in AI, Blockchain, HealthTech, and more! You can browse, collaborate, or submit your own ideas. Would you like me to show you trending projects?";
    } else if (lowerMessage.includes("community") || lowerMessage.includes("join")) {
      return "🌟 Join our thriving community of 25K+ innovators! Connect through discussion forums, attend workshops, find mentors, and get recognition for your contributions. Ready to connect?";
    } else if (lowerMessage.includes("freelance") || lowerMessage.includes("work")) {
      return "💼 Discover amazing freelancing opportunities with global teams! Browse projects, showcase your skills, and collaborate on cutting-edge innovations. What type of work interests you?";
    } else if (lowerMessage.includes("career") || lowerMessage.includes("job")) {
      return "🎯 Explore 500+ career opportunities with innovative companies! From AI research to blockchain development, find your dream role. Check out our career section!";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "🤝 I'm here to guide you through AMOGH! Ask me about projects, community, careers, or anything else. How can I make your journey smoother?";
    } else {
      return "✨ That's interesting! I can help you navigate our platform, find opportunities, connect with the community, or answer any questions about AMOGH. What would you like to explore?";
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Button */}
        {!isOpen && (
          <Button
            onClick={handleChatbotClick}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-slow relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-gradient-shift"></div>
            <MessageCircle className="w-7 h-7 text-white relative z-10" />
            <Sparkles className="w-4 h-4 text-white absolute top-2 right-2 animate-ping" />
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-96 h-[600px] bg-gradient-to-br from-slate-900 via-purple-900/50 to-blue-900/50 border-purple-500/30 shadow-2xl backdrop-blur-lg relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 animate-gradient-shift"></div>
            
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
              <CardTitle className="text-white flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 animate-pulse">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold">AMOGH Assistant</div>
                  <div className="text-xs text-white/80">Always here to help ✨</div>
                </div>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-[calc(600px-80px)] relative">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-slate-900/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-4"
                          : "bg-white/90 text-slate-800 mr-4 border border-white/20"
                      } shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.sender === "bot" && (
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mt-1">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {message.sender === "user" && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/90 p-4 rounded-2xl mr-4 backdrop-blur-sm border border-white/20">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Replies */}
              {messages.length === 1 && (
                <div className="px-4 py-2 border-t border-white/10">
                  <div className="text-xs text-white/70 mb-2">Quick options:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-900/50 to-purple-900/20 backdrop-blur-sm">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* PopupMenu Component */}
      <PopupMenu 
        isOpen={showPopupMenu}
        onClose={() => setShowPopupMenu(false)}
        title="Get Started with AMOGH"
        formType="login"
      />
    </>
  );
};