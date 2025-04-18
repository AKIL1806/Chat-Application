import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState(''); // ✅ Added username state
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // ✅ Fetch messages with user and text
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    // ✅ Listen for incoming messages
    socket.on('chat message', (msg: { user: string; text: string }) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && username.trim()) {
      const message = { user: username, text: input };
      socket.emit('chat message', message);
      setInput('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat</h1>

      {/* ✅ Username Input */}
      <input
        placeholder="Enter your name"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ marginBottom: 10, display: 'block' }}
      />

      {/* Chat Messages */}
      <div style={{ marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <input
        placeholder="Type a message"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
