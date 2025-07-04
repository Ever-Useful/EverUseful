import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import StatsCard from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, TrendingUp, DollarSign, Settings, LogOut, BarChart2, Megaphone, Shield, FileWarning, FolderKanban, CheckCircle2, AlertTriangle, UserPlus, UserX, Server, Activity } from "lucide-react";
import { getAdminOverview } from "@/services/userService";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts";

const Admin = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: "-", change: "-", icon: Users },
    { title: "Total Projects", value: "-", change: "-", icon: TrendingUp },
    { title: "Revenue", value: "$1.2M", change: "+15%", icon: DollarSign }
  ]);
  const [userGrowth, setUserGrowth] = useState<number[]>([0,0,0,0,0,0,0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState<string>('all');

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
          { title: "Total Users", value: data.totalUsers, change: "+12%", icon: Users },
          { title: "Total Projects", value: data.totalProjects, change: "+8%", icon: TrendingUp },
          { title: "Revenue", value: "$1.2M", change: "+15%", icon: DollarSign }
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

  // Build line graph data using real backend values for June
  const realUsers = Number(stats.find(s => s.title === 'Total Users')?.value) || 0;
  const realProjects = Number(stats.find(s => s.title === 'Total Projects')?.value) || 0;
  const lineGraphData = [
    { month: 'Jan', users: 0, projects: 0, revenue: 0 },
    { month: 'Feb', users: 0, projects: 0, revenue: 0 },
    { month: 'Mar', users: 0, projects: 0, revenue: 0 },
    { month: 'Apr', users: 0, projects: 0, revenue: 0 },
    { month: 'May', users: 0, projects: 0, revenue: 0 },
    { month: 'Jun', users: realUsers, projects: realProjects, revenue: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        {/* Fixed glassmorphic sidebar */}
        <div className="w-72 h-[90vh] bg-white/80 dark:bg-gray-900/80 glass-effect shadow-2xl rounded-2xl m-8 flex flex-col border border-blue-300/30 backdrop-blur-lg fixed top-8 left-8 z-30" style={{ position: 'fixed', top: 32, left: 32, height: '90vh' }}>
          <div className="flex flex-col items-center py-8 px-4">
            <div className="w-full">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 pl-2">ADMIN MENU</p>
              <nav className="space-y-2">
                {adminActions.map((item) => (
                  <Button key={item.label} className="w-full justify-start gap-3 h-12 text-md font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-[#2563eb] active:bg-[#2563eb] hover:text-white active:text-white cursor-pointer text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-800/80 border-0">
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ml-[23rem]">
          <div className="mb-10 pt-10">
            <h1 className="text-3xl font-extrabold text-blue-600 mb-1">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Manage and monitor the AMOGH platform</p>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect hover-lift rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
                <StatsCard
                  title={stat.title}
                  value={String(stat.value)}
                  change={stat.change}
                  primary={false}
                  status={false}
                  onClick={() => setSelectedStat(selectedStat === stat.title ? 'all' : stat.title)}
                  hoverData={[
                    { name: 'Mon', value: 0 },
                    { name: 'Tue', value: 0 },
                    { name: 'Wed', value: 0 },
                    { name: 'Thu', value: 0 },
                    { name: 'Fri', value: 0 },
                    { name: 'Sat', value: 0 },
                    { name: 'Sun', value: 0 },
                  ]}
                />
              </div>
            ))}
          </div>
          {/* Line graph for admin stats */}
          <div className="glass-effect bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-10 mb-12 border border-blue-300/20 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-blue-600">Platform Growth (Last 6 Months)</h2>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={lineGraphData} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }} labelStyle={{ color: '#2563eb', fontWeight: 600 }} cursor={{ stroke: '#2563eb', strokeWidth: 0.5, opacity: 0.1 }} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                {(selectedStat === 'all' || selectedStat === 'Total Users') && (
                  <>
                    <Area type="monotone" dataKey="users" stroke="#2563eb" fill="url(#colorUsers)" fillOpacity={0.2} dot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} isAnimationActive={true} />
                    <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} name="Users" isAnimationActive={true} />
                  </>
                )}
                {(selectedStat === 'all' || selectedStat === 'Total Projects') && (
                  <Line type="monotone" dataKey="projects" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} name="Projects" isAnimationActive={true} />
                )}
                {(selectedStat === 'all' || selectedStat === 'Revenue') && (
                  <Line type="monotone" dataKey="revenue" stroke="#f59e42" strokeWidth={2} dot={{ r: 4, fill: '#f59e42', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} name="Revenue" isAnimationActive={true} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Moderation & Health Section */}
          <h2 className="text-xl font-bold text-blue-600 mb-4">Moderation & Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {/* System Health Card */}
            <Card className="rounded-2xl glass-effect shadow-lg border-0 bg-white/90 dark:bg-gray-900/80 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-600 text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" />System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemHealth.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color} rounded-full p-1`} />
                    <span className="text-gray-700 dark:text-gray-200 font-medium flex-1">{item.label}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Pending Approvals Card */}
            <Card className="rounded-2xl glass-effect shadow-lg border-0 bg-white/90 dark:bg-gray-900/80 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-600 text-lg font-semibold flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-400" />Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingApprovals.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color} rounded-full p-1`} />
                    <span className="text-gray-700 dark:text-gray-200 font-medium flex-1">{item.label}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Recent Reports Card */}
            <Card className="rounded-2xl glass-effect shadow-lg border-0 bg-white/90 dark:bg-gray-900/80 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-blue-600 text-lg font-semibold flex items-center gap-2"><FileWarning className="w-5 h-5 text-blue-400" />Recent Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReports.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color} rounded-full p-1`} />
                    <span className="text-gray-700 dark:text-gray-200 font-medium flex-1">{item.user}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-300">{item.issue}</span>
                    <span className="text-xs text-gray-400 ml-2">{item.time}</span>
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
    </div>
  );
};

export default Admin;
