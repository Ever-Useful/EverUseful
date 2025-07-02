import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  primary?: boolean;
  status?: boolean;
  onClick: () => void;
  hoverData: Array<{ name: string; value: number }>;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  primary = false,
  status = false,
  onClick,
  hoverData
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Create segments for the line chart with different colors based on trend
  const createSegments = (data: Array<{ name: string; value: number }>) => {
    const segments = [];
    for (let i = 0; i < data.length - 1; i++) {
      const current = data[i];
      const next = data[i + 1];
      const isDecline = next.value < current.value;
      
      segments.push({
        data: [current, next],
        color: isDecline ? "#ef4444" : "#16a34a" // red for decline, green for increase
      });
    }
    return segments;
  };

  const segments = createSegments(hoverData);

  return (
    <Card 
      className={`border-0 shadow-lg ${
        primary || status
          ? '!bg-[#10b981] !text-white'
          : 'bg-white dark:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-medium ${
            primary 
              ? 'text-white' 
              : 'text-gray-600 dark:text-gray-300'
          }`}>
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${
              primary 
                ? 'text-white' 
                : 'text-gray-400 dark:text-gray-500'
            }`} />
            <BarChart3 className={`w-4 h-4 ${
              primary 
                ? 'text-white' 
                : 'text-gray-400 dark:text-gray-500'
            }`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className={`text-3xl font-bold ${
            primary ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            {value}
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-3 h-3 ${
              primary 
                ? 'text-white' 
                : status 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span className={`text-xs ${
              primary 
                ? 'text-white' 
                : status 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-500 dark:text-gray-400'
            }`}>
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;