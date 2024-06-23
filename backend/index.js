import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import { join } from "path";

const app = express();
const httpServer = http.createServer(app);

const PORT = 4000;

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
})

let connections = [];
let activeRooms = [];

io.on('connect', (socket) => {

    connections.push(socket.id);
    console.log("Currently connected:", connections);
    io.emit('updateUserList', connections);

    // an event to create and join a room at first place
    socket.on('createRoom', ({ currentUser, room }) => {
        console.log(`${currentUser} created : ${room.roomName}`);
        socket.join(room.roomName);
        activeRooms.push(room);
        socket.emit('roomCreated', room); // informing creator that room is created.
    })

    // send the list of active rooms to client
    socket.emit('activeRooms', activeRooms);

    // an event to let others join a room
    socket.on('joinRoom', (roomName) => {
        console.log(`${socket.id} joined : ${roomName}`);
        socket.join(roomName);
    })

    // an event to fetch historical messages for a room
    socket.on('getMessages', (roomName) => {
        // Assuming messages are stored in an array per room on the server
        const historicalMessages = activeRooms.find(room => room.roomName === roomName)?.messages || [];
        socket.emit('messages', historicalMessages);
    });

    // an event to broadcast the message to all members of same room
    socket.on('message', ({ currentRoom, message }) => {
        console.log(`Message received in room ${currentRoom}: `, message);
        io.to(currentRoom).emit('message', message); // Broadcast the message to all members in the room
    });

    // an event to show disconnected users
    socket.on('disconnect', () => {
        connections = connections.filter(id => id !== socket.id);
        console.log("Just Disconnected:", socket.id);
        console.log("Currently remaining connections:", connections);
        io.emit('updateUserList', connections);
    });
})

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})