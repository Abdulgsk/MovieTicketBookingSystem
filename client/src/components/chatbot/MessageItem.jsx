import { formatTime } from "./utils";
import { User, Bot } from "lucide-react";

const MessageItem = ({ message }) => {
  const isUser = message.type === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div className="flex max-w-[80%]">
        {/* Avatar for bot messages */}
        {!isUser && (
          <div className="mr-2 mt-1 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
            <Bot size={18} className="text-white" />
          </div>
        )}
        
        <div className="flex flex-col">
          <div 
            className={`p-3 rounded-lg ${
              isUser 
                ? "bg-red-700 text-white rounded-br-none" 
                : "bg-gray-800 text-white rounded-bl-none"
            } ${message.isError ? "bg-red-800" : ""}`}
          >
            {message.text}
          </div>
          
          <div 
            className={`text-xs text-gray-500 mt-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
        
        {/* Avatar for user messages */}
        {isUser && (
          <div className="ml-2 mt-1 bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
