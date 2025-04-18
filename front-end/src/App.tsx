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
    <div>
      <h1>Chat</h1>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        placeholder="Type a message"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
