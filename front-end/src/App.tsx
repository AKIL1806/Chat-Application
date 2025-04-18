import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Fetch existing messages
    axios.get("http://localhost:3000/messages").then((res) => {
      setMessages(res.data);
    });

    // Listen for new messages
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    const message = { user: "User", text: input };
    socket.emit("chat message", message);
    setInput("");
  };

  return (
    <div className="App">
      <h1>Chat</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}><strong>{msg.user}:</strong> {msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
