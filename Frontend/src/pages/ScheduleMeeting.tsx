import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

const ScheduleMeeting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '30',
    participants: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
      toast.error('Please sign in to schedule a meeting');
      return;
    }

    if (!date) {
      toast.error('Please select a date for the meeting');
      return;
    }

    setLoading(true);
    try {
      const meetingData = {
        ...formData,
        date: date.toISOString(),
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        status: 'scheduled',
        participants: formData.participants.split(',').map(email => email.trim()),
      };

      // Send meeting data to backend API (DynamoDB)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/users'}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(meetingData)
      });

      if (!response.ok) throw new Error('Failed to schedule meeting');
      
      toast.success('Meeting scheduled successfully!');
      navigate('/meetings');
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Schedule Meeting</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the meeting agenda"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !date && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Participants (comma-separated emails)</Label>
            <Input
              id="participants"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              placeholder="email1@example.com, email2@example.com"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ScheduleMeeting; 