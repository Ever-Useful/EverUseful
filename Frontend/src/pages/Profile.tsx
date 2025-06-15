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
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Profile = () => {
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );
  const [profileData, setProfileData] = useState({
    name: "Alex Rivera",
    title: "Digital Creator & Entrepreneur",
    bio: "Passionate about technology, design, and creating meaningful connections. Building the future one project at a time.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  });
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

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
                <img src={profileData.avatar} alt={profileData.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover justify-center flex items-center " />
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
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg flex items-center mb-1.5 ">{profileData.name}</h1>
                <p className="text-xl text-slate-200 drop-shadow-md">{profileData.title}</p>
                <div className="mt-4">
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
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">12K</div>
              <div className="text-sm text-slate-600">Followers</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">850</div>
              <div className="text-sm text-slate-600">Following</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">45</div>
              <div className="text-sm text-slate-600">Projects</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">2.5K</div>
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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum explicabo dignissimos voluptatum perferendis pariatur aperiam culpa ab? Nostrum earum recusandae consectetur in corrupti, exercitationem labore dolore? Quos numquam cum soluta animi sapiente, ullam quam eveniet molestiae laborum maiores pariatur doloribus dicta adipisci. Repellat, optio asperiores.</p>
            </Card>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">Recent Projects</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full mt-2 p-2 bg-white rounded-lg shadow-md">
                {/* Recent Projects */}
                <RecentProjects />
              </DropdownMenuContent>
            </DropdownMenu>

    

            {/* Social Links
            <SocialLinks socialLinks={socialLinks} /> */}
          </div>

          {/* Right Column - Quick Actions and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <QuickActions />
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">Skills</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full mt-2 p-2 bg-white rounded-lg shadow-md">
                {/* Skills Section */}
                <SkillsSection />
              </DropdownMenuContent>
            </DropdownMenu>


             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">Recent Activity</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full mt-2 p-2 bg-white rounded-lg shadow-md">
                 {/* Recent Activity */}
                <RecentActivity />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
)};
export default Profile;