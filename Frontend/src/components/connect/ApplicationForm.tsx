import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface ApplicationFormProps {
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationForm = ({ jobTitle, isOpen, onClose }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    experience: "",
    resume: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted for:", jobTitle, formData);
    alert(`Application submitted for ${jobTitle}! We'll be in touch soon.`);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto flex flex-col mx-4">
        <div className="sticky top-0 bg-white border-b border-mint-light p-4 md:p-6 flex justify-between items-center rounded-t-xl md:rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-olive-dark truncate">Apply for Position</h2>
            <p className="text-sm md:text-base text-olive truncate">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-mint-light rounded-full transition-colors ml-2 flex-shrink-0"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-olive" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm md:text-base">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="border-mint focus:border-olive h-10 md:h-11 text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm md:text-base">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="border-mint focus:border-olive h-10 md:h-11 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm md:text-base">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-mint focus:border-olive h-10 md:h-11 text-sm md:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm md:text-base">Years of Experience *</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, experience: value })}>
              <SelectTrigger className="border-mint focus:border-olive h-10 md:h-11 text-sm md:text-base">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="2-3">2-3 years</SelectItem>
                <SelectItem value="4-6">4-6 years</SelectItem>
                <SelectItem value="7-10">7-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-sm md:text-base">Resume *</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
              className="border-mint focus:border-olive h-10 md:h-11 text-sm md:text-base"
            />
            <p className="text-xs md:text-sm text-olive">Accepted formats: PDF, DOC, DOCX (max 5MB)</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
            <Button
              type="submit"
              className="flex-1 bg-olive hover:bg-olive-dark text-white py-2 md:py-3 text-sm md:text-base h-10 md:h-11"
            >
              Submit Application
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 md:px-8 border-olive text-olive hover:bg-olive hover:text-white h-10 md:h-11 text-sm md:text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
