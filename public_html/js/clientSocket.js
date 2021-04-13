const socket = io('http://34.75.193.0:8080');

socket.on('greeting-from-server', function (message) {
    document.body.appendChild(
        document.createTextNode(message.greeting)
    );
    socket.emit('greeting-from-client', {
        greeting: 'Hello Server'
    });
});