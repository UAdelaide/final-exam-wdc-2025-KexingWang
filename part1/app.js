var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    // Connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'DogWalkService'
    });

  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// Attach db to request
app.use((req, res, next) => {
  req.db = db;
  next();
});


// Dog routes
const dogsRouter = require('./routes/dogs');
app.use('/api/dogs', dogsRouter);

// Walkrequest routes
const walkRequestsRouter = require('./routes/walkRequests');
app.use('/api/walkrequests', walkRequestsRouter);

// Walker routes
const walkersRouter = require('./routes/walkers');
app.use('/api/walkers', walkersRouter);

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;