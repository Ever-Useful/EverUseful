import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfileStore, Project } from '@/hooks/useProfileStore';
import { v4 as uuidv4 } from 'uuid';

const ProjectManager = () => {
  const { profile, addProject, updateProject, deleteProject } = useProfileStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    aim: '',
    description: '',
    link: ''
  });

  const projects = profile?.userType === 'student' ? profile.projects : [];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      const newProject: Project = {
        id: uuidv4(),
        ...formData
      };
      addProject(newProject);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', aim: '', description: '', link: '' });
    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      aim: project.aim,
      description: project.description,
      link: project.link
    });
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Manage Projects</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Add New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <Label htmlFor="project-aim">Project Aim *</Label>
                <Input
                  id="project-aim"
                  value={formData.aim}
                  onChange={(e) => handleInputChange('aim', e.target.value)}
                  required
                  placeholder="What is the main goal of this project?"
                />
              </div>
              
              <div>
                <Label htmlFor="project-description">Project Description *</Label>
                <Textarea
                  id="project-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Describe your project in detail..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="project-link">Project Link</Label>
                <Input
                  id="project-link"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder="https://github.com/yourproject"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? 'Update Project' : 'Add Project'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No projects added yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Your First Project</Button>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-gray-600 mb-2"><strong>Aim:</strong> {project.aim}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{project.description}</p>
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Project →
                </a>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;