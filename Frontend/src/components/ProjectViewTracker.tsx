import { useEffect } from 'react';
import { userService } from '@/services/userService';

interface ProjectViewTrackerProps {
  projectId: string;
  children: React.ReactNode;
}

/**
 * ProjectViewTracker - Automatically tracks project views
 * 
 * Usage:
 * <ProjectViewTracker projectId="PROJ_001">
 *   <YourProjectComponent project={project} />
 * </ProjectViewTracker>
 * 
 * This component will automatically track a view after 2 seconds
 * when the project is displayed to the user.
 */
export const ProjectViewTracker: React.FC<ProjectViewTrackerProps> = ({ projectId, children }) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        await userService.trackProjectView(projectId);
      } catch (error) {
        console.log('Failed to track project view:', error);
      }
    };

    // Track view after a short delay to ensure user is actually viewing
    const timer = setTimeout(trackView, 2000);
    return () => clearTimeout(timer);
  }, [projectId]);

  return <>{children}</>;
}; 