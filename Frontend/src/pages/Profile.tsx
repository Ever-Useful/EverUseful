import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import BackgroundUpload from "@/components/BackgroundUpload";
import RecentProjects from "@/components/RecentProjects";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import SkillsSection from "@/components/Skillssection";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserData({});
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        setLoading(false);
      } else {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No user data found");
            setUserData({});
          }
        } catch (err) {
          console.error("Error fetching user data", err);
          setUserData({});
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-xl font-semibold text-slate-700 animate-pulse">
          Loading your profile...
        </div>
      </div>
    );
  }

  const fullName =
    `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Unnamed User";

  const profile = isLoggedIn
    ? {
        name: fullName,
        title: userData.title || "New Member",
        bio: userData.bio || "This is a new profile. Update your bio!",
        avatar: userData.avatar || "",
        stats: {
          followers: 0,
          following: 0,
          projects: 0,
          likes: 0,
        },
      }
    : {
        name: "Guest",
        title: "Digital Creator & Entrepreneur",
        bio: "Passionate about technology, design, and creating meaningful connections. Building the future one project at a time.",
        avatar: "",
        stats: {
          followers: 12,
          following: 850,
          projects: 45,
          likes: 2.5,
        },
      };

  const handleBackgroundChange = (newImageUrl: string) => {
    setBackgroundImage(newImageUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Background */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <BackgroundUpload onBackgroundChange={handleBackgroundChange} />

        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 rounded-md bg-transparent my-[99px] py-[34px] px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={profile.avatar}
                    alt={profile.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-xl flex items-center justify-center">
                    {profile.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors">
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold drop-shadow-lg mb-1.5">{profile.name}</h1>
                <p className="text-xl text-slate-200 drop-shadow-md">{profile.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10">
        <Card className="p-4 shadow-lg border-0 backdrop-blur-sm bg-blue-50">
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Followers" value={`${profile.stats.followers}K`} />
            <StatCard label="Following" value={profile.stats.following} />
            <StatCard label="Projects" value={profile.stats.projects} />
            <StatCard label="Likes" value={`${profile.stats.likes}K`} />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 shadow-lg border-0 bg-[#f0ebe3]/70 rounded-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">About Me</h2>
              <p className="text-slate-600 leading-relaxed text-lg">{profile.bio}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl">
                  Contact Me
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 shadow-md hover:bg-slate-50"
                >
                  Download CV
                </Button>
              </div>
            </Card>
            {/* Render blank RecentProjects for new users */}
            <RecentProjects />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            {/* Empty skills and activity sections for new users */}
             <SkillsSection />
            <RecentActivity />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-center group cursor-pointer">
    <div className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
      {value}
    </div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);

export default Profile;
