const http = require('http');
const { Server } = require('node:http');
const socketio = require('socket.io');
const { io } = require('socket.io-client');
const fileServer = require('./fileServer.js');

const httpServer = http.createServer(function (req, res) {
    let urlObj = new URL(req.url, VM_IP);
    path = urlObj.pathname;

    switch(path) {
        case "/chat":
	    break;
	case "/":
	    fileServer.readFile("public_html/demo.html", res);
	    break;
	default:
	    fileServer.readFile("public_html/"+path, res);
	    break;
    }
});

httpServer.listen(8080);
io = socketio(httpServer);

io.on('connection', function(socket) {
    socket.emit('greeting-from-server', {
        greeting: 'Hello Client'
    });
    socket.on('greeting-from-client', function (message) {
        console.log(message);
    });
});