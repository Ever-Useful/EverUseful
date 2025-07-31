import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Mail, Phone, Building } from "lucide-react";

interface ConsultationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationForm = ({ isOpen, onClose }: ConsultationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    organizationType: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    toast({
      title: "Consultation Booked!",
      description: "We'll contact you within 24 hours to confirm your appointment.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      organizationType: "",
      preferredDate: "",
      preferredTime: "",
      message: ""
    });
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
     <SheetContent className="w-full sm:w-[540px] galaxy-bg overflow-y-auto max-h-screen">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-2xl font-bold text-eco-green glow-text">
            Book Your Free Consultation
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Get expert advice on your sustainability journey. Our consultation is completely free 
            and tailored to your specific needs.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-eco-green" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-eco-green" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-eco-green" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization" className="flex items-center gap-2">
                <Building className="h-4 w-4 text-eco-green" />
                Organization *
              </Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                placeholder="Enter your organization name"
                required
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationType">Organization Type *</Label>
              <Select onValueChange={(value) => handleInputChange("organizationType", value)} required>
                <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="research">Research Institution</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-eco-green" />
                  Preferred Date
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-eco-green" />
                  Preferred Time
                </Label>
                <Select onValueChange={(value) => handleInputChange("preferredTime", value)}>
                  <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Information</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Tell us about your sustainability goals, current challenges, or any specific questions you have..."
                rows={4}
                className="bg-background/50 border-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full eco-gradient hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            size="lg"
          >
            Schedule Free Consultation
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};