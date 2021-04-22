var socketList = []

//handles initial socket connection
exports.connect = function (socket, io) {
    //joins socket to chat room #1 by default
    socket.join('default');
    socket.emit('connection' , {
        userList : socketList
    });
    socketList.push(socket.id);
    //User introduction to other users
    io.in('default').emit('userJoin', {
        message: 'Notice: ' + socket.id +' has joined the chat room',
        user : socket.id
    });
}

//handles disconnection events but notifying other
//connected sockets in the room
exports.disconnect = function (socket, io) {
    room = Array.from(socket.rooms);
    console.log(room[1]);
    io.in(room).emit('disconnection' , {
        message: 'Notice: '+socket.id+' has disconnected',
        user: socket.id
    });
    let index = socketList.findIndex(i => i == socket.id);
    socketList.splice(index, 1);
}

//handles new messages sent to the server
//broadcasts message to rest of the room
exports.message = function (socket, io, data) {
        room = data.room;
        io.in('Room1').emit('chatUpdate', {
            update: socket.id + ': ' +data
        });
}
