const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./navigation/nav');
const app = express();

// for body parser. to collect data that sent from the client.
app.use(express.urlencoded( { extended : false}));


// Serve static files. CSS, Images, JS files ... etc
app.use(express.static(path.join(__dirname, 'public')));


// Template engine. PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// session
app.use(session({
    secret:'coursework_scheduling_app',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

// Routers
app.use('/', pageRouter);

// Setting up the server
app.listen(8000, () => {
    console.log('Server is running on port 8000...');
});

module.exports = app;