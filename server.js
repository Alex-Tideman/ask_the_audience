const http = require('http');
const express = require('express');
const _ = require('lodash');
const app = express();

app.use(express.static('public'));

app.get('/', function (req, res){
    res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
    .listen(port, function(){
        console.log('Listening on port ' + port + '.');
    });

const socketIo = require('socket.io');
const io = socketIo(server);


var votes = {};

io.on('connection', function(socket){
    console.log('A user has connected.', io.engine.clientsCount);

    socket.emit('statusMessage', 'You have connected.');

    io.sockets.emit('usersConnected', io.engine.clientsCount);
    io.sockets.emit('voteCount', countVotes(votes));

    socket.on('message', function (channel, message) {
        if (channel === 'voteCast') {
            votes[socket.id] = message;
            io.sockets.emit('voteCount', countVotes(votes));
            socket.emit('voteMessage', message);
        }
    });

    socket.on('disconnect', function(){
        console.log('A user has disconnected.', io.engine.clientsCount);
        delete votes[socket.id];
        socket.emit('voteCount', countVotes(votes));
        io.sockets.emit('userConnection', io.engine.clientsCount);
    });

});


function countVotes(votes) {
    var voteCount = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };
    for (vote in votes) {
        voteCount[votes[vote]]++
    }

    var results = "";

    _.forOwn(voteCount, function(count,vote) {
        results += vote + ":" + count + "  ";
    });

    return results;
}

module.exports = server;