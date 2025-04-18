const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
