import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfileStore, EnterpriseProfile } from '@/hooks/useProfileStore';

interface EnterpriseFormProps {
  onComplete: () => void;
}

const EnterpriseForm = ({ onComplete }: EnterpriseFormProps) => {
  const { profile, setProfile, updateProfile } = useProfileStore();
  
  const [formData, setFormData] = useState<Omit<EnterpriseProfile, 'products'>>({
    userType: 'enterprise',
    name: '',
    bio: '',
    avatar: '',
    location: ''
  });

  useEffect(() => {
    if (profile?.userType === 'enterprise') {
      setFormData({
        userType: 'enterprise',
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
        location: profile.location
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const enterpriseProfile: EnterpriseProfile = {
      ...formData,
      products: profile?.userType === 'enterprise' ? profile.products : []
    };

    if (profile) {
      updateProfile(enterpriseProfile);
    } else {
      setProfile(enterpriseProfile);
    }
    
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Card className="p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Enterprise Profile Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Company/Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter your company name"
              />
            </div>
            
            <div>
              <Label htmlFor="avatar">Logo Image URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => handleInputChange('avatar', e.target.value)}
                placeholder="https://example.com/logo.jpg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio/Tagline *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              required
              placeholder="Describe your company and what you do..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-white text-base" type="submit" size="lg">
              Continue to Products/Services
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EnterpriseForm;