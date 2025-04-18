import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    const res = await axios.get('http://localhost:3000/messages');
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await axios.post('http://localhost:3000/messages', {
      text: newMessage,
      timestamp: new Date().toISOString(),
    });
    setNewMessage('');
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Chat App</h1>
      <div>
        {messages.map((msg: any, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
