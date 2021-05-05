//object to map socket ids and the room currently in
const sock = {
    id : '',
    room : '',
    name : ''
};

//object to keep track of room data, stays active only for as
//long as the application is running
//was having trouble with getting database info, next would be
//to actually write these to the database like we had planned
const r = {
    name : '',
    vis : '',
    pass : ''
};

//arrays to store the objects above
//these arrays will get filtered for certain functions
let connections = [];
let rooms = [];

//variable and function for finding objects in the two arrays above
let index = '';

function getConnection(socket) {
    return connections.findIndex(i => (i.id == socket.id));
}

//handles initial socket connection
exports.connect = function (socket, io, user) {
    //creates new sock object with attributes, adds to connections array
    newConnection = Object.create(sock);
    newConnection.id = socket.id;
    newConnection.name = user;
    newConnection.room = 'default';

    //other function handles joining room
    roomJoin(socket, newConnection.room, io, newConnection.name);
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
    let mentionedUser = '';
    let msgArr = data.split(" ");
    for(let i=0; i<msgArr.length; i++) {
        if(msgArr[i][0] == '@') {
	    mentionedUser = msgArr[i].slice(1);
	}
    }
    console.log(mentionedUser);
    let userIndex = connections.findIndex(i => i.name == mentionedUser);
    mentionedUser = connections[userIndex];
    if (mentionedUser === undefined) {
        console.log('chat.js  No mentioned user');
        io.in(room).emit('chatUpdate', {
            update: conn.name + ': ' + data,
            mention: 'none'
        });
    }
    else {
        console.log('chat.js Mentioned User: ' + mentionedUser);
        io.in(room).emit('chatUpdate', {
            update: conn.name + ': ' +data,
	    mention: mentionedUser.id
        });
    }
}

//handles room changes, logs user out of room and joins new one
//if the room to be joined has a password, validates before joining
exports.changeRoom = function(socket, io, data) {
    //update sock object room and update with new room
    let index = connections.findIndex(i => (i.id == socket.id));
    conn = connections[index];
    oldRoom = conn.room;

    socket.leave(oldRoom);
    let r = rooms.findIndex(i => (i.name == data.room));
    let target = rooms[r];
    if(typeof(target) == 'undefined' && data.room == 'default'){
        let defaultRoom = Object.create(r);
	defaultRoom.name = 'default';
	defaultRoom.vis = 'public';
	defaultRoom.pass = 'none';
	rooms.push(def);
	target = defaultRoom;
    }
    console.log('Target room: ' + target);
    //if password is correct, join new room and alert users
    if(target.pass == data.password || data.room == 'default') {
        conn.room = data.room;
	socket.join(data.room);
	filteredConnections = connections.filter(connection => (connection.room == data.room));
	
	socket.emit('changeRoom', {
	    userList : filteredConnections,
	    room : data.room
	});
	//user introduction to other users
	io.in(data.room).emit('userJoin', {
	    message : 'Notice: ' + conn.name + ' has joined the chat room',
	    user : conn.id,
	    name : conn.name
	});
    }
    else {
        socket.emit('roomFail', {
	    message : 'Invalid password for room.'
        });
    }
    
    //update users in old room
    io.in(oldRoom).emit('disconnection' , {
        message: 'Notice: '+conn.name+' has disconnected',
        user: conn.id,
        name: conn.name
        });
}

//emits newly added room to all clients
exports.updateRoom = function(socket, io, data) {
    let newRoom = Object.create(r);
    newRoom.name = data.name;
    newRoom.vis = data.vis;
    newRoom.pass = data.pass;
    rooms.push(newRoom);
    io.emit('updateRoom', {
        roomlist : rooms
    });
}

//split off from connection event because of room changes
//joins a socket to specified room
function roomJoin(socket, room, io, name) {
    socket.join(room);
    filteredConnections = connections.filter(connection => (connection.room == room));
    socket.emit('connection' , {
        userList : filteredConnections,
	roomlist : rooms,
        room : room
    });
    //User introduction to other users
    io.in(room).emit('userJoin', {
        message: 'Notice: ' + name +' has joined the chat room',
        user : socket.id,
	name : name
    });
}
