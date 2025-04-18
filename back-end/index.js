const express = require('express');
const redis = require('redis');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const client = redis.createClient();
client.connect().catch(console.error);

app.get('/messages', async (req, res) => {
  const messages = await client.lRange('chat_messages', 0, -1);
  res.json(messages.map(msg => JSON.parse(msg)));
});

app.post('/messages', async (req, res) => {
  const message = req.body;
  await client.rPush('chat_messages', JSON.stringify(message));
  res.status(201).send('Message stored');
});

io.on('connection', (socket) => {
  socket.on('chat message', async (msg) => {
    await client.rPush('chat_messages', JSON.stringify(msg));
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
