//Add a header with your name, data, and description of this file
//Alex Cushman - CSC 543 - Homework Assignment 3
//This program is a simple http server that displays the current time and date to users.

//route module
let routes = require('./routes.js');

//url package for later
let url = require('url');
const http = require('http');

//current date object
let date = new Date();

//create a server object:
const myserver = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'plain'});
    
    //checking url to determine route
    //call appropriate route function
    let q = url.parse(req.url, true);
    let route = q.pathname;
    if(route == "/time")
	{
	    routes.time(res, date);
	}
    else if(route == "/today")
	{
	    routes.today(res, date);
	}
    else if(route == "/dateToDay")
	{
	    routes.dateToDay(res, q.query, date);
	}
    else
        {
        routes.error(res);
        }
});
myserver.listen(80, function() {console.log("Listening on port 80")}); //the server object listens on port 8080

