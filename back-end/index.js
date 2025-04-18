const express = require('express');
const redis = require('redis');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Adjust if different
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const client = redis.createClient();
client.connect().catch(console.error);

// Fetch previous messages
app.get('/messages', async (req, res) => {
  const messages = await client.lRange('chat_messages', 0, -1);
  res.json(messages.map(msg => JSON.parse(msg)));
});

// Store new messages
app.post('/messages', async (req, res) => {
  const message = req.body;
  await client.rPush('chat_messages', JSON.stringify(message));
  res.status(201).send('Message stored');
});

// Handle WebSocket messages
io.on('connection', (socket) => {
  socket.on('chat message', async (msg) => {
    await client.rPush('chat_messages', JSON.stringify(msg)); // Save to Redis
    io.emit('chat message', msg); // Broadcast to all clients
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
