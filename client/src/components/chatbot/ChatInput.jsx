import { useState, useRef } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");
  const maxLength = 250;
  const inputRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = input.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;

  return (
    <div className="p-3 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center">
        <input
          ref={inputRef}
          className="flex-grow p-2 bg-gray-900 text-white border border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          maxLength={maxLength}
        />
        <button
          className={`bg-red-600 hover:bg-red-700 text-white p-2 rounded-r-md transition-colors ${
            !input.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Character counter */}
      <div
        className={`text-right mt-1 text-xs ${
          isNearLimit
            ? isAtLimit
              ? "text-red-500"
              : "text-yellow-500"
            : "text-gray-500"
        }`}
      >
        {charCount}/{maxLength}
      </div>
    </div>
  );
};

export default ChatInput;
