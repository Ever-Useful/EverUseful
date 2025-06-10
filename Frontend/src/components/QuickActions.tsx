
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Calendar } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Start New Project',
      description: 'Create a new project',
      primary: true,
    },
    {
      icon: Users,
      label: 'Find Collaborators',
      description: 'Connect with others',
      primary: false,
    },
    {
      icon: Calendar,
      label: 'Schedule Meeting',
      description: 'Book a time slot',
      primary: false,
    },
  ];

  return (
    <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={index}
              variant={action.primary ? "default" : "outline"}
              className={`w-full justify-start p-4 h-auto ${
                action.primary 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              } shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">{action.label}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
