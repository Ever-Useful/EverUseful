import { Camera } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import SocialLinks from "@/components/SocialLinks";
import { Header } from '@/components/Header';
import BackgroundUpload from "@/components/BackgroundUpload";
import RecentProjects from "@/components/RecentProjects";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import SkillsSection from '@/components/Skillssection';
import InitialsAvatar from '@/components/InitialsAvatar';
import { useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useProfileStore } from "@/hooks/useProfileStore";
import YourMeetings from '@/components/YourMeetings';
import { firestoreService } from "@/services/firestoreService";
import { userService } from '@/services/userService';
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    userType: '',
    bio: '',
    avatar: '',
  });
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    projects: 0,
    likes: 0
  });
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { profile, setProfile } = useProfileStore();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [customUserId, setCustomUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userProfile = await userService.getUserProfile();
      const { auth, profile } = userProfile;
      setProfileData({
        firstName: auth.firstName || '',
        lastName: auth.lastName || '',
        userType: auth.userType ? auth.userType.charAt(0).toUpperCase() + auth.userType.slice(1) : '',
        bio: profile.bio || 'No bio available',
        avatar: profile.avatar || '',
      });
      // Optionally set stats if available
      if (userProfile.stats) {
        setStats({
          followers: userProfile.stats.followersCount || 0,
          following: userProfile.stats.followingCount || 0,
          projects: userProfile.stats.projectsCount || 0,
          likes: userProfile.stats.totalLikes || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (showCamera && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera]);

  useEffect(() => {
    const fetchCustomUserId = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('User not authenticated, skipping customUserId fetch');
          return;
        }
        
        // Wait a bit for authentication to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const firestoreUser = await firestoreService.getCurrentUserData();
        if (firestoreUser && firestoreUser.customUserId) {
          setCustomUserId(firestoreUser.customUserId);
        }
    } catch (error) {
        console.error("Error fetching customUserId:", error);
      }
    };
    
    // Only fetch if user is authenticated
    const user = auth.currentUser;
    if (user) {
      fetchCustomUserId();
    }
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async (imageSrc, cropAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    canvas.width = cropAreaPixels.width;
    canvas.height = cropAreaPixels.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      cropAreaPixels.x,
      cropAreaPixels.y,
      cropAreaPixels.width,
      cropAreaPixels.height,
      0,
      0,
      cropAreaPixels.width,
      cropAreaPixels.height
    );
    return canvas.toDataURL("image/png");
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    setProfileData({ ...profileData, avatar: croppedImage });
    toast.success("Avatar updated successfully!");
    setShowCropper(false);
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 200, 200);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setProfileData({ ...profileData, avatar: dataUrl });
    toast.success("Photo captured successfully!");
    setShowCamera(false);
  };

  const handleRemoveAvatar = () => {
    setProfileData({ ...profileData, avatar: "" });
  };

  const handleBackgroundChange = (newImageUrl) => {
    setBackgroundImage(newImageUrl);
  };
  // const [socialLinks] = useState([{
  //   platform: 'instagram',
  //   username: '@alexrivera',
  //   url: 'https://instagram.com/alexrivera',
  //   icon: Instagram
  // }, {
  //   platform: 'twitter',
  //   username: '@alexrivera',
  //   url: 'https://twitter.com/alexrivera',
  //   icon: Twitter
  // }, {
  //   platform: 'linkedin',
  //   username: 'Alex Rivera',
  //   url: 'https://linkedin.com/in/alexrivera',
  //   icon: Linkedin
  // }, {
  //   platform: 'youtube',
  //   username: 'Alex Rivera',
  //   url: 'https://youtube.com/@alexrivera',
  //   icon: Youtube
  // }, {
  //   platform: 'facebook',
  //   username: 'Alex Rivera',
  //   url: 'https://facebook.com/alexrivera',
  //   icon: Facebook
  // }, {
  //   platform: 'email',
  //   username: 'alex@example.com',
  //   url: 'mailto:alex@example.com',
  //   icon: Mail
  // }]);
 
  // Show loading spinner or skeleton while waiting for auth
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
  
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <Header/>
   {/* Hidden Inputs for File Upload & Camera */}
      <input
        type="file"
        id="upload-avatar"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarChange}
      />
      <input
        type="file"
        id="click-avatar"
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
        onChange={handleAvatarChange}
      />
      {/* Hero Section with Background */}
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${backgroundImage})`
 }}>
 {showCamera && (
  <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center space-y-4 p-4">
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-64 h-64 rounded-lg border-4 border-white object-cover"
    />
    <canvas ref={canvasRef} width={200} height={200} style={{ display: "none" }} />

    <div className="flex space-x-4">
      <Button onClick={handleCapture} className="bg-green-600 text-white hover:bg-green-700">
        Capture Photo
      </Button>
      <Button onClick={() => setShowCamera(false)} variant="outline" className="text-white border-white hover:bg-white/10">
        Cancel
      </Button>
    </div>
  </div>
)}

 {showCropper && (
  <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center space-y-6 p-4">
    <div className="relative w-80 h-80 bg-black">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
    </div>
    <div className="flex gap-4">
      <Button onClick={handleCropDone} className="bg-blue-600 text-white hover:bg-blue-700">
        Set Photo
      </Button>
      <Button variant="outline" onClick={() => setShowCropper(false)} className="text-white border-white hover:bg-white/10">
        Cancel
      </Button>
    </div>
  </div>
)}


        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
          {/* Background Upload Component */}
             {/* Background Upload on Hover */}
           <div className="absolute top-4 right-4 group z-10">
               {/* Hover Icon Button */}
            <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors">
           <Camera className="text-slate-700 w-5 h-5" />
             </button>

               {/* Upload Panel (hidden by default, shows on hover) */}
          <div className="absolute right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <BackgroundUpload onBackgroundChange={handleBackgroundChange} />
          </div>
        </div>

        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 rounded-md bg-transparent my-[99px] py-[34px] px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <InitialsAvatar 
                  firstName={profileData.firstName}
                  lastName={profileData.lastName}
                  size={128}
                  className="w-32 h-32 border-4 border-white shadow-lg"
                />
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors">
                      <Camera className="w-4 h-4 text-slate-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2 rounded-md shadow-lg bg-white space-y-1">
                    <label
                      htmlFor="upload-avatar"
                      className="block px-3 py-1 text-sm text-slate-700 cursor-pointer hover:bg-slate-100 rounded"
                    >
                      Upload Photo
                    </label>
                   <button
                       onClick={() => setShowCamera(true)}
                       className="block w-full text-left px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 rounded">
                        Take Photo
                     </button>

                    <button
                      onClick={handleRemoveAvatar}
                      className="w-full text-left px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Remove Avatar
                    </button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Profile Text */}
              {/* Profile Text */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg flex items-center mb-1.5 ">{`${profileData.firstName} ${profileData.lastName}`.trim()}</h1>
                <p className="text-xl text-slate-200 drop-shadow-md">{profileData.userType}</p>
                <div className="mt-4 w-[280px] flex flex-row justify-between">
                  <Link to="/EditProfile">
                    <Button variant="secondary" size="sm">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
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
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {stats.followers}
              </div>
              <div className="text-sm text-slate-600">Followers</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {stats.following}
              </div>
              <div className="text-sm text-slate-600">Following</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {stats.projects}
              </div>
              <div className="text-sm text-slate-600">Projects</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {stats.likes}
              </div>
              <div className="text-sm text-slate-600">Likes</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Projects */}
            <RecentProjects />

            {/* Your Meetings - Now separate */}
            <YourMeetings />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills Section */}
            <SkillsSection />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
)};
export default Profile;