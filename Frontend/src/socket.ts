// src/socket.ts
import { io } from "socket.io-client";

// Only connect to socket.io if backend is available
// For now, disable socket.io to prevent connection errors
const socketUrl = null; // Set to "http://localhost:3000" when backend is running

export const socket = socketUrl ? io(socketUrl, {
  withCredentials: true,
  timeout: 5000, // 5 second timeout
  reconnection: false, // Disable auto-reconnection to prevent spam
}) : null;
