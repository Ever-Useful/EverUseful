import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { UserType } from "@/pages/Dashboard";

interface RemindersProps {
  userType: UserType;
}

const Reminders = ({ userType }: RemindersProps) => {
  const getReminderData = () => {
    switch (userType) {
      case 'student':
        return {
          title: "Assignment Due",
          subtitle: "Math Problem Set #5",
          time: "Due: 11:59 pm - Today",
          buttonText: "Start Working"
        };
      case 'professor':
        return {
          title: "Faculty Meeting",
          subtitle: "Department Curriculum Review",
          time: "Time: 02:00 pm - 04:00 pm",
          buttonText: "Join Meeting"
        };
      case 'enterprise':
        return {
          title: "Meeting with Arc Company",
          subtitle: "Quarterly Business Review",
          time: "Time: 02:00 pm - 04:00 pm",
          buttonText: "Start Meeting"
        };
      default:
        return {
          title: "Meeting with Arc Company",
          subtitle: "Quarterly Business Review",
          time: "Time: 02:00 pm - 04:00 pm",
          buttonText: "Start Meeting"
        };
    }
  };

  const reminder = getReminderData();

  return (
    <Card className="h-80">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-1">{reminder.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{reminder.subtitle}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            {reminder.time}
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
            {reminder.buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reminders;