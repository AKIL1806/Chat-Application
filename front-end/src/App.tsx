import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load initial messages
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for new chat messages
    socket.on('chat message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && username.trim()) {
      const message = { username, text: input };
      socket.emit('chat message', message);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Chat</h1>
      <input
        placeholder="Enter your username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ marginBottom: '0.5rem', display: 'block' }}
      />
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '0.5rem'
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.username}</strong>: {msg.text}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        placeholder="Type your message"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
