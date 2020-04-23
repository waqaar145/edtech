const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const http = require('http');
const adminRoutes = require('./routes/admin');
// // const usersRoutes = require('./routes/users');
var session = require('express-session');
const KnexSessionStore = require("connect-session-knex")(session);
const knex = require('./db/knex');
const uuid = require('uuid/v4');
const passport = require('passport');
const config = require('./config/config');
var morgan = require('morgan');
//
// // Redis Starts here *****
// // const redis = require("redis");
// // const client = redis.createClient();
// // client.on('connect', function() {
// //     console.log('Redis client connected');
// // });
// // client.set('count', '1');
// // Redis ends here *****
//
var app = express();
var server = require('http').createServer(app);
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//
// sesstion
const store = new KnexSessionStore({
  knex: knex,
  tablename: "sessions" // optional. Defaults to 'sessions'
});
//
app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: store,
  secret: config.SESSTION_SECRET,
  resave: false,
  saveUninitialized: false
}));

require("./config/passport-local");

app.use(passport.initialize());
app.use(passport.session());

//
// // Socket-io starts here ********
// var io = require('socket.io')(server);
// io.on('connection', function(socket){
//   console.log('a user connected');
// });
// // Socket-io ends here ********
//
app.use(express.static(__dirname + '/uploads/top-level'));
adminRoutes.routes(app);
// // usersRoutes.routes(app);
//
// app.get('*', function(req, res){
//   res.status(404).send('what???');
// });

server.listen(port, () => {
  console.log('Server is running on port - ', port);
});
