import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, Calendar, Users, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface DetailedStatsSectionProps {
  selectedStat: {
    title: string;
    value: string;
    change: string;
    primary?: boolean;
    status?: boolean;
  } | null;
  onClose: () => void;
  userType: 'student' | 'professor' | 'enterprise';
}

const DetailedStatsSection: React.FC<DetailedStatsSectionProps> = ({ 
  selectedStat, 
  onClose, 
  userType 
}) => {
  if (!selectedStat) return null;

  // Generate detailed data based on the selected stat and user type
  const getDetailedData = () => {
    const baseData = [
      { name: 'Jan', value: 20, previous: 15 },
      { name: 'Feb', value: 35, previous: 25 },
      { name: 'Mar', value: 25, previous: 30 },
      { name: 'Apr', value: 45, previous: 35 },
      { name: 'May', value: 60, previous: 40 },
      { name: 'Jun', value: 55, previous: 50 },
    ];

    // Modify data based on stat type and user type
    if (selectedStat.title.includes('Total')) {
      return baseData.map(item => ({
        ...item,
        value: item.value * 1.5,
        previous: item.previous * 1.2
      }));
    }
    
    return baseData;
  };

  const getInsights = () => {
    switch (userType) {
      case 'student':
        return [
          { label: 'Average completion time', value: '4.2 days', icon: Calendar },
          { label: 'Success rate', value: '94%', icon: Target },
          { label: 'Collaborations', value: '12', icon: Users },
        ];
      case 'professor':
        return [
          { label: 'Student engagement', value: '87%', icon: Users },
          { label: 'Average session length', value: '2.5 hrs', icon: Calendar },
          { label: 'Feedback score', value: '4.8/5', icon: Target },
        ];
      case 'enterprise':
        return [
          { label: 'Average deal size', value: '$45K', icon: Target },
          { label: 'Conversion rate', value: '23%', icon: TrendingUp },
          { label: 'Time to close', value: '18 days', icon: Calendar },
        ];
      default:
        return [];
    }
  };

  const detailedData = getDetailedData();
  const insights = getInsights();

  return (
    <div className="animate-fade-in">
      <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Detailed Analytics: {selectedStat.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          {/* Main Chart with improved padding */}
          <div className="h-72">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              6-Month Trend
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={detailedData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    className="dark:stroke-gray-400"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    className="dark:stroke-gray-400"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(17 24 39)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#16a34a" 
                    fill="#16a34a"
                    fillOpacity={0.3}
                    name="Current Period"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#6b7280" 
                    fill="#6b7280"
                    fillOpacity={0.1}
                    name="Previous Period"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <insight.icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {insight.label}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {insight.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Bar Chart with improved padding */}
          <div className="h-60">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Monthly Breakdown
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detailedData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    className="dark:stroke-gray-400"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    className="dark:stroke-gray-400"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(17 24 39)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#16a34a" 
                    radius={[4, 4, 0, 0]}
                    name="Current"
                  />
                  <Bar 
                    dataKey="previous" 
                    fill="#6b7280" 
                    radius={[4, 4, 0, 0]}
                    name="Previous"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedStatsSection;