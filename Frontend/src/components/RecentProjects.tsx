import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
const RecentProjects = () => {
  const projects = [{
    title: 'AI-Powered Study Assistant',
    category: 'Machine Learning',
    status: 'In Progress',
    progress: 75,
    collaborators: 3
  }, {
    title: 'Sustainable Energy Monitor',
    category: 'IoT',
    status: 'Under Review',
    progress: 100,
    collaborators: 2
  }, {
    title: 'Social Media Analytics Tool',
    category: 'Data Science',
    status: 'Planning',
    progress: 25,
    collaborators: 5
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planning':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <Card className="p-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm rounded-lg my-[45px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Recent Projects</h2>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
          View All
        </Button>
      </div>
      
      <div className="space-y-6">
        {projects.map((project, index) => <div key={index} className="border-b border-slate-200 last:border-b-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{project.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate-600">{project.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <Users className="w-4 h-4 mr-1" />
                {project.collaborators}
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{
              width: `${project.progress}%`
            }} />
              </div>
            </div>
          </div>)}
      </div>
    </Card>;
};
export default RecentProjects;