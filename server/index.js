// ================================
// 📦 Import required dependencies
// ================================
const path = require('path');
// load .env that lives in the same folder as this file (server/.env)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


const app = express();
const server = http.createServer(app);


// ==========================================
//  Ensure uploads directory exists safely
// ==========================================
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('Created uploads directory:', UPLOAD_DIR);
} else {
  console.log('Uploads directory exists:', UPLOAD_DIR);
}

// ================================
//  Middleware configuration
// ================================
app.use(cors());                // Enable CORS for cross-origin requests
app.use(express.json());        // Parse JSON request bodies

//  Serve uploaded files publicly at /uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// ==========================================
//  Socket.IO setup with CORS configuration
// ==========================================

// Read allowed client origins from env (comma-separated)
// Example: "http://localhost:5173,https://real-time-chat-application-rk6g.onrender.com"
const rawOrigins = process.env.CLIENT_ORIGINS || "http://localhost:5173";


const ALLOWED_ORIGINS = rawOrigins
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow non-browser clients (no origin)
      if (!origin) return callback(null, true);

      // Check if origin is in the whitelist
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      // Otherwise block it
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
    },
    methods: ["GET", "POST"]
  }
});


// ==========================================
//  Multer configuration for file uploads
// ==========================================
// 1. Storage engine (save files in /uploads with safe filenames)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

// 2. File filter (only allow certain types)
const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/png', 'image/jpg', 'image/jpeg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  cb(null, allowed.includes(file.mimetype));
};

// 3. Create multer instance with limits
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB per file
  fileFilter
});

// ==========================================
//  File upload API route
// ==========================================
// POST /upload → returns URL of uploaded file
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Construct file URL for client access
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl, filename: req.file.filename });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// ==========================================
//  Socket.IO events (real-time chat system)
// ==========================================
// Maintain a map of users per room
const roomUsers = new Map(); // room -> Set of socket IDs

io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] socket connected:`, socket.id);

  // User joins a room
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

  // User leaves a room
  socket.on('leave_room', (room) => {
    socket.leave(room);
    removeUserFromRoom(room, socket.id);
    socket.room = null;

    const userCount = getRoomUserCount(room);
    io.to(room).emit('user_count_update', userCount);
  });

  // Chat messages (send/receive)
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.room).emit('user_typing', {
      username: data.username,
      userId: data.userId
    });
  });

  // Stop typing indicator
  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('user_stopped_typing', {
      username: data.username,
      userId: data.userId
    });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`[${new Date().toISOString()}] socket disconnected:`, socket.id, reason);
    if (socket.room) {
      removeUserFromRoom(socket.room, socket.id);
      const userCount = getRoomUserCount(socket.room);
      io.to(socket.room).emit('user_count_update', userCount);
    }
  });
});

// ==========================================
//  Helper functions for room management
// ==========================================
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

// ==========================================
//  Serve React build files (client/dist)
// ==========================================
app.use(express.static(path.join(__dirname, '../client/dist')));

// For SPA routing (React Router fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ==========================================
//  Start the server
// ==========================================
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
