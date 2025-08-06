const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"]
  }
});

// Store room users
const roomUsers = new Map(); // room -> Set of socket IDs

// Socket.IO connection handling
io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);

  // Handle user joining a room
  socket.on('join_room', (room) => {
    // Leave previous room if any
    if (socket.room) {
      socket.leave(socket.room);
      removeUserFromRoom(socket.room, socket.id);
    }

    // Join new room
    socket.join(room);
    socket.room = room; // Store current room on socket object
    addUserToRoom(room, socket.id);

    // console.log(`User ${socket.id} joined room: ${room}`);

    // Emit user count update to all users in the room
    const userCount = getRoomUserCount(room);
    io.to(room).emit('user_count_update', userCount);
  });

  // Handle user leaving a room
  socket.on('leave_room', (room) => {
    socket.leave(room);
    removeUserFromRoom(room, socket.id);
    socket.room = null; // Clear room from socket

    // console.log(`User ${socket.id} left room: ${room}`);

    // Emit user count update to remaining users in the room
    const userCount = getRoomUserCount(room);
    io.to(room).emit('user_count_update', userCount);
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    // console.log(`User ${data.username} is typing in room ${data.room}`);
    // Broadcast typing indicator to other users in the room
    socket.to(data.room).emit('user_typing', {
      username: data.username,
      userId: data.userId
    });
  });

  // Handle typing stop indicators
  socket.on('stop_typing', (data) => {
    // console.log(`User ${data.username} stopped typing in room ${data.room}`);
    // Broadcast typing stop indicator to other users in the room
    socket.to(data.room).emit('user_stopped_typing', {
      username: data.username,
      userId: data.userId
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);

    // Remove user from their current room
    if (socket.room) {
      removeUserFromRoom(socket.room, socket.id);
      const userCount = getRoomUserCount(socket.room);
      io.to(socket.room).emit('user_count_update', userCount);
    }
  });
});

// Helper functions for room management
function addUserToRoom(room, socketId) {
  if (!roomUsers.has(room)) {
    roomUsers.set(room, new Set());
  }
  roomUsers.get(room).add(socketId);
}

function removeUserFromRoom(room, socketId) {
  if (roomUsers.has(room)) {
    roomUsers.get(room).delete(socketId);
    if (roomUsers.get(room).size === 0) {
      roomUsers.delete(room);
    }
  }
}

function getRoomUserCount(room) {
  return roomUsers.has(room) ? roomUsers.get(room).size : 0;
}


const path = require('path');

// Serve static files from the React app (client/dist)
app.use(express.static(path.join(__dirname, '../client/dist')));

// For any route not handled by the server (like /chat, /room/xyz etc.), serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});
