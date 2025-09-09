import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X, Upload, FileText, AlertCircle, Download, Code, Brain, Zap, Image as ImageIcon, Video, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { TbRobot, TbHexagon3D, TbBrandOpenai } from 'react-icons/tb';
import { FiTrendingUp, FiAward, FiZap } from 'react-icons/fi';
import { GiProcessor } from 'react-icons/gi';
import SuccessAnimation from './SuccessAnimation';
import s3Service from '@/services/s3Service';
import { API_ENDPOINTS } from '@/config/api';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

interface PublishAgentSidebarProps {
  onClose: () => void;
  onAgentCreated?: () => void;
  editMode?: boolean;
  agentToEdit?: any;
}

interface AgentFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  version: string;
  tags: string;
  features: string;
  capabilities: string;
  requirements: string;
  documentation: string;
  modelFile: string;
  configFile: string;
  readmeFile: string;
  image?: string;
  images?: string[];
  video?: string;
  files?: any[];
}

const PublishAgentSidebar: React.FC<PublishAgentSidebarProps> = ({ onClose, onAgentCreated, editMode = false, agentToEdit }) => {
  const { user, token } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [showAgentSuccess, setShowAgentSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [agentData, setAgentData] = useState<AgentFormData>({
    name: '',
    description: '',
    category: '',
    price: '',
    version: '1.0.0',
    tags: '',
    features: '',
    capabilities: '',
    requirements: '',
    documentation: '',
    modelFile: '',
    configFile: '',
    readmeFile: '',
    image: '',
    images: [],
    video: '',
    files: []
  });

  // Pre-fill form if editing
  React.useEffect(() => {
    if (editMode && agentToEdit) {
      setAgentData({
        name: agentToEdit.name || '',
        description: agentToEdit.description || '',
        category: agentToEdit.category || '',
        price: agentToEdit.price?.toString() || '',
        version: agentToEdit.version || '1.0.0',
        tags: Array.isArray(agentToEdit.tags) ? agentToEdit.tags.join(', ') : agentToEdit.tags || '',
        features: Array.isArray(agentToEdit.features) ? agentToEdit.features.join(', ') : agentToEdit.features || '',
        capabilities: agentToEdit.capabilities || '',
        requirements: agentToEdit.requirements || '',
        documentation: agentToEdit.documentation || '',
        modelFile: agentToEdit.modelFile || '',
        configFile: agentToEdit.configFile || '',
        readmeFile: agentToEdit.readmeFile || '',
        image: agentToEdit.image || '',
        images: agentToEdit.images || [],
        video: agentToEdit.video || '',
        files: agentToEdit.files || []
      });
      setUploadedImages(agentToEdit.images || []);
      setUploadedVideo(agentToEdit.video || '');
      setUploadedFiles(agentToEdit.files || []);
    }
  }, [editMode, agentToEdit]);

  const categories = [
    { id: 'business', name: 'Business Intelligence', icon: <FiTrendingUp /> },
    { id: 'education', name: 'Education', icon: <FiAward /> },
    { id: 'productivity', name: 'Productivity', icon: <FiZap /> },
    { id: 'creative', name: 'Creative', icon: <TbHexagon3D /> },
    { id: 'healthcare', name: 'Healthcare', icon: <GiProcessor /> },
    { id: 'research', name: 'Research', icon: <TbBrandOpenai /> },
  ];

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!agentData.name.trim()) errors.name = 'Agent name is required';
    if (!agentData.description.trim()) errors.description = 'Agent description is required';
    if (!agentData.category.trim()) errors.category = 'Agent category is required';
    if (!agentData.price.trim()) {
      errors.price = 'Agent price is required';
    } else if (isNaN(Number(agentData.price)) || Number(agentData.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }
    if (selectedFiles.length === 0 && uploadedFiles.length === 0) {
      errors.files = 'At least one file (model, config, or documentation) is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgentData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles: File[] = [];
    files.forEach(file => {
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum file size is 100MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      // Create preview URLs for images only
      const newPreviewUrls = validFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      });
      setFilePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles: File[] = [];
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Clear the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error('Video file is too large. Maximum file size is 100MB.');
      return;
    }

    setSelectedVideo(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    
    // Clear the file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setSelectedVideo(null);
    setVideoPreviewUrl('');
  };

  const handleRemoveUploadedVideo = () => {
    setUploadedVideo('');
  };

  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToS3 = async () => {
    const uploadPromises = [];

    // Upload selected files
    if (selectedFiles.length > 0) {
      const fileUploadPromise = s3Service.uploadAgentFiles(selectedFiles, user?.uid || 'anonymous');
      uploadPromises.push(fileUploadPromise);
    }

    // Upload selected images
    if (selectedImages.length > 0) {
      const imageUploadPromise = s3Service.uploadAgentImages(selectedImages, user?.uid || 'anonymous');
      uploadPromises.push(imageUploadPromise);
    }

    // Upload selected video
    if (selectedVideo) {
      const videoUploadPromise = s3Service.uploadAgentVideo(selectedVideo, user?.uid || 'anonymous');
      uploadPromises.push(videoUploadPromise);
    }

    if (uploadPromises.length === 0) {
      return { files: uploadedFiles, images: uploadedImages, video: uploadedVideo };
    }

    try {
      const results = await Promise.all(uploadPromises);
      
      let newFiles = [...uploadedFiles];
      let newImages = [...uploadedImages];
      let newVideo = uploadedVideo;

      results.forEach(result => {
        if (result.files) {
          newFiles = [...newFiles, ...result.files];
        }
        if (result.images) {
          newImages = [...newImages, ...result.images];
        }
        if (result.video) {
          newVideo = result.video;
        }
      });

      return { files: newFiles, images: newImages, video: newVideo };
    } catch (error) {
      console.error('Error uploading files to S3:', error);
      throw error;
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'py':
      case 'js':
      case 'ts':
      case 'json':
        return <Code className="w-4 h-4" />;
      case 'md':
      case 'txt':
        return <FileText className="w-4 h-4" />;
      case 'pkl':
      case 'h5':
      case 'pt':
      case 'pth':
        return <Brain className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleSaveAgent = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Upload files to S3
      const uploadResults = await uploadFilesToS3();
      
      // Prepare agent data
      const agentPayload = {
        name: agentData.name.trim(),
        description: agentData.description.trim(),
        category: agentData.category,
        price: parseFloat(agentData.price),
        version: agentData.version.trim(),
        tags: agentData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        features: agentData.features.split(',').map(feature => feature.trim()).filter(feature => feature),
        capabilities: agentData.capabilities.trim(),
        requirements: agentData.requirements.trim(),
        documentation: agentData.documentation.trim(),
        image: uploadResults.images[0] || agentData.image,
        images: uploadResults.images,
        video: uploadResults.video || agentData.video,
        files: uploadResults.files
      };

      // Make API call
      const url = editMode ? API_ENDPOINTS.AGENT(agentToEdit.id) : API_ENDPOINTS.AGENTS;
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(agentPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to save agent');
      }

      const result = await response.json();
      
      // Call the callback to refresh data
      if(onAgentCreated) onAgentCreated();

      setShowAgentSuccess(true);
      toast.success(editMode ? 'Agent updated successfully!' : 'Agent published successfully!');

      setTimeout(() => {
        setShowAgentSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error saving agent:', error);
      toast.error('Failed to save agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showAgentSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-10 w-full max-w-2xl h-full bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 shadow-2xl flex flex-col justify-center items-center">
          <SuccessAnimation 
            isVisible={true} 
            onClose={() => {}} 
            title={editMode ? "AI Agent Updated!" : "AI Agent Published!"}
            message={editMode ? "Your AI agent has been successfully updated." : "Your AI agent has been successfully published to the marketplace."}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <TbRobot className="text-cyan-400 text-4xl mx-auto mb-2" />
            <p className="text-xl font-semibold text-white">
              {editMode ? 'Agent Updated Successfully!' : 'Agent Published Successfully!'}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl h-full bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-gray-300 hover:text-white hover:bg-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TbRobot className="text-cyan-400 text-2xl" />
              <h2 className="font-semibold text-xl text-white">
                {editMode ? 'Edit AI Agent' : 'Publish AI Agent'}
              </h2>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-500 hover:scrollbar-thumb-cyan-400">
          {/* Agent Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">Agent Name <span className="text-red-400">*</span></Label>
            <Input 
              id="name" 
              name="name" 
              value={agentData.name} 
              onChange={handleInputChange} 
              placeholder="e.g., SynthAnalytics Pro" 
              className="mt-2 h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
            {formErrors.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-300">Description <span className="text-red-400">*</span></Label>
            <Textarea 
              id="description" 
              name="description" 
              value={agentData.description} 
              onChange={handleInputChange} 
              placeholder="Describe your AI agent's capabilities and use cases..." 
              className="mt-2 h-32 resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
            {formErrors.description && <p className="text-red-400 text-sm mt-1">{formErrors.description}</p>}
          </div>
          
          {/* Category and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-300">Category <span className="text-red-400">*</span></Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setAgentData(prev => ({ ...prev, category: category.id }))}
                    className={`p-3 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                      agentData.category === category.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500 hover:bg-gray-700/30'
                    }`}
                  >
                    {category.icon}
                    <span className="text-xs font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
              {formErrors.category && <p className="text-red-400 text-sm mt-1">{formErrors.category}</p>}
            </div>
            
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-300">Price ($) <span className="text-red-400">*</span></Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={agentData.price} 
                onChange={handleInputChange} 
                placeholder="e.g., 149.99" 
                className="mt-2 h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
              {formErrors.price && <p className="text-red-400 text-sm mt-1">{formErrors.price}</p>}
            </div>
          </div>
          
          {/* Version */}
          <div>
            <Label htmlFor="version" className="text-sm font-medium text-gray-300">Version</Label>
            <Input 
              id="version" 
              name="version" 
              value={agentData.version} 
              onChange={handleInputChange} 
              placeholder="e.g., 1.0.0" 
              className="mt-2 h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          
          {/* Tags */}
          <div>
            <Label htmlFor="tags" className="text-sm font-medium text-gray-300">Tags (comma-separated)</Label>
            <Input 
              id="tags" 
              name="tags" 
              value={agentData.tags} 
              onChange={handleInputChange} 
              placeholder="e.g., AI, Analytics, Business Intelligence" 
              className="mt-2 h-11 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          
          {/* Features */}
          <div>
            <Label htmlFor="features" className="text-sm font-medium text-gray-300">Key Features (comma-separated)</Label>
            <Textarea 
              id="features" 
              name="features" 
              value={agentData.features} 
              onChange={handleInputChange} 
              placeholder="Feature 1, Feature 2, Feature 3" 
              className="mt-2 h-24 resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          
          {/* Capabilities */}
          <div>
            <Label htmlFor="capabilities" className="text-sm font-medium text-gray-300">Capabilities</Label>
            <Textarea 
              id="capabilities" 
              name="capabilities" 
              value={agentData.capabilities} 
              onChange={handleInputChange} 
              placeholder="Describe what your AI agent can do..." 
              className="mt-2 h-24 resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          
          {/* Requirements */}
          <div>
            <Label htmlFor="requirements" className="text-sm font-medium text-gray-300">System Requirements</Label>
            <Textarea 
              id="requirements" 
              name="requirements" 
              value={agentData.requirements} 
              onChange={handleInputChange} 
              placeholder="Python 3.8+, TensorFlow 2.0+, 8GB RAM..." 
              className="mt-2 h-20 resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
          
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-300">Agent Files</Label>
              <span className="text-sm text-gray-400">
                {selectedFiles.length + uploadedFiles.length} file{(selectedFiles.length + uploadedFiles.length) !== 1 ? 's' : ''} selected
              </span>
            </div>
            {formErrors.files && (
              <div className="text-red-400 text-sm">{formErrors.files}</div>
            )}
            
            {/* Files Display */}
            {(selectedFiles.length > 0 || uploadedFiles.length > 0) && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-2">Selected Files:</p>
                <div className="space-y-2">
                  {/* Uploaded files */}
                  {uploadedFiles.map((file, index) => (
                    <div key={`uploaded-${index}`} className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-600 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-cyan-400">
                          {getFileIcon(file.name || file.url || '')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name || 'Uploaded File'}</p>
                          <p className="text-xs text-gray-400">
                            {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Uploaded file'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUploadedFile(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Selected files */}
                  {selectedFiles.map((file, index) => (
                    <div key={`selected-${index}`} className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-600 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-cyan-400">
                          {getFileIcon(file.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* File Selection */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 font-medium rounded-lg transition-all duration-200"
              >
                <Upload className="w-4 h-4" />
                Select Files
              </Button>
              <span className="text-sm text-gray-400">
                Model files, configs, documentation
              </span>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".py,.json,.md,.txt,.pkl,.h5,.pt,.pth,.yaml,.yml"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-300">Agent Images</Label>
              <span className="text-sm text-gray-400">
                {selectedImages.length + uploadedImages.length} image{(selectedImages.length + uploadedImages.length) !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            {/* Selected Images Display */}
            {(selectedImages.length > 0 || uploadedImages.length > 0) && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-2">Selected Images:</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Uploaded images */}
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={`uploaded-${index}`} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        onClick={() => handleRemoveUploadedImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Selected images */}
                  {imagePreviewUrls.map((previewUrl, index) => (
                    <div key={`selected-${index}`} className="relative group">
                      <img
                        src={previewUrl}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image Selection */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 font-medium rounded-lg transition-all duration-200"
              >
                <ImageIcon className="w-4 h-4" />
                Select Images
              </Button>
              <span className="text-sm text-gray-400">
                Screenshots, demos, previews
              </span>
            </div>
            
            {/* Hidden image input */}
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Video Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-300">Agent Video</Label>
              <span className="text-sm text-gray-400">
                {(selectedVideo || uploadedVideo) ? '1 video selected' : 'No video selected'}
              </span>
            </div>
            
            {/* Video Display */}
            {(selectedVideo || uploadedVideo) && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-2">Selected Video:</p>
                <div className="relative group">
                  {selectedVideo ? (
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                    />
                  ) : (
                    <video
                      src={uploadedVideo}
                      controls
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                    />
                  )}
                  <button
                    onClick={selectedVideo ? handleRemoveVideo : handleRemoveUploadedVideo}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Video Selection */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 font-medium rounded-lg transition-all duration-200"
              >
                <Video className="w-4 h-4" />
                Select Video
              </Button>
              <span className="text-sm text-gray-400">
                Demo, tutorial, showcase
              </span>
            </div>
            
            {/* Hidden video input */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>
          
          {/* Documentation */}
          <div>
            <Label htmlFor="documentation" className="text-sm font-medium text-gray-300">Documentation</Label>
            <Textarea 
              id="documentation" 
              name="documentation" 
              value={agentData.documentation} 
              onChange={handleInputChange} 
              placeholder="Provide setup instructions, usage examples, and API documentation..." 
              className="mt-2 h-32 resize-none bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="p-6 border-t border-gray-700 flex justify-end gap-4 bg-gray-800/50 backdrop-blur-sm">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 font-medium rounded-lg transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAgent} 
            disabled={loading} 
            className="bg-gradient-to-r from-cyan-600 to-indigo-700 hover:from-cyan-700 hover:to-indigo-800 text-white font-medium rounded-lg px-6 py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20 border-0"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {editMode ? 'Updating...' : 'Publishing...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {editMode ? 'Update Agent' : 'Publish Agent'}
              </div>
            )}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default PublishAgentSidebar;