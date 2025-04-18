import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch initial messages
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for real-time messages
    socket.on('chat message', (msg: { username: string; text: string }) => {
      setMessages(prev => [...prev, msg]);
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Chat</h1>

      <input
        placeholder="Your name"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px',
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={sendMessage} style={{ padding: '8px 16px' }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
