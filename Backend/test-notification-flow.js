// Test script to verify notification flow
// Run this with: node test-notification-flow.js

const { io } = require('socket.io-client');

// Test socket connection and registration
const socket = io('http://localhost:3000', {
  withCredentials: true,
  timeout: 5000,
});

socket.on('connect', () => {
  console.log('✅ Connected to socket server:', socket.id);
  
  // Test registration with a sample user ID
  const testUserId = 'test-user-123';
  socket.emit('register', testUserId);
  console.log('📝 Registered test user:', testUserId);
});

socket.on('user_notification', (notification) => {
  console.log('🔔 Received notification:', notification);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from socket server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

// Keep the script running for 30 seconds
setTimeout(() => {
  console.log('⏰ Test completed');
  socket.disconnect();
  process.exit(0);
}, 30000);
