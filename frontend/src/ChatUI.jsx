import React, { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);

    try {
      const response = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add AI response
        setMessages(prev => [...prev, { 
          role: "bot", 
          text: data.reply 
        }]);
      } else {
        // Show error
        setMessages(prev => [...prev, { 
          role: "bot", 
          text: `Error: ${data.error || "Something went wrong"}` 
        }]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "bot", 
        text: "Connection error! Make sure your server is running on port 4000" 
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <h2>🤖 NumPath NumPath Chat</h2>
      
      {/* Messages */}
      <div style={{
        border: "2px solid #ddd",
        borderRadius: "10px",
        height: "500px",
        padding: "15px",
        overflowY: "auto",
        marginBottom: "15px",
        backgroundColor: "#f8f9fa"
      }}>
        {messages.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            color: "#666", 
            marginTop: "200px",
            fontSize: "18px" 
          }}>
            🌟 Ask me anything about numerology! <br/>
            Powered by NumPath AI ✨
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: msg.role === "user" ? "#007bff" : "#e9ecef",
              color: msg.role === "user" ? "white" : "black",
              marginLeft: msg.role === "user" ? "20%" : "0",
              marginRight: msg.role === "user" ? "0" : "20%",
              fontSize: "16px",
              lineHeight: "1.4"
            }}
          >
            <strong>{msg.role === "user" ? "You" : "NumPath AI"}:</strong>
            <div style={{ marginTop: "5px", whiteSpace: "pre-wrap" }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ 
            textAlign: "center", 
            color: "#007bff",
            fontSize: "16px",
            fontStyle: "italic"
          }}>
            🤖 NumPath is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about numerology, life paths, destiny numbers..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "2px solid #ddd",
            fontSize: "16px",
            outline: "none"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 24px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            minWidth: "80px"
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* Status */}
      <div style={{ 
        marginTop: "10px", 
        textAlign: "center",
        fontSize: "14px",
        color: "#666"
      }}>
        💡 Ask!!!!!
      </div>
    </div>
  );
}
