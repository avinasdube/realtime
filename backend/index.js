import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);

const PORT = 4000;

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
})

let connections = [];

io.on('connect', (socket) => {

    connections.push(socket.id);
    console.log("Currently connected:", connections);
    io.emit('updateUserList', connections);

    // an event to create and join a room at first place
    socket.on('create', (room) => {
        console.log(`${socket.id} created : ${room}`);
        socket.join(room);
        socket.emit('roomCreated', room); // informing creator that room is created.
    })

    // an event to let others join a room
    socket.on('join', (room) => {
        console.log(`${socket.id} created : ${room}`);
        socket.join(room);
    })

    // an event to broadcast the message to all members of same room
    socket.on('message', ({ room, message }) => {
        console.log(`Message received in room ${room}: `, message);
        io.to(room).emit('message', message); // Broadcast the message to all members in the room
    });

    // an event to show disconnected users
    socket.on('disconnect', () => {
        connections = connections.filter(conn => conn !== socket.id);
        console.log("Just Disconnected : ", socket.id)
        console.log("Currently remaining connections : ", connections);
        io.emit('updateduserList', connections);
    })
})

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})