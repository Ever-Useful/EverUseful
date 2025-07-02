import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, TrendingUp, DollarSign, Settings, LogOut, BarChart2, Megaphone, Shield, FileWarning, FolderKanban, CheckCircle2, AlertTriangle, UserPlus, UserX, Server, Activity } from "lucide-react";
import { getAdminOverview } from "@/services/userService";

const Admin = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: "-", change: "-", icon: Users, color: "bg-blue-100 text-blue-600" },
    { title: "Active Projects", value: "-", change: "-", icon: TrendingUp, color: "bg-indigo-100 text-indigo-600" },
    { title: "Revenue", value: "$1.2M", change: "+15%", icon: DollarSign, color: "bg-green-100 text-green-600" }
  ]);
  const [userGrowth, setUserGrowth] = useState<number[]>([0,0,0,0,0,0,0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin sidebar actions
  const adminActions = [
    { label: "User Management", icon: Users },
    { label: "Project Moderation", icon: FolderKanban },
    { label: "Reports & Issues", icon: FileWarning },
    { label: "Platform Settings", icon: Settings },
    { label: "Announcements", icon: Megaphone },
    { label: "Security & Access", icon: Shield },
    { label: "Logout", icon: LogOut }
  ];

  // Example data for new cards
  const systemHealth = [
    { label: "API", status: "Online", color: "bg-green-100 text-green-700", icon: Server },
    { label: "Database", status: "Online", color: "bg-green-100 text-green-700", icon: Activity },
    { label: "Email", status: "Degraded", color: "bg-yellow-100 text-yellow-700", icon: AlertTriangle },
    { label: "Storage", status: "Online", color: "bg-green-100 text-green-700", icon: CheckCircle2 }
  ];
  const pendingApprovals = [
    { label: "New Users", count: 4, icon: UserPlus, color: "bg-blue-100 text-blue-700" },
    { label: "Projects", count: 2, icon: FolderKanban, color: "bg-indigo-100 text-indigo-700" },
    { label: "Content", count: 1, icon: FileWarning, color: "bg-orange-100 text-orange-700" }
  ];
  const recentReports = [
    { user: "Jane Doe", issue: "Inappropriate content", time: "3m ago", icon: AlertTriangle, color: "bg-red-100 text-red-700" },
    { user: "John Smith", issue: "Spam project", time: "10m ago", icon: FileWarning, color: "bg-yellow-100 text-yellow-700" }
  ];

  useEffect(() => {
    async function fetchAdminStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminOverview();
        setStats([
          { title: "Total Users", value: data.totalUsers, change: "+12%", icon: Users, color: "bg-blue-100 text-blue-600" },
          { title: "Total Projects", value: data.totalProjects, change: "+8%", icon: TrendingUp, color: "bg-indigo-100 text-indigo-600" },
          { title: "Revenue", value: "$1.2M", change: "+15%", icon: DollarSign, color: "bg-green-100 text-green-600" }
        ]);
        setUserGrowth(data.userGrowth || [0,0,0,0,0,0,0]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f8fa] via-[#e9eef5] to-[#f6f8fa]">
      <Header />
      <div className="flex gap-8 px-0 py-8">
        {/* Sidebar - always flush left */}
        <aside className="w-64 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col min-h-[500px] ml-0">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">ADMIN FUNCTIONS</p>
            <nav className="space-y-1">
              {adminActions.map((item) => (
                <Button key={item.label} variant="ghost" className="w-full justify-start gap-3 h-10 text-slate-700 text-md hover:bg-slate-100">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </aside>
        {/* Main Content - centered */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-1">Admin Dashboard</h1>
            <p className="text-slate-500 text-lg">Manage and monitor the AMOGH platform</p>
          </div>
          {/* Platform Overview Section */}
          <h2 className="text-xl font-bold text-slate-700 mb-4">Platform Overview</h2>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading admin stats...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="rounded-2xl shadow-md border border-slate-100 bg-white hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                        <p className="text-3xl font-extrabold text-slate-800 mb-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* User Growth Mini-Chart Card */}
              <Card className="rounded-2xl shadow-md border border-slate-100 bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-slate-500 text-sm font-medium mb-1">User Growth</p>
                      <p className="text-2xl font-bold text-blue-700">+{userGrowth.reduce((a, b) => a + b, 0)}</p>
                    </div>
                    <BarChart2 className="w-7 h-7 text-blue-400" />
                  </div>
                  {/* Mini-chart */}
                  <div className="flex items-end gap-1 h-16 mt-2">
                    {userGrowth.map((val, i) => (
                      <div key={i} className="w-3 rounded bg-blue-200" style={{ height: `${val * 8}px` }} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Last 7 days</p>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Moderation & Health Section */}
          <h2 className="text-xl font-bold text-slate-700 mb-4">Moderation & Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* System Health Card */}
            <Card className="rounded-2xl shadow-md border border-slate-100 bg-white hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-slate-700 text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" />System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemHealth.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color} rounded-full p-1`} />
                    <span className="text-slate-700 font-medium flex-1">{item.label}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Pending Approvals Card */}
            <Card className="rounded-2xl shadow-md border border-slate-100 bg-white hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-slate-700 text-lg font-semibold flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-400" />Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingApprovals.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color} rounded-full p-1`} />
                    <span className="text-slate-700 font-medium flex-1">{item.label}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Recent Reports Card */}
            <Card className="rounded-2xl shadow-md border border-slate-100 bg-white hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-slate-700 text-lg font-semibold flex items-center gap-2"><FileWarning className="w-5 h-5 text-red-400" />Recent Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color} rounded-full p-1`} />
                    <span className="text-slate-700 font-medium flex-1">{item.user}</span>
                    <span className="text-xs text-slate-500">{item.issue}</span>
                    <span className="text-xs text-slate-400 ml-2">{item.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Admin Authentication - now below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="rounded-2xl shadow-md border border-slate-100 bg-white">
              <CardHeader>
                <CardTitle className="text-slate-700 text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Admin Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Input placeholder="Admin Email" className="bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400" />
                  <Input type="password" placeholder="Admin Password" className="bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400" />
                </div>
                <Button className="w-full py-2 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all duration-200">
                  Authenticate Admin Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
