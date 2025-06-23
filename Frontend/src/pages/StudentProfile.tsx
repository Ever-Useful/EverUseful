import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Camera, DollarSign, Award, Clock, GraduationCap, UserPlus, BookOpen, Edit, Link, Briefcase, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import BackgroundUpload from "@/components/BackgroundUpload";
// import RecentProjects from "@/components/RecentProjects";
// import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import SkillsSection from "@/components/Skillssection";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnreadMessagesCard } from "@/components/chat/UnreadMessagesCard";

const Profile = () => {
  const navigate = useNavigate();
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

  // Move fetchUserData outside so it can be reused elsewhere
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

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

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
  const handleBackgroundChange = (newImageUrl: string) => {
    setBackgroundImage(newImageUrl);
  };

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
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Main Content */}
          <div className="-translate-x-[30px] lg:col-span-2 space-y-8 max-w-8xl mx-auto px-4 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xl font-bold">$50</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Hourly Rate</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xl font-bold">{profile.stats.projects}+</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Projects</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xl font-bold">5</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Avg Response Time</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <UserPlus className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xl font-bold">{profile.stats.connections}+</div>
                  <div className="text-xs opacity-90 uppercase tracking-wider">Connections</div>
                </CardContent>
              </Card>
            </div>

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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection('About')}
                    className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />
                    Edit
                  </Button>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {displayedText}
                  </p>
                  {shouldTruncate && (
                    <button
                      className="mt-2 text-blue-600 hover:underline text-sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection('About')}
                    className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />
                    Edit
                  </Button>
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
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Course:</span> {item.course}
                          </p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddProject}
                    className="-translate-y-[15px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />
                    Add Project
                  </Button>
                </div>
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
                  {Array.isArray(profile.stats.projects) && profile.stats.projects.length > 0 ? (
                    profile.stats.projects.map((project, index) => (
                      <Card key={project.id || index} className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img
                              src={project.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=200&fit=crop"}
                              alt={project.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-5 md:w-2/3">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.title}</h3>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeleteProject(project.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-gray-600 mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(project.skills || project.tags || []).map((tech, techIndex) => (
                                <Badge key={techIndex} variant="secondary" className="text-xs bg-gray-100">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            <div className="space-y-2">
                              {project.university && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">Institution:</span> {project.university}
                                </p>
                              )}
                              {project.publication && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">Publication:</span> {project.publication}
                                </p>
                              )}
                              {project.award && (
                                <p className="text-sm text-green-600 font-medium">
                                  <Award className="w-4 h-4 inline mr-1" /> {project.award}
                                </p>
                              )}
                              {project.patent && (
                                <p className="text-sm text-blue-600 font-medium">
                                  <Link className="w-4 h-4 inline mr-1" /> {project.patent}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Click "Add Project" to showcase your work.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* sidebar */}
          <div className="-translate-x-[85px] space-y-6">
            {/* Research Interests */}
            <Card className="bg-white shadow-lg rounded-xl max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </span>
                    Research Skills & Technical Expertise
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSection('About')}
                    className="-translate-y-[20px] translate-x-[15px] text-purple-600 text-sm hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Edit className="w-2 h-2 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profile.stats.skills && profile.stats.skills.length > 0 ? (
                    profile.stats.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg"
                      >
                        {skill}
                      </Badge>
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