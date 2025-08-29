
import React, { useState } from 'react';
import { TrashIcon, FaceSmileIcon, XMarkIcon, PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import './ChatInterface.css';

const CommonQuestionButton = ({ text, onClick }) => {
  return (
    <button
      className="common-question-button"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const ChatInterface = ({ onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Andaaz', text: "Hi! I'm your food assistant. How can I help you with your order today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const commonQuestions =  [
  'What are your most popular dishes?', // Scrape top items from a list or menu section
  'What are your operating hours?',     // Look for a specific <div> or <p> with business hours
  'What are your contact details?',     // Extract phone number or email from the footer
];
const handleClearChat = () => {
  setChatMessages([
    { sender: 'Andaaz', text: "Hi! I'm your food assistant. How can I help you with your order today?" }
  ]);
};

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    const newUserMessage = { sender: 'user', text: message };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/ask', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const newAndaazMessage = { sender: 'Andaaz', text: data.answer || "Sorry, I couldn't get a response." };
      setChatMessages((prevMessages) => [...prevMessages, newAndaazMessage]);

    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      const errorMessage = { sender: 'Andaaz', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommonQuestionClick = (question) => {
    handleSendMessage(question);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h2>Andaaz</h2>
       <div className="header-icons">
  {/* <FaceSmileIcon className="header-icon" /> */}
  <TrashIcon className="header-icon" onClick={handleClearChat} />
  <XMarkIcon className="header-icon" onClick={onClose} />
</div>
      </div>

      {/* Main Chat Body */}
      <div className="chat-body">
        
        {chatMessages.map((msg, index) => (
    <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'kodee-message'}`}>
        {msg.sender === 'Andaaz' && (
            <div className="message-avatar">
                <div className="avatar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9.75 15.939a4.5 4.5 0 01-2.228-2.607M17.817 15.904L18 15.939a4.5 4.5 0 002.228-2.607M10.875 18.004L10.5 17.75l-.375.25m9.375-6l.375-.25L21 12.5l-.625.25-.375-.25zm-2.25-4.5L16.5 6.5l.375.25L18 6.5l.375-.25L18 6.25l-.375-.25zm-1.5 6l.375-.25L16.5 12.5l-.375.25L16.5 12.25l-.375-.25zM12 21a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                </div>
            </div>
        )}
        {/* The message bubble is now rendered BEFORE the user icon */}
        <div className="message-bubble">
            <p>{msg.text}</p>
        </div>
        {msg.sender === 'user' && (
            <div className="message-avatar user-avatar">
                <UserCircleIcon className="avatar-icon" />
            </div>
        )}
    </div>
))}
        {isLoading && (
          <div className="chat-message kodee-message">
            <div className="message-avatar">
              <div className="avatar-icon animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9.75 15.939a4.5 4.5 0 01-2.228-2.607M17.817 15.904L18 15.939a4.5 4.5 0 002.228-2.607M10.875 18.004L10.5 17.75l-.375.25m9.375-6l.375-.25L21 12.5l-.625.25-.375-.25zm-2.25-4.5L16.5 6.5l.375.25L18 6.5l.375-.25L18 6.25l-.375-.25zm-1.5 6l.375-.25L16.5 12.5l-.375.25L16.5 12.25l-.375-.25zM12 21a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
              </div>
            </div>
            <div className="message-bubble">
              <p>Typing...</p>
            </div>
          </div>
        )}
        {chatMessages.length <= 1 && (
          <div className="common-questions">
            <p>Common questions are:</p>
            {commonQuestions.map((q, index) => (
              <CommonQuestionButton
                key={index}
                text={q}
                onClick={() => handleCommonQuestionClick(q)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input and Disclaimer */}
      <div className="chat-footer">
        <form onSubmit={handleInputSubmit} className="message-form">
          <input
            type="text"
            placeholder="Ask a question based on the website..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="message-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading}
          >
            <PaperAirplaneIcon className="send-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;