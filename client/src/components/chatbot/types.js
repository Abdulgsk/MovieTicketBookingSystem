// Message object structure
export const Message = {
    id: "",         // string
    type: "user",   // "user" | "bot"
    text: "",       // string
    timestamp: new Date(), // Date
    isError: false, // optional boolean
  };
  
  // QuickReply object structure
  export const QuickReply = {
    id: "",      // string
    text: "",    // string
    action: "",  // string
  };
      