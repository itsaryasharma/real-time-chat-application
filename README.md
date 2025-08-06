# 🟢 REAL-TIME CHAT APPLICATION

**COMPANY:** CODETECH IT SOLUTIONS

**NAME:** ARYA KUMAR

**INTERN ID:** CT04DZ311

**DOMAIN:** FRONTEND WEB DEVELOPMENT

**DURATION:** 4 WEEKS

**MENTOR:** NEELA SANTOSH

---

## 📦 PROJECT OVERVIEW

This real-time chat application was developed as part of my internship at CodeTech IT Solutions, under the domain of Full Stack Web Development. The project was built using a modern and scalable tech stack including React.js, Node.js, Express, and Socket.IO, with the goal of learning how real-time communication works in web applications. The final outcome is a responsive, desktop-first chat system that enables seamless messaging between users across dynamic chat rooms.

- The application offers a variety of interactive features such as:

- Real-time message sending and receiving using WebSockets

- Support for multiple chat rooms that users can dynamically join or leave

- A live counter showing the number of online users in each room

- Clean room switching functionality

- Ability to set and persist a custom username across sessions using localStorage

While building this application, I focused not just on implementing the features, but also on deeply understanding the underlying technologies. The project uses Socket.IO, a library built on top of WebSockets, to create full-duplex real-time communication between the frontend and backend. Every time a user opens the application, a new socket connection is established, uniquely identified by a socket ID. This ID is used by the server to manage events like joining rooms, sending messages, and broadcasting updates to the right users.

On the frontend, I used React.js with Vite for a fast development setup. I built reusable components and managed state using React hooks like useState, useEffect, and useRef. These allowed me to listen to incoming socket events and update the UI instantly. I also added a room selector, username input, and chat history pane to make the experience more user-friendly. The user interface was designed to be clean, modern, and scalable, with professional layout and styling done entirely using plain CSS (without UI libraries).

The backend was developed using Node.js and Express, and it acts as the WebSocket server using socket.io. The server listens for events like join_room or send_message, and then emits those messages to users in the same room. Thanks to Socket.IO’s built-in room feature, there’s no need for a complex mapping system — the server automatically handles which user belongs to which room.

What makes this project even more meaningful is that I didn't just write code blindly. I used AI pair-programming tools to get help when I was stuck — but always ensured I understood what every line of code did. I treated these tools as collaborators, not crutches. By doing this, I gained confidence in how a real-time app is built and deployed.

Through this experience, I’ve learned full-stack concepts such as client-server communication, REST vs WebSocket protocols, event-driven architectures, state management in React, and how real-time systems handle concurrency and synchronization.

The entire project is production-ready and can be deployed using services like Render for the backend and Vercel for the frontend. With further enhancements such as user authentication, typing indicators, file sharing, and database integration, this app could evolve into a fully functional messaging platform.

In conclusion, this internship project was not just an exercise in building a working app — it was a deep dive into how modern web systems function under the hood. I now feel confident in saying that I understand the full stack life cycle of a real-time application, and I can apply these skills to future web development challenges.

## 🧠 KEY LEARNINGS

- Real-time bi-directional communication using **WebSockets / Socket.IO**
- Creating and managing dynamic **chat rooms**
- Emitting and listening for socket events like `join_room`, `send_message`, and `receive_message`
- Maintaining socket sessions, user states, and rooms
- Frontend concepts like `useEffect`, `useRef`, `useState`, and component-based structure
- Responsive and professional UI using plain CSS (no libraries used)
- Client-server communication using REST and Socket events
- Local storage for persisting user information
- Clean and production-ready folder structure
- Git & GitHub version control with clean commit history

---

## 🧱 PROJECT STRUCTURE

```
REAL-TIME-CHAT-APPLICATION/
├── client/          # React frontend (Vite)
│   └── README.md
├── server/          # Node.js backend
│   
└── README.md        # ← You're here (Root README)
```

---

## ⚙️ TECH STACK

| Layer    | Technology  |
| -------- | ----------- |
| Frontend | React, Vite |
|          | Socket.IO   |
|          | Client      |
| Backend  | Node.js,    |
|          | Express.js  |
|          | Socket.IO   |
| Protocol | WebSockets  |

| Ready for Deployment? | ✅ Yes (`Vercel` + `Render` or VPS supported) |

---

## 🚀 FEATURES

- ⚡ Real-time messaging
- 🧑‍🤝‍🧑 Dynamic chat rooms
- 🌐 Socket.IO connection and broadcasting
- 👤 Username persistence using `localStorage`
- 👁️ Online users count per room
- 💻 Desktop-first responsive UI with mobile support
- 🧼 Clean code and structured file system

---

🚀 **This project is a functional MVP (Minimum Viable Product)** of a real-time chat application.  
It demonstrates end-to-end WebSocket communication using **React**, **Node.js**, **Express**, and **Socket.IO** — without needing authentication or a database.  

Users can:
- Join any room
- Send and receive real-time messages
- See how many users are online
- Instantly connect across the globe

This MVP proves the core functionality works and lays the foundation for future upgrades like login, database storage, private messaging, and more.

---

## 🛠️ HOW TO RUN LOCALLY

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/real-time-chat-app.git
cd real-time-chat-app
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. (Optional) Setup Environment Variable

Create a `.env` file inside the `server` folder:

```env
PORT=3001
```

---

### 5. Run the Application

#### Start the Server

```bash
cd server
npm run dev
```

The server will start on: `http://localhost:3001`

#### Start the Client

In a new terminal:

```bash
cd client
npm run dev
```

The client will start on: `http://localhost:5173`

---

## 🌐 ACCESS

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 🧪 WEB SOCKET EVENTS

| Event Name        | Description                |
| ----------------- | -------------------------- |
| `join_room`       | User joins a room          |
| `send_message`    | User sends a message       |
| `receive_message` | Others receive the message |

---

## 🐞 TROUBLESHOOTING

1. **Port Conflicts**  
   Change ports in `.env` or Vite config if `3001` or `5173` are in use.

2. **CORS Errors**  
   Server allows requests from `http://localhost:5173` — update if changed.

3. **Socket Errors**  
   Make sure both client and server are running and refresh the browser.

---

## 🚧 FUTURE IMPROVEMENTS

- 🔒 User authentication system
- 💬 Typing indicators
- 🧾 Message persistence via database
- 📎 File/image sharing
- 🧑 User profiles and avatars
- 🌍 Deployment to Render/Vercel for global access

---

## 🤝 CONTRIBUTING

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and submit a pull request

---

## 📜 LICENSE

ISC License

---

# OUTPUTS

---

> **Thank you for reviewing my project!**
