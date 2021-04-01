const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const { connect, dbPath } = require('./connectDb');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 600000 },
    store: MongoStore.create({ mongoUrl: dbPath }),
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(3005, () => {
  console.log('Server Started');
});

module.exports = app;
