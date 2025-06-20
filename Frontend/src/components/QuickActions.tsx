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
import { doc, setDoc, collection, query, where, getDocs, addDoc, updateDoc, increment, orderBy } from 'firebase/firestore';

import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SuccessAnimation from './SuccessAnimation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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

  const [showProjectDialog, setShowProjectDialog] = useState(false);
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
      console.log('No user found, cannot create project');
      toast.error('Please sign in to start a project');
      return;
    }

    console.log('Current user:', user.uid);

    if (!projectData.title || !projectData.description || !projectData.category) {
      console.log('Missing required fields:', projectData);
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const projectDataToSave = {
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        tags: projectData.tags.split(',').map(tag => tag.trim()),
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        status: 'Planning',
        progress: 0,
        collaborators: 0,
        githubLink: projectData.githubLink || '',
        projectLink: projectData.projectLink || '',
        imageUrl: projectData.imageUrl || '',
      };

      console.log('Saving project data:', projectDataToSave);

      // Create project in Firestore
      const projectRef = await addDoc(collection(db, 'projects'), projectDataToSave);
      console.log('Project created with ID:', projectRef.id);
      
      // Update user's project count
      await updateDoc(doc(db, 'users', user.uid), {
        'stats.projects': increment(1)
      });
      console.log('Updated user project count');
      
      // Add activity
      // await addActivity(
      //   user.uid,
      //   'project',
      //   `Created new project: ${projectData.title}`
      // );
      
      // Reset form data
      setProjectData({
        title: '',
        description: '',
        category: '',
        tags: '',
        projectLink: '',
        githubLink: '',
        imageUrl: '',
      });
      
      // Close dialog and show success message
      setShowProjectDialog(false);
      toast.success('Project created successfully!');
      
      // Show success animation
      setShowMeetingSuccess(true);

      // Force a refresh of the projects list
      const projectsQuery = query(
        collection(db, 'projects'),
        where('createdBy', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(projectsQuery);
      console.log('Refreshed projects list:', snapshot.docs.length, 'projects');
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
      // await incrementFollowing(user.uid);
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
      
      // Add activity
      // await addActivity(
      //   user.uid,
      //   'meeting',
      //   `Scheduled new meeting: ${meetingData.title}`
      // );
      
      // Reset form data
      setMeetingData({
        title: '',
        date: '',
        time: '',
        participants: '',
        meetingId: '',
        meetingLink: '',
      });
      
      // Close dialog and show success message
      setShowMeetingDialog(false);
      toast.success('Meeting scheduled successfully!');
      
      // Show success animation
      setShowMeetingSuccess(true);
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
      label: 'Start Project',
      description: 'Create a new project',
      primary: true,
      dialog: (
        <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
          <DialogTrigger asChild>
            <Button
              id="start-project-trigger"
              className="w-full justify-between p-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <Plus className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Start Project</div>
                  <div className="text-sm opacity-80">Create a new project</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Start a New Project</DialogTitle>
              <DialogDescription>
                Fill in all the details to create your project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[90vh] overflow-y-auto">
              {/* Project Main Info */}
              <div className="grid gap-2">
                <Label htmlFor="project-title">Title</Label>
                <Input id="project-title" placeholder="Enter project title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea id="project-description" placeholder="Describe your project" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-image">Main Image</Label>
                  <input id="project-image" type="file" accept="image/*" className="block w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-images">Gallery Images</Label>
                  <input id="project-images" type="file" accept="image/*" multiple className="block w-full text-sm text-gray-700 border border-gray-300 rounded px-3 py-2" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-category">Category</Label>
                  <Input id="project-category" placeholder="e.g., FinTech" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-price">Price (USD)</Label>
                  <Input id="project-price" type="number" min="0" placeholder="e.g., 1000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-duration">Duration</Label>
                  <Input id="project-duration" placeholder="e.g., 3 months" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-status">Status</Label>
                  <Input id="project-status" placeholder="e.g., Active" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-teamSize">Team Size</Label>
                  <Input id="project-teamSize" type="number" min="1" placeholder="e.g., 5" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-tags">Tags (comma-separated)</Label>
                  <Input id="project-tags" placeholder="e.g., AI, Security, Finance" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-skills">Skills (comma-separated)</Label>
                  <Input id="project-skills" placeholder="e.g., Python, Data Analytics" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-features">Features (comma-separated)</Label>
                  <Input id="project-features" placeholder="e.g., Real-time detection, Automated alerts" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-techStack">Tech Stack (comma-separated)</Label>
                  <Input id="project-techStack" placeholder="e.g., Python, TensorFlow, AWS, React" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-deliverables">Deliverables (comma-separated)</Label>
                  <Input id="project-deliverables" placeholder="e.g., Source code, API documentation" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                Cancel
              </Button>
              <Button>
                Create Project
              </Button>
            </DialogFooter>
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
