const express = require('express');
const redis = require('redis');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const client = redis.createClient();
client.connect().catch(console.error);

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
});

app.get('/messages', async (req, res) => {
  const messages = await client.lRange('chat_messages', 0, -1);
  res.json(messages.map(msg => JSON.parse(msg)));
});

app.post('/messages', async (req, res) => {
  const message = req.body;
  await client.rPush('chat_messages', JSON.stringify(message));

  // Broadcast message to all WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });

  res.status(201).send('Message stored and broadcasted');
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
