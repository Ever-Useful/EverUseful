import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Calendar, Users, Code, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
// Removed Firestore imports - using DynamoDB now
import { toast } from 'react-hot-toast';

interface Activity {
  id: string;
  type: 'collaboration' | 'milestone' | 'profile' | 'project' | 'meeting' | 'skill';
  message: string;
  time: string;
  color: string;
  icon: React.ReactNode;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load activities from backend
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // For now, we'll use a simple mock since activities endpoint might not be implemented
        // You can implement this later when you add activities to your backend
        const mockActivities: Activity[] = [
          {
            id: '1',
            type: 'profile',
            message: 'Profile updated successfully',
            time: new Date().toISOString(),
            color: getActivityColor('profile'),
            icon: getActivityIcon('profile')
          }
        ];
        setActivities(mockActivities);
      } catch (error) {
        console.error('Failed to load activities:', error);
        toast.error('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'collaboration':
        return 'bg-blue-500';
      case 'milestone':
        return 'bg-green-500';
      case 'profile':
        return 'bg-purple-500';
      case 'project':
        return 'bg-orange-500';
      case 'meeting':
        return 'bg-pink-500';
      case 'skill':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'collaboration':
        return <Users className="w-4 h-4" />;
      case 'milestone':
        return <Star className="w-4 h-4" />;
      case 'profile':
        return <Users className="w-4 h-4" />;
      case 'project':
        return <Code className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'skill':
        return <Plus className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleClearActivities = async () => {
    if (!user) return;

    try {
      // For now, just clear local state since activities are mocked
      // You can implement this when you add activities to your backend
      setActivities([]);
      toast.success('Activities cleared successfully');
    } catch (error) {
      toast.error('Failed to clear activities');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
          {activities.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleClearActivities}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
        
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 group">
                <div className={`w-3 h-3 rounded-full ${activity.color} mt-2 flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {activity.icon}
                    <p className="text-slate-700">{activity.message}</p>
                  </div>
                  <p className="text-sm text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecentActivity;