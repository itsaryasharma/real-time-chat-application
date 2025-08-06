import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const Chat = () => {
  // State management for chat functionality
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('general');
  const [customRoom, setCustomRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Refs for DOM manipulation and socket connection
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Predefined rooms available for selection
  const predefinedRooms = ['general', 'tech', 'random', 'gaming', 'music', 'memes'];

  // Load username and room from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername');
    const savedRoom = localStorage.getItem('chatRoom');
    
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      // Generate unique username if none saved
      const generateUniqueUsername = () => {
        const adjectives = ['Happy', 'Clever', 'Brave', 'Wise', 'Swift', 'Bright', 'Calm', 'Eager'];
        const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Phoenix', 'Wolf', 'Lion', 'Bear'];
        const randomNum = Math.floor(Math.random() * 1000);
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adjective}${noun}${randomNum}`;
      };
      setUsername(generateUniqueUsername());
    }
    
    if (savedRoom) {
      setRoom(savedRoom);
    }

    // Generate unique user ID for distinguishing between users with same username
    const generateUserId = () => {
      return 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    };
    setUserId(generateUserId());
  }, []);

  // Save username and room to localStorage when they change
  useEffect(() => {
    if (username) {
      localStorage.setItem('chatUsername', username);
    }
  }, [username]);

  useEffect(() => {
    if (room) {
      localStorage.setItem('chatRoom', room);
    }
  }, [room]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change with a small delay for DOM update
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  // Socket.IO connection and event handling
  useEffect(() => {
    socket.current = io('http://localhost:3001');

    // Handle successful connection
    socket.current.on('connect', () => {
      // console.log('Socket.IO connection opened');
      setIsConnected(true);
      // Join the current room when connected
      socket.current.emit('join_room', room);
    });

    // Handle disconnection
    socket.current.on('disconnect', () => {
      // console.log('Socket.IO connection closed');
      setIsConnected(false);
    });

    // Listen for incoming messages from other users
    socket.current.on('receive_message', (data) => {
      // console.log('Received message:', data);
      setMessages(prevMessages => [...prevMessages, data]);
    });

    // Listen for real-time user count updates
    socket.current.on('user_count_update', (count) => {
      // console.log('User count updated:', count);
      setOnlineUsers(count);
    });

    // Listen for typing indicators
    socket.current.on('user_typing', (data) => {
      // console.log('User typing:', data);
      setTypingUsers(prevUsers => {
        // Add user to typing list if not already there
        if (!prevUsers.find(user => user.userId === data.userId)) {
          return [...prevUsers, { username: data.username, userId: data.userId }];
        }
        return prevUsers;
      });
    });

    // Listen for typing stop indicators
    socket.current.on('user_stopped_typing', (data) => {
      // console.log('User stopped typing:', data);
      setTypingUsers(prevUsers => 
        prevUsers.filter(user => user.userId !== data.userId)
      );
    });

    // Cleanup socket connection on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [room]); // Re-run when room changes

  // Function to join a new room and leave the current one
  const joinRoom = (newRoom) => {
    if (socket.current && socket.current.connected) {
      // Leave current room to clean up server-side tracking
      socket.current.emit('leave_room', room);
      
      // Join new room
      socket.current.emit('join_room', newRoom);
      
      // Clear messages when switching rooms
      setMessages([]);
      setRoom(newRoom);
      setCustomRoom(''); // Clear custom room input
      setTypingUsers([]); // Clear typing users when switching rooms
    }
  };

  // Handle room selection from dropdown
  const handleRoomChange = (e) => {
    const selectedRoom = e.target.value;
    joinRoom(selectedRoom);
  };

  // Handle joining a custom room
  const handleCustomRoomJoin = () => {
    const trimmedRoom = customRoom.trim();
    if (trimmedRoom && socket.current && socket.current.connected) {
      joinRoom(trimmedRoom);
    }
  };

  // Clear saved data and reload the app
  const handleClearSavedData = () => {
    // Remove saved data from localStorage
    localStorage.removeItem('chatUsername');
    localStorage.removeItem('chatRoom');
    localStorage.removeItem(`chatMessages-${room}`);
    // Reload the app to reset state
    window.location.reload();
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle typing events with debouncing
  const handleTyping = () => {
    if (socket.current && socket.current.connected && isUsernameValid()) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing event if not already typing
      if (!isTyping) {
        socket.current.emit('typing', {
          room: room,
          username: username,
          userId: userId
        });
        setIsTyping(true);
      }

      // Set timeout to stop typing indicator after 2 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit('stop_typing', {
          room: room,
          username: username,
          userId: userId
        });
        setIsTyping(false);
      }, 2000);
    }
  };

  // Send message to the current room
  const sendMessage = () => {
    const trimmedUsername = username.trim();
    const trimmedMessage = message.trim();
    
    // Validate connection, message, and username before sending
    if (socket.current && socket.current.connected && trimmedMessage && trimmedUsername && trimmedUsername !== 'User') {
      const messageData = {
        message: trimmedMessage,
        room: room,
        author: trimmedUsername,
        userId: userId, // Include unique user ID to prevent conflicts
        time: new Date().toLocaleTimeString()
      };
      
      // Clear typing indicator when sending message
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.current.emit('stop_typing', {
        room: room,
        username: username,
        userId: userId
      });
      setIsTyping(false);
      
      // Add message to local state immediately for instant feedback
      setMessages(prevMessages => [...prevMessages, messageData]);
      
      // Send message to server for broadcasting to other users
      socket.current.emit('send_message', messageData);
      setMessage(''); // Clear input field
    } else {
      // Show appropriate error messages
      if (!trimmedUsername || trimmedUsername === 'User') {
        alert('Please set a unique username before sending messages!');
      } else if (!trimmedMessage) {
        alert('Please enter a message to send!');
      } else {
        console.warn('Socket.IO is not connected');
      }
    }
  };

  // Handle Enter key press in message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Handle message input change with typing indicator
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    handleTyping(); // Trigger typing indicator
  };

  // Validate username for UI feedback
  const isUsernameValid = () => {
    const trimmedUsername = username.trim();
    return trimmedUsername && trimmedUsername !== 'User';
  };

  // Format typing indicator text
  const getTypingText = () => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) {
      return `${typingUsers[0].username} is typing...`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
    }
    return `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing...`;
  };

  return (
    <div className="chat-app">
      {/* Hamburger Menu Button - Always visible on main screen */}
      <div className={`hamburger-menu ${sidebarOpen ? 'hidden' : ''}`}>
        <button 
          className="hamburger-button"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <div className={`hamburger-icon ${sidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="menu-text">Menu</span>
        </button>
      </div>

      {/* Sidebar with Glass Effect */}
      <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="header-content">
            <h2>Chat Settings</h2>
            <div className="connection-status">
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
          </div>
          {/* Close button in sidebar header */}
          <button 
            className="close-sidebar-button"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <div className="close-icon">
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Username Section */}
        <div className="sidebar-section">
          <h3>Your Identity</h3>
          <div className="input-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className={`username-input ${!isUsernameValid() ? 'error' : ''}`}
            />
            {!isUsernameValid() && (
              <div className="error-message">
                ⚠️ Please enter a unique username
              </div>
            )}
          </div>
        </div>

        {/* Room Selection Section */}
        <div className="sidebar-section">
          <h3>Room Selection</h3>
          <div className="input-group">
            <label htmlFor="room-dropdown">Select Room</label>
            <select 
              id="room-dropdown"
              value={room} 
              onChange={handleRoomChange}
              className="room-dropdown"
            >
              {predefinedRooms.map(roomName => (
                <option className="dropdown-option" clakey={roomName} value={roomName}>
                  #{roomName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="custom-room-input">Custom Room</label>
            <div className="custom-room-input-group">
              <input
                id="custom-room-input"
                type="text"
                value={customRoom}
                onChange={e => setCustomRoom(e.target.value)}
                placeholder="Enter room name..."
                className="custom-room-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomRoomJoin();
                  }
                }}
                
              />
              <button 
                onClick={handleCustomRoomJoin}
                className="join-room-button"
                disabled={!customRoom.trim()}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Online Users Section */}
        <div className="sidebar-section">
          <h3>Room Info</h3>
          <div className="room-info-card">
            <div className="info-item">
              <span className="info-label">Current Room:</span>
              <span className="info-value">#{room}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Online Users:</span>
              <span className="info-value">{onlineUsers} user{onlineUsers !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Clear Saved Data Button */}
        <div className="sidebar-footer">
          <button 
            onClick={handleClearSavedData}
            className="clear-data-button"
            title="Clear saved username and room, then reload the app"
          >
            🗑️ Clear Saved Data
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

      {/* Chat Window - Full Width */}
      <div className="chat-window">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-content">
            <h1>#{room}</h1>
            <div className="chat-header-info">
              <span className="online-indicator">
                {onlineUsers} user{onlineUsers !== 1 ? 's' : ''} online
              </span>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Welcome to #{room}!</h3>
              <p>Start the conversation by sending a message.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              // Determine if message is outgoing (sent by current user) or incoming (from others)
              // Compare by userId first for accuracy, then by username as fallback
              const isOutgoing = msg.userId === userId || (msg.userId === undefined && msg.author === username);
              
              return (
                <div 
                  key={index} 
                  className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`}
                >
                  <div className="message-bubble">
                    {/* Only show author name for incoming messages (not your own) */}
                    {!isOutgoing && <div className="message-author">{msg.author}</div>}
                    <div className="message-text">{msg.message}</div>
                    <div className="message-time">{msg.time}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-content">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">{getTypingText()}</span>
            </div>
          </div>
        )}

        {/* Message Input Section */}
        <div className="message-input-section">
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="message-input"
              disabled={!isUsernameValid()}
            />
            <button 
              onClick={sendMessage} 
              className="send-button"
              disabled={!isUsernameValid() || !message.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;