const Datastore = require('nedb')
const db = new Datastore({ filename: 'database.db' })
const express = require('express');
db.loadDatabase()
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    db.insert({msg})
  });
   socket.on('disconnect', () => {
     io.emit('disconnected', 'a user has disconnected')
   })
});

app.get("/api", (request, response) => {
  db.find({}, (err,data) => {
    if (err) {
      response.end()
      return;
    }
    response.json({data})
  })
})
server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});
