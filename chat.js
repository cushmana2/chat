//handles initial socket connection
exports.connect = function (socket) {
    //joins socket to chat room #1 by default
    socket.join('Room1');
    //User introduction
    socket.emit('userJoin', {
        message: 'Notice: A new user has joined the chat room'
    });
}

//handles disconnection events but notifying other
//connected sockets in the room
exports.disconnect = function (socket) {
    socket.emit('disconnection' , {
        message: 'Notice: A user has disconnected'
    });
}

//handles new messages sent to the server
//broadcasts message to rest of the room
exports.message = function (socket, data) {
        console.log(data);
        socket.emit('chatUpdate', {
            update: 'Anonymous User: '+data
        });
}