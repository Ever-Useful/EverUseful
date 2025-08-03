import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Calendar, Clock, Users, Trash2 } from 'lucide-react';
// Removed Firestore imports - using DynamoDB now
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/firebase';

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
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Meetings</h2>
      <div className="text-center py-8 text-gray-500">
        Meeting fetching disabled.
      </div>
    </div>
  );
};

export default YourMeetings; 