const VM_IP = 'localhost';

function login() {

    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function() {
        alert('Error');
    }
    AJAX.onload = function() {
        console.log("Logged in!");
    }
    AJAX.open('GET', "/");
    AJAX.send();
}

function register() {
    registerdata = {
        username : document.getElementById('registerUsername').value,
        password : document.getElementById('registerPassword').value
    };
    console.log(registerdata);
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function() {
        alert('Error');
    }
    AJAX.onload = function() {
        console.log('Register Success');
        alert('Register Success!');
    }
    AJAX.open('POST', "/register");
    AJAX.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    AJAX.send(JSON.stringify(registerdata));
}

document.getElementById('registerBtn').addEventListener('click', register);
document.getElementById('loginBtn').addEventListener('click', login);