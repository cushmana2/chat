//object to map socket ids and the room currently in
const sock = {
    id : '',
    room : '',
    name : ''
};

let connections = [];
let index = '';

function getConnection(socket) {
    return connections.findIndex(i => (i.id == socket.id));
}

//handles initial socket connection
exports.connect = function (socket, io, user, rooms) {
    //creates new sock object with attributes, adds to connections array
    newConnection = Object.create(sock);
    newConnection.id = socket.id;
    newConnection.name = user;
    newConnection.room = 'default';

    //other function handles joining room
    roomJoin(socket, newConnection.room, io, newConnection.name, rooms);
    connections.push(newConnection);
}

//handles disconnection events but notifying other
//connected sockets in the room
exports.disconnect = function (socket, io) {
    conn = connections[getConnection(socket)];
    room = Array.from(socket.rooms)[1];
    io.in(room).emit('disconnection' , {
        message: 'Notice: '+conn.name+' has disconnected',
        user: socket.id
    });
    let index = connections.findIndex(i => (i.room == room && i.id == socket.id));
    connections.splice(index, 1);
}

//handles new messages sent to the server
//broadcasts message to rest of the room
exports.message = function (socket, io, data) {
    let index = connections.findIndex(i => (i.id == socket.id));
    conn = connections[index];
    room = Array.from(socket.rooms)[1];
    io.in(room).emit('chatUpdate', {
        update: conn.name + ': ' +data
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
        message: 'Notice: '+conn.name+' has disconnected',
        user: conn.id,
        name: conn.name
    });

    socket.join(data.room);
    filteredConnections = connections.filter(connection => (connection.room == data.room));
    socket.emit('changeRoom' , {
        userList : filteredConnections,
        room : data.room
    });
    //User introduction to other users
    io.in(data.room).emit('userJoin', {
        message: 'Notice: ' + conn.name +' has joined the chat room',
        user : conn.id,
	    name : conn.name
    });
}

//emits newly added room to all clients
exports.updateRoom = function(socket, io, data) {
    io.emit('updateRoom', {
        name : data.name,
        vis : data.vis,
        pass : data.pass
    });
}

//split off from connection event because of room changes
//joins a socket to specified room
function roomJoin(socket, room, io, name, rooms) {
    socket.join(room);
    filteredConnections = connections.filter(connection => (connection.room == room));
    socket.emit('connection' , {
        userList : filteredConnections,
        room : room
    });
    //User introduction to other users
    io.in(room).emit('userJoin', {
        message: 'Notice: ' + name +' has joined the chat room',
        user : socket.id,
	name : name
    });
}
