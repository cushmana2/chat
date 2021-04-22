//object to map socket ids and the room currently in
const sock = {
    id : '',
    room : ''
};
connections = [];

//handles initial socket connection
exports.connect = function (socket, io) {
    //creates new sock object with attributes, adds to connections array
    newConnection = Object.create(sock);
    newConnection.id = socket.id;
    newConnection.room = 'default';

    //other function handles joining room
    roomJoin(socket, newConnection.room, io);
    connections.push(newConnection);
}

//handles disconnection events but notifying other
//connected sockets in the room
exports.disconnect = function (socket, io) {
    room = Array.from(socket.rooms)[1];
    io.in(room).emit('disconnection' , {
        message: 'Notice: '+socket.id+' has disconnected',
        user: socket.id
    });
    let index = connections.findIndex(i => (i.room == room && i.id == socket.id));
    connections.splice(index, 1);
}

//handles new messages sent to the server
//broadcasts message to rest of the room
exports.message = function (socket, io, data) {
    room = Array.from(socket.rooms)[1];
    io.in(room).emit('chatUpdate', {
        update: socket.id + ': ' +data
    });
}

exports.changeRoom = function(socket, io, data) {
    //update sock object room and update with new room
    let index = connections.findIndex(i => (i.id == socket.id));
    conn = connections[index];
    oldRoom = conn.room;

    socket.leave(oldRoom);
    conn.room = data.room;
    
    //update users in old room
    io.in(oldRoom).emit('disconnection' , {
        message: 'Notice: '+socket.id+' has disconnected',
        user: socket.id
    });

    socket.join(data.room);
    filteredConnections = connections.filter(connection => (connection.room == data.room));
    socket.emit('changeRoom' , {
        userList : filteredConnections,
        room : data.room
    });
    //User introduction to other users
    io.in(data.room).emit('userJoin', {
        message: 'Notice: ' + socket.id +' has joined the chat room',
        user : socket.id
    });
    
}

//split off from connection event because of room changes
//joins a socket to specified room
function roomJoin(socket, room, io) {
    socket.join(room);
    filteredConnections = connections.filter(connection => (connection.room == room));
    socket.emit('connection' , {
        userList : filteredConnections,
        room : room
    });
    //User introduction to other users
    io.in(room).emit('userJoin', {
        message: 'Notice: ' + socket.id +' has joined the chat room',
        user : socket.id
    });
}