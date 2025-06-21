import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, ArrowRight, X } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SuccessAnimation from './SuccessAnimation';

interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
}

interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  images: string;
  category: string;
  price: string;
  duration: string;
  status: string;
  teamSize: string;
  tags: string;
  skills: string;
  features: string;
  techStack: string;
  deliverables: string;
}

interface QuickActionsProps {
  onProjectCreated?: () => void;
}

const QuickActions = ({ onProjectCreated }: QuickActionsProps) => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  const [showProjectSuccess, setShowProjectSuccess] = useState(false);
  const [isPanelAnimating, setIsPanelAnimating] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Project form state with all marketplace.json fields
  const [projectData, setProjectData] = useState<ProjectFormData>({
    title: '',
    description: '',
    image: '',
    images: '',
    category: '',
    price: '',
    duration: '',
    status: 'active',
    teamSize: '',
    tags: '',
    skills: '',
    features: '',
    techStack: '',
    deliverables: '',
  });

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!projectData.title.trim()) {
      errors.title = 'Project title is required';
    }
    
    if (!projectData.description.trim()) {
      errors.description = 'Project description is required';
    }
    
    if (!projectData.category.trim()) {
      errors.category = 'Project category is required';
    }
    
    if (!projectData.price.trim()) {
      errors.price = 'Project price is required';
    } else if (isNaN(Number(projectData.price)) || Number(projectData.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    return projectData.title.trim() && 
           projectData.description.trim() && 
           projectData.category.trim() && 
           projectData.price.trim() && 
           !isNaN(Number(projectData.price)) && 
           Number(projectData.price) >= 0;
  };

  const handleStartProject = async () => {
    if (!user) {
      toast.error('Please sign in to start a project');
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      // Get auth token like the working profile logic
      const token = await user.getIdToken();
      if (!token) {
        toast.error('Authentication failed. Please refresh and try again.');
        setLoading(false);
        return;
      }

      // Get customUserId from backend profile endpoint
      const profileRes = await fetch('http://localhost:3000/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileRes.ok) {
        throw new Error('Failed to get user profile');
      }

      const profileData = await profileRes.json();
      const customUserId = profileData.data.customUserId;

      if (!customUserId) {
        toast.error('User ID not found. Please refresh and try again.');
        setLoading(false);
        return;
      }

      // Prepare payload for backend with all marketplace.json fields
      // All unfilled fields will be set to null or empty arrays
      const payload = {
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        image: projectData.image.trim() || null,
        images: projectData.images.trim() ? projectData.images.split(',').map(img => img.trim()).filter(img => img) : [],
        category: projectData.category.trim(),
        price: Number(projectData.price),
        duration: projectData.duration.trim() || null,
        status: projectData.status,
        posted: new Date().toISOString().split('T')[0],
        teamSize: projectData.teamSize.trim() ? Number(projectData.teamSize) : null,
        tags: projectData.tags.trim() ? projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        skills: projectData.skills.trim() ? projectData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
        features: projectData.features.trim() ? projectData.features.split(',').map(feature => feature.trim()).filter(feature => feature) : [],
        techStack: projectData.techStack.trim() ? projectData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech) : [],
        deliverables: projectData.deliverables.trim() ? projectData.deliverables.split(',').map(delivery => delivery.trim()).filter(delivery => delivery) : [],
        customUserId
      };

      console.log('Creating project with payload:', payload);

      // Create project in backend
      const res = await fetch('http://localhost:3000/api/marketplace/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Project creation response status:', res.status);
      
      if (!res.ok) {
        const err = await res.json();
        console.error('Project creation error:', err);
        throw new Error(err.error || 'Failed to create project');
      }
      
      const { project } = await res.json();
      console.log('Project created successfully:', project);

      // Add project id to user's created projects in userData.json
      console.log('Adding project ID to user profile:', project.id);
      const projectRes = await fetch(`http://localhost:3000/api/users/${customUserId}/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          projectId: project.id,
          projectData: {
            title: project.title,
            description: project.description,
            category: project.category,
            tags: project.tags || [],
            imageUrl: project.image,
            projectLink: project.projectLink,
            githubLink: project.githubLink,
            price: project.price,
            status: project.status,
            posted: project.posted,
            teamSize: project.teamSize,
            skills: project.skills || [],
            features: project.features || [],
            techStack: project.techStack || [],
            deliverables: project.deliverables || []
          }
        })
      });

      console.log('Add project to user profile response status:', projectRes.status);

      if (!projectRes.ok) {
        const errorData = await projectRes.json();
        console.warn('Failed to add project to user profile:', errorData);
      } else {
        console.log('Project added to user profile successfully');
      }

      // Reset form data and errors
      setProjectData({
        title: '',
        description: '',
        image: '',
        images: '',
        category: '',
        price: '',
        duration: '',
        status: 'active',
        teamSize: '',
        tags: '',
        skills: '',
        features: '',
        techStack: '',
        deliverables: '',
      });
      setFormErrors({});
      
      setShowProjectPanel(false);
      toast.success('Project created successfully!');
      setShowProjectSuccess(true);
      
      // Trigger refresh of RecentProjects
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
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
      // Fetch users from backend API instead of Firestore
      const res = await fetch('http://localhost:3000/api/users/admin/all');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const { data: usersData } = await res.json();
      
      // Transform the data to match the expected format
      const transformedUsers = usersData.map((user: any) => ({
        id: user.customUserId,
        name: user.profile?.title || 'Unknown User',
        title: user.profile?.bio || 'No title',
        avatar: user.profile?.avatar || '/default-avatar.png',
        skills: user.skills || []
      }));

      setUsers(transformedUsers);
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
      // Get auth token like the working profile logic
      const token = await user.getIdToken();
      if (!token) {
        toast.error('Authentication failed. Please refresh and try again.');
        return;
      }

      // Use backend API to follow user
      const res = await fetch(`http://localhost:3000/api/users/follow/${userId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success('Connection request sent!');
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Failed to connect');
      }
    } catch (error) {
      console.error('Error connecting with user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send connection request');
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
      action: () => {
        setShowProjectPanel(true);
        setIsPanelAnimating(true);
      },
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
              onClick={handleFindCollaborators}
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
              {action.dialog ? (
                action.dialog
              ) : (
                <Button
                  onClick={action.action}
                  className={`w-full justify-between p-4 h-auto shadow-md hover:shadow-lg transition-all duration-300 ${
                    action.primary
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center">
                    <action.icon className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">{action.label}</div>
                      <div className="text-sm opacity-80">{action.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Right Side Project Creation Panel */}
      {(showProjectPanel || isPanelAnimating) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end transition-all duration-300 ease-in-out">
          <div 
            className={`w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              showProjectPanel ? 'translate-x-0' : 'translate-x-full'
            }`}
            onTransitionEnd={() => {
              if (!showProjectPanel) {
                setIsPanelAnimating(false);
              }
            }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              </div>
              <p className="text-gray-600 mt-2">Fill in all the details to create your project for the marketplace.</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Required Fields Section */}
              <div className="space-y-4">
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-title" className="text-sm font-medium text-gray-700">
                      Project Title *
                    </Label>
                    <Input
                      id="project-title"
                      placeholder="Enter project title"
                      value={projectData.title}
                      onChange={e => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                      className={`mt-1 ${formErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="project-description" className="text-sm font-medium text-gray-700">
                      Description *
                    </Label>
                    <Textarea
                      id="project-description"
                      placeholder="Describe your project in detail"
                      value={projectData.description}
                      onChange={e => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                      className={`mt-1 ${formErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                      rows={4}
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-category" className="text-sm font-medium text-gray-700">
                        Category *
                      </Label>
                      <Input
                        id="project-category"
                        placeholder="e.g., AI & ML, Web Development"
                        value={projectData.category}
                        onChange={e => setProjectData(prev => ({ ...prev, category: e.target.value }))}
                        className={`mt-1 ${formErrors.category ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {formErrors.category && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="project-price" className="text-sm font-medium text-gray-700">
                        Price (USD) *
                      </Label>
                      <Input
                        id="project-price"
                        type="number"
                        min="0"
                        placeholder="e.g., 2500"
                        value={projectData.price}
                        onChange={e => setProjectData(prev => ({ ...prev, price: e.target.value }))}
                        className={`mt-1 ${formErrors.price ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {formErrors.price && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-status" className="text-sm font-medium text-gray-700">
                        Status
                      </Label>
                      <Select
                        value={projectData.status}
                        onValueChange={(value) => setProjectData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="project-teamSize" className="text-sm font-medium text-gray-700">
                        Team Size
                      </Label>
                      <Input
                        id="project-teamSize"
                        type="number"
                        min="1"
                        placeholder="e.g., 5"
                        value={projectData.teamSize}
                        onChange={e => setProjectData(prev => ({ ...prev, teamSize: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="project-duration" className="text-sm font-medium text-gray-700">
                      Duration
                    </Label>
                    <Input
                      id="project-duration"
                      placeholder="e.g., 2 months, 6 weeks"
                      value={projectData.duration}
                      onChange={e => setProjectData(prev => ({ ...prev, duration: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Media & Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-image" className="text-sm font-medium text-gray-700">
                      Main Image URL
                    </Label>
                    <Input
                      id="project-image"
                      placeholder="https://example.com/image.jpg"
                      value={projectData.image}
                      onChange={e => setProjectData(prev => ({ ...prev, image: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-images" className="text-sm font-medium text-gray-700">
                      Gallery Images (comma-separated URLs)
                    </Label>
                    <Textarea
                      id="project-images"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      value={projectData.images}
                      onChange={e => setProjectData(prev => ({ ...prev, images: e.target.value }))}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Technical Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Technical Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-tags" className="text-sm font-medium text-gray-700">
                      Tags (comma-separated)
                    </Label>
                    <Input
                      id="project-tags"
                      placeholder="e.g., AI, Security, Finance, Blockchain"
                      value={projectData.tags}
                      onChange={e => setProjectData(prev => ({ ...prev, tags: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-skills" className="text-sm font-medium text-gray-700">
                      Required Skills (comma-separated)
                    </Label>
                    <Input
                      id="project-skills"
                      placeholder="e.g., Python, Machine Learning, React, Node.js"
                      value={projectData.skills}
                      onChange={e => setProjectData(prev => ({ ...prev, skills: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-techStack" className="text-sm font-medium text-gray-700">
                      Tech Stack (comma-separated)
                    </Label>
                    <Input
                      id="project-techStack"
                      placeholder="e.g., TensorFlow, Python, AWS, Docker, React"
                      value={projectData.techStack}
                      onChange={e => setProjectData(prev => ({ ...prev, techStack: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-features" className="text-sm font-medium text-gray-700">
                      Features (comma-separated)
                    </Label>
                    <Textarea
                      id="project-features"
                      placeholder="e.g., Real-time detection, Automated alerts, API integration"
                      value={projectData.features}
                      onChange={e => setProjectData(prev => ({ ...prev, features: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-deliverables" className="text-sm font-medium text-gray-700">
                      Deliverables (comma-separated)
                    </Label>
                    <Textarea
                      id="project-deliverables"
                      placeholder="e.g., Source code, Documentation, API access, 1 month support"
                      value={projectData.deliverables}
                      onChange={e => setProjectData(prev => ({ ...prev, deliverables: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProjectPanel(false);
                    // The panel will animate out and then isPanelAnimating will be set to false
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartProject}
                  disabled={loading || !isFormValid()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Project..." : "Create Project"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showProjectSuccess && (
        <SuccessAnimation
          isVisible={showProjectSuccess}
          onClose={() => setShowProjectSuccess(false)}
        />
      )}
    </>
  );
};

export default QuickActions;