const path = require('path');
const fs = require('fs');

exports.readFile = function(filepath, res) {
    fs.readFile(filepath, function(err, data) {
        if(err) {
	    errorHandler(res);
	}
	else {
	    res.writeHead(200, {'Content-Type': extension(filepath) });
	    res.write(data);
	    res.end();
	}
    });
}

function errorHandler(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found');
    res.end();
}

function extension(filepath) {
    var content;
    let ext = path.extname(filepath);
    switch(ext) {
        case ".html":
	    content = 'text/html';
	    break;
	case ".css":
	    content = 'text/css';
	    break;
	case ".js":
	    content = 'text/javascript';
	    break;
	case ".txt":
	    content = 'text/plain';
	    break;
	case ".jpg":
	    content = 'image/jpeg';
	    break;
    }
    return content;
}
