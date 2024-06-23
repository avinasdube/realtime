import React, { useState } from "react";
import './Welcome.css';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const [username, setUsername] = useState('');
    const [notice, setNotice] = useState('');
    const navigate = useNavigate();

    const handleConnect = (e) => {
        if (username) {
            e.preventDefault();
            navigate(`/${username.trim().toLowerCase()}`);
        } else {
            setNotice("Please enter a username to continue !");
            setTimeout(() => {
                setNotice('');
            }, 3000);
            return;
        }
    }

    return (
        <div className="welcome-container">
            <div className="heading">Welcome to Realtime</div>
            <input type="text" placeholder="Enter your name" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            {notice && <div className="err">{notice}</div>}
            <button onClick={handleConnect}>Connect to Realtime</button>
        </div>
    )
}

export default Welcome;