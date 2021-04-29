const VM_IP = 'http://localhost';
const http = require('http');
const socketio = require('socket.io');
const fileServer = require('./fileServer.js');
const chat = require('./chat.js');


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

httpServer.listen(80);
io = socketio(httpServer);


//io is basically used to emit from the server
//(emit to room, broadcast, update connected sockets)
//the socket object within is used for specific clients
io.on('connection', function(socket) {
    chat.connect(socket, io, 'default');

    socket.on('message', function(data) {
        console.log('Message Sent');
        chat.message(socket, io, data);
    });

    socket.on('changeRoom', function(data) {
        chat.changeRoom(socket, io, data);
    })

    socket.on('disconnecting', function() {
        chat.disconnect(socket, io);
    });
});

