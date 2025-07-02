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
      className={`${
        primary || status
          ? '!bg-[#10b981] !text-white border-0'
          : 'bg-white dark:bg-gray-800 dark:border-gray-700'
      } transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-[#059669] cursor-pointer relative overflow-hidden rounded-xl glass-effect`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            } ${isHovered ? 'animate-pulse' : ''}`} />
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

        {/* Hover Graph Overlay with improved padding */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center transition-all duration-300 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-full h-36">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-3">
                7-day trend
              </p>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hoverData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(17 24 39)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    />
                    {segments.map((segment, index) => (
                      <Line 
                        key={index}
                        type="monotone" 
                        dataKey="value" 
                        data={segment.data}
                        stroke={segment.color}
                        strokeWidth={2}
                        dot={false}
                        connectNulls={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;