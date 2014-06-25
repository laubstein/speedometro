/*jslint white:true, plusplus:true, node:true, unparam:true, nomen:true*/
"use strict";
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    speedData = {
        persons: 0,
        plus: 0
    },
    users = {},
    MAX_LIFES = 3;

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

// current dir route
app.use(express.static(__dirname));

// connection and events
io.on('connection', function(socket) {
    var id = socket.request.connection.remoteAddress;

    if (users[id] === undefined && id !== '127.0.0.1') {
        users[id] = 1;
        speedData.persons++;
        speedData.plus++;
        console.log('User connected!', speedData);
        io.emit('refresh', speedData);
    } else {
        socket.emit('refresh', speedData);
    }

    socket.emit('mylifes', users[id]);

    socket.on('getData', function() {
        socket.emit('refresh', speedData);
    });

    socket.on('plus', function() {
        if (users[id] < MAX_LIFES) {
            speedData.plus++;
            users[id]++;
            io.emit('refresh', speedData);
            socket.emit('mylifes', users[id]);
        } else {
            socket.emit('maxvalue');
        }
    });

    socket.on('minus', function() {
        if (users[id] > 0) {
            speedData.plus--;
            users[id]--;
            io.emit('refresh', speedData);
            socket.emit('mylifes', users[id]);
        } else {
            socket.emit('minvalue');
        }
    });
});

http.listen(3000, function() {
    console.log('listening at *:3000');
});