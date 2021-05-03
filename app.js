const VM_IP = 'http://localhost';
const http = require('http');
const socketio = require('socket.io');
const fileServer = require('./fileServer.js');
const chat = require('./chat.js');
const database = require('./database.js');


const httpServer = http.createServer(function (req, res) {
    let urlObj = new URL(req.url, VM_IP);
    path = urlObj.pathname;

    if (req.method == 'GET') {
        switch(path) {
            case "/":
                fileServer.readFile("public_html/index.html", res);
                break;
            default:
                fileServer.readFile("public_html/"+path, res);
                break;
        }
    }

    if (req.method == 'POST') {
        let reqBody = '';
        req.on('data', data => {reqBody += data});
        req.on('end', () => {
        switch(path) {
            case "/register":
                r = JSON.parse(reqBody);
                database.createUser(r.username, r.password, res);
                break;
            default:
                console.log(path);
                break;
        }
    });
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

