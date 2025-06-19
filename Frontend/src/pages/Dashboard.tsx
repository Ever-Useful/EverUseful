import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


import StatsCards from "@/components/dashboard/StatsCards";


export type UserType = 'student' | 'professor' | 'enterprise';

const Dashboard = () => {
  const [userType, setUserType] = useState<UserType>('student');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* <Sidebar userType={userType} /> */}
      <div className="flex-1 flex flex-col">
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Plan, prioritize, and accomplish your tasks with ease.</p>
              </div>
              
            </div>
            
            <StatsCards userType={userType} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
            </div>
            

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;