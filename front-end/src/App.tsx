import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat-backend-pkeg.onrender.com');

interface ChatMessage {
  username: string;
  text: string;
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('https://chat-backend-pkeg.onrender.com/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    socket.on('chat message', (msg: ChatMessage) => {
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? 'Invalid time'
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom right, royalblue, white)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      }}>
        <h1 style={{ textAlign: 'center', color: 'royalblue', marginBottom: '1rem' }}>
          Chat Flow
        </h1>

        <input
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            marginBottom: '1rem',
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />

        <div style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '1rem',
          backgroundColor: '#f0f4ff',
          borderRadius: '5px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                <strong style={{ color: 'royalblue' }}>{msg.username}</strong>
                <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#888' }}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div style={{ color: '#222', marginLeft: '4px' }}>{msg.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex' }}>
          <input
            placeholder="Type your message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginRight: '0.5rem',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'royalblue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
