import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Import all pages directly
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Marketplace from "@/pages/Marketplace";
import ProductDisplay from "@/pages/ProductDisplay";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Chat from "@/pages/Chat";
import Connections from "@/pages/Connections";
import Collaborators from "@/pages/Collaborators";
import Consultation from "@/pages/Consultation";
import Connect from "@/pages/Connect";
import Freelancing from "@/pages/Freelancing";
import FreelancerProfile from "@/pages/FreelancerProfile";
import StudentProfile from "@/pages/StudentProfile";
import bussinessprofile from "@/pages/bussinessprofile";
import BecomeAMentor from "@/pages/BecomeAMentor";
import FindExpert from "@/pages/FindExpert";
import NewProject from "@/pages/NewProject";
import ScheduleMeeting from "@/pages/ScheduleMeeting";
// import YourMeetings from "@/pages/YourMeetings";
import AboutUs from "@/pages/AboutUs";
import Sustainable from "@/pages/Sustainable";
import AiAgents from "@/pages/AiAgents";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

// Policy pages
import PrivacyPolicy from "@/pages/Policy/PrivacyPolicy";
import TermsConditions from "@/pages/Policy/TermsConditions";
import CookiePolicy from "@/pages/Policy/CookiePolicy";
import RefundPolicy from "@/pages/Policy/RefundPolicy";
import DeliveryPolicy from "@/pages/Policy/DeliveryPolicy";
import SendFeedback from "@/pages/Policy/SendFeedback";
import BussinessProfile from "@/pages/bussinessprofile";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDisplay />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/freelancing" element={<Freelancing />} />
            <Route path="/freelancer-profile" element={<FreelancerProfile />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/business-profile" element={<BussinessProfile />} />
            <Route path="/become-a-mentor" element={<BecomeAMentor />} />
            <Route path="/find-expert" element={<FindExpert />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
            {/* <Route path="/your-meetings" element={<YourMeetings />} /> */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/sustainable" element={<Sustainable />} />
            <Route path="/ai-agents" element={<AiAgents />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* Policy Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/delivery-policy" element={<DeliveryPolicy />} />
            <Route path="/send-feedback" element={<SendFeedback />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
