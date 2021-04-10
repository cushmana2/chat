const VM_IP= "34.75.193.0"

function queryObjectToString(query) {
    let properties = Object.keys(query);
    let arrOfQueryStrings = properties.map(prop => prop+"="+query[prop]);
    return(arrOfQueryStrings.join('&'));

function sendAJAX() {
    let qObj = {message: document.getElementById('sendMsg').value};
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onerror = function() {alert('Error')};
    xmlhttp.onload = function() {
        if (this.status == 200) {
	    console.log('good');
	else {
	    alert('Server Error');
	}
    }
    xmlhttp.open('POST', VM_IP+"/chat");
    xmlhttp.setRequestHeader("Content-Type", "text/plain");
    xmlhttp.send(queryObjectToString(qObj));
