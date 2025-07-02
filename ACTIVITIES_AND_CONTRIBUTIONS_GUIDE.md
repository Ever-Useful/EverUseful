# Activities and Project Views System

## Overview

This document explains how the activities tracking and project views system works in the portal.

## 1. Activities System

### How Activities Are Created

Activities are automatically created when users perform certain actions:

#### Automatic Activity Triggers:

1. **Project Creation** (`project_created`)
   - Triggered when: User creates a new project
   - Description: "Created new project: [Project Title]"
   - Metadata: `{ projectId, projectTitle }`

2. **Skill Addition** (`skill_added`)
   - Triggered when: User adds a new skill
   - Description: "Added new skill: [Skill Name]"
   - Metadata: `{ skillName }`

3. **User Following** (`user_followed`)
   - Triggered when: User follows another user
   - Description: "Started following [User Name]" / "[User Name] started following you"
   - Metadata: `{ followingId, followingName }` or `{ followerId, followerName }`

4. **Project Milestones** (`project_milestone`)
   - Triggered when: Project reaches 10, 50, or 100 views
   - Description: "Your project '[Project Title]' reached [X] views!"
   - Metadata: `{ projectId, projectTitle, views }`

### Activity Structure

```javascript
{
  id: "timestamp",
  type: "activity_type",
  description: "Human readable description",
  timestamp: "ISO date string",
  metadata: {
    // Additional data specific to activity type
  }
}
```

### API Endpoints

- `POST /api/users/activities` - Add activity manually
- `GET /api/users/activities` - Get user activities

## 2. Project Views Tracking

### How Views Are Tracked

1. **Automatic Tracking**: Views are tracked when projects are viewed using the `ProjectViewTracker` component
2. **Manual Tracking**: Views can be tracked via API endpoint
3. **Milestone Tracking**: Special activities are created at view milestones (10, 50, 100 views)

### View Tracking Flow

1. User views a project
2. `ProjectViewTracker` component waits 2 seconds (to ensure actual viewing)
3. API call to `POST /api/users/projects/:projectId/view`
4. Backend increments view count and total views
5. If milestone reached, activity is created

### API Endpoints

- `POST /api/users/projects/:projectId/view` - Track project view

### Usage Example

```tsx
import { ProjectViewTracker } from '@/components/ProjectViewTracker';

// Wrap project display with tracker
<ProjectViewTracker projectId="PROJ_001">
  <ProjectDisplay project={project} />
</ProjectViewTracker>
```

## 3. Dashboard Integration

### Stats Display

The dashboard now shows real data for:

- **Projects Posted**: Number of projects created by user
- **Project Views**: Total views across all user's projects
- **Favourites**: Total favorites on user's projects
- **Connections**: Number of connections/followers
- **Likes**: Total likes on user's projects

### Recent Activity Display

- Shows last 5 activities with proper time formatting
- Activities are fetched from backend
- Time displayed as "Just now", "5m ago", "2h ago", etc.

### Project Analytics

- Project views are grouped by day of week
- Real project data is used for analytics
- Progress tracking based on project status

## 4. Frontend Components

### ProjectViewTracker
- Automatically tracks views when projects are displayed
- Waits 2 seconds before tracking to ensure actual viewing
- Handles errors gracefully

## 5. Backend Implementation

### UserService Methods

- `addActivity()` - Add activity to user
- `trackProjectView()` - Track project view and milestones

### Data Structure Updates

User data now includes:
- `activities.recent[]` - Recent activities
- `projects.created[].views` - View count per project
- `stats.totalViews` - Total views across all projects

## 6. Testing the System

### To Test Activities:
1. Create a new project → Should create `project_created` activity
2. Add a skill → Should create `skill_added` activity
3. Follow a user → Should create `user_followed` activities

### To Test Project Views:
1. View a project → Should increment view count
2. Check dashboard → Should show updated view stats
3. Reach milestones → Should create milestone activities

## 7. Future Enhancements

Potential improvements:
- Activity notifications
- Activity filtering by type
- Project view analytics
- Activity badges and achievements
- Email notifications for activities 