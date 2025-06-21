import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Github, ExternalLink, Calendar, Tag, Trash2, Eye, RefreshCw } from 'lucide-react';
import { auth } from "@/lib/firebase";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  progress: number;
  collaborators: number;
  createdAt: string;
  imageUrl?: string;
  description: string;
  githubLink?: string;
  projectLink?: string;
  tags: string[];
  price?: number;
  views?: number;
  likes?: number;
  author?: {
    name: string;
    image?: string;
  };
}

interface RecentProjectsProps {
  refreshTrigger?: number;
}

const RecentProjects = ({ refreshTrigger = 0 }: RecentProjectsProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = auth.currentUser;

  const fetchProjects = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping project fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting to fetch projects for user:', user.uid);
      
      // Get auth token
      const token = await user.getIdToken();
      if (!token) {
        throw new Error('Authentication failed');
      }

      console.log('Got auth token, fetching user profile...');

      // Get user profile to get customUserId
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

      console.log('Got customUserId:', customUserId);

      if (!customUserId) {
        throw new Error('User ID not found');
      }

      // Get user's projects from backend
      console.log('Fetching user projects from backend...');
      const projectsRes = await fetch(`http://localhost:3000/api/users/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!projectsRes.ok) {
        throw new Error('Failed to fetch projects');
      }

      const projectsData = await projectsRes.json();
      console.log('Projects response:', projectsData);
      
      const userProjects = projectsData.data.created || [];

      console.log('User projects IDs:', userProjects);

      if (userProjects.length === 0) {
        console.log('No projects found for user');
        setProjects([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Fetch full project details from marketplace for each project ID
      const fullProjects: Project[] = [];
      for (const projectId of userProjects) {
        try {
          console.log(`Fetching project details for ID: ${projectId}`);
          const projectRes = await fetch(`http://localhost:3000/api/marketplace/projects/${projectId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (projectRes.ok) {
            const projectData = await projectRes.json();
            console.log(`Project ${projectId} data:`, projectData);
            fullProjects.push({
              id: projectData.project.id,
              title: projectData.project.title,
              category: projectData.project.category,
              status: projectData.project.status,
              progress: 100, // Default progress
              collaborators: projectData.project.teamSize || 1,
              createdAt: projectData.project.posted,
              imageUrl: projectData.project.image,
              description: projectData.project.description,
              githubLink: projectData.project.githubLink,
              projectLink: projectData.project.projectLink,
              tags: projectData.project.tags || [],
              price: projectData.project.price,
              views: projectData.project.views || 0,
              likes: projectData.project.likes || 0,
              author: projectData.project.author
            });
          } else {
            console.error(`Failed to fetch project ${projectId}:`, projectRes.status, projectRes.statusText);
          }
        } catch (error) {
          console.error(`Failed to fetch project ${projectId}:`, error);
        }
      }

      console.log('Full projects loaded:', fullProjects);
      setProjects(fullProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Authentication failed');
      }

      // Get user profile to get customUserId
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
        throw new Error('User ID not found');
      }

      console.log(`Deleting project ${projectId} for user ${customUserId}`);

      // Delete project from marketplace
      const res = await fetch(`http://localhost:3000/api/marketplace/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ customUserId })
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Project deleted successfully:', result);
        setProjects(prev => prev.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recent Projects
          </h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          Loading projects...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Recent Projects
        </h2>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-4">
            <Plus className="w-12 h-12 mx-auto text-gray-300" />
          </div>
          <p className="text-lg font-medium text-gray-600 mb-2">No projects yet</p>
          <p className="text-sm text-gray-500">Create your first project to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(project.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{project.category}</span>
                    </div>
                    {project.price && (
                      <div className="font-medium text-green-600">
                        ${project.price}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{project.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>❤️ {project.likes || 0} likes</span>
                    </div>
                  </div>

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {project.githubLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(project.githubLink, '_blank')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                  {project.projectLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(project.projectLink, '_blank')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default RecentProjects;