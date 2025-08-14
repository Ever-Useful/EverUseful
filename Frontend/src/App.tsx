import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { useEffect } from "react";


// Lazy load all pages for code splitting
const Index = React.lazy(() => import("@/pages/Index"));
const SignIn = React.lazy(() => import("@/pages/SignIn"));
const SignUp = React.lazy(() => import("@/pages/SignUp"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const Marketplace = React.lazy(() => import("@/pages/Marketplace"));
const ProductDisplay = React.lazy(() => import("@/pages/ProductDisplay"));
const Cart = React.lazy(() => import("@/pages/Cart"));
const Checkout = React.lazy(() => import("@/pages/Checkout"));
const PaymentSuccess = React.lazy(() => import("@/pages/PaymentSuccess"));
const Chat = React.lazy(() => import("@/pages/Chat"));
const Connections = React.lazy(() => import("@/pages/Connections"));
const Collaborators = React.lazy(() => import("@/pages/Collaborators"));
const Consultation = React.lazy(() => import("@/pages/Consultation"));
const Connect = React.lazy(() => import("@/pages/Connect"));
const Freelancing = React.lazy(() => import("@/pages/Freelancing"));
const FreelancerProfile = React.lazy(() => import("@/pages/FreelancerProfile"));
const StudentProfile = React.lazy(() => import("@/pages/StudentProfile"));
const BussinessProfile = React.lazy(() => import("@/pages/bussinessprofile"));
const BecomeAMentor = React.lazy(() => import("@/pages/BecomeAMentor"));
const FindExpert = React.lazy(() => import("@/pages/FindExpert"));
const NewProject = React.lazy(() => import("@/pages/NewProject"));
const ScheduleMeeting = React.lazy(() => import("@/pages/ScheduleMeeting"));
const AboutUs = React.lazy(() => import("@/pages/AboutUs"));
const Sustainable = React.lazy(() => import("@/pages/Sustainable"));
const AiAgents = React.lazy(() => import("@/pages/AiAgents"));
const Admin = React.lazy(() => import("@/pages/Admin"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

// Policy pages
const PrivacyPolicy = React.lazy(() => import("@/pages/Policy/PrivacyPolicy"));
const TermsConditions = React.lazy(() => import("@/pages/Policy/TermsConditions"));
const CookiePolicy = React.lazy(() => import("@/pages/Policy/CookiePolicy"));
const RefundPolicy = React.lazy(() => import("@/pages/Policy/RefundPolicy"));
const DeliveryPolicy = React.lazy(() => import("@/pages/Policy/DeliveryPolicy"));
const SendFeedback = React.lazy(() => import("@/pages/Policy/SendFeedback"));

// Loading component for better UX
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="text-xl font-semibold text-slate-700 animate-pulse">
      Loading...
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Global scroll restoration component
const GlobalScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <AuthProvider>
    <UserProfileProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          
          <Sonner />
          <BrowserRouter 
            future={{ 
              v7_startTransition: true, 
              v7_relativeSplatPath: true 
            }}
          >
            <GlobalScrollToTop />
            
             <Routes>
            <Route path="/" element={
              <Suspense fallback={null}>
                <Index />
              </Suspense>
            } />
            <Route path="/signin" element={
              <Suspense fallback={<PageLoader />}>
                <SignIn />
              </Suspense>
            } />
            <Route path="/signup" element={
              <Suspense fallback={<PageLoader />}>
                <SignUp />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="/profile" element={
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            } />
            <Route path="/marketplace" element={
              <Suspense fallback={<PageLoader />}>
                <Marketplace />
              </Suspense>
            } />
            <Route path="/product/:id" element={
              <Suspense fallback={<PageLoader />}>
                <ProductDisplay />
              </Suspense>
            } />
            <Route path="/cart" element={
              <Suspense fallback={<PageLoader />}>
                <Cart />
              </Suspense>
            } />
            <Route path="/checkout" element={
              <Suspense fallback={<PageLoader />}>
                <Checkout />
              </Suspense>
            } />
            <Route path="/payment-success" element={
              <Suspense fallback={<PageLoader />}>
                <PaymentSuccess />
              </Suspense>
            } />
            <Route path="/chat" element={
              <Suspense fallback={<PageLoader />}>
                <Chat />
              </Suspense>
            } />
            <Route path="/connections" element={
              <Suspense fallback={<PageLoader />}>
                <Connections />
              </Suspense>
            } />
            <Route path="/collaborators" element={
              <Suspense fallback={<PageLoader />}>
                <Collaborators />
              </Suspense>
            } />
            <Route path="/consulting" element={
              <Suspense fallback={<PageLoader />}>
                <Consultation />
              </Suspense>
            } />
            <Route path="/connect" element={
              <Suspense fallback={<PageLoader />}>
                <Connect />
              </Suspense>
            } />
            <Route path="/freelancing" element={
              <Suspense fallback={<PageLoader />}>
                <Freelancing />
              </Suspense>
            } />
            <Route path="/freelancerprofile" element={
              <Suspense fallback={<PageLoader />}>
                <FreelancerProfile />
              </Suspense>
            } />
            <Route path="/freelancerprofile/:id" element={
              <Suspense fallback={<PageLoader />}>
                <FreelancerProfile />
              </Suspense>
            } />
            <Route path="/studentprofile" element={
              <Suspense fallback={<PageLoader />}>
                <StudentProfile />
              </Suspense>
            } />
            <Route path="/studentprofile/:id" element={
              <Suspense fallback={<PageLoader />}>
                <StudentProfile />
              </Suspense>
            } />
            <Route path="/businessprofile" element={
              <Suspense fallback={<PageLoader />}>
                <BussinessProfile />
              </Suspense>
            } />
            <Route path="/businessprofile/:id" element={
              <Suspense fallback={<PageLoader />}>
                <BussinessProfile />
              </Suspense>
            } />
            <Route path="/become-mentor" element={
              <Suspense fallback={<PageLoader />}>
                <BecomeAMentor />
              </Suspense>
            } />
            <Route path="/findexpert" element={
              <Suspense fallback={<PageLoader />}>
                <FindExpert />
              </Suspense>
            } />
            <Route path="/new-project" element={
              <Suspense fallback={<PageLoader />}>
                <NewProject />
              </Suspense>
            } />
            <Route path="/schedule-meeting" element={
              <Suspense fallback={<PageLoader />}>
                <ScheduleMeeting />
              </Suspense>
            } />
            <Route path="/aboutus" element={
              <Suspense fallback={<PageLoader />}>
                <AboutUs />
              </Suspense>
            } />
            <Route path="/sustainable" element={
              <Suspense fallback={<PageLoader />}>
                <Sustainable />
              </Suspense>
            } />
            <Route path="/aiagents" element={
              <Suspense fallback={<PageLoader />}>
                <AiAgents />
              </Suspense>
            } />
            <Route path="/admin" element={
              <Suspense fallback={<PageLoader />}>
                <Admin />
              </Suspense>
            } />
            
            {/* Policy Routes */}
            <Route path="/privacy-policy" element={
              <Suspense fallback={<PageLoader />}>
                <PrivacyPolicy />
              </Suspense>
            } />
            <Route path="/terms-conditions" element={
              <Suspense fallback={<PageLoader />}>
                <TermsConditions />
              </Suspense>
            } />
            <Route path="/cookie-policy" element={
              <Suspense fallback={<PageLoader />}>
                <CookiePolicy />
              </Suspense>
            } />
            <Route path="/refund-policy" element={
              <Suspense fallback={<PageLoader />}>
                <RefundPolicy />
              </Suspense>
            } />
            <Route path="/delivery-policy" element={
              <Suspense fallback={<PageLoader />}>
                <DeliveryPolicy />
              </Suspense>
            } />
            <Route path="/sendfeedback" element={
              <Suspense fallback={<PageLoader />}>
                <SendFeedback />
              </Suspense>
            } />
            
            <Route path="*" element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </UserProfileProvider>
  </AuthProvider>
);

export default App;
