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
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import FreelancerProfile from "./pages/FreelancerProfile";
import ProductDisplay from "./pages/ProductDisplay";
import PaymentSuccess from "./pages/PaymentSuccess";
import NewProject from '@/pages/NewProject';
import Collaborators from '@/pages/Collaborators';
import ScheduleMeeting from '@/pages/ScheduleMeeting';
import { AuthProvider } from '@/contexts/AuthContext';
<<<<<<< HEAD
import About from '@/pages/AboutUs';
=======
>>>>>>> ba84081 (Commit pending changes: update FilterSidebar, add useAuth hook, and add api lib)

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
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/freelancing" element={<Freelancing />} />
            <Route path="/product/:id" element={<ProductDisplay />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/freelancer/:id" element={<FreelancerProfile />} />
            <Route path="/projects/new" element={<NewProject />} />
            <Route path="/collaborators" element={<Collaborators />} />
            <Route path="/meetings/schedule" element={<ScheduleMeeting />} />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />
            <Route path="/aboutus" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
