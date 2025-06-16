import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Calendar, Clock, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  meetingId: string;
  meetingLink: string;
  participants: string[];
  status: string;
  createdBy: string;
  createdAt: string;
}

const YourMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'meetings'),
        where('createdBy', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const meetingsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Meeting[];
          setMeetings(meetingsData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching meetings:', error);
          toast.error('Failed to load meetings');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up meetings listener:', error);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Meetings</h2>
      {meetings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No meetings scheduled yet
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{meeting.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(meeting.date).toLocaleDateString()}
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    {meeting.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Users className="w-4 h-4 mr-1" />
                    {meeting.participants?.length || 0} participants
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {meeting.status}
                </Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Meeting ID:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{meeting.meetingId}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(meeting.meetingId);
                      toast.success('Meeting ID copied to clipboard');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Meeting Link:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                    {meeting.meetingLink}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(meeting.meetingLink);
                      toast.success('Meeting link copied to clipboard');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default YourMeetings; 