const express = require('express');
const redis = require('redis');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const client = redis.createClient();
client.connect().catch(console.error);

let sockets = [];

wss.on('connection', (ws) => {
  sockets.push(ws);
  console.log('New client connected');

  ws.on('close', () => {
    sockets = sockets.filter(s => s !== ws);
    console.log('Client disconnected');
  });
});

app.get('/messages', async (req, res) => {
  const messages = await client.lRange('chat_messages', 0, -1);
  res.json(messages.map(msg => JSON.parse(msg)));
});

app.post('/messages', async (req, res) => {
  const message = req.body;
  await client.rPush('chat_messages', JSON.stringify(message));

  // Broadcast to all connected WebSocket clients
  sockets.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });

  res.status(201).send('Message stored');
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
