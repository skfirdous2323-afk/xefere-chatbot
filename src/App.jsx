import React, { useState } from "react";
import "./App.css";
import logo from "./assets/whatsapp.svg";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
const [isLoading, setIsLoading] = useState(false);
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/smart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error connecting to server" },
      ]);
    }
  };

  return (
    <>
{isLoading && (
  <div className="flex justify-center my-2">
    <div className="animate-bounce text-gray-500">🤖 Thinking...</div>
  </div>
)}

      <div className="chat-button" onClick={() => setIsOpen(!isOpen)}>
        <img src={logo} alt="Chat" />
      </div>

{isLoading && (
  <div className="flex justify-center items-center my-2 space-x-2">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
  </div>
)}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">💬 Xefere Assistant</div>
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${
                  msg.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;





