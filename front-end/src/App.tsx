import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    socket.on('chat message', (msg) => {
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
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom right, royalblue, white)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ textAlign: 'center', color: 'royalblue' }}>Chat App</h1>

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
          }}
        />

        <div style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
        }}>
          {messages.map((msg, i) => (
            <div key={i}>
              <strong style={{ color: 'royalblue' }}>{msg.username}</strong>: <span style={{ color: '#333' }}>{msg.text}</span>
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
