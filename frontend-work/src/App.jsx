import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar openChat={() => setIsChatOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {isChatOpen && <Chatbot closeChat={() => setIsChatOpen(false)} />}
    </BrowserRouter>
  );
}

export default App;