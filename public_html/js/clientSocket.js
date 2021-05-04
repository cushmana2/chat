const socket = io('35.239.56.176:80');

let chatBox = document.getElementById('chatBox');
let userBox = document.getElementById('userBox');
let form = document.getElementById('addRoomForm');
let roomlist = document.getElementById('room');

socket.on('connection', function(data) {
    updateUser(data, socket);
    updateRoom(data);
});

socket.on('userJoin', function(data) {
    userJoin(data);
});

//updates chatroom with messages sent from server
socket.on('chatUpdate', function(data) {
    addMessage(data);
});

socket.on('changeRoom', function(data) {
    clearRoom(data);
    updateUser(data);
});

socket.on('updateRoom', function(data) {
    updateRoom(data);
})

//updates chat room with notice upon disconnection
socket.on('disconnection', function(data) {
    removeUser(data);
});

function updateRoom(data) {
    let rooms = data.roomlist;
    console.log(rooms);
    if(rooms) {
    Array.from(roomlist.children).forEach(room => {
	console.log(room)
	console.log(room.value);
        if(room.value != 'default'){
	room.remove();
	}
    });
    Array.from(rooms).forEach(room => {
        newroom = document.createElement('option');
	newroom.value = room;
	newroom.innerHTML = room;
	roomlist.appendChild(
	    newroom
        );
    });
}
}


//event handler for send message button
//sends textarea input to server, clears textarea
function sendMsg() {
    let textbox = document.getElementById('msg');
    let msg = textbox.value;
    socket.send(msg);
    textbox.value = '';
}

//updates userlist for new connections will all users currently in room
function updateUser(data) {
    data.userList.forEach(user => {
        if(user.room == data.room && user.id != socket.id) {
            let list = document.createElement('li');
            list.innerHTML = user.name;
            list.className = 'list-group'
            userBox.appendChild(
            list
        ); 
        }           
    });
}

function clearRoom(data) {
    let listItems = userBox.getElementsByTagName('li');
    console.log(listItems);
    Array.from(listItems).forEach(user => {
        console.log(user);
        if (data.userList.name != user.innerHTML)
        {
            user.remove();
        }
    });
    
    let messages = chatBox.getElementsByTagName('li');
    Array.from(messages).forEach(message => message.remove());
}

//updates room on user join
//adds new user to chat room then broadcasts notice
function userJoin(data) {
    let newUserMsg = document.createElement('li');
    newUserMsg.innerHTML = data.message;
    newUserMsg.className = 'list-group';
    chatBox.appendChild(
        newUserMsg
    );

    let newUserList = document.createElement('li');
    newUserList.innerHTML = data.name;
    newUserList.className = 'list-group';
    userBox.appendChild(
        newUserList
    );
}

//adds a sent message to the client html
function addMessage(data) {
    let newMsg = document.createElement('li');
    newMsg.innerHTML = data.update;
    newMsg.className = 'list-group';
    chatBox.appendChild(
        newMsg
    );
}

//removes a user from the user list upon disconnect
//notifies room of user leaving
function removeUser(data) {
    let disconnectionMsg = document.createElement('li');
    disconnectionMsg.innerHTML = data.message;
    disconnectionMsg.className = 'list-group';
    chatBox.appendChild(
        disconnectionMsg
    );

    let userList = userBox.getElementsByTagName('li');
    Array.from(userList).forEach(user => {
        if (data.name == user.innerHTML)
        {
            user.remove();
        }
    });
}

function changeRoom(event) {
    roomName = event.target.value;
    socket.emit('changeRoom', {
        room : roomName
    });
}

//generates form with inputs to add a room
//sends room information to server through socket
function addRoom() {
    //generating form fields
    let formDiv = document.getElementById('addRoomForm');
    formDiv.setAttribute('style', 'text-align: center;');

    let fields = [];
    
    let name = document.createElement('input');
    name.setAttribute('placeholder', 'Room Name');
    name.type = 'text';
    name.id = 'name';
    fields.push(name);

    let visibility = document.createElement('input');
    let label = document.createElement('label');
    visibility.type = 'checkbox';
    visibility.id = 'visibility';
    label.setAttribute('for', 'visibility');
    label.innerHTML = 'Private?';
    fields.push(label);
    fields.push(visibility);
    

    let password = document.createElement('input');
    password.setAttribute('placeholder', 'Password (if private)');
    password.type = 'text';
    password.id = 'password';
    fields.push(password);

    let sub = document.createElement('button');
    sub.type = 'button';
    sub.innerHTML = 'Add Room';
    fields.push(sub);

    Array.from(fields).forEach(field => {
        formDiv.appendChild(
            field
        );
        formDiv.appendChild(
            document.createElement('br')
        );
    });

    sub.addEventListener('click', processRoom);
}

//handling submission of add room
//grabs field information, emits to server, and removes form from user's display
function processRoom() {
    let name = document.getElementById('name');
    let vis = document.getElementById('visibility');
    let pass = document.getElementById('password');

    //if private is checked, make sure there is a password
    //otherwise, ignore password
    if (vis.checked) {
        if (pass.value){
            socket.emit('addRoom', {
                name : name.value,
                vis : 'private',
                pass : pass.value
            });
            //clear form
            Array.from(form.children).forEach (element => {
            element.remove();
            });
        }
        else {
            alert('Password must be entered to create private room');
        } 
    }
    else {
        socket.emit('addRoom', {
            name : name.value,
            vis: 'public',
            pass: 'None'
        });
	console.log('adding room');
        //clear form
        Array.from(form.children).forEach (element => {
        element.remove();
        });
    }

}

document.getElementById('sendMsg').addEventListener('click', sendMsg);
document.getElementById('room').addEventListener('change', changeRoom);
document.getElementById('roomBtn').addEventListener('click', addRoom);
