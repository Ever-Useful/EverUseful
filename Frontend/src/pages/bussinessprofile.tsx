import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Chatbot } from "@/components/Chatbot"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Award, TrendingUp, BookOpen, Briefcase, Settings, Home, Bell, Search } from "lucide-react"

const BussinessProfile = () => {
  const userProjects = [
    {
      title: "AI Healthcare Assistant",
      status: "Active",
      progress: 85,
      collaborators: 4,
      category: "Healthcare",
    },
    {
      title: "Sustainable Energy Monitor",
      status: "Completed",
      progress: 100,
      collaborators: 6,
      category: "Green Tech",
    },
    {
      title: "Blockchain Voting System",
      status: "In Review",
      progress: 90,
      collaborators: 3,
      category: "Blockchain",
    },
  ]

  const achievements = [
    { title: "Innovation Pioneer", description: "Led 5+ groundbreaking projects", icon: Award },
    { title: "Collaboration Master", description: "Successfully worked with 50+ team members", icon: User },
    { title: "Impact Creator", description: "Projects reached 10K+ users", icon: TrendingUp },
    { title: "Knowledge Sharer", description: "Mentored 20+ junior developers", icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-20 bg-gray-900 min-h-screen flex flex-col items-center py-8 space-y-8 border-r border-gray-800">
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
            <Home className="w-5 h-5 text-gray-300" />
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
            <Settings className="w-5 h-5 text-gray-300" />
          </div>
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors">
            <Bell className="w-5 h-5 text-gray-300" />
          </div>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-gray-900" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-900 text-white">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">John Doe</span>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Profile</h1>
              <p className="text-gray-400 text-sm">View all your profile details here.</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  {/* Banner Image */}
                  <div
                    className="h-40 w-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80')",
                      backgroundBlendMode: "overlay",
                      backgroundColor: "rgba(17, 24, 39, 0.7)",
                    }}
                  >
                    <div className="flex justify-end p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-900/50 border-gray-600 text-white hover:bg-gray-800"
                      >
                        Add Picture
                      </Button>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-6 relative">
                    {/* Profile Picture - Positioned to overlap the banner */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <Avatar className="w-40 h-40 border-4 border-gray-800 shadow-lg">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
                          <AvatarFallback className="text-3xl">JD</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Name and Edit Button - Positioned below the profile picture */}
                    <div className="text-center mt-24 mb-4">
                      <h2 className="text-2xl font-semibold mb-1">John Doe</h2>
                      <p className="text-green-400 text-sm mb-4">Premium User</p>

                      <Button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
                        <User className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Bio & Details */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-6">Bio & other details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Role</p>
                        <p className="text-white">AI Researcher & Innovation Lead</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My 3 Favorite Artists</p>
                        <p className="text-white">Ninho, Travis Scott, Metro Boomin</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">The Software or Equipment I Use</p>
                        <p className="text-white">Ableton</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My City or Region</p>
                        <p className="text-white">San Francisco, USA</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Badges</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700">Top Collaborator</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Experience Level</p>
                        <p className="text-white">Intermediate</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Favorite Music Genre</p>
                        <p className="text-white">Trap</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">My Preferred Music Mood</p>
                        <p className="text-white">Melancholic</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Availability</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-400 text-sm">Available for Collaboration</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-1">Tags</p>
                        <p className="text-white">#Drill, #Melancholic, #Trap-US</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Sections */}
            <div className="mt-8 space-y-4">
              {/* My Productions Dropdown */}
              <details className="bg-gray-800 rounded-lg">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold">My Productions</h3>
                  </div>
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="p-4 border-t border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">Title</th>
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">Timing</th>
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">No. of Recordings</th>
                          <th className="text-left py-3 text-gray-400 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userProjects.map((project, index) => (
                          <tr key={index} className="border-b border-gray-700/50">
                            <td className="py-4">
                              <div>
                                <p className="text-white font-medium">{project.title}</p>
                                <Badge className="mt-1 bg-green-600 text-white text-xs">{project.status}</Badge>
                              </div>
                            </td>
                            <td className="py-4 text-gray-300">{project.progress}% Complete</td>
                            <td className="py-4 text-gray-300">{project.collaborators}</td>
                            <td className="py-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>

              {/* Achievements Dropdown */}
              <details className="bg-gray-800 rounded-lg">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold">Achievements</h3>
                  </div>
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="p-4 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <achievement.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm">{achievement.title}</h4>
                          <p className="text-gray-400 text-xs">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              {/* Projects Dropdown */}
              <details className="bg-gray-800 rounded-lg">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold">Projects</h3>
                  </div>
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="p-4 border-t border-gray-700">
                  <div className="space-y-4">
                    {userProjects.map((project, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{project.title}</h4>
                          <Badge className="bg-green-600 text-white text-xs">{project.status}</Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">Category: {project.category}</p>
                        <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: project.progress + '%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{project.progress}% Complete</span>
                          <span className="text-gray-300">{project.collaborators} collaborators</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Chatbot />
    </div>
  )
}

export default BussinessProfile