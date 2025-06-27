import { useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ArrowRight, Sparkles, BookOpen, Target, User, Mail, Building2, Star, Eye, EyeOff, Phone } from "lucide-react";
import { Login } from "./Login";
import { Link } from "react-router-dom";

interface PopupMenuProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  formType?: "login";
  redirectPath?: string;
}

export const PopupMenu = ({ 
  isOpen, 
  onClose, 
  title = "Get Started", 
  formType = "login",
  redirectPath = "/profile"
}: PopupMenuProps) => {
  const [currentFormType, setCurrentFormType] = useState<"login">(formType as "login");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const renderForm = () => {
    switch (currentFormType) {
      case "login":
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <Login redirectPath={redirectPath} onSuccess={onClose} />
          </div>
        );
    }
  };

  const renderVectorSide = () => {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full bg-gradient-to-br from-indigo-50 to-blue-100 p-8">

        {/* Main Illustration */}
        <div className="relative mb-8">
          <div className="w-64 h-64 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full flex items-center justify-center relative overflow-hidden">
            {/* Abstract geometric shapes */}
            <div className="absolute top-8 left-8 w-16 h-16 bg-white/30 rounded-lg rotate-12 animate-pulse" />
            <div className="absolute bottom-12 right-12 w-12 h-12 bg-white/40 rounded-full animate-bounce" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <BookOpen className="w-20 h-20 text-white/80" />
            </div>
          </div>
        </div>

        {/* Feature Points */}
        <div className="space-y-4 text-center">
          <div className="flex items-center space-x-3 text-slate-700">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium">Secure Communication</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Research Collaboration</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-700">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium">Academic Impact</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-4xl w-full h-[600px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Login to AMOGH</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in to access your AMOGH account and explore our platform
        </DialogDescription>
        <div className="grid lg:grid-cols-2 h-full">
          {/* Left Side - Form */}
          <div className="bg-white flex flex-col h-full">            
            {renderForm()}
          </div>

          {/* Right Side - Vector Illustration */}
          {renderVectorSide()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Custom animation for floating effect
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;
document.head.appendChild(style);