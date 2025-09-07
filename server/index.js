const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const multer = require('multer'); // ✅ For handling file uploads

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json()); // ✅ For parsing JSON requests

// ✅ Serve uploaded files publicly
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://real-time-chat-application-rk6g.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
});

// ✅ Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'), // Save in uploads folder
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) // Unique file name
});
const upload = multer({ storage });

// ✅ File upload route (returns URL of uploaded file)
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Socket.IO room user management
const roomUsers = new Map(); // room -> Set of socket IDs

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Handle user joining a room
  socket.on('join_room', (room) => {
    if (socket.room) {
      socket.leave(socket.room);
      removeUserFromRoom(socket.room, socket.id);
    }

    socket.join(room);
    socket.room = room;
    addUserToRoom(room, socket.id);

    const userCount = getRoomUserCount(room);
    io.to(room).emit('user_count_update', userCount);
  });

  // Handle user leaving a room
  socket.on('leave_room', (room) => {
    socket.leave(room);
    removeUserFromRoom(room, socket.id);
    socket.room = null;

    const userCount = getRoomUserCount(room);
    io.to(room).emit('user_count_update', userCount);
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  // Typing indicators
  socket.on('typing', (data) => {
    socket.to(data.room).emit('user_typing', {
      username: data.username,
      userId: data.userId
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('user_stopped_typing', {
      username: data.username,
      userId: data.userId
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
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

// ✅ Serve static React files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// For SPA routing (React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
