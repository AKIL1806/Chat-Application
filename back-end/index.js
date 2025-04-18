const express = require('express');
const redis = require('redis');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Redis Client
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.connect().then(() => {
  console.log('Connected to Redis');
}).catch(console.error);

// REST endpoint to get all chat messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await client.lRange('chat_messages', 0, -1);
    const parsed = messages.map((msg) => JSON.parse(msg));
    res.json(parsed);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send('Internal Server Error');
  }
});

// REST endpoint to send a message
app.post('/messages', async (req, res) => {
  const message = req.body;

  if (!message.username || !message.text) {
    return res.status(400).send('Invalid message');
  }

  try {
    await client.rPush('chat_messages', JSON.stringify(message));
    io.emit('chat message', message);
    res.status(201).send('Message stored and broadcasted');
  } catch (err) {
    console.error('Error storing message:', err);
    res.status(500).send('Internal Server Error');
  }
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('chat message', async (msg) => {
    if (!msg.username || !msg.text) return;

    await client.rPush('chat_messages', JSON.stringify(msg));
    io.emit('chat message', msg);
  });
});

// Start server
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
