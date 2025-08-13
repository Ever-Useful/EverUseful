import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import SuccessAnimation from './SuccessAnimation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { API_ENDPOINTS } from '../config/api';
import { DropdownWithOther } from './ui/dropdown-with-other';
import { getDropdownOptions } from '../utils/dropdownUtils';
import s3Service from '@/services/s3Service';
import { getS3ImageUrl, handleImageError } from '@/utils/s3ImageUtils';
import NoImageAvailable from '@/assets/images/no image available.png';

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

const MAX_IMAGES = 4;

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
      
      // Set uploaded images if they exist - handle both string and array formats
      const collected: string[] = [];
      if (projectToEdit.images) {
        if (Array.isArray(projectToEdit.images)) {
          collected.push(...projectToEdit.images);
        } else if (typeof projectToEdit.images === 'string') {
          try {
            const parsed = JSON.parse(projectToEdit.images);
            if (Array.isArray(parsed)) collected.push(...parsed);
            else collected.push(projectToEdit.images);
          } catch {
            collected.push(projectToEdit.images);
          }
        }
      }
      // Legacy fields support
      ['image1','image2','image3','image4'].forEach((k)=>{
        const v = (projectToEdit as any)[k];
        if (typeof v === 'string' && v.trim().length > 0) collected.push(v);
      });
      if (collected.length > 0) {
        setUploadedImages(Array.from(new Set(collected)));
      } else if (projectToEdit.image) {
        setUploadedImages([projectToEdit.image]);
      } else {
        setUploadedImages([]);
      }
    }
  }, [editMode, projectToEdit]);

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviewUrls]);

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
    
    // Validate that at least one image is uploaded or selected
    if (uploadedImages.length === 0 && selectedFiles.length === 0) {
      errors.images = 'At least one project image is required';
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
    if (totalImages > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images per project. You currently have ${uploadedImages.length + selectedFiles.length} images.`);
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
      
      // Clear the file input so the same file can be selected again
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Function to handle immediate upload of selected files (for edit mode)
  const handleImmediateUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    // Only allow immediate upload for existing projects
    if (!editMode || !projectToEdit || !projectToEdit.id) {
      console.log('Images will be uploaded when you save the project');
      return;
    }
    
    try {
      const token = await user?.getIdToken();
      if (!token) {
        toast.error('Please sign in to upload images');
        return;
      }

      // Use actual project ID for immediate upload
      const projectId = projectToEdit.id;
      
      // Upload images to S3
      const imageResults = await s3Service.uploadProjectImages(selectedFiles, projectId);
      
      // Extract URLs
      const imageUrls = imageResults.map(result => result.main);
      
      // Update local state
      const updatedImages = [...uploadedImages, ...imageUrls];
      setUploadedImages(updatedImages);
      
      // Clear selected files
      setSelectedFiles([]);
      setImagePreviewUrls([]);
      
      // Update project data
      setProjectData(prev => ({
        ...prev,
        image: updatedImages[0] || '',
        images: updatedImages.join(', ')
      }));
      
      toast.success(`${imageResults.length} images uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    }
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
    
    // Update local state
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    
    // Update project data
    setProjectData(prev => ({
      ...prev,
      image: updatedImages[0] || '',
      images: updatedImages.join(', ')
    }));
    
    // If we're in edit mode, we need to update the project in DynamoDB immediately
    if (editMode && projectToEdit && projectToEdit.id) {
      try {
        const token = await user?.getIdToken();
        if (token) {
          const updatePayload = {
            ...projectToEdit,
            image: updatedImages[0] || '',
            images: updatedImages
          };
          
          await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(projectToEdit.id), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatePayload)
          });
          
          toast.success('Image removed successfully');
        }
      } catch (error) {
        console.error('Failed to update project after image removal:', error);
        toast.error('Failed to update project');
      }
    }
  };

  // Get the total number of images (uploaded + selected)
  const totalImageCount = uploadedImages.length + selectedFiles.length;
  
  // Check if user can add more images
  const canAddMoreImages = totalImageCount < MAX_IMAGES;
  
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

      // Prepare project payload without images first
      const payload = {
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        tags: projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        price: parseFloat(projectData.price) || 0,
        duration: projectData.duration,
        teamSize: parseInt(projectData.teamSize) || 1,
        skills: projectData.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
        features: projectData.features.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0),
        techStack: projectData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
        deliverables: projectData.deliverables.split(',').map(deliverable => deliverable.trim()).filter(deliverable => deliverable.length > 0),
        image: uploadedImages[0] || '', // Use existing uploaded images
        images: uploadedImages, // Use existing uploaded images
        image1: uploadedImages[0] || '',
        image2: uploadedImages[1] || '',
        image3: uploadedImages[2] || '',
        image4: uploadedImages[3] || '',
        status: 'Active',
        posted: new Date().toISOString().split('T')[0],
        views: 0,
        favoritedBy: [],
      };

      let projectId: string;
      let res;

      if (editMode && projectToEdit && projectToEdit.id) {
        // Edit mode: update existing project
        projectId = projectToEdit.id;
        res = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(projectId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new project first
        res = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECTS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to create project');
        }

        const result = await res.json();
        projectId = result.project.id;
      }

      // Now upload any selected files using the real project ID
      let finalImages = [...uploadedImages];
      if (selectedFiles.length > 0) {
        try {
          // Upload images to S3 using the real project ID
          const imageResults = await s3Service.uploadProjectImages(selectedFiles, projectId);
          
          // Extract URLs
          const imageUrls = imageResults.map(result => result.main);
          finalImages = [...uploadedImages, ...imageUrls];
          
          // Clear selected files after successful upload
          setSelectedFiles([]);
          setImagePreviewUrls([]);
          
          // Update the project with the new images
          const updatedPayload = {
            ...payload,
            image: finalImages[0] || '',
            images: finalImages,
            image1: finalImages[0] || '',
            image2: finalImages[1] || '',
            image3: finalImages[2] || '',
            image4: finalImages[3] || ''
          };

          if (editMode) {
            // Update the project with new images
            res = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(projectId), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatedPayload)
            });
          } else {
            // Update the newly created project with images
            res = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(projectId), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatedPayload)
            });
          }
          
          toast.success(`${imageResults.length} images uploaded successfully`);
        } catch (error) {
          console.error('Error uploading images:', error);
          toast.error('Failed to upload images');
          setLoading(false);
          return;
        }
      }

      // If editing, delete old images that are no longer in the project
      if (editMode && projectToEdit && projectToEdit.images) {
        const oldImages = Array.isArray(projectToEdit.images) ? projectToEdit.images : [projectToEdit.images];
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
              <Label htmlFor="price">Price (₹) <span className="text-red-500">*</span></Label>
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
              <div className="flex items-center justify-between">
                <Label>Project Images</Label>
                <span className="text-sm text-gray-500">
                  {totalImageCount}/{MAX_IMAGES} images
                </span>
              </div>
              {formErrors.images && (
                <div className="text-red-500 text-sm">{formErrors.images}</div>
              )}
            
            {/* Image Limit Warning */}
            {totalImageCount >= MAX_IMAGES && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Maximum {MAX_IMAGES} images reached. Remove some images to add more.
                </span>
              </div>
            )}
            
            {/* Uploaded Images Display */}
            {uploadedImages.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                <div className="grid grid-cols-2 gap-3">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl || NoImageAvailable}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                        onError={(e) => { 
                          e.currentTarget.src = NoImageAvailable; 
                        }}
                      />
                      <button
                        onClick={() => handleRemoveUploadedImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Selected Files with Previews */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-2">Selected Files (will be uploaded when you save):</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imagePreviewUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
                                {/* File Selection */}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200"
                        disabled={!canAddMoreImages}
                      >
                        <ImageIcon className="w-4 h-4" />
                        Select Images
                      </Button>
                      <span className="text-sm text-gray-500">
                        {totalImageCount} image{(totalImageCount) !== 1 ? 's' : ''} selected
                      </span>
                      {selectedFiles.length > 0 && editMode && projectToEdit && projectToEdit.id && (
                        <Button
                          type="button"
                          variant="default"
                          onClick={handleImmediateUpload}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md border-0"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Now
                        </Button>
                      )}
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
          <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200">
            Cancel
          </Button>
          <Button onClick={handleSaveProject} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 transition-all duration-200 hover:shadow-md border-0">
            {loading ? (editMode ? 'Saving...' : 'Creating...') : (editMode ? 'Save Changes' : 'Create Project')}
          </Button>
        </footer>
      </div>
    </div>
  );
}; 