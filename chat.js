//handles initial socket connection
exports.connect = function (socket) {
    //joins socket to chat room #1 by default
    socket.join('Room1');
    //User introduction
    socket.to("Room1").emit('userJoin', {
        message: 'A new user has joined the chat room'
    });
}

exports.disconnect = function (socket, room) {
    socket.to(room).emit('disconnection' , {
        message: 'A user has disconnected'
    })
}

