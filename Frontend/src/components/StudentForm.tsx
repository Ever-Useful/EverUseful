import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfileStore, StudentProfile } from '@/hooks/useProfileStore';
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface StudentFormProps {
  onComplete: () => void;
}

const StudentForm = ({ onComplete }: StudentFormProps) => {
  const { profile, setProfile, updateProfile } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState<Omit<StudentProfile, 'projects'>>({
    userType: 'student',
    name: '',
    lastName: '',
    bio: '',
    avatar: '',
    college: '',
    degree: '',
    course: '',
    year: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load data from Firestore (name and lastName)
        if (profile?.userType === 'student') {
          const user = auth.currentUser;
          if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              // Load data from backend (other student details)
              const userService = (await import('@/services/userService')).userService;
              try {
                const backendData = await userService.getUserProfile();
                
                setFormData({
                  userType: 'student',
                  name: userData.name || '',
                  lastName: userData.lastName || '',
                  bio: backendData.profile?.bio || '',
                  avatar: userData.avatar || '',
                  college: backendData.studentData?.college || '',
                  degree: backendData.studentData?.degree || '',
                  course: backendData.studentData?.course || '',
                  year: backendData.studentData?.year || '',
                  location: backendData.profile?.location || '',
                  website: backendData.profile?.website || ''
                });
              } catch (backendError) {
                console.error('Failed to load backend data:', backendError);
                // Fallback to Firestore data only
                setFormData({
                  userType: 'student',
                  name: userData.name || '',
                  lastName: userData.lastName || '',
                  bio: userData.bio || '',
                  avatar: userData.avatar || '',
                  college: userData.college || '',
                  degree: userData.degree || '',
                  course: userData.course || '',
                  year: userData.year || '',
                  location: userData.location || '',
                  website: userData.website || ''
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user logged in");
      }

      // Split the name into first and last name for Firestore
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Update Firestore with first and last name
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        lastName: lastName,
        updatedAt: new Date().toISOString()
      });

      // Prepare data for backend (excluding first/last name)
      const backendProfileData = {
        bio: formData.bio,
        college: formData.college,
        degree: formData.degree,
        course: formData.course,
        year: formData.year,
        location: formData.location,
        website: formData.website,
        userType: formData.userType
      };

      // Update backend with other details
      const userService = (await import('@/services/userService')).userService;
      await userService.updateProfile(backendProfileData);

      // Update local state
      const studentProfile: StudentProfile = {
        ...formData,
        projects: profile?.userType === 'student' ? profile.projects : []
      };

      if (profile) {
        updateProfile(studentProfile);
      } else {
        setProfile(studentProfile);
      }

      toast.success("Profile updated successfully");
      onComplete();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <Card className="p-8 shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Card className="p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Student Profile Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">First Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              required
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="college">College/University *</Label>
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => handleInputChange('college', e.target.value)}
                required
                placeholder="Enter your college/university name"
              />
            </div>

            <div>
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                required
                placeholder="e.g., Bachelor's, Master's, PhD"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="course">Course/Major *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                required
                placeholder="Enter your course or major"
              />
            </div>

            <div>
              <Label htmlFor="year">Year of Study *</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
                placeholder="e.g., 1st Year, 2nd Year"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your location"
              />
            </div>

            <div>
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://your-website.com"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentForm;