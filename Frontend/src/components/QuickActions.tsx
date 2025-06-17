import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Calendar, ArrowRight, Upload, Link as LinkIcon, Github } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { incrementFollowing, incrementProjects } from '@/lib/stats';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SuccessAnimation from './SuccessAnimation';

interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
}

interface MeetingData {
  title: string;
  date: string;
  time: string;
  participants: string;
  meetingId: string;
  meetingLink: string;
}

const QuickActions = () => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [date, setDate] = useState<Date>();

  // Project form state
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    projectLink: '',
    githubLink: '',
    imageUrl: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Meeting form state
  const [meetingData, setMeetingData] = useState<MeetingData>({
    title: '',
    date: '',
    time: '',
    participants: '',
    meetingId: '',
    meetingLink: '',
  });

  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [showMeetingSuccess, setShowMeetingSuccess] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `project-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProjectData(prev => ({ ...prev, imageUrl: downloadURL }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleStartProject = async () => {
    if (!user) {
      toast.error('Please sign in to start a project');
      return;
    }

    setLoading(true);
    try {
      const projectDataToSave = {
        ...projectData,
        tags: projectData.tags.split(',').map(tag => tag.trim()),
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        status: 'Planning',
        progress: 0,
        collaborators: 0,
      };

      const projectRef = doc(db, 'projects', Date.now().toString());
      await setDoc(projectRef, projectDataToSave);
      await incrementProjects(user.uid);
      
      setProjectData({
        title: '',
        description: '',
        category: '',
        tags: '',
        projectLink: '',
        githubLink: '',
        imageUrl: '',
      });
      
      // Close the dialog and show success animation
      setShowMeetingDialog(false);
      setShowMeetingSuccess(true);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleFindCollaborators = async () => {
    if (!user) {
      toast.error('Please sign in to find collaborators');
      return;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('type', 'in', ['student', 'professor']));
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleConnect = async (userId: string) => {
    if (!user) {
      toast.error('Please sign in to connect with others');
      return;
    }

    try {
      await incrementFollowing(user.uid);
      toast.success('Connection request sent!');
    } catch (error) {
      console.error('Error connecting with user:', error);
      toast.error('Failed to send connection request');
    }
  };

  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const generateMeetingLink = (meetingId: string) => {
    return `https://meet.google.com/${meetingId}`;
  };

  const handleScheduleMeeting = async () => {
    if (!user) {
      toast.error('Please sign in to schedule a meeting');
      return;
    }

    if (!meetingData.title || !meetingData.date || !meetingData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const meetingId = generateMeetingId();
      const meetingLink = generateMeetingLink(meetingId);
      
      const meetingDataToSave = {
        title: meetingData.title,
        date: meetingData.date,
        time: meetingData.time,
        meetingId,
        meetingLink,
        participants: meetingData.participants ? meetingData.participants.split(',').map(email => email.trim()) : [],
        createdBy: user.uid,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };

      const meetingRef = doc(db, 'meetings', Date.now().toString());
      await setDoc(meetingRef, meetingDataToSave);
      
      // Close the dialog and show success animation
      setShowMeetingDialog(false);
      setShowMeetingSuccess(true);
      
      // Reset the form data
      setMeetingData({
        title: '',
        date: '',
        time: '',
        participants: '',
        meetingId: '',
        meetingLink: '',
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 ||
                         selectedSkills.some(skill => user.skills.includes(skill));
    return matchesSearch && matchesSkills;
  });

  const actions = [
    {
      icon: Plus,
      label: 'Start New Project',
      description: 'Create a new project',
      primary: true,
      dialog: (
        <Dialog open={showMeetingDialog} onOpenChange={setShowMeetingDialog}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="w-full justify-between p-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <Plus className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Start New Project</div>
                  <div className="text-sm opacity-80">Create a new project</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={projectData.title}
                  onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project"
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={projectData.category}
                    onChange={(e) => setProjectData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Web Development, AI, Design"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={projectData.tags}
                    onChange={(e) => setProjectData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., react, typescript, ui-design"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectLink">Project Link</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <LinkIcon className="h-4 w-4" />
                    </span>
                    <Input
                      id="projectLink"
                      value={projectData.projectLink}
                      onChange={(e) => setProjectData(prev => ({ ...prev, projectLink: e.target.value }))}
                      placeholder="https://your-project.com"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Repository</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Github className="h-4 w-4" />
                    </span>
                    <Input
                      id="githubLink"
                      value={projectData.githubLink}
                      onChange={(e) => setProjectData(prev => ({ ...prev, githubLink: e.target.value }))}
                      placeholder="https://github.com/username/repo"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Project Image</Label>
                <div className="flex items-center gap-4">
                  {projectData.imageUrl && (
                    <img
                      src={projectData.imageUrl}
                      alt="Project preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleStartProject}
                disabled={loading || uploadingImage}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      icon: Users,
      label: 'Find Collaborators',
      description: 'Connect with others',
      primary: false,
      dialog: (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between p-4 h-auto border-slate-300 text-slate-700 hover:bg-slate-50 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Find Collaborators</div>
                  <div className="text-sm opacity-80">Connect with others</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Find Collaborators</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or title"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    value={selectedSkills.join(', ')}
                    onChange={(e) => setSelectedSkills(e.target.value.split(',').map(s => s.trim()))}
                    placeholder="Filter by skills (comma-separated)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto">
                {filteredUsers.map(user => (
                  <Card key={user.id} className="p-4 flex items-center gap-4">
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.title}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnect(user.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Connect
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      icon: Calendar,
      label: 'Schedule Meeting',
      description: 'Book a time slot',
      primary: false,
      dialog: (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between p-4 h-auto border-slate-300 text-slate-700 hover:bg-slate-50 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Schedule Meeting</div>
                  <div className="text-sm opacity-80">Book a time slot</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule a Meeting</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule your meeting.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="meeting-title">Meeting Title</Label>
                <Input
                  id="meeting-title"
                  value={meetingData.title}
                  onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
                  placeholder="Enter meeting title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meeting-participants">Participants (Email addresses, comma-separated)</Label>
                <Input
                  id="meeting-participants"
                  value={meetingData.participants}
                  onChange={(e) => setMeetingData({ ...meetingData, participants: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMeetingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleMeeting} disabled={loading}>
                {loading ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <>
      <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
        
        <div className="space-y-3">
          {actions.map((action, index) => (
            <div key={index}>
              {action.dialog}
            </div>
          ))}
        </div>
      </Card>
      
      {showMeetingSuccess && (
        <SuccessAnimation
          isVisible={showMeetingSuccess}
          onClose={() => setShowMeetingSuccess(false)}
        />
      )}
    </>
  );
};

export default QuickActions;
