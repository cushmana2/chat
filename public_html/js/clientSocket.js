const socket = io('http://localhost:80');

let chatBox = document.getElementById('chatBox');
let userBox = document.getElementById('userBox');

//updates chat room with newly joined user
//updates user list and adds notice message
socket.on('userJoin', function(data) {
    let newUserMsg = document.createElement('li');
    newUserMsg.innerHTML = data.message;
    newUserMsg.className = 'list-group';
    chatBox.appendChild(
        newUserMsg
    );

    let newUserList = document.createElement('li');
    newUserList.innerHTML = 'Anonymous User';
    newUserList.className = 'list-group';
    userBox.appendChild(
        newUserList
    );
});

//updates chatroom with messages sent from server
socket.on('chatUpdate', function(data) {
    let newMsg = document.createElement('li');
    newMsg.innerHTML = data.update;
    newMsg.className = 'list-group';
    chatBox.appendChild(
        newMsg
    );
})

//updates chat room with notice upon disconnection
socket.on('disconnection', function(data) {
    let disconnectionMsg = document.createElement('li');
    disconnectionMsg.innerHTML = data.message;
    disconnectionMsg.className = 'list-group';
    chatBox.appendChild(
        disconnectionrMsg
    );
});

//event handler for send message button
//sends textarea input to server, clears textarea
function sendMsg() {
    let textbox = document.getElementById('msg');
    let msg = textbox.value;
    socket.send(msg);
    textbox.value = '';
}

document.getElementById('sendMsg').addEventListener('click', sendMsg);