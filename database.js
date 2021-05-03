//get the client
const mysql = require('mysql');

//create connection to the database
const pool = mysql.createPool({
   host: '34.123.119.12',
   user: 'root',
   password: 'ChatApp098',
   database: 'ChatApp',
   connectionLimit: 10
});


pool.query("show tables;",
  function (error, results, fields) {
    if (error) throw error;
    console.log('Success');
    console.log(results);
});

//NOTE
//results is an array object containing each row as an object
//to obtain specific result: result[0].username

//Takes a username and a password, as well as the database connection and inserts into db
exports.createUser = function(uName, pWord, res) {
   pool.query("INSERT INTO user(username, password) VALUES ('" + uName + "' , '" + pWord + "');",
     function(error, results, fields) {
        if (error) throw error;
        else {
           console.log('Account creation successful!');
           res.writeHead(200, {'Content-Type': 'text/plaintext'});
           res.write('Register Success');
           res.end();
           //connection.end();  Don't know if we need this in each function or not
        } //else
     }); //end query function
}; //overall function

//Takes a room name and password plus db connection, inserts into db
function createRoom(connection, rName, pWord) {
   connection.query("INSERT INTO room(roomName, password) VALUES ('" + rName + "' , '" + pWord + "');",
      function(error, results, fields) {
         if (error) throw error;
         else {
            console.log('Room Creation Successful!');
            //connection.end(); need this?
         } //else
      }); //query function
}; //function

//Tests
//createUser(pool, "", "");
//createRoom(pool, "", "");


//BUFF UP ERROR HANDLING, ARE WE RETURNING ANYTHING? FIT INTO MAIN CODE
function getUser(connection, uName, pWord) {
   connection.query("SELECT username FROM user WHERE username = '" + uName + "';",
     function(error, results, fields) {
        if (error) throw error;
        else {
           console.log(results[0].username);
           let realUser = results[0].username;
           connection.query("SELECT password FROM user WHERE username = '" + uName + "';",
             function(error, results, fields) {
                if (error) throw error;
                else {
                   console.log(results[0].password);
                   let realPass = results[0].password;
                   if (realUser == uName && realPass == pWord) {
                      console.log('Login Succesful!');
                      //what else??
                   }
                   else {
                      console.log('Incorrect username or password')
                   } //else
                } //else
             }); //query
        } //else
     }); //query function
}; //overall function

//test
//getUser(pool, "Tonydags", "12345");

//Find a password protected room
//UPDATE ERROR HANDLING AND FIT INTO MAIN CODE
function getRoom(connection, rName, pWord) {
   connection.query("SELECT roomName FROM room WHERE roomName = '" + rName + "';",
     function(error, results, fields) {
        if (error) throw err;
        else {
           console.log(results[0].roomName);
           let realrName = results[0].roomName;
           connection.query("SELECT password FROM room WHERE password = '" + pWord + "';",
             function(error, results, fields) {
                if (error) throw error;
                else {
                   console.log(results);
                   let realPass = results[0].password;
                   if (realrName == rName && realPass == pWord) {
                      console.log('Room Found Successfully');
                      //What else?
                   }
                   else {
                      console.log('Invalid Room name/password');
                   } //else
                } //else
             }); //query 2
        } //else
     }); //query
}; //overall function


