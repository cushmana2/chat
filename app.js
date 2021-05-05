
const VM_IP = 'http://34.75.120.250';
const http = require('http');
const socketio = require('socket.io');
const fileServer = require('./fileServer.js');
const chat = require('./chat.js');
const database = require('./database.js');

let newUser = '';

const httpServer = http.createServer(function (req, res) {
    let urlObj = new URL(req.url, VM_IP);
    path = urlObj.pathname;
    console.log('app.js pathname: ' + path);
    if (req.method == 'GET') {
        switch(path) {
            case "/":
                fileServer.readFile("public_html/index.html", res);
                break;
            case "/chat":
                fileServer.readFile("public_html/chat.html", res);
                break;
            default:
                fileServer.readFile("public_html"+path, res);
                break;
        }
    }

    //handling login/registration through post requests
    //login is fake and awful, since the database takes a while
    //it has to wait. also sends multiple requests for some reason
    if (req.method == 'POST') {
        let reqBody = '';
        req.on('data', data => {reqBody += data});
        req.on('end', () => {
        switch(path) {
            case "/register":
                r = JSON.parse(reqBody);
                database.createUser(r.username, r.password, res);
                break;
            case "/login":
                l = JSON.parse(reqBody);
                setTimeout(function() {
		        database.getUser(l.username, l.password, res);
		        }, 2000);
		        newUser = l.username;
                break;
            default:
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
    chat.connect(socket, io, newUser);
    console.log('app.js: ' + newUser);
    socket.on('message', function(data) {
        console.log('app.js: Message Sent');
        chat.message(socket, io, data);
    });

    socket.on('changeRoom', function(data) {
        chat.changeRoom(socket, io, data);
    });

    socket.on('addRoom', function(data) {
	database.createRoom(data.name, data.pass);
        chat.updateRoom(socket, io, data);
    });

    socket.on('disconnecting', function() {
        chat.disconnect(socket, io);
    });
});

