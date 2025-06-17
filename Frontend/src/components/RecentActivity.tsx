import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Calendar, Users, Code, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
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
      console.log('No user found in RecentActivity');
      setLoading(false);
      return;
    }

    console.log('Setting up activities listener for user:', user.uid);

    // Query activities for the current user
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Received activities update. Changes:', snapshot.docChanges().length);
        console.log('Total activities:', snapshot.docs.length);
        
        const activitiesData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Activity data:', data);
          return {
            id: doc.id,
            type: data.type,
            message: data.message,
            time: data.time,
            color: getActivityColor(data.type),
            icon: getActivityIcon(data.type)
          };
        });
        
        console.log('Processed activities data:', activitiesData);
        setActivities(activitiesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error in activities listener:', error);
        if (error.code === 'failed-precondition') {
          toast.error('Activities are being indexed. Please try again in a few minutes.');
        } else {
          toast.error('Failed to load activities');
        }
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      console.log('Cleaning up activities listener');
      unsubscribe();
    };
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
      const activitiesRef = collection(db, 'activities');
      const q = query(activitiesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      toast.success('Activities cleared successfully');
    } catch (error) {
      console.error('Error clearing activities:', error);
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
    </div>
  );
};

export default RecentActivity;