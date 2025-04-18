import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Update if using a different port

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Clean up on unmount
    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Real-time Chat</h1>
      <div style={{ marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
