
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign, Shield, Settings, Eye, Edit, Trash2 } from "lucide-react";

const Admin = () => {
  const stats = [
    { title: "Total Users", value: "75,234", change: "+12%", icon: Users },
    { title: "Active Projects", value: "2,540", change: "+8%", icon: TrendingUp },
    { title: "Revenue", value: "$1.2M", change: "+15%", icon: DollarSign },
    { title: "Platform Security", value: "99.9%", change: "+0.1%", icon: Shield }
  ];

  const recentActivity = [
    { user: "Sarah Chen", action: "Created new AI project", time: "2 min ago", type: "create" },
    { user: "Mike Johnson", action: "Completed payment", time: "5 min ago", type: "payment" },
    { user: "Lisa Wang", action: "Joined sustainable team", time: "8 min ago", type: "join" },
    { user: "David Brown", action: "Updated profile", time: "12 min ago", type: "update" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage and monitor the AMOGH platform</p>
        </div>

        {/* Login Section */}
        <Card className="mb-8 bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Admin Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Admin Email" className="bg-gray-700 border-gray-600 text-white" />
              <Input type="password" placeholder="Admin Password" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
              Authenticate Admin Access
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800/60 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-green-400 text-sm">{stat.change} from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-gray-800/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{activity.user}</p>
                      <p className="text-gray-400 text-sm">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={activity.type === 'payment' ? 'default' : 'outline'}>
                        {activity.type}
                      </Badge>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
                <Eye className="w-4 h-4 mr-2" />
                View All Users
              </Button>
              <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Manage Projects
              </Button>
              <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Platform Settings
              </Button>
              <Button className="w-full justify-start bg-red-600 hover:bg-red-700 text-white">
                <Trash2 className="w-4 h-4 mr-2" />
                Moderate Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
