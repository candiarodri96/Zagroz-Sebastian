import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Results from "./pages/Results";
import AdDetail from "./pages/AdDetail";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import MyAds from "./pages/MyAds";
import MyOffers from "./pages/MyOffers";
import NegotiationChat from "./pages/NegotiationChat";
import ContractView from "./pages/ContractView";
import Messages from "./pages/Messages";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar openChat={() => setIsChatOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/results" element={<Results />} />
        <Route path="/ads/:id" element={<AdDetail />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-ads" element={<MyAds />} />
        <Route path="/my-offers" element={<MyOffers />} />
        <Route path="/chat/:adId" element={<NegotiationChat />} />
        <Route path="/contract/:adId" element={<ContractView />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>

      {isChatOpen && <Chatbot closeChat={() => setIsChatOpen(false)} />}
    </BrowserRouter>
  );
}

export default App;