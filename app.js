const VM_IP = "http://34.75.193.0"
const http = require('http')
const fileServer = require('./fileServer.js');




const httpServer = http.createServer(function(req, res) {
    let urlObj = new URL(req.url, VM_IP);
    path = urlObj.pathname;

    switch(path) {
        case "/chat":
	    break;
	case "/":
	    fileServer.readFile("public_html/demo.html", res);
	    break;
	default:
	    fileServer.readFile("public_html/"+path, res);
	    break;
    }
});

httpServer.listen(80);
