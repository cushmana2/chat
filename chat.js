var socketList = []

//handles initial socket connection
exports.connect = function (socket, io) {
    //joins socket to chat room #1 by default
    socket.join('Room1');
    socket.emit('connection' , {
        userList : socketList
    });
    socketList.push(socket.id);
    //User introduction to other users
    io.in('Room1').emit('userJoin', {
        message: 'Notice: ' + socket.id +' has joined the chat room',
        user : socket.id
    });
}

//handles disconnection events but notifying other
//connected sockets in the room
exports.disconnect = function (socket, io) {
    io.in('Room1').emit('disconnection' , {
        message: 'Notice: '+socket.id+' has disconnected',
        user: socket.id
    });
    let index = socketList.find(i => i == socket.id);
    socketList.splice(index, 1);
}

//handles new messages sent to the server
//broadcasts message to rest of the room
exports.message = function (socket, io, data) {
        io.in('Room1').emit('chatUpdate', {
            update: socket.id + ': ' +data
        });
}