import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfileStore, StudentProfile } from '@/hooks/useProfileStore';

interface StudentFormProps {
  onComplete: () => void;
}

const StudentForm = ({ onComplete }: StudentFormProps) => {
  const { profile, setProfile, updateProfile } = useProfileStore();
  
  const [formData, setFormData] = useState<Omit<StudentProfile, 'projects'>>({
    userType: 'student',
    name: '',
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
    if (profile?.userType === 'student') {
      setFormData({
        userType: 'student',
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
        college: profile.college,
        degree: profile.degree,
        course: profile.course,
        year: profile.year,
        location: profile.location,
        website: profile.website
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentProfile: StudentProfile = {
      ...formData,
      projects: profile?.userType === 'student' ? profile.projects : []
    };

    if (profile) {
      updateProfile(studentProfile);
    } else {
      setProfile(studentProfile);
    }
    
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Card className="p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Student Profile Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="avatar">Avatar Image URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
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
              <Label htmlFor="college">College/University Name *</Label>
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => handleInputChange('college', e.target.value)}
                required
                placeholder="Enter your institution name"
              />
            </div>
            
            <div>
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                required
                placeholder="e.g., Bachelor of Science"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="course">Course *</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                required
                placeholder="e.g., Computer Science"
              />
            </div>
            
            <div>
              <Label htmlFor="year">Year of Studying *</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
                placeholder="e.g., 3rd Year"
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
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg">
              Continue to Projects
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentForm;