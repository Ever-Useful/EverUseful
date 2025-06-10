import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
const RecentActivity = () => {
  const activities = [{
    type: 'collaboration',
    message: 'New collaboration request from TechCorp',
    time: '2 hours ago',
    color: 'bg-blue-500'
  }, {
    type: 'milestone',
    message: 'Project milestone completed',
    time: '1 day ago',
    color: 'bg-green-500'
  }, {
    type: 'profile',
    message: 'Profile viewed by 12 new visitors',
    time: '2 days ago',
    color: 'bg-purple-500'
  }];
  return <div className="space-y-6">
      <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          {activities.map((activity, index) => <div key={index} className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
              <div className="flex-1">
                <p className="text-slate-700 mb-1">{activity.message}</p>
                <p className="text-sm text-slate-500">{activity.time}</p>
              </div>
            </div>)}
        </div>
      </Card>

      {/* Upgrade Card */}
      <Card className="p-6 shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white mx-px my-[23px]">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">⭐ Upgrade to Premium</h3>
          <p className="text-blue-100 mb-4">
            Get unlimited projects, priority support, and exclusive features
          </p>
          <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
            Upgrade Now
          </Button>
        </div>
      </Card>
    </div>;
};
export default RecentActivity;