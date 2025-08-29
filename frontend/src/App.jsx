
// src/App.jsx
import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
// Import the new CSS file
import './App.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(true);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="app-container">
      {isChatOpen && <ChatInterface onClose={toggleChat} />}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="open-chat-button"
        >
          Open Chat
        </button>
      )}
    </div>
  );
}

export default App;