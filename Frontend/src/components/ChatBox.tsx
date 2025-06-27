import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Star } from "lucide-react";
import NoUserProfile from "@/assets/images/no user profile.png";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'freelancer';
  timestamp: Date;
}

interface ChatBoxProps {
  freelancerName: string;
  freelancerImage: string;
}

export const ChatBox = ({ freelancerName, freelancerImage }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-blue-100 text-slate-700 shadow-lg h-96 flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-400">
          <img 
            src={freelancerImage} 
            alt={freelancerName}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = NoUserProfile;
            }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-slate-700">{freelancerName}</h3>
          </div>
          <Button size="sm" variant="ghost" className="text-slate-700 p-1">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-slate-700 text-sm py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-slate-700" />
              <p>Start a conversation with {freelancerName}</p>
              <p className="text-xs mt-1">Send a message to get started</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-400 pt-3">
          <div className="flex space-x-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-orange-500 hover:to-orange-800 px-4"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};