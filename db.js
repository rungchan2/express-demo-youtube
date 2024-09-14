// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings: true
});

// A simple SELECT query
connection.query(
  'SELECT * FROM `users`',
  function (err, results, fields) {

    var { name, email, id, created_at } = results[results.length - 1];
    console.log(name)
    console.log(email)
    console.log(id)
    console.log(created_at)
  }
);