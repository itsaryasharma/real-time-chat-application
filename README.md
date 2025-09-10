# 🟢 REAL-TIME CHAT APPLICATION

![GitHub repo size](https://img.shields.io/github/repo-size/itsaryasharma/real-time-chat-application)
![GitHub stars](https://img.shields.io/github/stars/itsaryasharma/real-time-chat-application?style=social)
![Deployed on Render](https://img.shields.io/badge/Backend%20Deployed-Render-blue)
![Status](https://img.shields.io/badge/Status-Live%20%7C%20Working-brightgreen)
![Built with](https://img.shields.io/badge/Built%20With-React%20%7C%20Node.js%20%7C%20Socket.IO-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## 📚 TABLE OF CONTENTS

- [Live Demo](#-live-demo)
- [Project Overview](#-project-overview)
- [Key Learnings](#-key-learnings)
- [Project Structure](#-project-structure)
- [Tech Stack](#️-tech-stack)
- [Features](#-features)
- [How to Run Locally](#️-how-to-run-locally)
- [WebSocket Events](#-web-socket-events)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

## 🌐 Live Demo 👉 [Check it out on Render](https://real-time-chat-application-rk6g.onrender.com)

---

**COMPANY:** CODETECH IT SOLUTIONS

**NAME:** ARYA KUMAR

**INTERN ID:** CT04DZ311

**DOMAIN:** FRONTEND WEB DEVELOPMENT

**DURATION:** 4 WEEKS

**MENTOR:** NEELA SANTOSH

---

## 📦 PROJECT OVERVIEW

As part of my internship at **CodeTech IT Solutions**, I built a production-ready real-time chat application using **React (Vite), Node.js, Express, and Socket.IO**.

Key features:

- Real-time messaging across multiple dynamic chat rooms
- Online user counts per room + clean room switching
- Responsive, modern UI styled with plain CSS

On the **frontend**, I used React hooks to manage socket events and update the UI instantly.  
On the **backend**, an Express + Socket.IO server handled room events like join, leave, and broadcast.

This project gave me hands-on experience with **full-stack real-time communication**, covering WebSockets vs REST, event-driven design, and state management. It’s deployable (Render + Vercel) and ready for enhancements like typing indicators and authentication.

## 🧠 KEY LEARNINGS

- Real-time bidirectional communication with **Socket.IO**
- Managing chat rooms and per-room user counts
- Uploading and serving files securely via **Multer** (UUID filenames)
- Environment-driven CORS configuration for safe deployment
- React hooks and lifecycle for real-time UI updates (`useState`, `useEffect`, `useRef`)
- Deployment strategies and trade-offs (committing `client/dist` vs. building on deploy)
- Preserving contributor authorship when merging PRs

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

---

| Layer                 | Technology                                    |
| --------------------- | --------------------------------------------- |
| Frontend              | React, Vite                                   |
|                       | Socket.IO                                     |
|                       | Client,axios                                  |
|                       |                                               |
| Backend               | Node.js,                                      |
|                       | Express.js                                    |
|                       | Socket.IO                                     |
|                       | Multer                                        |
|                       |                                               |
| Protocol              | WebSockets                                    |
|                       |                                               |
| Tools                 | UUID, CORS                                    |
|                       | dotenv                                        |
|                       |                                               |
| Ready for Deployment? | ✅ Yes (`Vercel` + `Render` or VPS supported) |
|                       |                                               |

---

## 🚀 FEATURES

- ⚡ Real-time messaging (Socket.IO)
- 🧑‍🤝‍🧑 Dynamic chat rooms (predefined + custom)
- 🌐 Live online user counts per room
- ✍️ Typing indicators
- 👤 Username persistence via `localStorage`
- 📎 **File & Image Uploads** (Multer + Axios)
- 🖼️ Image preview inline within chat bubbles
- 💻 Responsive, mobile-friendly UI

---

🚀 **This project is a functional MVP (Minimum Viable Product)** of a real-time chat application.  
It demonstrates end-to-end WebSocket communication using **React**, **Node.js**, **Express**, and **Socket.IO** — without needing authentication or a database.

Users can:

- Join any room
- Send and receive real-time messages
- See how many users are online
- Instantly connect across the globe
- Send images and files in chat

This MVP proves the core functionality works and lays the foundation for future upgrades like login, database storage, private messaging, and more.

---

## 🛠️ HOW TO RUN LOCALLY

### 1. Clone the Repository

```bash
git clone https://github.com/itsaryasharma/real-time-chat-application
cd real-time-chat-application
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
- Upload endpoint: POST /upload (multipart/form-data) → returns { url, filename }

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
- 🧾 Message persistence via database
- 🧑 User profiles and avatars

---

## 🤝 CONTRIBUTING

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and submit a pull request

---

## 🤗 ACKNOWLEDGEMENTS

Special thanks to **Aditya Anurag** for implementing the **file & image upload feature**  
(Multer integration, image preview in chat, and file handling).  
His contribution is included in this project and preserved in the commit history.

---

## 📜 LICENSE

MIT License

---

# OUTPUTS

<img width="1907" height="865" alt="Image" src="https://github.com/user-attachments/assets/5660d241-927f-4764-9173-2cee815eafc1" />

<img width="1907" height="872" alt="Image" src="https://github.com/user-attachments/assets/9e42a11c-eb11-495b-b6bb-5ae0e538e4ef" />

<img width="1910" height="867" alt="Image" src="https://github.com/user-attachments/assets/c3feb336-257c-43fd-87a3-96f4d1d3788d" />

<img width="1917" height="872" alt="Image" src="https://github.com/user-attachments/assets/889aed1a-396c-4e1a-95b3-a8e1f2251b7e" />

<img width="1916" height="871" alt="Image" src="https://github.com/user-attachments/assets/610a51e7-2d49-4436-bcd9-1ca65bab9c9b" />

<img width="1917" height="870" alt="Image" src="https://github.com/user-attachments/assets/3de3df62-9cc1-42e4-aa71-ddfe6b682b95" />

---

> **Thank you for reviewing my project!**
