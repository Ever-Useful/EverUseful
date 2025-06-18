import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import type { UserType } from "@/pages/Dashboard";

interface ProjectAnalyticsProps {
  userType: UserType;
}

const ProjectAnalytics = ({ userType }: ProjectAnalyticsProps) => {
  const data = [
    { name: 'M', value: 20 },
    { name: 'T', value: 45 },
    { name: 'W', value: 60 },
    { name: 'T', value: 35 },
    { name: 'F', value: 25 },
    { name: 'S', value: 15 },
  ];

  const getTitle = () => {
    switch (userType) {
      case 'student': return "Project Contributions";
      case 'professor': return "Course Analytics";
      case 'enterprise': return "Project Analytics";
      default: return "Project Analytics";
    }
  };

  return (
    <Card className="h-80 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              className="text-gray-500 dark:text-gray-400 text-sm"
            />
            <Bar 
              dataKey="value" 
              fill="#16a34a" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProjectAnalytics;