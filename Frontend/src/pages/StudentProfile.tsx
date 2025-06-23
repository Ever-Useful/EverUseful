import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera, DollarSign, Award, Clock, GraduationCap, UserPlus, BookOpen, Edit, Link, Briefcase, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import RecentActivity from "@/components/RecentActivity";
import SkillsSection from "@/components/Skillssection";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnreadMessagesCard } from "@/components/chat/UnreadMessagesCard";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
  );
  const [editSection, setEditSection] = useState('');
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

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

  // Fetch user data by id from Firestore
  const fetchUserData = async () => {
    if (id) {
      try {
        const userRef = doc(db, "users", id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData({});
        }
      } catch (err) {
        setUserData({});
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-100">
  //       <div className="text-xl font-semibold text-slate-700 animate-pulse">
  //         Loading your profile...
  //       </div>
  //     </div>
  //   );
  // }

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
          connections: 1500,
          skills: userData.skills || [],  
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
          connections: 1500,
        skills: userData.skills || [],  
        },
      };

  const MAX_LENGTH = 200;
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = profile.bio && profile.bio.length > MAX_LENGTH;
  const displayedText = shouldTruncate && !isExpanded
    ? profile.bio.slice(0, MAX_LENGTH) + "..."
    : profile.bio;

  const handleEditSection = (section: string) => {
    setEditSection(section);
    setShowEditProfile(true);
  };
  
  const academicBackground = [
    {
      degree: userData.degree || "Bachelor's Degree",
      institution: userData.college || "University",
      year: userData.year || "2020 - 2024",
      course: userData.course || "Computer Science",
    }
  ];

  
  const handleAddProject = () => {
    setShowMyProjects(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

  //   try {
  //     const user = auth.currentUser;
  //     if (!user) {
  //       toast.error("You must be logged in to delete a project.");
  //       return;
  //     }
  //     const token = await user.getIdToken();

  //     const response = await fetch(`http://localhost:3000/api/marketplace/projects/${projectId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "Failed to delete project.");
  //     }

  //     toast.success("Project deleted successfully!");
  //     fetchUserData(); // Refresh the project list
  //   } catch (error) {
  //     toast.error(error.message);
  //     console.error("Error deleting project:", error);
  //   }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 rounded-md bg-transparent my-[99px] py-[34px] px-[23px]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="relative">
                <Avatar className="w-36 h-36 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-3xl flex items-center justify-center">
                    {profile.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "NA"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold drop-shadow-lg mb-1.5">{profile.name}</h1>
                <p className="text-xl text-slate-200 drop-shadow-md">{profile.title}</p>
                {/* Connect Button */}
                <div className="flex flex-row items-center justify-between mt-4">
                  <div className="flex flex-col w-[200px] h-12 items-center justify-around gap-2 text-gray-200 bg-gray-100/20 rounded-2xl">
                    <button className="flex items-center gap-2 text-white drop-shadow-md text-lg">
                      <UserPlus className="w-6 h-6" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profile.stats.projects}+</div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
            <CardContent className="p-4 text-center">
              <UserPlus className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profile.stats.connections}+</div>
              <div className="text-xs opacity-90 uppercase tracking-wider">Connections</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </span>
                    About
                  </h2>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">{displayedText}</p>
                  {shouldTruncate && (
                    <button className="mt-2 text-blue-600 hover:underline text-sm" onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Academic Background */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-blue-100 p-2 rounded-lg mr-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </span>
                    Academic Background
                  </h2>
                </div>
                <div className="space-y-6">
                  {academicBackground.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-blue-500" />
                        </div>
                        {index < academicBackground.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.degree}</h3>
                        <p className="text-gray-600">{item.institution} • {item.year}</p>
                        {item.course && (
                          <p className="text-sm text-gray-500 mt-1"><span className="font-medium">Course:</span> {item.course}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Portfolio Section */}
            <Card className="bg-white shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </span>
                    Research Projects & Commercial Work
                  </h2>
                </div>
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
                  {/* Render projects if available, else show call to action */}
                  <div className="text-center py-20">
                    <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Click "Add Project" to showcase your work.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Section */}
            <Card className="bg-white shadow-lg rounded-xl max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </span>
                    Research Skills & Technical Expertise
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profile.stats.skills && profile.stats.skills.length > 0 ? (
                    profile.stats.skills.map((skill: string, index: number) => (
                      <Badge key={index} className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet. Click edit to add your skills.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <UnreadMessagesCard />
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