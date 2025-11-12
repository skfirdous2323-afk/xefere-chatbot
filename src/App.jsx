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
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/smart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { sender: "bot", text: data.reply, products: data.products || [] },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error connecting to server" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="chat-button" onClick={() => setIsOpen(!isOpen)}>
        <img src={logo} alt="Chat" />
      </div>

      {/* Chat Window */}
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



                {msg.products && msg.products.length > 0 ? null : <p>{msg.text}</p>}



                {/* Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="product-grid">
                    {msg.products.map((p, idx) => (
                      <div key={idx} className="product-card">
                        <div className="thumb">
                          <img
                            src={p.image || "https://via.placeholder.com/150"}
                            alt={p.title}
                          />
                        </div>
                        <div className="product-details">
                          <h3>{p.title}</h3>
                          <p>{p.price}</p>
                          <p>{p.available}</p>
                          <p>{p.shortDescription}</p>
                          <button onClick={() => window.open(p.link, "_blank")}>
                            View Product
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && <p className="loading">Bot is typing...</p>}
          </div>

          {/* Input Area */}
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
