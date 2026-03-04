function Chatbot({ closeChat }) {
  const API = import.meta.env.VITE_API_URL;

  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-80">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">Help Assistant</h3>
        <button onClick={closeChat}>X</button>
      </div>

      <p className="text-sm">
        Hi! How can I help you today?
      </p>
    </div>
  );
}

export default Chatbot;