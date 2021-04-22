const socket = io('http://localhost:80');

let chatBox = document.getElementById('chatBox');
let userBox = document.getElementById('userBox');

socket.on('connection', function(data) {
    updateUser(data);
});

socket.on('userJoin', function(data) {
    userJoin(data);
});

//updates chatroom with messages sent from server
socket.on('chatUpdate', function(data) {
    addMessage(data);
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
        let list = document.createElement('li');
        list.innerHTML = user;
        list.className = 'list-group'
        userBox.appendChild(
            list
        );            
    });
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
    newUserList.innerHTML = data.user;
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
        if (data.user == user.innerHTML)
        {
            user.remove();
        }
    });
}

document.getElementById('sendMsg').addEventListener('click', sendMsg);