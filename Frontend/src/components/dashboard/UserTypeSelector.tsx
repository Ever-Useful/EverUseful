import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/pages/Dashboard";

interface UserTypeSelectorProps {
  userType: UserType;
  onUserTypeChange: (type: UserType) => void;
}

const UserTypeSelector = ({ userType, onUserTypeChange }: UserTypeSelectorProps) => {
  return (
    <Card className="w-fit dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-2">
        <div className="flex gap-1">
          <Button
            variant={userType === 'student' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onUserTypeChange('student')}
            className="text-xs"
          >
            Student
          </Button>
          <Button
            variant={userType === 'professor' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onUserTypeChange('professor')}
            className="text-xs"
          >
            Professor
          </Button>
          <Button
            variant={userType === 'enterprise' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onUserTypeChange('enterprise')}
            className="text-xs"
          >
            Enterprise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTypeSelector;