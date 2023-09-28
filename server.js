require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3300;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDBStore = require('connect-mongo')(session); // Invoking the MongoStore class

// Database connection
const url = 'mongodb://127.0.0.1:27017/pizza';

const connection = mongoose.connection;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB!!!');
    })
    .catch((err) => {
        console.error('Connection Failed:', err);
    });

// Session store
const mongoStore = new MongoDBStore({
    mongooseConnection: connection,
    collection: 'sessions'
});

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.json());

//global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

// Set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// Import and use the route initializer function
const initRoutes = require('./routes/web');
initRoutes(app); // Pass the 'app' object as an argument

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
