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


//NOTE
//results is an array object containing each row as an object
//to obtain specific result: result[0].username


//Takes a username and a password, as well as the database connection and inserts into db
exports.createUser = function(uName, pWord, res) {
   pool.getConnection(function(err, connection) {
      connection.query("INSERT INTO user(username, password) VALUES ('" + uName + "' , '" + pWord + "');",
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
   });
}; //overall function

//Takes a room name and password plus db connection, inserts into db
exports.createRoom = function(rName, pWord) {
   pool.getConnection(function(err, connection) {
      connection.query("INSERT INTO room(roomName, password) VALUES ('" + rName + "' , '" + pWord + "');",
         function(error, results, fields) {
            if (error) throw error;
            else {
               console.log('Room Creation Successful!');
               connection.release();
               //connection.end(); need this?
            } //else
         }); //query function
   });
}; //function

//Tests
//createUser(pool, "", "");
//createRoom(pool, "", "");


//BUFF UP ERROR HANDLING, ARE WE RETURNING ANYTHING? FIT INTO MAIN CODE
exports.getUser = function(uName, pWord, res) {
   pool.getConnection(function(err, connection) {
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
                        res.writeHead(200, {'Content-Type': 'text/plaintext'});
                        res.write('Login Success');
                        res.end();
                        connection.release();
                     }
                     else {
                        console.log('Incorrect username or password')
                        res.writeHead(400, {'Content-Type': 'text/plaintext'});
                        res.write('Login Failure: Bad Credentials');
                        res.end();
                        connection.release();
                     } //else
                  } //else
               }); //query
         } //else
      }); //query function
   });
}; //overall function


exports.checkRoomPass = function(roomName, pWord, res) {
   pool.getConnection(function(err, connection) {
      connection.query("SELECT password FROM room WHERE roomName = '" + roomName + "';",
      function(error, results, fields) {
         if (error) throw error;
         else {
            console.log(results[0]);
            let realPass = results[0].password;
            if(pWord == realPass){
               console.log('Login Succesful!');
               res.writeHead(200, {'Content-Type': 'text/plaintext'});
               res.write('Login Success');
               res.end();
               connection.release();
            }
            else {
               console.log('Incorrect username or password')
               res.writeHead(400, {'Content-Type': 'text/plaintext'});
               res.write('Login Failure: Bad Credentials');
               res.end();
               connection.release();
            } //else
         } //else
      }); //query function
   });
}; //overall function

//test
//getUser(pool, "Tonydags", "12345");

//Get all rooms (doesn't work?)
//UPDATE ERROR HANDLING AND FIT INTO MAIN CODE
/*exports.getRoom = function(res) {
   pool.getConnection(function(err, connection) {
      connection.query("SELECT roomName FROM room;",
      function(error, results, fields) {
         if (error) throw err;
         else {
            console.log(results);
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.write(JSON.stringify(results));
            res.end();
         } //else
      }); //query
   });
}; //overall function
*/

