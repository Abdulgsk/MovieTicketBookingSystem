import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const ChatButton = ({ isOpen, onClick }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add animation when component mounts
  return (
    <button
      className={`fixed bottom-5 right-5 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 ${
        mounted ? "scale-100" : "scale-0"
      } ${isOpen ? "rotate-90" : "rotate-0"}`}
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X size={24} className="text-white" />
      ) : (
        <MessageCircle size={24} className="text-white" />
      )}
    </button>
  );
};

export default ChatButton;
