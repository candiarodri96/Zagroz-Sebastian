import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send } from "lucide-react";
import { getResponse } from "../utils/chatbotKnowledge";

function Chatbot({ closeChat }) {
  const API = import.meta.env.VITE_API_URL;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col bg-gray-950 border border-slate-700 text-white rounded-2xl shadow-2xl w-96 h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
        <h3 className="font-bold text-sm">Flowie</h3>
        <button
          onClick={closeChat}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${
                msg.from === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-200 rounded-bl-none"
              }`}
            >
              {msg.text}

              {msg.guide && (
                <button
                  onClick={() => handleGuide(msg.guide.path)}
                  className="mt-2 block w-full text-center text-sm font-medium bg-blue-500 hover:bg-blue-400 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  {msg.guide.label}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;