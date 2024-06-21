import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import './App.css';

const socket = io("http://localhost:4000");

function App() {

  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roomParam = queryParams.get('room');
    if (roomParam) {
      setRoom(roomParam);
      socket.emit('join', roomParam);
    }

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('roomCreated', (room) => {
      const url = `${window.location.origin}?room=${room}`;
      window.prompt("Room created! Share this link to invite others:", url);
    });

    socket.on('updateUserList', (users) => {
      setUsers(users);
    })

    return () => {
      socket.off('message');
      socket.off('roomCreated');
      socket.off('updateUserList');
    };
  }, [])

  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit('create', room);
    setRoom('');
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('message', { room, message });
    setMessage('')
  }

  return (
    <div className='chat-container'>
      <h2>Realtime Chat</h2>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form>
        <div className='msg-input'>
          <input
            type='text'
            placeholder='Enter message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="room-input">
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}></input>
          <button onClick={joinRoom}>Join Room</button>
        </div>

        <div className="users-list">
          {users.map((usr, index) => (
            <div key={index}>{usr}</div>
          ))}
        </div>
      </form>
    </div>
  )
}

export default App;