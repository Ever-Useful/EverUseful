import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X, Upload, Image as ImageIcon } from 'lucide-react';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import SuccessAnimation from './SuccessAnimation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { API_ENDPOINTS } from '../config/api';
import { DropdownWithOther } from './ui/dropdown-with-other';
import { getDropdownOptions } from '../utils/dropdownUtils';
import s3Service from '@/services/s3Service';

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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectData, setProjectData] = useState<ProjectFormData>({
    title: '',
    description: '',
    image: '',
    images: '',
    category: '',
    price: '',
    duration: '',
    status: '',
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
        images: '', // We'll handle images separately
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
      
      // Set uploaded images if they exist
      if (projectToEdit.images && Array.isArray(projectToEdit.images)) {
        setUploadedImages(projectToEdit.images);
      }
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Check if adding these files would exceed the 4 image limit
    const totalImages = uploadedImages.length + selectedFiles.length + files.length;
    if (totalImages > 4) {
      toast.error(`You can only upload up to 4 images per project. You currently have ${uploadedImages.length + selectedFiles.length} images.`);
      return;
    }
    
    // Validate files
    const validFiles: File[] = [];
    files.forEach(file => {
      const validation = s3Service.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        toast.error(`${file.name}: ${validation.error}`);
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];
    
    // Delete from S3 if it's an S3 image
    if (imageToRemove && imageToRemove.includes('amazonaws.com/')) {
      try {
        const key = imageToRemove.split('.amazonaws.com/')[1]?.split('?')[0];
        if (key) {
          await s3Service.deleteImage(key);
          console.log('Image deleted from S3:', key);
        }
      } catch (deleteError) {
        console.warn('Failed to delete image from S3, but continuing with removal:', deleteError);
      }
    }
    
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    
    // Update project data
    const remainingImages = uploadedImages.filter((_, i) => i !== index);
    setProjectData(prev => ({
      ...prev,
      image: remainingImages[0] || '',
      images: remainingImages.join(', ')
    }));
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

      // If there are selected files, upload them first
      let finalImages = [...uploadedImages];
      if (selectedFiles.length > 0) {
        try {
          // Generate a temporary project ID for upload
          const tempProjectId = `temp-${Date.now()}`;
          
          // Upload images to S3
          const imageResults = await s3Service.uploadProjectImages(selectedFiles, tempProjectId);
          
          // Extract URLs
          const imageUrls = imageResults.map(result => result.main);
          finalImages = [...uploadedImages, ...imageUrls];
          
          toast.success(`${imageResults.length} images uploaded successfully`);
        } catch (error) {
          console.error('Error uploading images:', error);
          toast.error('Failed to upload images');
          setLoading(false);
          return;
        }
      }

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
        image: finalImages[0] || '', // First image as main image
        images: finalImages,
        status: 'Active',
        posted: new Date().toISOString().split('T')[0],
        views: 0,
        favoritedBy: [],
      };

      // If editing, delete old images that are no longer in the project
      if (editMode && projectToEdit && projectToEdit.images) {
        const oldImages = projectToEdit.images;
        const newImages = finalImages;
        
        // Find images that were removed
        const removedImages = oldImages.filter((oldImg: string) => !newImages.includes(oldImg));
        
        // Delete removed images from S3
        for (const removedImage of removedImages) {
          if (removedImage && removedImage.includes('amazonaws.com/')) {
            try {
              const key = removedImage.split('.amazonaws.com/')[1]?.split('?')[0];
              if (key) {
                await s3Service.deleteImage(key);
                console.log('Old project image deleted from S3:', key);
              }
            } catch (deleteError) {
              console.warn('Failed to delete old project image from S3:', deleteError);
            }
          }
        }
      }

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
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Project Images</Label>
            
            {/* Uploaded Images Display */}
            {(uploadedImages.length > 0 || selectedFiles.length > 0) && (
              <div className="space-y-3">
                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => handleRemoveUploadedImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Selected Files with Previews */}
                {selectedFiles.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Selected Files (will be uploaded when you save):</p>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imagePreviewUrls[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* File Selection */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Select Images
              </Button>
              <span className="text-sm text-gray-500">
                {uploadedImages.length + selectedFiles.length} image{(uploadedImages.length + selectedFiles.length) !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
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