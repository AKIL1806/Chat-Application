const express = require('express');
const redis = require('redis');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

// Replace this with your actual frontend URL
const FRONTEND_URL = 'https://chat-frontend-kdat.onrender.com';

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Redis client (Upstash TLS)
const client = redis.createClient({
  url: 'rediss://default:AUrcAAIjcDE2YzY3M2E3NzY1NGU0ZDc4YTdmNzI2NDRkZWE5MGE0YnAxMA@clear-skink-19164.upstash.io:6379',
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

client.connect().then(() => {
  console.log('✅ Connected to Upstash Redis');
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
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).send('Invalid message');
  }

  const message = {
    username,
    text,
    timestamp: new Date().toISOString()
  };

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
  console.log('🟢 New WebSocket connection');

  socket.on('chat message', async (msg) => {
    if (!msg.username || !msg.text) return;

    const messageWithTimestamp = {
      ...msg,
      timestamp: new Date().toISOString()
    };

    try {
      await client.rPush('chat_messages', JSON.stringify(messageWithTimestamp));
      io.emit('chat message', messageWithTimestamp);
    } catch (err) {
      console.error('WebSocket Redis error:', err);
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
