const VM_IP = 'http://34.75.193.0';
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

io.on('connection', function(socket) {
    chat.connect(socket);
});

io.on('disconnect', function(socket) {
    chat.disconnect(socket, "Room1");
});
