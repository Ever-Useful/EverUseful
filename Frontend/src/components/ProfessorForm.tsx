import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfileStore, ProfessorProfile } from '@/hooks/useProfileStore';

interface ProfessorFormProps {
  onComplete: () => void;
}

const ProfessorForm = ({ onComplete }: ProfessorFormProps) => {
  const { profile, setProfile, updateProfile } = useProfileStore();
  
  const [formData, setFormData] = useState<Omit<ProfessorProfile, 'papers'>>({
    userType: 'professor',
    name: '',
    bio: '',
    avatar: '',
    institution: '',
    department: '',
    experience: ''
  });

  useEffect(() => {
    if (profile?.userType === 'professor') {
      setFormData({
        userType: 'professor',
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
        institution: profile.institution,
        department: profile.department,
        experience: profile.experience
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const professorProfile: ProfessorProfile = {
      ...formData,
      papers: profile?.userType === 'professor' ? profile.papers : []
    };

    if (profile) {
      updateProfile(professorProfile);
    } else {
      setProfile(professorProfile);
    }
    
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Card className="p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Professor Profile Information</h2>
        
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
              placeholder="Tell us about your academic background and interests..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="institution">Current Institution *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                required
                placeholder="Enter your current institution"
              />
            </div>
            
            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="experience">Years of Experience *</Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              required
              placeholder="e.g., 10 years"
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg">
              Continue to Papers
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfessorForm;