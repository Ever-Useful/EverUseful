import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Star } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'freelancer';
  timestamp: Date;
}

interface ChatBoxProps {
  freelancerName: string;
  freelancerImage: string;
  freelancerRating: number;
}

export const ChatBox = ({ freelancerName, freelancerImage, freelancerRating }: ChatBoxProps) => {
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
    <Card className="bg-white shadow-lg h-96 flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
          <img 
            src={freelancerImage} 
            alt={freelancerName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{freelancerName}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{freelancerRating}</span>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-500 p-1">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
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
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
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
        <div className="border-t border-gray-200 pt-3">
          <div className="flex space-x-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};