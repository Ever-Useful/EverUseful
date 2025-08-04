import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Marketplace from "./pages/Marketplace";
import Freelancing from "./pages/Freelancing";
import Connect from "./pages/Connect";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import FreelancerProfile from "./pages/FreelancerProfile";
import StudentProfile from "./pages/StudentProfile";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProductDisplay from "./pages/ProductDisplay";
import PaymentSuccess from "./pages/PaymentSuccess";
import NewProject from '@/pages/NewProject';
import Collaborators from '@/pages/Collaborators';
import ScheduleMeeting from '@/pages/ScheduleMeeting';
import { AuthProvider } from '@/contexts/AuthContext';
import About from '@/pages/AboutUs';
import Dashboard from "./pages/Dashboard";
import AiAgents from "./pages/AiAgents";
import FindExpert from "./pages/FindExpert";
import SendFeedback from "./pages/Policy/SendFeedback";
import Chat from "./pages/Chat";
import Sustainable from "./pages/Sustainable";
import Connections from "./pages/Connections";
import Consulting from "./pages/Consultation";
import BussinessProfile from "./pages/bussinessprofile";
// Import new policy pages
import PrivacyPolicy from "./pages/Policy/PrivacyPolicy";
import TermsConditions from "./pages/Policy/TermsConditions";
import CookiePolicy from "./pages/Policy/CookiePolicy";
import DeliveryPolicy from "./pages/Policy/DeliveryPolicy";
import RefundPolicy from "./pages/Policy/RefundPolicy";

import BecomeAMentor from "./pages/BecomeAMentor";
import BecomeMentor from "./pages/BecomeAMentor";


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
            <Route path="/aiagents" element={<AiAgents />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/freelancing" element={<Freelancing />} />
            <Route path="/product/:id" element={<ProductDisplay />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/studentprofile" element={<StudentProfile />} />
            <Route path="/bussinessprofile" element={<BussinessProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/freelancerprofile/:id" element={<FreelancerProfile />} />
            <Route path="/projects/new" element={<NewProject />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/meetings/schedule" element={<ScheduleMeeting />} />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />
            <Route path="/aboutus" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/findexpert" element={<FindExpert />} />
            <Route path="/sendfeedback" element={<SendFeedback />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/sustainable" element={<Sustainable />} />
            <Route path="/connection" element={<Connections />} />
            <Route path="/studentprofile/:id" element={<StudentProfile />} />
            <Route path="/become-mentor" element={<BecomeMentor />} />
            <Route path="/green" element={<Sustainable/>} />
            {/* Policy Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/delivery-policy" element={<DeliveryPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);
//testing
export default App;
