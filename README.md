# 💬 Chat Flow

**Real-time, futuristic-themed chat application** built with **React**, **Express**, **Socket.IO**, and **Redis**. Communicate instantly with users across the world.

---

### 🚀 Live Demo

- **Front-end**: [Chat Flow UI](https://chat-frontend-kdat.onrender.com)
- **Back-end**: [Chat Flow API](https://chat-backend-pkeg.onrender.com)

---

### 🛠️ Tech Stack

- **Front-end**: React (Vite) + TypeScript + Socket.IO Client
- **Back-end**: Express.js + Socket.IO + Redis
- **Database**: Upstash Redis (TLS enabled)
- **Deployment**: Render (front-end & back-end)

---

### ⚙️ Features

- 🔥 Real-time chat using WebSockets
- 🧠 Username support
- 📜 Persistent message history stored in Redis
- 🕶️ Futuristic-themed UI with bright, modern visuals
- 🌐 Publicly accessible - chat from anywhere!

---

### 🧩 Folder Structure

```
Chat-Application/
├── front-end/         # React (Vite) application
│   ├── src/
│   └── public/
├── back-end/          # Express + Socket.IO server
│   ├── index.js
│   └── redis.js
```

---

### 💻 Local Setup

> Make sure you have **Node.js** installed.

#### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/Chat-Application.git
cd Chat-Application
```

#### 2. Install dependencies

```bash
cd front-end
npm install

cd ../back-end
npm install
```

#### 3. Start Redis (optional if you're using Upstash)

#### 4. Run servers

In one terminal:

```bash
cd back-end
node index.js
```

In another terminal:

```bash
cd front-end
npm run dev
```

---

### 📦 Deployment

Both front-end and back-end are deployed on **Render**, with Redis managed via **Upstash** (with TLS).

---

### 👤 Contributors

- [@AKIL1806](https://github.com/AKIL1806)

---
