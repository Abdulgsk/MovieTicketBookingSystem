import { useState, useRef, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const ChatWindow = ({ messages, isTyping, onSend, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  // Sample quick replies - these would typically come from your backend
  const quickReplies = [
    { id: "q1", text: "How can you help me?", action: "How can you help me?" },
    { id: "q2", text: "What services do you offer?", action: "What services do you offer?" },
    { id: "q3", text: "Contact support", action: "I need to contact support" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-20 right-5 z-50 transition-all duration-300 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <div className="bg-black text-white shadow-xl rounded-xl w-80 sm:w-96 h-[450px] overflow-hidden flex flex-col border border-red-600">
        {/* Header */}
        <div className="bg-red-600 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare size={20} className="mr-2" />
            <h3 className="font-semibold">Virtual Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-red-700 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
        />
        
        {/* Quick Reply Buttons - shown when there are few messages */}
        {messages.length < 3 && (
          <div className="p-3 bg-gray-900 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => onSend(reply.action)}
                className="bg-gray-800 hover:bg-red-900 text-xs px-3 py-1.5 rounded-full text-white transition-colors"
              >
                {reply.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
};

export default ChatWindow;
    