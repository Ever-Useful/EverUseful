import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { UserType } from "@/pages/Dashboard";

interface StatsCardsProps {
  userType: UserType;
}

const StatsCards = ({ userType }: StatsCardsProps) => {
  const getStatsData = () => {
    switch (userType) {
      case 'student':
        return [
          { title: "Total Projects", value: "18", change: "Increased from last month", primary: true },
          { title: "Completed", value: "12", change: "Increased from last month" },
          { title: "In Progress", value: "4", change: "Increased from last month" },
          { title: "Sold", value: "2", change: "On Discuss", status: true },
        ];
      case 'professor':
        return [
          { title: "Total Sessions", value: "8", change: "Increased from last month", primary: true },
          { title: "Active Students", value: "156", change: "Increased from last month" },
          { title: "Projects Reviews", value: "24", change: "Increased from last month" },
          { title: "Pending Reviews", value: "12", change: "On Discuss", status: true },
        ];
      case 'enterprise':
        return [
          { title: "Total Deals", value: "24", change: "Increased from last month", primary: true },
          { title: "Past Deals", value: "10", change: "Increased from last month" },
          { title: "Ongoing deals", value: "12", change: "Increased from last month" },
          { title: "Inventory", value: "2", change: "Projects", status: true },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.primary ? 'bg-green-600 text-white' : 'bg-white'} transition-all hover:shadow-lg`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium ${stat.primary ? 'text-green-100' : 'text-gray-600'}`}>
                {stat.title}
              </h3>
              <TrendingUp className={`w-4 h-4 ${stat.primary ? 'text-green-200' : 'text-gray-400'}`} />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold">{stat.value}</p>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-3 h-3 ${stat.primary ? 'text-green-200' : 'text-green-600'}`} />
                <span className={`text-xs ${stat.primary ? 'text-green-200' : stat.status ? 'text-green-600' : 'text-gray-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;