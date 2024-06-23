import React, { useEffect, useState } from "react";
import './Chat.css';

import socket from "../../socket";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
    const navigate = useNavigate();

    const [activeRoom, setActiveRoom] = useState('');

    const { activeRoomName } = useParams();
    const currentUser = useParams().activeRoomName.toLowerCase();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (activeRoomName) {
            setActiveRoom(currentUser.trim());
            socket.emit('joinRoom', currentUser.trim()); // Join the current active room
            socket.emit('getMessages', currentUser);
        }

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('updateUserList', (users) => {
            setUsers(users);
        })

        return () => {
            socket.off('message');
            socket.off('updateUserList');
            socket.off('joinRoom');
            socket.off('getMessages');
        }

    }, [activeRoomName, currentUser])


    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('message', { currentRoom: activeRoom, message });
        setMessage('');
    }

    return (
        users ? <div className='chat-container'>
            <div className="left-side">
                <header>Realtime Chat</header>
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
                </form>
            </div>
            <div className="right-side">
                <div className="users-list">
                    <header>Currently Active</header>
                    {users.map((usr, index) => (
                        <div key={index}>{index} {usr}</div>
                    ))}
                </div>
            </div>
        </div> : navigate('/')
    )
}

export default Chat;