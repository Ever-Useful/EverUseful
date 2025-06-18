import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Github, ExternalLink, Calendar, Tag, Trash2 } from 'lucide-react';
import { auth, db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { format } from 'date-fns';
import { decrementProjects } from '@/lib/stats';

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
}

const RecentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      console.log('No user found in RecentProjects, cannot fetch projects');
      setLoading(false);
      return;
    }

    console.log('Setting up projects listener for user:', user.uid);

    // Query projects created by the current user with server-side sorting
    const q = query(
      collection(db, 'projects'),
      where('createdBy', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Received projects update. Changes:', snapshot.docChanges().length);
        console.log('Total projects found:', snapshot.docs.length);
        
        snapshot.docChanges().forEach(change => {
          console.log('Change type:', change.type);
          console.log('Document ID:', change.doc.id);
          console.log('Document data:', change.doc.data());
        });

        const projectsData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Processing project:', data);
          return {
            id: doc.id,
            ...data
          };
        }) as Project[];
        
        console.log('Final processed projects data:', projectsData);
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error in projects listener:', error);
        if (error.code === 'failed-precondition') {
          toast.error('Projects are being indexed. Please try again in a few minutes.');
        } else {
          toast.error('Failed to load projects');
        }
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      console.log('Cleaning up projects listener');
      unsubscribe();
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      await decrementProjects(user.uid);
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
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
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recent Projects
          </h2>
          <Button
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => {
              const trigger = document.getElementById('start-project-trigger');
              if (trigger) {
                (trigger as HTMLButtonElement).click();
              }
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Start your journey by creating your first project</p>
          <Button
            onClick={() => {
              const trigger = document.getElementById('start-project-trigger');
              if (trigger) {
                (trigger as HTMLButtonElement).click();
              }
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Create Your First Project
          </Button>
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
        <Button
          variant="outline"
          className="text-blue-600 hover:text-blue-700"
          onClick={() => {
            const trigger = document.getElementById('start-project-trigger');
            if (trigger) {
              (trigger as HTMLButtonElement).click();
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start gap-4">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {project.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.projectLink && (
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(project.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default RecentProjects;