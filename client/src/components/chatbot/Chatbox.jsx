import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import ChatButton from "./ChatButton";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Welcome message when chat first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          type: "bot",
          text: "Hello! How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async (inputText) => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const response = await fetch("https://movie-ticket-booking-0igc.onrender.com/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputText }),
      });

      const data = await response.json();
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: data.reply || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error("Error in fetching chatbot response:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    <div className="fixed bottom-6 right-6 z-50">
  {/* Your chatbot button or icon here */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onSend={handleSend}
          onClose={toggleChat}
        />
      )}
      <ChatButton isOpen={isOpen} onClick={toggleChat} />
    </div>
    </>
  );
};

export default Chatbot;
