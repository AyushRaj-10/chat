const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Setup Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the frontend HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// WebSocket room logic
const rooms = {};

wss.on('connection', (socket, req) => {
  const roomID = req.url.split('?room=')[1] || 'default';
  if (!rooms[roomID]) rooms[roomID] = new Set();
  rooms[roomID].add(socket);

  socket.on('message', (message) => {
    rooms[roomID].forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    rooms[roomID].delete(socket);
  });
});

// Start server
server.listen(3000, () => console.log('Server running on http://localhost:3000'));
