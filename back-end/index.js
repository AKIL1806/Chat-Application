const express = require('express');
const redis = require('redis');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Connect to Redis running inside WSL using its IP address
const client = redis.createClient({
  socket: {
    host: '172.30.192.104',
    port: 6379,
  }
});

client.connect().catch(console.error);

// API endpoint to fetch all messages
app.get('/messages', async (req, res) => {
  const messages = await client.lRange('chat_messages', 0, -1);
  res.json(messages.map(msg => JSON.parse(msg)));
});

// API endpoint to post a new message
app.post('/messages', async (req, res) => {
  const message = req.body;
  await client.rPush('chat_messages', JSON.stringify(message));
  io.emit('chat message', message); // emit to all clients
  res.status(201).send('Message stored and broadcasted');
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('chat message', async (msg) => {
    await client.rPush('chat_messages', JSON.stringify(msg));
    io.emit('chat message', msg);
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
