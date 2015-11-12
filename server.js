const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const app = express();

app.use(express.static('public'));

app.get('/', function (req, res){
    res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 3000;

var server = http.createServer(app)
    .listen(port, function () {
        console.log('Listening on port ' + port + '.');
    });

const io = socketIo(server);


io.on('connection', function (socket) {
    console.log('A user has connected.', io.engine.clientsCount);
});







module.exports = server;