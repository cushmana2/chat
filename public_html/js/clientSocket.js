const socket = io('35.239.56.176:80');

let chatBox = document.getElementById('chatBox');
let userBox = document.getElementById('userBox');

socket.on('connection', function(data) {
    updateUser(data, socket);
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

//updates chat room with notice upon disconnection
socket.on('disconnection', function(data) {
    removeUser(data);
});


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
	console.log(data.name);
	console.log(user.innerHTML);
        if (data.name == user.innerHTML)
	{ 
	    console.log('removed');
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


document.getElementById('sendMsg').addEventListener('click', sendMsg);
document.getElementById('room').addEventListener('change', changeRoom);
