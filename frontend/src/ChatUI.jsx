import React, { useState, useRef, useEffect } from "react";
import "./ChatUI.css";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { id: 1, from: "assistant", text: "Hello! I am your assistant. How can I help?" },
    { id: 2, from: "user", text: "Make a UI like yours." },
  ]);
  const [value, setValue] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!value.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: value }]);
    setValue("");
    // demo assistant reply
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: "assistant", text: "Nice! I got your message." }]);
    }, 600);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <div className="logo">MyChat</div>
        <div className="conversations">
          <div className="conv active">General</div>
          <div className="conv">Work</div>
          <div className="conv">Ideas</div>
        </div>
        <button className="new-chat">+ New chat</button>
      </aside>

      <main className="main-chat">
        <header className="chat-header">
          <div className="title">General</div>
          <div className="status">Assistant</div>
        </header>

        <section className="messages">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.from}`}>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </section>

        <footer className="composer">
          <textarea
            className="input"
            placeholder="Type a message..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
          />
          <button className="send" onClick={send} aria-label="Send">Send</button>
        </footer>
      </main>
    </div>
  );
}
