import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileStore, UserType } from '@/hooks/useProfileStore';
import StudentForm from '@/components/StudentForm';
import ProfessorForm from '@/components/ProfessorForm';
import EnterpriseForm from '@/components/EnterpriseForm';
import ProjectManager from '@/components/ProjectManager';
import PaperManager from '@/components/PaperManager';
import ProductManager from '@/components/ProductManager';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Building2, Star, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState<'profile' | 'content'>('profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Load from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Load from backend to get complete profile
            try {
              const userService = (await import('@/services/userService')).userService;
              const backendData = await userService.getUserProfile();
              
              // Merge Firestore and backend data
              const completeProfile = {
                ...userData,
                ...backendData.profile,
                studentData: backendData.studentData
              };
              
              setProfile(completeProfile as any);
            } catch (backendError) {
              console.error('Failed to load backend data:', backendError);
              // Fallback to Firestore data only
              setProfile(userData as any);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileComplete = () => {
    setCurrentStep('content');
  };

  const handleSaveAndExit = () => {
    navigate('/profile');
  };

  const renderProfileForm = () => {
    if (!profile) return null;
    
    switch (profile.userType) {
      case 'student':
        return <StudentForm onComplete={handleProfileComplete} />;
      case 'professor':
        return <ProfessorForm onComplete={handleProfileComplete} />;
      case 'enterprise':
        return <EnterpriseForm onComplete={handleProfileComplete} />;
      default:
        return null;
    }
  };

  const renderContentManager = () => {
    if (!profile) return null;
    
    try {
      switch (profile.userType) {
        case 'student':
          return <ProjectManager />;
        case 'professor':
          return <PaperManager />;
        case 'enterprise':
          return <ProductManager />;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering content manager:', error);
      return (
        <div className="max-w-6xl mx-auto px-8 py-12">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">Error loading content manager</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </Card>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 to-purple-300">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-left">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg group-hover:scale-110 transition-all duration-300 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  AMOGH
                </span>
                <span className="text-xs text-slate-500 -mt-1">ever useful</span>
              </div>
              <Badge variant="secondary" className="hidden w-10 h-6 text-sm px-1 sm:inline-flex animate-pulse bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">Beta</Badge>
            </Link>
          </div>
          <h1 className="text-2xl font-medium text-slate-600 text-lg">Edit Profile</h1>
          <div className="flex items-center gap-4">
            {currentStep === 'content' && (
              <Button className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base"
                variant="outline" 
                onClick={() => setCurrentStep('profile')}
              >
                Back
              </Button>
            )}
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white text-base" onClick={handleSaveAndExit}>
              Save & Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div>
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex justify-center items-center gap-8">
            <div className={`flex items-center gap-2 ${currentStep === 'profile' ? 'text-blue-600' : 'text-black'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'profile' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                1
              </div>
              <span>Profile Details</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'content' ? 'text-blue-600' : 'text-black'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'content' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                2
              </div>
              <span>Manage Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentStep === 'profile' && renderProfileForm()}
      {currentStep === 'content' && renderContentManager()}
    </div>
  );
};

export default EditProfile;