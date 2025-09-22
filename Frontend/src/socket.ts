// src/socket.ts
import { io } from "socket.io-client";

// Connect to socket.io backend
const socketUrl = "http://localhost:3000"; // Backend socket server URL

export const socket = socketUrl ? io(socketUrl, {
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  reconnection: true, // Enable auto-reconnection
  reconnectionAttempts: 5, // Try to reconnect 5 times
  reconnectionDelay: 1000, // Wait 1 second between reconnection attempts
  reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
  maxReconnectionAttempts: 5, // Maximum number of reconnection attempts
  forceNew: true, // Force a new connection
}) : null;

// Add connection event listeners for debugging
if (socket) {
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed');
  });
}
