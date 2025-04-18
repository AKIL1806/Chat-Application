const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React front-end
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const client = redis.createClient();
client.connect().catch(console.error);

// REST API endpoints
app.get('/messages', async (req, res) => {
  const messages = await client.lRange('chat_messages', 0, -1);
  res.json(messages.map(msg => JSON.parse(msg)));
});

app.post('/messages', async (req, res) => {
  const message = req.body;
  await client.rPush('chat_messages', JSON.stringify(message));
  res.status(201).send('Message stored');
});

// WebSocket setup
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", async (msg) => {
    // Store in Redis
    await client.rPush("chat_messages", JSON.stringify(msg));

    // Broadcast to all clients
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
