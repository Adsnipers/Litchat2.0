var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/room/admin.html');
})

io.on('connection', function (socket) {
  io.emit('main', 'A user has connected');
  socket.on('disconnect', () => {
    io.emit('main', 'A user has disconnected');
  })
  socket.on('main', function (msg) {
      io.emit('main', msg);
  });
});

io.on('connection', function (socket) {
  io.emit('admin', 'A user has connected');
  socket.on('disconnect', () => {
    io.emit('admin', 'A user has disconnected');
  })
  socket.on('admin', function (msg) {
    if (msg == '/stop') {
      socket.to('main').to('admin').emit('ADMIN SHUTDOWN COMMAND RECIEVED. LITCHAT SERVER SHUTTING DOWN')
      process.exit(0);
    } else {
      io.emit('admin', msg);
    }
  });
});


http.listen(port, function () {
  console.log('listening on http://localhost:' + port);
});