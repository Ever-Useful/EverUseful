import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { UserType } from "@/pages/Dashboard";

interface ProjectProgressProps {
  userType: UserType;
}

const ProjectProgress = ({ userType }: ProjectProgressProps) => {
  const data = [
    { name: 'Completed', value: 41, color: '#16a34a' },
    { name: 'In Progress', value: 35, color: '#3b82f6' },
    { name: 'Pending', value: 24, color: '#f59e0b' },
  ];

  const getTitle = () => {
    switch (userType) {
      case 'student': return "Project Progress";
      case 'professor': return "Mentoring Progress";
      case 'enterprise': return "Ongoing Deals";
      default: return "Project Progress";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">41%</p>
            <p className="text-sm text-gray-600">
              {userType === 'student' ? 'Assignments' : userType === 'professor' ? 'Courses' : 'Projects'} Completed
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;