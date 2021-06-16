const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/CreativeProject', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

const users = require("./users.js");
app.use("/api/users", users.routes);

const animations = require("./animations.js");
app.use("/api/animations", animations.routes);

const lists = require("./lists.js");
app.use("/api/lists", lists.routes);

app.listen(3002, () => console.log('Server listening on port 3002!'));
