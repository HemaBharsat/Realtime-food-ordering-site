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
const passport = require('passport')
const Emitter = require('events')

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

//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));
 
//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// Set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app)

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

//socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    //Join
    console.log(socket.id)
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced' , (data) =>{
    io.to('adminRoom').emit('orderPlaced', data)
})