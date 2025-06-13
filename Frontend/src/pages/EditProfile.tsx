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
      <Card className="p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Select Your Profile Type</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
            onClick={() => handleUserTypeSelect('student')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Student</h3>
              <p className="text-gray-600">Perfect for students showcasing their academic journey and projects</p>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-500"
            onClick={() => handleUserTypeSelect('professor')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professor</h3>
              <p className="text-gray-600">Ideal for educators sharing their research and publications</p>
            </div>
          </Card>
          
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-500"
            onClick={() => handleUserTypeSelect('enterprise')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-600">Great for businesses showcasing products and services</p>
            </div>
          </Card>
        </div>
      </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Edit Profile</h1>
          <div className="flex items-center gap-4">
            {currentStep !== 'type' && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(currentStep === 'content' ? 'profile' : 'type')}
              >
                Back
              </Button>
            )}
            <Button onClick={handleSaveAndExit}>
              Save & Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep === 'type' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span>Select Type</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className={`flex items-center gap-2 ${currentStep === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span>Profile Details</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className={`flex items-center gap-2 ${currentStep === 'content' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'content' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
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