# User System Architecture Documentation

## Overview

This system implements a **dual-storage architecture** where:
- **Firebase Firestore**: Stores minimal authentication and user identification data
- **JSON Files**: Store comprehensive user data and application business logic
- **Custom User IDs**: Generated sequentially (USER_000001, USER_000002, etc.) for all application operations

## Architecture Benefits

1. **Separation of Concerns**: Authentication vs. Application Data
2. **Flexibility**: Can change authentication providers without affecting user data
3. **Privacy**: Firebase UIDs are not exposed in public APIs
4. **Scalability**: Custom IDs can be optimized for your application needs
5. **Data Portability**: User data is stored in your own JSON structure
6. **Performance**: Fast JSON file operations for application data
7. **Simplicity**: Easy to backup, version control, and migrate user data

## Data Storage Structure

### Firebase Firestore (`users` collection)
Stores minimal authentication and identification data:
```javascript
{
  "firebase_uid": {
    "customUserId": "USER_000001",
    "firstName": "John",
    "lastName": "Doe", 
    "phoneNumber": "+1234567890",
    "email": "john@example.com",
    "userType": "student"
  }
}
```

### User Data Schema (`userData.json`)
Stores comprehensive application data:
```json
{
  "users": {
    "USER_000001": {
      "customUserId": "USER_000001",
      "profile": {
        "avatar": null,
        "bio": "Software Developer",
        "location": "New York",
        "website": "https://johndoe.com",
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
        "cart": [
          {
            "productId": "10",
            "addedAt": "2025-06-19T21:36:07.569Z",
            "quantity": 1
          }
        ],
        "orders": [],
        "favorites": [],
        "reviews": [],
        "wishlist": []
      },
      "skills": ["JavaScript", "React", "Node.js"],
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
          "email": null,
          "push": null,
          "sms": null
        },
        "privacy": {
          "profileVisibility": null,
          "showEmail": null,
          "showLocation": null
        },
        "theme": null,
        "language": null
      },
      "stats": {
        "projectsCount": 0,
        "totalLikes": 0,
        "totalViews": 0,
        "totalDownloads": 0,
        "memberSince": "2025-01-27T00:00:00.000Z"
      },
      "studentData": {
        "college": "CUJ",
        "degree": "Btech", 
        "course": "CSE",
        "year": "3",
        "updatedAt": "2025-06-18T22:19:59.243Z"
      }
    }
  },
  "userCounter": 5,
  "metadata": {
    "lastUpdated": "2025-06-20T14:00:00.000Z",
    "version": "1.0.0",
    "description": "User data storage with custom user IDs"
  }
}
```

### Marketplace Data Schema (`marketplace.json`)
Stores project listings and marketplace data:
```json
{
  "projects": [
    {
      "id": 1,
      "title": "AI-Powered Climate Change Prediction Model",
      "description": "Advanced machine learning system...",
      "image": "https://images.unsplash.com/...",
      "images": ["https://...", "https://..."],
      "category": "AI & ML",
      "price": 2500,
      "duration": "2 months",
      "rating": 4,
      "reviews": 127,
      "author": {
        "name": "Dr. Sarah Chen",
        "image": "https://randomuser.me/api/portraits/women/44.jpg",
        "verified": true,
        "rating": 4.8,
        "projects": 12,
        "bio": "PhD in Environmental Science..."
      },
      "status": "Active",
      "posted": "2025-06-01",
      "teamSize": 6,
      "tags": ["AI", "Climate", "Prediction"],
      "skills": ["Machine Learning", "Python", "Climate Science"],
      "features": ["Real-time climate pattern analysis", "95% prediction accuracy"],
      "techStack": ["TensorFlow", "Python", "AWS", "Docker"],
      "deliverables": ["Source code", "Documentation", "API access"],
      "views": 1553,
      "favoritedBy": []
    }
  ]
}
```

## Authentication Flow

### 1. User Registration/Login
```javascript
// POST /token (GET request for basic auth, POST for additional data)
{
  "userType": "student",
  "firstName": "John", 
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Process:**
1. Firebase authenticates user and provides UID
2. System checks if user exists in Firestore
3. If new user:
   - Generates custom user ID (USER_000001, USER_000002, etc.)
   - Saves minimal data to Firestore
   - Creates comprehensive user structure in userData.json
4. If existing user:
   - Updates any provided fields in Firestore
   - Returns existing custom user ID

### 2. User Identification
- **Firebase UID**: Used only for authentication and Firestore lookups
- **Custom User ID**: Used for all application operations and public APIs

## API Endpoints

### Authentication & User Management

#### `GET /token` - Basic Authentication
Authenticate user and create basic profile if new
```javascript
// Response
{
  "redirectUrl": "/profile"
}
```

#### `POST /token` - Authentication with Additional Data
Authenticate user and save additional profile information
```javascript
// Request
{
  "userType": "student",
  "firstName": "John",
  "lastName": "Doe", 
  "phoneNumber": "+1234567890"
}

// Response
{
  "redirectUrl": "/profile"
}
```

#### `POST /api/users/create` - Create User (Legacy)
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

#### `GET /api/users/profile` - Get Current User Profile
Get authenticated user's complete profile
```javascript
// Response
{
  "success": true,
  "data": {
    "customUserId": "USER_000001",
    "auth": {
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "email": "john@example.com",
      "userType": "student"
    },
    "profile": {
      "avatar": null,
      "bio": "Software Developer",
      "location": "New York",
      "website": "https://johndoe.com",
      "title": "Full Stack Developer",
      "createdAt": "2025-01-27T00:00:00.000Z",
      "updatedAt": "2025-01-27T00:00:00.000Z"
    },
    "stats": {
      "projectsCount": 0,
      "totalLikes": 0,
      "totalViews": 0,
      "totalDownloads": 0,
      "memberSince": "2025-01-27T00:00:00.000Z"
    },
    "studentData": {
      "college": "CUJ",
      "degree": "Btech",
      "course": "CSE", 
      "year": "3",
      "updatedAt": "2025-06-18T22:19:59.243Z"
    }
  }
}
```

#### `GET /api/users/:customUserId` - Get Public Profile
Get public profile by custom user ID (no authentication required)
```javascript
// Response
{
  "success": true,
  "data": {
    "customUserId": "USER_000001",
    "profile": {
      "avatar": null,
      "bio": "Software Developer",
      "title": "Full Stack Developer",
      "location": "New York",
      "website": "https://johndoe.com",
      "createdAt": "2025-01-27T00:00:00.000Z"
    },
    "stats": {
      "projectsCount": 0,
      "totalLikes": 0,
      "totalViews": 0,
      "totalDownloads": 0,
      "memberSince": "2025-01-27T00:00:00.000Z"
    },
    "social": {
      "followersCount": 0,
      "followingCount": 0
    }
  }
}
```

#### `PUT /api/users/auth` - Update Authentication Info
Update user's basic authentication information
```javascript
// Request
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phoneNumber": "+1234567890",
  "userType": "student"
}

// Response
{
  "success": true,
  "message": "Auth info updated successfully"
}
```

#### `PUT /api/users/profile` - Update User Profile
Update user's extended profile information
```javascript
// Request
{
  "bio": "Updated bio",
  "location": "San Francisco",
  "website": "https://updated.com",
  "title": "Senior Developer",
  "college": "MIT",
  "degree": "Masters",
  "course": "Computer Science",
  "year": "2"
}

// Response
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Skills Management

#### `GET /api/users/skills` - Get User Skills
Get user's skills as a flat array
```javascript
// Response
{
  "success": true,
  "data": ["JavaScript", "React", "Node.js", "Python"]
}
```

#### `POST /api/users/skills` - Add Skill
Add a skill to user's profile
```javascript
// Request
{
  "name": "TypeScript"
}

// Response
{
  "success": true,
  "message": "Skill added successfully"
}
```

#### `DELETE /api/users/skills/:skillName` - Remove Skill
Remove a skill from user's profile
```javascript
// Response
{
  "success": true,
  "message": "Skill removed successfully"
}
```

### Projects Management

#### `POST /api/users/projects` - Add Project
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

// Response
{
  "success": true,
  "message": "Project added successfully",
  "data": { ... }
}
```

#### `GET /api/users/projects` - Get User Projects
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

#### `POST /api/users/:customUserId/projects` - Add Project ID (Public)
Add project ID to user's created projects (for backend integration)
```javascript
// Request
{
  "projectId": "PROJ_001"
}

// Response
{
  "success": true,
  "message": "Project ID added to user",
  "data": { "projectId": "PROJ_001" }
}
```

### Cart Management

#### `POST /api/users/:customUserId/cart` - Add to Cart
Add item to user's cart
```javascript
// Request
{
  "productId": "17",
  "name": "AI-Based Fraud Detection System",
  "price": 3100,
  "image": "https://...",
  "quantity": 1
}

// Response
{
  "success": true,
  "message": "Item added to cart",
  "data": [
    {
      "productId": "17",
      "name": "AI-Based Fraud Detection System",
      "price": 3100,
      "image": "https://...",
      "addedAt": "2025-06-18T20:22:23.131Z",
      "quantity": 1
    }
  ]
}
```

#### `GET /api/users/:customUserId/cart` - Get User Cart
Get user's cart items
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "productId": "17",
      "name": "AI-Based Fraud Detection System",
      "price": 3100,
      "image": "https://...",
      "addedAt": "2025-06-18T20:22:23.131Z",
      "quantity": 1
    }
  ]
}
```

#### `DELETE /api/users/:customUserId/cart/:productId` - Remove from Cart
Remove item from user's cart
```javascript
// Response
{
  "success": true,
  "message": "Item removed from cart",
  "data": [...]
}
```

#### `DELETE /api/users/:customUserId/cart` - Clear Cart
Clear all items from user's cart
```javascript
// Response
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

### Activities & Social

#### `POST /api/users/activities` - Add Activity
Add activity to user's activity feed
```javascript
// Request
{
  "type": "project_created",
  "description": "Created new project",
  "metadata": { "projectId": "PROJ_001" }
}

// Response
{
  "success": true,
  "message": "Activity added successfully",
  "data": {
    "id": "1234567890",
    "type": "project_created",
    "description": "Created new project",
    "timestamp": "2025-06-20T14:00:00.000Z",
    "metadata": { "projectId": "PROJ_001" }
  }
}
```

#### `GET /api/users/activities` - Get User Activities
Get user's activity feed
```javascript
// Response
{
  "success": true,
  "data": {
    "recent": [...],
    "achievements": [...],
    "badges": [...],
    "points": 0
  }
}
```

#### `POST /api/users/follow/:targetUserId` - Follow User
Follow another user
```javascript
// Response
{
  "success": true,
  "message": "User followed successfully",
  "data": {
    "followersCount": 1,
    "followingCount": 1
  }
}
```

#### `GET /api/users/social/:type` - Get Social Data
Get user's followers or following list
```javascript
// Response (for /api/users/social/followers)
{
  "success": true,
  "data": {
    "users": [
      {
        "customUserId": "USER_000002",
        "avatar": null,
        "title": "Developer"
      }
    ],
    "count": 1
  }
}
```

### Statistics

#### `GET /api/users/stats` - Get User Statistics
Get user's statistics
```javascript
// Response
{
  "success": true,
  "data": {
    "projectsCount": 5,
    "followersCount": 10,
    "followingCount": 15,
    "totalLikes": 25,
    "totalViews": 100,
    "totalDownloads": 5,
    "memberSince": "2025-01-27T00:00:00.000Z",
    "points": 150
  }
}
```

### Admin Endpoints

#### `GET /api/users/admin/all` - Get All Users
Get all users (admin only)
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "customUserId": "USER_000001",
      "profile": { ... },
      "stats": { ... }
    }
  ]
}
```

#### `DELETE /api/users/admin/:customUserId` - Delete User
Delete a user (admin only)
```javascript
// Response
{
  "success": true,
  "message": "User deleted successfully",
  "data": { "success": true, "message": "User deleted successfully" }
}
```

### Debug Endpoints

#### `GET /api/users/debug/current-user` - Debug Current User
Get debug information about current user
```javascript
// Response
{
  "firebaseUid": "firebase_uid_here",
  "userExists": true,
  "user": {
    "customUserId": "USER_000001",
    "skills": ["JavaScript", "React"]
  }
}
```

## Marketplace API Endpoints

### Project Management

#### `GET /api/marketplace/projects` - Get Projects
Get all projects with filtering and pagination
```javascript
// Query Parameters
{
  "search": "AI",
  "category": "AI & ML",
  "minPrice": 1000,
  "maxPrice": 5000,
  "minRating": 4,
  "skills": "Python,Machine Learning",
  "duration": "2 months",
  "sort": "recent", // recent, rating, price_asc, price_desc
  "page": 1,
  "limit": 6
}

// Response
{
  "projects": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProjects": 30,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### `GET /api/marketplace/projects/:id` - Get Project Details
Get specific project details
```javascript
// Response
{
  "project": {
    "id": 1,
    "title": "AI-Powered Climate Change Prediction Model",
    "description": "...",
    "image": "https://...",
    "images": [...],
    "category": "AI & ML",
    "price": 2500,
    "duration": "2 months",
    "rating": 4,
    "reviews": 127,
    "author": { ... },
    "status": "Active",
    "posted": "2025-06-01",
    "teamSize": 6,
    "tags": [...],
    "skills": [...],
    "features": [...],
    "techStack": [...],
    "deliverables": [...],
    "views": 1553,
    "likes": 89,
    "likedBy": [],
    "favoritedBy": []
  }
}
```

#### `POST /api/marketplace/projects` - Create Project
Create a new project listing
```javascript
// Request
{
  "title": "New AI Project",
  "description": "Description here",
  "image": "https://...",
  "images": [...],
  "category": "AI & ML",
  "price": 2500,
  "duration": "2 months",
  "teamSize": 5,
  "tags": ["AI", "Machine Learning"],
  "skills": ["Python", "TensorFlow"],
  "features": ["Feature 1", "Feature 2"],
  "techStack": ["Python", "AWS"],
  "deliverables": ["Source code", "Documentation"],
  "customUserId": "USER_000001"
}

// Response
{
  "project": { ... }
}
```

#### `POST /api/marketplace/projects/:id/view` - Increment View Count
Increment project view count
```javascript
// Response
{
  "views": 1554
}
```

#### `POST /api/marketplace/projects/:id/favorite` - Toggle Favorite
Toggle project favorite status
```javascript
// Request
{
  "userId": "USER_000001"
}

// Response
{
  "isFavorited": true,
  "favoritedBy": ["USER_000001"]
}
```

#### `POST /api/marketplace/projects/:id/like` - Toggle Like
Toggle project like status
```javascript
// Request
{
  "userId": "USER_000001"
}

// Response
{
  "likes": 90,
  "likedBy": ["USER_000001"],
  "isLiked": true
}
```

## User Service Methods

### Core User Operations
- `loadUserData()` - Load user data from JSON file
- `saveUserData()` - Save user data to JSON file
- `generateCustomUserId()` - Generate sequential custom user ID
- `createUser(firebaseUid, userData)` - Create new user
- `findUserByFirebaseUid(firebaseUid)` - Find user by Firebase UID
- `findUserByCustomId(customUserId)` - Find user by custom ID

### Profile Management
- `updateUserProfile(customUserId, profileData)` - Update user profile
- `addUserProject(customUserId, projectData)` - Add project to user
- `addUserSkill(customUserId, skillData)` - Add skill to user
- `removeUserSkill(customUserId, skillName)` - Remove skill from user

### Cart Management
- `addToCart(customUserId, productData)` - Add item to cart
- `removeFromCart(customUserId, productId)` - Remove item from cart
- `clearCart(customUserId)` - Clear user's cart

### Social Features
- `addActivity(customUserId, activityData)` - Add activity to user
- `followUser(followerId, followingId)` - Follow another user
- `getUserStats(customUserId)` - Get user statistics

### Admin Operations
- `getAllUsers()` - Get all users
- `deleteUser(customUserId)` - Delete user

## Error Handling

### Common Error Responses
```javascript
// 400 Bad Request
{
  "success": false,
  "message": "Validation error message"
}

// 404 Not Found
{
  "success": false,
  "message": "User not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Internal server error"
}
```

### Authentication Errors
```javascript
// 401 Unauthorized
{
  "error": "Failed to save user info"
}
```

## Security Considerations

1. **Firebase Authentication**: All protected endpoints require valid Firebase token
2. **Custom User ID Validation**: Public endpoints validate custom user IDs
3. **Data Separation**: Sensitive auth data stored in Firestore, application data in JSON
4. **Input Validation**: All user inputs are validated before processing
5. **Error Handling**: Comprehensive error handling without exposing sensitive information

## Performance Optimizations

1. **JSON File Caching**: User data loaded once and cached in memory
2. **Sequential IDs**: Fast custom user ID generation
3. **Minimal Firestore Usage**: Only essential auth data stored in Firestore
4. **Efficient Queries**: Optimized filtering and pagination for marketplace
5. **Batch Operations**: Multiple operations handled efficiently

## Data Migration & Backup

1. **JSON File Backup**: Easy to backup userData.json and marketplace.json
2. **Version Control**: JSON files can be version controlled
3. **Data Export**: Users can export their data in JSON format
4. **Migration Path**: Easy to migrate to different storage solutions

## Current Implementation Status

✅ **Fully Implemented:**
- User authentication and registration
- Profile management (basic and extended)
- Skills management (add/remove)
- Cart management (add/remove/clear)
- Project management (add/view)
- Marketplace operations (browse/filter/create)
- Social features (follow/unfollow)
- Activity tracking
- Statistics tracking
- Admin operations

🔄 **In Development:**
- Advanced search and filtering
- Real-time notifications
- Payment integration
- Advanced analytics

📋 **Planned:**
- User roles and permissions
- Advanced privacy controls
- Data export/import
- API rate limiting
- Caching layer 