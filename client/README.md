# 💬 Real-Time Chat Client — React + Vite

This is the **frontend (client)** part of a full-stack real-time chat application built using **React**, **Socket.IO**, and **Vite**.

---

## ⚙️ Tech Stack (Frontend)

- ✅ **React** (with hooks)
- ✅ **Vite** (for fast dev server and build)
- ✅ **Socket.IO Client** (real-time communication)
- ✅ **CSS / Custom Styling** (responsive + professional UI)
- ✅ **LocalStorage** (for username persistence)

---

## 🧠 Key Features

- 🔹 Join specific chat rooms  
- 🔹 See and switch rooms dynamically  
- 🔹 Real-time messages sent and received instantly  
- 🔹 User count per room displayed  
- 🔹 Username is stored and reused via `localStorage`  
- 🔹 Responsive layout (Desktop-first, Mobile supported)

---

## 🧪 How to Run (Dev Mode)

Make sure your **backend Socket.IO server** is already running.

```bash
cd client
npm install
npm run dev
```

App will run at:  
🌐 `http://localhost:5173/`

> If you're using Vite, it should auto-refresh changes and support hot module reload.

---

## 🧠 Developer Notes

- The frontend connects to the backend using `socket.io-client` and joins a room with the selected or entered room name.
- Messages are emitted via sockets and received through real-time listeners (`socket.on(...)`).
- UI components include: Room selector dropdown, chat message display area, input box, and a sidebar (optional).
- `localStorage` is used to save the username so the user doesn't have to enter it every time.

---

## 📁 Folder Structure

```
client/
├── public/
├── src/
│   ├── components/
│   │   └── Chat.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── Chat.css
├── index.html
├── package.json
└── vite.config.js
```

---

## 🧠 What I Learned

While building this frontend, I explored:

- Managing socket connections in React using `useEffect`, `useRef`, and `useState`
- Listening and emitting socket events cleanly
- Cleanup on component unmount to avoid memory leaks
- UI component structure and state flow in a real-time app
- Using `localStorage` to persist user identity across reloads
- Creating mobile-responsive layouts with custom styling


---

## 🚀 Deployment

You can easily deploy the client on platforms like:

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**

Set the backend server URL in the code if deploying separately.

---
