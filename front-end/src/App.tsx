import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);

  useEffect(() => {
    // Load existing messages
    fetch('http://localhost:3000/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // Listen for new messages
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && username.trim()) {
      const message = { username, text: input };
      socket.emit('chat message', message);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Chat App</h1>
      <input
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: 'block', marginBottom: '0.5rem' }}
      />
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: '0.5rem' }}>
        {messages.map((msg, index) => (
          <div key={index}><strong>{msg.username}</strong>: {msg.text}</div>
        ))}
      </div>
      <input
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
