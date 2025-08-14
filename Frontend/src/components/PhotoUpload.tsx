import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Image as ImageIcon, Edit3, Trash2, X, RotateCw, ZoomIn, ZoomOut, Eye, Frame, Crop, Filter, Settings, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { API_ENDPOINTS } from '../config/api';
import s3Service from '@/services/s3Service';
import userService from '@/services/userService';
import toast from 'react-hot-toast';

interface PhotoUploadProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  type: 'avatar' | 'background';
  trigger: React.ReactNode;
  className?: string;
}

interface ImageEditOptions {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotate: number;
  scale: number;
  zoom: number;
  straighten: number;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentImage,
  onImageUpload,
  type,
  trigger,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [editOptions, setEditOptions] = useState<ImageEditOptions>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotate: 0,
    scale: 100,
    zoom: 100,
    straighten: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample gallery images (in production, these would come from user's previous uploads)
  const galleryImages = [
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
    '/api/placeholder/150/150',
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setActiveTab('edit');
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast.error('Unable to access camera');
      console.error('Camera access error:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            setCapturedImage(canvas.toDataURL());
            setPreviewUrl(canvas.toDataURL());
            setShowCamera(false);
            setActiveTab('edit');

            // Stop camera stream
            const stream = video.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const imageUrls = await s3Service.uploadProfileImage(selectedFile, type);

      // Prefer medium for avatar, large for background
      const chosen = type === 'avatar' ? imageUrls.medium.url : imageUrls.large.url;
      
      // Since bucket is public, use direct URL with cache busting
      const cacheBusted = `${chosen}${chosen.includes('?') ? '&' : '?'}t=${Date.now()}`;
      
      // Delete old image from S3 if it exists
      if (currentImage && currentImage.includes('amazonaws.com/')) {
        try {
          const key = currentImage.split('.amazonaws.com/')[1]?.split('?')[0];
          if (key) {
            await s3Service.deleteImage(key);
            console.log('Old image deleted successfully:', key);
          }
        } catch (deleteError) {
          console.warn('Failed to delete old image, but continuing with upload:', deleteError);
        }
      }
      
      // Update the UI immediately
      onImageUpload(cacheBusted);

      toast.success(`${type === 'avatar' ? 'Profile photo' : 'Cover photo'} updated successfully!`);
      setIsOpen(false);
      resetState();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCapturedImage('');
    setShowCamera(false);
    setEditOptions({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      rotate: 0,
      scale: 100,
      zoom: 100,
      straighten: 0
    });
    setActiveTab('upload');
  };

  const handleEditOptionChange = (option: keyof ImageEditOptions, value: number) => {
    setEditOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const getImageStyle = () => {
    return {
      filter: `
        brightness(${editOptions.brightness}%)
        contrast(${editOptions.contrast}%)
        saturate(${editOptions.saturation}%)
        blur(${editOptions.blur}px)
      `,
      transform: `rotate(${editOptions.rotate}deg) scale(${editOptions.scale / 100})`
    };
  };

  // Profile Photo Modal (White Theme)
  if (type === 'avatar') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className={className}>
            {trigger}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-white text-gray-900 border-gray-200 z-[60] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <DialogTitle className="text-lg font-semibold">Profile photo</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-2">
            {/* Profile Photo Display */}
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
              ) : currentImage ? (
                <img
                  src={currentImage}
                  alt="Current profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center shadow-lg">
                  <User className="w-14 h-14 text-gray-400" />
                </div>
              )}
            </div>

            {/* Visibility Setting */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">
                <Eye className="w-4 h-4 mr-2" />
                Anyone
              </Button>
            </div>

            {/* Upload Section */}
            {!previewUrl && (
              <div className="w-full space-y-4">
                <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload a new photo</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Choose File
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Fixed layout */}
          <div className="grid grid-cols-3 gap-1 pt-3 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('edit')}
              disabled={!previewUrl}
              className="text-gray-700 hover:bg-gray-100 text-xs px-2"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-700 hover:bg-gray-100 text-xs px-2"
            >
              <Camera className="w-3 h-3 mr-1" />
              Update
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  // Attempt to delete from S3 if current image is an S3 URL and we can extract a key
                  const img = currentImage || '';
                  if (img.includes('amazonaws.com/')) {
                    const key = img.split('.amazonaws.com/')[1]?.split('?')[0];
                    if (key) {
                      try { 
                        await s3Service.deleteImage(key);
                        console.log('S3 image deleted successfully:', key);
                      } catch (s3Error) {
                        console.warn('Failed to delete from S3, but continuing with profile update:', s3Error);
                      }
                    }
                  }
                  
                  // Persist clear to backend profile
                  await userService.updateUserProfile({ avatar: '' });
                  
                  // Clear on UI immediately
                  onImageUpload('');
                  toast.success('Profile photo removed successfully');
                  resetState();
                  setIsOpen(false);
                } catch (e) {
                  console.error('Delete photo failed:', e);
                  toast.error('Failed to remove photo');
                }
              }}
              disabled={!currentImage}
              className="text-gray-700 hover:text-red-600 text-xs px-2"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>

          {/* Edit Section - Improved layout */}
          {previewUrl && activeTab === 'edit' && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block font-medium">Brightness</Label>
                  <Slider
                    value={[editOptions.brightness]}
                    onValueChange={([value]) => handleEditOptionChange('brightness', value)}
                    max={200}
                    min={0}
                    step={1}
                    className="mt-1"
                    style={{
                      '--slider-track-color': '#22c55e',
                      '--slider-thumb-color': '#22c55e'
                    } as React.CSSProperties}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-700 mb-1 block font-medium">Contrast</Label>
                  <Slider
                    value={[editOptions.contrast]}
                    onValueChange={([value]) => handleEditOptionChange('contrast', value)}
                    max={200}
                    min={0}
                    step={1}
                    className="mt-1"
                    style={{
                      '--slider-track-color': '#22c55e',
                      '--slider-thumb-color': '#22c55e'
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons - Only show when editing */}
          {previewUrl && activeTab === 'edit' && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={resetState}
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-3"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Cover Photo Modal (Light Theme)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={className}>
          {trigger}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-[60]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-gray-900">Cover image</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Display */}
          <div className="relative">
            {previewUrl ? (
              <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  style={getImageStyle()}
                  className="w-full max-h-96 object-cover"
                />
              </div>
            ) : currentImage ? (
              <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={currentImage}
                  alt="Current cover"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No cover image selected</p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Section */}
          {!previewUrl && (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload cover image</h3>
              <p className="text-gray-600 mb-4">
                Choose an image from your device
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Choose File
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Edit Tools */}
          {previewUrl && (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-lg">
                  <TabsTrigger value="crop" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Crop className="w-4 h-4 mr-2" />
                    Crop
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </TabsTrigger>
                  <TabsTrigger value="adjust" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Adjust
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crop" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <ZoomIn className="w-4 h-4" />
                        Zoom
                      </Label>
                      <Slider
                        value={[editOptions.zoom]}
                        onValueChange={([value]) => handleEditOptionChange('zoom', value)}
                        max={200}
                        min={50}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <RotateCw className="w-4 h-4" />
                        Straighten
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOptionChange('straighten', editOptions.straighten - 1)}
                        >
                          -
                        </Button>
                        <Slider
                          value={[editOptions.straighten]}
                          onValueChange={([value]) => handleEditOptionChange('straighten', value)}
                          max={45}
                          min={-45}
                          step={1}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOptionChange('straighten', editOptions.straighten + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="space-y-4">
                  <p className="text-gray-600">Filter options coming soon...</p>
                </TabsContent>

                <TabsContent value="adjust" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <ZoomIn className="w-4 h-4" />
                        Brightness
                      </Label>
                      <Slider
                        value={[editOptions.brightness]}
                        onValueChange={([value]) => handleEditOptionChange('brightness', value)}
                        max={200}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Contrast
                      </Label>
                      <Slider
                        value={[editOptions.contrast]}
                        onValueChange={([value]) => handleEditOptionChange('contrast', value)}
                        max={200}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Saturation
                      </Label>
                      <Slider
                        value={[editOptions.saturation]}
                        onValueChange={([value]) => handleEditOptionChange('saturation', value)}
                        max={200}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={async () => {
              try {
                // Attempt to delete from S3 if current image is an S3 URL and we can extract a key
                const img = currentImage || '';
                if (img.includes('amazonaws.com/')) {
                  const key = img.split('.amazonaws.com/')[1]?.split('?')[0];
                  if (key) {
                    try { 
                      await s3Service.deleteImage(key);
                      console.log('S3 image deleted successfully:', key);
                    } catch (s3Error) {
                      console.warn('Failed to delete from S3, but continuing with profile update:', s3Error);
                    }
                  }
                }
                
                // Persist clear to backend profile
                const updateData = { backgroundImage: '' };
                await userService.updateUserProfile(updateData);
                
                // Clear on UI immediately
                onImageUpload('');
                toast.success('Cover photo removed successfully');
                resetState();
                setIsOpen(false);
              } catch (e) {
                console.error('Delete photo failed:', e);
                toast.error('Failed to remove photo');
              }
            }}
            size="sm"
            className="text-gray-600 hover:text-red-600"
          >
            Delete photo
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Change photo
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUploading ? 'Uploading...' : 'Apply'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 