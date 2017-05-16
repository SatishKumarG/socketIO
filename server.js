var express = require("express");
var app = (module.exports = express());
var server = require("http").Server(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3001;

var clients = [];
io.on("connect", function(socket) {

  socket.on("storeClientInfo", function(data) {
   
    var clientInfo = {
      userId : data.userId,
      time : data.time,
      clientId : socket.id
    };

    clients.push(clientInfo);

    socket.emit("userInfo", clients);
    socket.broadcast.emit("userInfo", clients);
  });
  socket.on("disconnect", function(data) {
    for (var i = 0; i < clients.length; ++i) {
      var client = clients[i];
      if (client.clientId == socket.id) {
        clients.splice(i, 1);
        socket.emit("userInfo", clients);
        socket.broadcast.emit("userInfo", clients);
        break;
      }
    }
  });
});

app.get("*", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
server.listen(port, function() {
  console.log("listening on :" + port);
});