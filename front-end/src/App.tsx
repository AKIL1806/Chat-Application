import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

type ChatMessage = {
  username: string;
  text: string;
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Load initial messages from the API
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for new chat messages via WebSocket
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

  return (
    <div>
      <h1>Chat</h1>
      <input
        placeholder="Your name"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <div>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.username}:</strong> {msg.text}</div>
        ))}
      </div>
      <input
        placeholder="Type a message..."
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
