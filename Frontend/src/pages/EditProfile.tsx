import { useState } from 'react';
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

const EditProfile = () => {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfileStore();
  const [selectedUserType, setSelectedUserType] = useState<UserType>(profile?.userType || 'student');
  const [currentStep, setCurrentStep] = useState<'type' | 'profile' | 'content'>('type');

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    setCurrentStep('profile');
  };

  const handleProfileComplete = () => {
    setCurrentStep('content');
  };

  const handleSaveAndExit = () => {
    navigate('/profile');
  };

  const renderUserTypeSelection = () => (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Select Your Profile Type</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Card 
            className="p-6 cursor-pointer rounded-3xl hover:shadow-lg transition-all border-2 hover:border-cyan-500"
            onClick={() => handleUserTypeSelect('student')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"><BookOpen /></span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Student</h3>
              <p className="text-gray-600">Undergrad, Grad, or PhD Students</p>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer rounded-3xl hover:shadow-lg transition-all border-2 hover:border-pink-500"
            onClick={() => handleUserTypeSelect('professor')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"><Star /></span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professor</h3>
              <p className="text-gray-600">Academic researcher or educator</p>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer rounded-3xl hover:shadow-lg transition-all border-2 hover:border-emerald-500"
            onClick={() => handleUserTypeSelect('enterprise')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"><Building2 /></span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-600">Company or Organization</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderProfileForm = () => {
    switch (selectedUserType) {
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
    switch (selectedUserType) {
      case 'student':
        return <ProjectManager />;
      case 'professor':
        return <PaperManager />;
      case 'enterprise':
        return <ProductManager />;
      default:
        return null;
    }
  };

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
            {currentStep !== 'type' && (
              <Button className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all duration-300 text-base"
                variant="outline" 
                onClick={() => setCurrentStep(currentStep === 'content' ? 'profile' : 'type')}
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
          <div className="flex justify-around items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep === 'type' ? 'text-blue-600' : 'text-black'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'type' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                1
              </div>
              <span>Select Type</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'profile' ? 'text-blue-600' : 'text-black'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'profile' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                2
              </div>
              <span>Profile Details</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'content' ? 'text-blue-600' : 'text-black'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'content' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                3
              </div>
              <span>Manage Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentStep === 'type' && renderUserTypeSelection()}
      {currentStep === 'profile' && renderProfileForm()}
      {currentStep === 'content' && renderContentManager()}
    </div>
  );
};

export default EditProfile;