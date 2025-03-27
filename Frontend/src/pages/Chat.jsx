import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const token = localStorage.getItem("token"); // Assuming token is stored here

  const handleSend = async () => {
    if (!message.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([...messages, { sender: "user", text: message, timestamp }]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages([
        ...messages,
        { sender: "user", text: message, timestamp },
        { sender: "ai", text: res.data.reply, timestamp: aiTimestamp },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages([
        ...messages,
        { sender: "user", text: message, timestamp },
        { sender: "ai", text: "Failed to get response", timestamp: aiTimestamp },
      ]);
      setIsTyping(false);
    }
  };

  const handleOptionClick = async (option, displayText) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([...messages, { sender: "user", text: displayText, timestamp }]);
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: option }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages([
        ...messages,
        { sender: "user", text: displayText, timestamp },
        { sender: "ai", text: res.data.reply, timestamp: aiTimestamp },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages([
        ...messages,
        { sender: "user", text: displayText, timestamp },
        { sender: "ai", text: "Failed to get response", timestamp: aiTimestamp },
      ]);
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setMessage("");
    setIsTyping(false);
    setShowHelp(false);
  };

  const options = [
    { intent: "invest land", display: "Land Investment", label: "Land" },
    { intent: "invest gold", display: "Gold Investment", label: "Gold" },
    { intent: "invest stocks", display: "Stock Investment", label: "Stocks" },
    { intent: "invest mutual funds", display: "Mutual Funds", label: "Mutual Funds" },
    { intent: "invest fixed deposit", display: "Fixed Deposit", label: "Fixed Deposit" },
    { intent: "smart investment", display: "Smart Investment Options", label: "Smart Invest" },
    { intent: "saving advice", display: "Saving Tips", label: "Save Smart" },
    { intent: "budget plan", display: "Create Budget Plan", label: "Budget" },
    { intent: "quick tips", display: "Quick Financial Tips", label: "Tips" },
  ];

  const helpCommands = [
    "Tax Summary: 'tax' or '/summary'",
    "Transactions: 'history' or '/'",
    "Smart Investment: Click 'Smart Invest'",
    "Saving Tips: Click 'Save Smart'",
    "Budget: Click 'Budget'",
  ];

  return (
    <div>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center text-lg font-semibold z-50"
      >
        {isChatOpen ? "✖" : "🤖"}
      </button>

      {/* Chatbox */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-96 max-w-full h-[600px] bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col overflow-hidden z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white p-4 flex justify-between items-center rounded-t-xl">
            <span className="text-lg font-semibold tracking-wide">Finance Buddy</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-sm bg-green-800 hover:bg-green-900 text-white px-2 py-1 rounded-lg transition-all"
              >
                {showHelp ? "Hide" : "Help"}
              </button>
              <button
                onClick={resetChat}
                className="text-sm bg-green-800 hover:bg-green-900 text-white px-2 py-1 rounded-lg transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.length === 0 && !showHelp && (
              <div className="text-gray-700 text-sm">
                <p className="font-medium mb-2">Your Financial Options:</p>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option.intent}
                      onClick={() => handleOptionClick(option.intent, option.display)}
                      className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-teal-200 transition-all shadow-sm"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {showHelp && (
              <div className="text-gray-700 text-sm bg-white p-3 rounded-lg shadow-sm">
                <p className="font-medium mb-2">Quick Commands:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {helpCommands.map((cmd, idx) => (
                    <li key={idx}>{cmd}</li>
                  ))}
                </ul>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-xl text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-teal-100 text-teal-900 self-end ml-auto"
                    : "bg-white text-gray-800 self-start border border-gray-100"
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{msg.sender === "user" ? "You" : "AI"}</span>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <p className="mt-1">{msg.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="text-gray-500 text-xs italic animate-pulse">AI is typing...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-100 border-t border-gray-200 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask or type a command..."
              className="flex-1 p-2 bg-white rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-gradient-to-r from-green-600 to-teal-600 text-white p-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;