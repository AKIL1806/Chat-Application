import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './index.css'; // Only this is needed since all styles are here

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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime())
      ? 'Invalid time'
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-background">
      <div className="chat-container">
        <h1 className="chat-title">Chat Flow</h1>

        <input
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="username-input"
        />

        <div className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className="chat-message">
              <div>
                <strong>{msg.username}</strong>
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              </div>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>

        <div className="input-row">
          <input
            placeholder="Type your message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="message-input"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
