# Real-Time Chat Application

A real-time chat application built with React (frontend) and Node.js (backend) using Socket.IO for real-time communication.

## Project Structure

```
REAL TIME CHAT APPLICATION/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend
└── README.md        # This file
```

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Clone or Download the Project

Navigate to the project directory:

```bash
cd "REAL TIME CHAT APPLICATION"
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Setup

Create a `.env` file in the server directory (optional):

```bash
cd ../server
# Create .env file with:
PORT=3001
```

### 5. Running the Application

#### Start the Server (Backend)

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3001`

#### Start the Client (Frontend)

In a new terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Features

- Real-time messaging using Socket.IO
- Room-based chat functionality
- Cross-origin resource sharing (CORS) enabled
- Hot reload for development

## Technology Stack

### Frontend (Client)

- React 18
- Vite (Build tool)
- Socket.IO Client

### Backend (Server)

- Node.js
- Express.js
- Socket.IO
- CORS middleware

## Development Scripts

### Server Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Client Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

- `GET /` - Server health check
- WebSocket events:
  - `join_room` - Join a chat room
  - `send_message` - Send a message to a room
  - `receive_message` - Receive messages from a room

## Troubleshooting

1. **Port conflicts**: If ports 3001 or 5173 are in use, modify the port in the respective configuration files.

2. **CORS issues**: The server is configured to allow requests from `http://localhost:5173`. If you change the client port, update the CORS configuration in `server/index.js`.

3. **Socket connection issues**: Ensure both client and server are running and check the browser console for connection errors.

## Next Steps

1. Implement user authentication
2. Add message persistence with a database
3. Add file sharing capabilities
4. Implement typing indicators
5. Add user profiles and avatars

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License
