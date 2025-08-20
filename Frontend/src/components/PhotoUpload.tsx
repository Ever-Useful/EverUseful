import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
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
import NoUserProfile from '@/assets/images/no user profile.png';

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
      // Capture previous S3 key from current image (if public S3 URL)
      const previousKey = (currentImage && currentImage.includes('amazonaws.com/'))
        ? currentImage.split('.amazonaws.com/')[1]?.split('?')[0] || ''
        : '';
      const imageUrls = await s3Service.uploadProfileImage(selectedFile, type);

      // Use large for both to match required URL pattern
      const chosen = imageUrls.large?.url || imageUrls.medium.url;
      
      // Since bucket is public, use direct URL with cache busting
      const cacheBusted = `${chosen}${chosen.includes('?') ? '&' : '?'}t=${Date.now()}`;
      
      // Delete prior image only if its key differs from the new uploaded keys
      try {
        const newKeys = [imageUrls.thumbnail?.key, imageUrls.small?.key, imageUrls.medium?.key, imageUrls.large?.key]
          .filter(Boolean);
        if (previousKey && !newKeys.includes(previousKey)) {
          await s3Service.deleteImage(previousKey);
          console.log('Old image deleted successfully (different key):', previousKey);
        } else if (previousKey) {
          console.log('Skipping delete since key appears unchanged/overwritten:', previousKey);
        }
      } catch (deleteError) {
        console.warn('Failed to delete old image (non-blocking):', deleteError);
      }
      
      // Persist public URL to DynamoDB to ensure profile page picks it up
      try {
        const publicUrl = type === 'avatar' ? (imageUrls.large?.url || imageUrls.medium.url) : imageUrls.large.url;
        if (type === 'avatar') await userService.updateUserProfile({ avatar: publicUrl });
        else await userService.updateUserProfile({ backgroundImage: publicUrl });
      } catch (err) {
        console.warn('Failed to persist new image URL to DB:', err);
      }

      // Update UI with cache-busted public URL
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

  // Profile Photo Modal (White Theme) - LinkedIn Mobile Style
  if (type === 'avatar') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className={className}>
            {trigger}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md sm:max-w-lg bg-white text-gray-900 border-gray-200 z-[60] p-4 sm:p-6">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 sm:pb-6">
            <DialogTitle className="text-lg sm:text-xl font-semibold">Profile photo</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">Upload or edit your profile photo</DialogDescription>

          {/* Always-present hidden file input so Change/Upload buttons work regardless of tab/state */}
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-4 sm:space-y-6 py-2 sm:py-4">
            {/* Single preview at top */}
            <div className="relative">
              <img
                src={previewUrl || currentImage || NoUserProfile}
                alt="Profile preview"
                style={getImageStyle()}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-200 shadow-lg"
              />
            </div>

            {/* Visibility Setting */}
            {/* <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white text-xs sm:text-sm px-3 sm:px-4 py-2">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Anyone
              </Button>
            </div> */}
            {/* Optional helper when no image yet */}
            {!previewUrl && !currentImage && (
              <div className="text-xs sm:text-sm text-gray-600">Choose an image from the Upload tab to get started.</div>
            )}
          </div>
          {/* Tabs below preview; compact */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className={`grid w-full ${(!currentImage && !previewUrl) ? 'grid-cols-2' : 'grid-cols-1'} mb-3`}>
              {(!currentImage && !previewUrl) && (
                <TabsTrigger value="upload" className="text-xs sm:text-sm">Upload</TabsTrigger>
              )}
              <TabsTrigger value="edit" className="text-xs sm:text-sm">Edit</TabsTrigger>
            </TabsList>

            {(!currentImage && !previewUrl) && (
            <TabsContent value="upload" className="space-y-3">
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{currentImage ? 'Drag and drop to replace your photo, or click to browse' : 'Choose an image to set your profile photo'}</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-4 py-2"
                >
                  Choose File
                </Button>
              </div>
            </TabsContent>
            )}

            <TabsContent value="edit" className="space-y-4 sm:space-y-6">
              {(previewUrl || currentImage) && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Preview is shown at the top; only controls below */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <Label className="flex items-center gap-2 text-xs sm:text-sm">
                        <RotateCw className="w-4 h-4" />
                        Rotate
                      </Label>
                      <Slider
                        value={[editOptions.rotate]}
                        onValueChange={([value]) => handleEditOptionChange('rotate', value)}
                        max={360}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2 text-xs sm:text-sm">
                        <ZoomIn className="w-4 h-4" />
                        Scale
                      </Label>
                      <Slider
                        value={[editOptions.scale]}
                        onValueChange={([value]) => handleEditOptionChange('scale', value)}
                        max={200}
                        min={50}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                <div>
                      <Label className="flex items-center gap-2 text-xs sm:text-sm">
                        <Filter className="w-4 h-4" />
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
                      <Label className="flex items-center gap-2 text-xs sm:text-sm">
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
                      <Label className="flex items-center gap-2 text-xs sm:text-sm">
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
            </div>
          )}
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-200 rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => {
                      setPreviewUrl(image);
                      setActiveTab('edit');
                    }}
                  />
                ))}
            </div>
            </TabsContent>
          </Tabs>

          {/* Footer actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 sm:pt-6 mt-2 sm:mt-4 border-t border-gray-200 gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  const img = currentImage || '';
                  if (img.includes('amazonaws.com/')) {
                    const key = img.split('.amazonaws.com/')[1]?.split('?')[0];
                    if (key) {
                      try {
                        await s3Service.deleteImage(key);
                      } catch (err) {
                        console.warn('Failed to delete from S3:', err);
                      }
                    }
                  }
                  await userService.updateUserProfile({ avatar: '' });
                  onImageUpload('');
                  resetState();
                  setActiveTab('upload');
                  // keep dialog open so user can upload a new photo if they want
                  toast.success('Profile photo removed successfully');
                } catch (e) {
                  console.error('Failed to remove avatar:', e);
                  toast.error('Failed to remove photo');
                }
              }}
              className="text-gray-600 hover:text-red-600 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
            >
              Delete photo
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 w-full sm:w-auto"
              >
                Change photo
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 w-full sm:w-auto"
              >
                {isUploading ? 'Uploading...' : 'Apply'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Cover Photo Modal (Light Theme) - LinkedIn Mobile Style
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={className}>
          {trigger}
        </div>
      </DialogTrigger>
              <DialogContent className="max-w-4xl sm:max-w-5xl bg-white z-[60] p-4 sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">Cover image</DialogTitle>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button> */}
        </DialogHeader>
        <DialogDescription className="sr-only">Upload or edit your cover image</DialogDescription>

        {/* Hidden file input for Change/Choose buttons in cover modal */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4 sm:space-y-6">
          {/* Image Display - LinkedIn Mobile Style */}
          <div className="relative">
            {previewUrl ? (
              <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  style={getImageStyle()}
                  className="w-full max-h-64 sm:max-h-96 object-cover"
                />
              </div>
            ) : currentImage ? (
              <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={currentImage}
                  alt="Current cover"
                  className="w-full max-h-64 sm:max-h-96 object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-32 sm:h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm text-gray-600">No cover image selected</p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Section - show only when no existing cover image */}
          {!previewUrl && !currentImage && (
            <div className="text-center p-6 sm:p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Upload cover image</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Choose a high-quality image that represents your profile</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5"
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

          {/* Edit Section - LinkedIn Mobile Style */}
          {previewUrl && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label className="flex items-center gap-2 text-xs sm:text-sm">
                    <RotateCw className="w-4 h-4" />
                    Rotate
                  </Label>
                  <Slider
                    value={[editOptions.rotate]}
                    onValueChange={([value]) => handleEditOptionChange('rotate', value)}
                    max={360}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                    <div>
                  <Label className="flex items-center gap-2 text-xs sm:text-sm">
                        <ZoomIn className="w-4 h-4" />
                    Scale
                      </Label>
                      <Slider
                    value={[editOptions.scale]}
                    onValueChange={([value]) => handleEditOptionChange('scale', value)}
                        max={200}
                        min={50}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                  <Label className="flex items-center gap-2 text-xs sm:text-sm">
                    <Filter className="w-4 h-4" />
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
                  <Label className="flex items-center gap-2 text-xs sm:text-sm">
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
                  <Label className="flex items-center gap-2 text-xs sm:text-sm">
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
            </div>
          )}
        </div>

        {/* Action Buttons - compact */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-gray-200 gap-3">
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
                setActiveTab('upload');
              } catch (e) {
                console.error('Delete photo failed:', e);
                toast.error('Failed to remove photo');
              }
            }}
            size="sm"
            className="text-gray-600 hover:text-red-600 text-xs sm:text-sm px-3 py-2"
          >
            Delete photo
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm px-3 py-2 w-full sm:w-auto"
            >
              Change photo
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-2 w-full sm:w-auto"
            >
              {isUploading ? 'Uploading...' : 'Apply'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 