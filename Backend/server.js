require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authorize = require('./authorize');
const marketplaceRoutes = require('./routes/marketplace');
const userRoutes = require('./routes/users');
const userService = require('./services/userService');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const s3Routes = require('./routes/s3');
const s3Service = require('./services/s3Service');
const http = require('http');
const { Server } = require('socket.io');

const app = express();


//server.listen(port, '0.0.0.0', () => console.log(`App running on :${port}`));
app.use(cors({
  origin: [
    'https://amoghconnect.com',
    'https://www.amoghconnect.com',
    'http://localhost:8080',
    'http://localhost:3000',
    // 'https://www.amoghconnect.com', // Uncomment if you use www subdomain
    // Add more allowed origins as needed
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Test endpoint to check if server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!', timestamp: new Date().toISOString() });
});

// Marketplace routes
app.use('/api/marketplace', marketplaceRoutes);

// User routes
app.use('/api/users', userRoutes);

// S3 routes
app.use('/api/s3', s3Routes);

app.use('/api', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/token', authorize, async (req, res) => {
  const { uid, name, email, phone_number } = req.user;

  try {
    if (!uid) throw new Error("Missing UID from Firebase token");

    // Check if user exists in DynamoDB
    let user = await userService.findUserByFirebaseUid(uid);

    if (!user) {
      // Create new user in DynamoDB
      const customUserId = await userService.generateCustomUserId();

      // Parse firstName and lastName from name if available
      let firstName = '';
      let lastName = '';
      if (name) {
        const nameParts = name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      // Create user in DynamoDB
      user = await userService.createUser(uid, {
        firstName: firstName,
        lastName: lastName,
        email: email ?? 'no-email@example.com',
        userType: 'student',
        mobile: phone_number ?? '',
        phoneNumber: phone_number ?? '',
      });

      console.log('New OAuth user created with data:', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phone_number
      });
    }

    // Ensure S3 folder structure exists (idempotent)
    if (user && user.customUserId) {
      try {
        await s3Service.createUserFolder(user.customUserId);
      } catch (e) {
        console.error('Failed to ensure S3 folder for user:', e.message);
      }
    }

    return res.json({ redirectUrl: '/profile' });
  } catch (err) {
    console.error("Error saving user:", err.message);
    return res.status(500).json({ error: 'Failed to save user info' });
  }
});

app.post('/token', authorize, async (req, res) => {
  const { uid, name, email, phone_number, firebase } = req.user;
  const { userType, firstName, lastName, phoneNumber } = req.body;

  try {
    if (!uid) throw new Error("Missing UID from Firebase token");

    // Check if user exists in DynamoDB
    let user = await userService.findUserByFirebaseUid(uid);

    if (!user) {
      // Create new user in DynamoDB
      const customUserId = await userService.generateCustomUserId();

      // Use provided firstName/lastName or parse from name
      let resolvedFirstName = firstName;
      let resolvedLastName = lastName;
      
      // If firstName/lastName are provided from signup form, use them
      if (firstName && lastName) {
        resolvedFirstName = firstName;
        resolvedLastName = lastName;
      } else if (name) {
        // Parse from OAuth provider name
        const nameParts = name.split(' ');
        resolvedFirstName = resolvedFirstName || nameParts[0] || '';
        resolvedLastName = resolvedLastName || nameParts.slice(1).join(' ') || '';
      }

      // Create user in DynamoDB with all provided data
      user = await userService.createUser(uid, {
        firstName: resolvedFirstName ?? '',
        lastName: resolvedLastName ?? '',
        email: email ?? 'no-email@example.com',
        userType: userType ?? 'student',
        mobile: phoneNumber ?? phone_number ?? '',
        phoneNumber: phoneNumber ?? phone_number ?? '',
      });

      console.log('New user created with data:', {
        firstName: resolvedFirstName,
        lastName: resolvedLastName,
        email: email,
        userType: userType,
        phoneNumber: phoneNumber ?? phone_number
      });

    } else {
      // Update existing user's profile if provided
      const updateFields = {};
      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;
      if (phoneNumber) updateFields.phoneNumber = phoneNumber;
      
      if (Object.keys(updateFields).length > 0) {
        await userService.updateUserProfile(user.customUserId, updateFields);
        console.log('Existing user updated with fields:', updateFields);
      }
    }

    // Ensure S3 folder structure exists (idempotent)
    if (user && user.customUserId) {
      try {
        await s3Service.createUserFolder(user.customUserId);
      } catch (e) {
        console.error('Failed to ensure S3 folder for user:', e.message);
      }
    }

    return res.json({ redirectUrl: '/profile' });
  } catch (err) {
    console.error("Error saving user:", err.message);
    return res.status(500).json({ error: 'Failed to save user info' });
  }
});

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:8080",   // frontend dev server
      "http://localhost:3000",   // if you test frontend also on 3000
      "https://amoghconnect.com",
      "https://www.amoghconnect.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("register", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", (error) => {
  if (error) {
    console.log(`App Failed at port :${port}`);
  } else {
    console.log(`App running at http://0.0.0.0:${port}`);
  }
});
