import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import MyAds from "./pages/MyAds";
import MyOffers from "./pages/MyOffers";
import NegotiationChat from "./pages/NegotiationChat";
import ContractView from "./pages/ContractView";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar openChat={() => setIsChatOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-ads" element={<MyAds />} />
        <Route path="/my-offers" element={<MyOffers />} />
        <Route path="/chat/:adId" element={<NegotiationChat />} />
        <Route path="/contract/:adId" element={<ContractView />} />
      </Routes>

      {isChatOpen && <Chatbot closeChat={() => setIsChatOpen(false)} />}
    </BrowserRouter>
  );
}

export default App;