const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let visitorCount = 0;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  visitorCount++;
  const newColor = getRandomColor();
  io.emit('visitorUpdate', { count: visitorCount, color: newColor });

  socket.on('disconnect', () => {
    visitorCount--;
    const newColor = getRandomColor();
    io.emit('visitorUpdate', { count: visitorCount, color: newColor });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});