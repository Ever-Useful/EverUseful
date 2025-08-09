import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X } from 'lucide-react';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import SuccessAnimation from './SuccessAnimation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { API_ENDPOINTS } from '../config/api';
import { DropdownWithOther } from './ui/dropdown-with-other';
import { getDropdownOptions } from '../utils/dropdownUtils';

interface MyProjectsSidebarProps {
  onClose: () => void;
  onProjectCreated?: () => void;
  editMode?: boolean;
  projectToEdit?: any;
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

export const MyProjects: React.FC<MyProjectsSidebarProps> = ({ onClose, onProjectCreated, editMode = false, projectToEdit }) => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [showProjectSuccess, setShowProjectSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

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

  // Pre-fill form if editing
  React.useEffect(() => {
    if (editMode && projectToEdit) {
      setProjectData({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        image: projectToEdit.image || '',
        images: (projectToEdit.images || []).join(', '),
        category: projectToEdit.category || '',
        price: projectToEdit.price ? String(projectToEdit.price) : '',
        duration: projectToEdit.duration || '',
        status: projectToEdit.status || 'active',
        teamSize: projectToEdit.teamSize ? String(projectToEdit.teamSize) : '',
        tags: (projectToEdit.tags || []).join(', '),
        skills: (projectToEdit.skills || []).join(', '),
        features: (projectToEdit.features || []).join(', '),
        techStack: (projectToEdit.techStack || []).join(', '),
        deliverables: (projectToEdit.deliverables || []).join(', '),
      });
    }
  }, [editMode, projectToEdit]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!projectData.title.trim()) errors.title = 'Project title is required';
    if (!projectData.description.trim()) errors.description = 'Project description is required';
    if (!projectData.category.trim()) errors.category = 'Project category is required';
    if (!projectData.price.trim()) {
      errors.price = 'Project price is required';
    } else if (isNaN(Number(projectData.price)) || Number(projectData.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProject = async () => {
    if (!user) {
      toast.error('Please sign in to create a project');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const customUserId = user.uid;

      const payload = {
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        tags: projectData.tags.split(',').map(tag => tag.trim()),
        price: parseFloat(projectData.price) || 0,
        duration: projectData.duration,
        teamSize: parseInt(projectData.teamSize) || 1,
        skills: projectData.skills.split(',').map(skill => skill.trim()),
        features: projectData.features.split(',').map(feature => feature.trim()),
        techStack: projectData.techStack.split(',').map(tech => tech.trim()),
        deliverables: projectData.deliverables.split(',').map(deliverable => deliverable.trim()),
        status: 'Active',
        posted: new Date().toISOString().split('T')[0],
        views: 0,
        favoritedBy: [],
      };

      let res;
      if (editMode && projectToEdit && projectToEdit.id) {
        console.log('Editing project:', projectToEdit);
        console.log('Editing project id:', projectToEdit.id);
        // Edit mode: update project
        res = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(projectToEdit.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Add mode: create new project
        res = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECTS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || (editMode ? 'Failed to update project' : 'Failed to create project'));
      }

      // Call the callback to refresh data immediately after successful operation
      if(onProjectCreated) onProjectCreated();

      setShowProjectSuccess(true);

      setTimeout(() => {
        setShowProjectSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      toast.error(error.message || (editMode ? 'Failed to update project' : 'Failed to create project'));
    } finally {
      setLoading(false);
    }
  };

  if (showProjectSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
        <div className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col justify-center items-center">
          <SuccessAnimation 
            isVisible={true} 
            onClose={() => {}} 
            title={editMode ? "Project Updated!" : "Project Created!"}
            message={editMode ? "Your project has been successfully updated." : "Your project has been successfully created."}
          />
          <p className="text-xl font-semibold mt-4">
            {editMode ? 'Project Updated Successfully!' : 'Project Created Successfully!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        <header className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-semibold text-lg">{editMode ? 'Edit Project' : 'Add New Project'}</h2>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
            <Input id="title" name="title" value={projectData.title} onChange={handleInputChange} placeholder="e.g., AI-Powered Climate Change Model" />
            {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Textarea id="description" name="description" value={projectData.description} onChange={handleInputChange} placeholder="Describe your project in detail..." />
            {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DropdownWithOther
                label="Category"
                options={getDropdownOptions('projectCategories')}
                value={projectData.category}
                onChange={(value) => setProjectData(prev => ({ ...prev, category: value }))}
                placeholder="Select Category"
                required={true}
                error={formErrors.category}
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
              <Input id="price" name="price" type="number" value={projectData.price} onChange={handleInputChange} placeholder="e.g., 2500" />
              {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" value={projectData.duration} onChange={handleInputChange} placeholder="e.g., 2 months" />
            </div>
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Input id="teamSize" name="teamSize" type="number" value={projectData.teamSize} onChange={handleInputChange} placeholder="e.g., 6" />
            </div>
          </div>
          <div>
            <DropdownWithOther
              label="Status"
              options={getDropdownOptions('projectStatuses')}
              value={projectData.status}
              onChange={(value) => setProjectData(prev => ({ ...prev, status: value }))}
              placeholder="Select Status"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" value={projectData.tags} onChange={handleInputChange} placeholder="e.g., AI, Climate, Prediction" />
          </div>
          <div>
            <Label htmlFor="skills">Required Skills (comma-separated)</Label>
            <Input id="skills" name="skills" value={projectData.skills} onChange={handleInputChange} placeholder="e.g., Machine Learning, Python" />
          </div>
          <div>
            <Label htmlFor="image">Main Image URL</Label>
            <Input id="image" name="image" value={projectData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
          </div>
          <div>
            <Label htmlFor="images">Additional Image URLs (comma-separated)</Label>
            <Input id="images" name="images" value={projectData.images} onChange={handleInputChange} placeholder="https://.../img1.jpg, https://.../img2.jpg" />
          </div>
          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea id="features" name="features" value={projectData.features} onChange={handleInputChange} placeholder="Feature 1, Feature 2, Feature 3" />
          </div>
          <div>
            <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
            <Textarea id="techStack" name="techStack" value={projectData.techStack} onChange={handleInputChange} placeholder="TensorFlow, Python, AWS" />
          </div>
          <div>
            <Label htmlFor="deliverables">Deliverables (comma-separated)</Label>
            <Textarea id="deliverables" name="deliverables" value={projectData.deliverables} onChange={handleInputChange} placeholder="Source code, Documentation" />
          </div>
        </main>
        <footer className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveProject} disabled={loading}>
            {loading ? (editMode ? 'Saving...' : 'Creating...') : (editMode ? 'Save Changes' : 'Create Project')}
          </Button>
        </footer>
      </div>
    </div>
  );
}; 