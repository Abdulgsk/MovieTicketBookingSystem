import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

const TypingIndicator = () => {
  const [dots, setDots] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start animate-fadeIn">
      <div className="mr-2 mt-1 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
        <Bot size={18} className="text-white" />
      </div>
      
      <div className="p-3 bg-gray-800 text-white rounded-lg rounded-bl-none inline-block">
        <span className="flex items-center space-x-1">
          <span>Typing</span>
          <span className="w-5 text-center">
            {".".repeat(dots)}
          </span>
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
        