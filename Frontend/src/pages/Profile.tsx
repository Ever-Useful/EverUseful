import { Camera, Instagram, Twitter, Linkedin, Youtube, Facebook, Mail } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/SocialLinks";
import BackgroundUpload from "@/components/BackgroundUpload";
import RecentProjects from "@/components/RecentProjects";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import SkillsSection from '@/components/Skillssection';
import { useState } from "react";
import { useProfileStore } from "@/hooks/useProfileStore";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  const { profile } = useProfileStore();
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80');
  const [userData] = useState<any>({});
  const [isLoggedIn] = useState(false);

  // Use profile data from store if available, otherwise use default data
  const [profileData] = useState({
    name: profile?.name || 'Alex Rivera',
    title: profile?.userType === 'student' ? 'Student' : 
           profile?.userType === 'professor' ? 'Professor' : 
           profile?.userType === 'enterprise' ? 'Enterprise' : 'Digital Creator & Entrepreneur',
    bio: profile?.bio || 'Passionate about technology, design, and creating meaningful connections. Building the future one project at a time.',
    avatar: profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    location: profile?.userType === 'student' ? (profile as any)?.location : 
              profile?.userType === 'enterprise' ? (profile as any)?.location : 'London',
    website: profile?.userType === 'student' ? (profile as any)?.website : 'https://github.com',
    projects: profile?.userType === 'student' ? (profile as any)?.projects || [] : []
  });

  const [socialLinks] = useState([{
    platform: 'instagram',
    username: '@alexrivera',
    url: 'https://instagram.com/alexrivera',
    icon: Instagram
  }, {
    platform: 'twitter',
    username: '@alexrivera',
    url: 'https://twitter.com/alexrivera',
    icon: Twitter
  }, {
    platform: 'linkedin',
    username: 'Alex Rivera',
    url: 'https://linkedin.com/in/alexrivera',
    icon: Linkedin
  }, {
    platform: 'youtube',
    username: 'Alex Rivera',
    url: 'https://youtube.com/@alexrivera',
    icon: Youtube
  }, {
    platform: 'facebook',
    username: 'Alex Rivera',
    url: 'https://facebook.com/alexrivera',
    icon: Facebook
  }, {
    platform: 'email',
    username: 'alex@example.com',
    url: 'mailto:alex@example.com',
    icon: Mail
  }]);

  const profileStats = isLoggedIn
    ? {
        name: profileData.name,
        title: profileData.title,
        bio: profileData.bio,
        avatar: userData.avatar || "",
        stats: {
          followers: 0,
          following: 0,
          projects: profileData.projects.length,
          likes: 0,
        },
      }
    : {
        name: profileData.name,
        title: profileData.title,
        bio: profileData.bio,
        avatar: profileData.avatar,
        stats: {
          followers: 12,
          following: 850,
          projects: profile?.userType === 'student' ? (profile as any)?.projects?.length || 45 : 
                   profile?.userType === 'professor' ? (profile as any)?.papers?.length || 25 :
                   profile?.userType === 'enterprise' ? (profile as any)?.products?.length || 12 : 45,
          likes: 2.5,
        },
      };

  const handleBackgroundChange = (newImageUrl: string) => {
    setBackgroundImage(newImageUrl);
  };

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section with Background */}
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${backgroundImage})`
 }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Background Upload Component */}
        <BackgroundUpload onBackgroundChange={handleBackgroundChange} />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 rounded-md bg-transparent my-[99px] py-[34px] px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <img src={profileData.avatar} alt={profileData.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover justify-center flex items-center " />
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors">
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              
              {/* Profile Text */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg flex items-center mb-1.5 ">{profileData.name}</h1>
                <p className="text-xl text-slate-200 drop-shadow-md">{profileData.title}</p>
                {profile && (
                  <div className="mt-4">
                    <Link to="/EditProfile">
                      <Button variant="secondary" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </div>              
            </div>
          </div>
        </div>
      </div>

      {/* Compact Stats Section - positioned near profile */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10">
        <Card className="p-4 shadow-lg border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-xl bg-blue-50">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{profileStats.stats.followers}K</div>
              <div className="text-sm text-slate-600">Followers</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{profileStats.stats.following}</div>
              <div className="text-sm text-slate-600">Following</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{profileStats.stats.projects}</div>
              <div className="text-sm text-slate-600">
                {profile?.userType === 'student' ? 'Projects' : 
                 profile?.userType === 'professor' ? 'Papers' : 
                 profile?.userType === 'enterprise' ? 'Products' : 'Projects'}
              </div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{profileStats.stats.likes}K</div>
              <div className="text-sm text-slate-600">Likes</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Bio, Projects, and Social Links */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <Card className="p-8 shadow-lg border-0 backdrop-blur-sm bg-[#f0ebe3]/70 my-0 mx-0 px-[34px] py-[32px] rounded-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">About Me</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {profileData.bio}</p>
            </Card>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">Toggle Recent Projects</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full mt-2 p-2 bg-white rounded-lg shadow-md">
                {/* Recent Projects */}
                <RecentProjects />
              </DropdownMenuContent>
            </DropdownMenu>

    

            {/* Social Links */}
            <SocialLinks socialLinks={socialLinks} />
          </div>

          {/* Right Column - Quick Actions and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <QuickActions />
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">Toggle Skills</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full mt-2 p-2 bg-white rounded-lg shadow-md">
                {/* Skills Section */}
                <SkillsSection />
              </DropdownMenuContent>
            </DropdownMenu>


             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">Toggle Recent Activity</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full mt-2 p-2 bg-white rounded-lg shadow-md">
                 {/* Recent Activity */}
                <RecentActivity />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>;
};
export default Profile;