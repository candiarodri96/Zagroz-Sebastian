import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";

function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Navbar openChat={() => setIsChatOpen(true)} />
      <Outlet />

      {isChatOpen && (
        <Chatbot closeChat={() => setIsChatOpen(false)} />
      )}
    </>
  );
}

export default MainLayout;