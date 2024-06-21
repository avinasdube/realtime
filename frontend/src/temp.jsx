// import { useEffect, useState } from 'react';
// import './App.css';
// import { io } from 'socket.io-client';

// function App() {

//   const socket = io('http://localhost:4000');

//   const [room, setRoom] = useState('');
//   const [message, setMessage] = useState('')
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     })

//     return () => {
//       socket.off('message');
//     }
//   }, [socket])

//   const joinRoom = () => {
//     if (room.trim()) {
//       socket.emit('joinRoom', room);
//       console.log(`Joined room: ${room}`);
//     }
//   };

//   const leaveRoom = () => {
//     if (room.trim()) {
//       socket.emit('leaveRoom', room);
//       console.log(`Left room: ${room}`);
//     }
//   };

//   const sendMessage = () => {
//     if (message.trim() && room) {
//       console.log(`Sending message to room ${room}: ${message}`);
//       socket.emit('message', message);
//       setMessage('');
//     }
//   };

//   return (
//     <div className='chat-container'>
//       <h2>Realtime Chat</h2>
//       <div className="message-container">
//         {messages.map((msg, index) => {
//           <div key={index}>{msg}</div>
//         })}
//       </div>
//       <form>
//         <div className='msg-input'>
//           <input
//             type='text'
//             placeholder='Enter message'
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           ></input>
//           <button onClick={sendMessage}>Send</button>
//         </div>
//         <div className="room-input">
//           <input
//             type='text'
//             placeholder='Enter room name'
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//           ></input>
//           <button onClick={joinRoom}>Join Room</button>
//           <button onClick={leaveRoom}>Leave Room</button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default App;

-------------------------------------------------------------------------------------------


// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';

// const app = express();
// const httpServer = http.createServer(app);

// const PORT = 4000;

// const io = new Server(httpServer, {
//     cors: {
//         origin: "http://localhost:5173",
//     }
// });

// // // configuring app middlewares
// // app.use(cors(corsOptions));
// // app.use(express.json({ limit: "16kb" }));
// // app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// // app.use('/request', (req, res) => {
// //     console.log(req.body);
// // })

// io.on("connection", (socket) => {
//     console.log('A user connected');

//     // // Join a room
//     // socket.on('joinRoom', (room) => {
//     //     socket.join(room);
//     //     console.log(`User joined room: ${room}`);
//     // });

//     // // Leave a room
//     // socket.on('leaveRoom', (room) => {
//     //     socket.leave(room);
//     //     console.log(`User left room: ${room}`);
//     // });

//     // Handle incoming messages
//     socket.on('message', (message) => {
//         console.log(`Message received : ${message}`);
//         io.emit('message', message); // Broadcast to the room
//     });

//     // Handle disconnection
//     // socket.on('disconnect', () => {
//     //     console.log('A user disconnected');
//     // });
// })

// httpServer.listen(PORT);