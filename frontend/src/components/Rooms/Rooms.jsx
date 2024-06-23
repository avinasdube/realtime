import React, { useEffect, useState } from "react";
import './Rooms.css';

import socket from "../../socket";
import { Link, useNavigate, useParams } from "react-router-dom";

const Rooms = () => {
    const navigate = useNavigate();
    const [room, setRoom] = useState({
        roomName: '',
        roomUrl: ''
    });
    const [activeRooms, setActiveRooms] = useState([]);
    const currentUser = useParams().username.toLowerCase();

    useEffect(() => {
        // fetch list of activeRooms from the server when component mounts
        socket.on('activeRooms', (rooms) => {
            setActiveRooms(rooms)
        })

        socket.on('roomCreated', (newRoom) => {
            setActiveRooms((prevActiveRooms) => [...prevActiveRooms, newRoom]);
        });

        return () => {
            socket.off('activeRooms')
            socket.off('roomCreated')
        };
    }, [])

    const handleRoomInput = (e) => {
        const trimmedRoomName = e.target.value.trim();
        setRoom({ ...room, roomName: trimmedRoomName });
    }

    const createRoom = (e) => {
        e.preventDefault();

        if (room.roomName) {
            socket.emit('createRoom', { currentUser, room });
            setRoom({ roomName: '', roomUrl: '' });
        } else {
            alert("Enter a room name first !");
        }
    }

    const handleJoinRoom = (roomName) => {
        socket.emit('joinRoom', roomName); // Emit joinRoom event with roomName to server
    };

    return currentUser ? (
        <div className="rooms-container">
            <header>Rooms</header>
            {activeRooms.length > 0 ?
                <div className="active-rooms">
                    <div className="heading">Active Rooms</div>
                    <div className="rooms-list">
                        {activeRooms.map((activeRoom, index) => (
                            <Link
                                key={index}
                                to={`/room/${activeRoom.roomName}`}
                                onClick={() => handleJoinRoom(activeRoom.roomName)}>
                                {activeRoom.roomName}
                            </Link>
                        ))}
                    </div>
                </div> : ''}
            <div className="room-input">
                <input
                    type="text"
                    placeholder="Enter room name"
                    value={room.roomName}
                    onChange={handleRoomInput}></input>
                <button onClick={createRoom}>Create Room</button>
            </div>

            <div className="current-user">
                <div className="c-u-label">Currently logged in as : </div>
                <div className="c-u-name">{currentUser}</div>
            </div>
        </div>
    ) : navigate('/');
}

export default Rooms;