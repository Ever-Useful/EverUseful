# User System Architecture Documentation

## Overview

This system implements a dual-ID architecture where:
- **Firebase UID**: Used exclusively for authentication
- **Custom User ID**: Used for all application data and business logic

## Architecture Benefits

1. **Separation of Concerns**: Authentication vs. Application Data
2. **Flexibility**: Can change authentication providers without affecting user data
3. **Privacy**: Firebase UIDs are not exposed in public APIs
4. **Scalability**: Custom IDs can be optimized for your application needs
5. **Data Portability**: User data is stored in your own JSON structure

## Data Structure

### User Data Schema (`userData.json`)

```json
{
  "users": {
    "USER_000001": {
      "customUserId": "USER_000001",
      "firebaseUid": "firebase_uid_here",
      "profile": {
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://...",
        "bio": "Software Developer",
        "location": "New York",
        "website": "https://johndoe.com",
        "userType": "student",
        "title": "Full Stack Developer",
        "createdAt": "2025-01-27T00:00:00.000Z",
        "updatedAt": "2025-01-27T00:00:00.000Z"
      },
      "projects": {
        "created": [],
        "collaborated": [],
        "favorites": [],
        "count": 0
      },
      "marketplace": {
        "cart": [],
        "orders": [],
        "favorites": [],
        "reviews": [],
        "wishlist": []
      },
      "skills": {
        "technical": [],
        "soft": [],
        "certifications": [],
        "expertise": {}
      },
      "social": {
        "followers": [],
        "following": [],
        "connections": [],
        "followersCount": 0,
        "followingCount": 0
      },
      "activities": {
        "recent": [],
        "achievements": [],
        "badges": [],
        "points": 0
      },
      "preferences": {
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        },
        "privacy": {
          "profileVisibility": "public",
          "showEmail": false,
          "showLocation": false
        },
        "theme": "light",
        "language": "en"
      },
      "stats": {
        "projectsCount": 0,
        "totalLikes": 0,
        "totalViews": 0,
        "totalDownloads": 0,
        "memberSince": "2025-01-27T00:00:00.000Z"
      }
    }
  },
  "userCounter": 1,
  "metadata": {
    "lastUpdated": "2025-01-27T00:00:00.000Z",
    "version": "1.0.0",
    "description": "User data storage with custom user IDs"
  }
}
```

## API Endpoints

### Authentication & User Management

#### `POST /api/users/create`
Create a new user after Firebase authentication
```javascript
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "userType": "student",
  "title": "Developer"
}

// Response
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "customUserId": "USER_000001",
    "firebaseUid": "firebase_uid",
    "profile": { ... }
  }
}
```

#### `GET /api/users/profile`
Get current user's profile (requires authentication)
```javascript
// Response
{
  "success": true,
  "data": {
    "customUserId": "USER_000001",
    "profile": { ... },
    "stats": { ... }
  }
}
```

#### `GET /api/users/:customUserId`
Get public profile by custom user ID (no authentication required)
```javascript
// Response
{
  "success": true,
  "data": {
    "customUserId": "USER_000001",
    "profile": { ... }, // Public data only
    "stats": { ... },
    "social": { ... }
  }
}
```

#### `PUT /api/users/profile`
Update user profile
```javascript
// Request
{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "location": "San Francisco"
}
```

### Projects

#### `POST /api/users/projects`
Add a project to user's portfolio
```javascript
// Request
{
  "projectId": "PROJ_001",
  "title": "My Awesome Project",
  "description": "A revolutionary app",
  "category": "web",
  "tags": ["react", "nodejs"],
  "imageUrl": "https://...",
  "projectLink": "https://...",
  "githubLink": "https://..."
}
```

#### `GET /api/users/projects`
Get user's projects
```javascript
// Response
{
  "success": true,
  "data": {
    "created": [...],
    "collaborated": [...],
    "favorites": [...],
    "count": 5
  }
}
```

### Skills

#### `POST /api/users/skills`
Add a skill to user's profile
```javascript
// Request
{
  "name": "React",
  "category": "Frontend",
  "expertise": "Expert"
}
```

#### `GET /api/users/skills`
Get user's skills
```javascript
// Response
{
  "success": true,
  "data": {
    "technical": [...],
    "soft": [...],
    "certifications": [...],
    "expertise": { ... }
  }
}
```

### Marketplace

#### `POST /api/users/cart`
Add item to cart
```javascript
// Request
{
  "productId": "PROD_001",
  "name": "Premium Template",
  "price": 29.99,
  "image": "https://...",
  "quantity": 1
}
```

#### `GET /api/users/cart`
Get user's cart
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "productId": "PROD_001",
      "name": "Premium Template",
      "price": 29.99,
      "image": "https://...",
      "addedAt": "2025-01-27T00:00:00.000Z",
      "quantity": 1
    }
  ]
}
```

### Activities

#### `POST /api/users/activities`
Add user activity
```javascript
// Request
{
  "type": "project_created",
  "description": "Created new project: My App",
  "metadata": {
    "projectId": "PROJ_001"
  }
}
```

#### `GET /api/users/activities`
Get user activities
```javascript
// Response
{
  "success": true,
  "data": {
    "recent": [...],
    "achievements": [...],
    "badges": [...],
    "points": 150
  }
}
```

### Social Features

#### `POST /api/users/follow/:targetUserId`
Follow another user
```javascript
// Response
{
  "success": true,
  "message": "User followed successfully",
  "data": {
    "followersCount": 25,
    "followingCount": 10
  }
}
```

#### `GET /api/users/social/:type`
Get followers or following (type: 'followers' or 'following')
```javascript
// Response
{
  "success": true,
  "data": {
    "users": [...],
    "count": 25
  }
}
```

### Statistics

#### `GET /api/users/stats`
Get user statistics
```javascript
// Response
{
  "success": true,
  "data": {
    "projectsCount": 5,
    "followersCount": 25,
    "followingCount": 10,
    "totalLikes": 150,
    "totalViews": 1000,
    "totalDownloads": 50,
    "memberSince": "2025-01-27T00:00:00.000Z",
    "points": 150
  }
}
```

## Frontend Integration

### Using the User Service

```typescript
import { userService } from '@/services/userService';

// Create user after Firebase authentication
const createUser = async () => {
  try {
    const userData = await userService.createUser({
      name: 'John Doe',
      email: 'john@example.com',
      userType: 'student'
    });
    console.log('User created:', userData.customUserId);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Get user profile
const getProfile = async () => {
  try {
    const profile = await userService.getUserProfile();
    console.log('User profile:', profile);
  } catch (error) {
    console.error('Error getting profile:', error);
  }
};

// Add project
const addProject = async () => {
  try {
    const project = await userService.addProject({
      title: 'My Project',
      description: 'Awesome project',
      category: 'web'
    });
    console.log('Project added:', project);
  } catch (error) {
    console.error('Error adding project:', error);
  }
};

// Add skill
const addSkill = async () => {
  try {
    const skill = await userService.addSkill({
      name: 'React',
      category: 'Frontend',
      expertise: 'Expert'
    });
    console.log('Skill added:', skill);
  } catch (error) {
    console.error('Error adding skill:', error);
  }
};

// Add activity
const addActivity = async () => {
  try {
    const activity = await userService.addActivity({
      type: 'skill_added',
      description: 'Added React skill'
    });
    console.log('Activity added:', activity);
  } catch (error) {
    console.error('Error adding activity:', error);
  }
};
```

## Migration Strategy

### From Firebase-only to Dual-ID System

1. **Backup existing data**: Export current Firebase user data
2. **Create migration script**: Map Firebase UIDs to custom user IDs
3. **Update frontend**: Replace Firebase UID references with custom user IDs
4. **Test thoroughly**: Ensure all functionality works with new system
5. **Deploy gradually**: Use feature flags to roll out changes

### Example Migration Script

```javascript
// Migration script example
const migrateUsers = async () => {
  const firebaseUsers = await getFirebaseUsers();
  
  for (const firebaseUser of firebaseUsers) {
    try {
      // Create user in new system
      const newUser = await userService.createUser({
        name: firebaseUser.name,
        email: firebaseUser.email,
        userType: firebaseUser.userType || 'student'
      });
      
      // Migrate existing data
      await migrateUserData(firebaseUser.uid, newUser.customUserId);
      
      console.log(`Migrated user: ${firebaseUser.uid} -> ${newUser.customUserId}`);
    } catch (error) {
      console.error(`Failed to migrate user ${firebaseUser.uid}:`, error);
    }
  }
};
```

## Security Considerations

1. **Authentication**: Always verify Firebase token before accessing user data
2. **Authorization**: Check user permissions for sensitive operations
3. **Data Validation**: Validate all input data before saving
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Data Backup**: Regular backups of user data JSON file

## Performance Optimizations

1. **Caching**: Cache frequently accessed user data
2. **Indexing**: Consider moving to a database for large user bases
3. **Pagination**: Implement pagination for large data sets
4. **Lazy Loading**: Load user data on demand
5. **Compression**: Compress JSON data for storage

## Future Enhancements

1. **Database Migration**: Move from JSON to PostgreSQL/MongoDB
2. **Real-time Updates**: Implement WebSocket connections
3. **Advanced Analytics**: Add detailed user analytics
4. **Notification System**: Implement push notifications
5. **API Versioning**: Add API versioning for backward compatibility 