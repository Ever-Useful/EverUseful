import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X, Upload, FileText, AlertCircle, Download, Code, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { TbRobot, TbHexagon3D, TbBrandOpenai } from 'react-icons/tb';
import { FiTrendingUp, FiAward, FiZap } from 'react-icons/fi';
import { GiProcessor } from 'react-icons/gi';
import SuccessAnimation from './SuccessAnimation';

interface PublishAgentSidebarProps {
  onClose: () => void;
  onAgentCreated?: () => void;
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
}

const PublishAgentSidebar: React.FC<PublishAgentSidebarProps> = ({ onClose, onAgentCreated }) => {
  const [loading, setLoading] = useState(false);
  const [showAgentSuccess, setShowAgentSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  });

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
    if (selectedFiles.length === 0) {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the callback to refresh data
      if(onAgentCreated) onAgentCreated();

      setShowAgentSuccess(true);

      setTimeout(() => {
        setShowAgentSuccess(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating agent:', error);
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
            title="AI Agent Published!"
            message="Your AI agent has been successfully published to the marketplace."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <TbRobot className="text-cyan-400 text-4xl mx-auto mb-2" />
            <p className="text-xl font-semibold text-white">
              Agent Published Successfully!
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
              <h2 className="font-semibold text-xl text-white">Publish AI Agent</h2>
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
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            {formErrors.files && (
              <div className="text-red-400 text-sm">{formErrors.files}</div>
            )}
            
            {/* Selected Files Display */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-2">Selected Files:</p>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-600 rounded-lg">
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
                Publishing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Publish Agent
              </div>
            )}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default PublishAgentSidebar;