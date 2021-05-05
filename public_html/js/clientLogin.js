
const VM_IP = '34.75.120.250';

//this is awful but for some reason I'm having trouble redirecting with http requests
//grabs the login information from the form, then sends it to the server to process
//if successful, adds the href='/chat' attribute to the <a> tag, and redirects the user 
function login() {
    logindata = {
        username : document.getElementById('loginUsername').value,
        password : document.getElementById('loginPassword').value
    };
    console.log(logindata);
    let AJAX = new XMLHttpRequest();
    AJAX.onerror = function() {
        alert('Error: Login Failure');
    }
    AJAX.onload = function() {
        console.log('Login Success!');
        link = document.getElementById('loginBtn');
        link.setAttribute('href', '/chat');
        console.log(link);
        link.click();
    }
    AJAX.open('POST', "/login");
    AJAX.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    AJAX.send(JSON.stringify(logindata));
}

//simple POST request, sends registration data to server to add to database
//doesn't redirect, just informs user of success
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
