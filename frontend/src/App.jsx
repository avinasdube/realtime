import React from "react";
import './App.css';
import Welcome from "./components/Welcome/Welcome";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Rooms from "./components/Rooms/Rooms";
import Chat from "./components/Main/Chat";

function App() {
  const router = createHashRouter([
    {
      path: '/',
      element: <Welcome />
    },
    {
      path: '/:username',
      element: <Rooms />
    },
    {
      path: '/room/:activeRoomName',
      element: <Chat />
    }
  ])
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App;