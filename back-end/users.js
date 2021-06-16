const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();

const animations = require("./animations.js");
const Animation = animations.model;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  watched: {
    type: Array,
    default: []
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();

  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model('User', userSchema);

const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    req.user = user;
  } catch (error) {
    return res.status(403).send({
      message: "not logged in"
    });
  }
  next();
};

// create a new user
router.post('/', async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password)
    return res.status(400).send({
      message: "first name, last name, username and password are required"
    });

  try {
    const existingUser = await User.findOne({
      username: req.body.username
    });

    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });

    if (req.body.username.length < 8 || req.body.password.length < 8)
      return res.status(403).send({
        message: "It must have at least 8 words"
      });

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password
    });
    await user.save();
    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// login a user
router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    req.session.userID = user._id;

    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get logged in user
router.get('/', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// logout
router.delete("/", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// add watched animation
router.put("/addWatched/:id", validUser, async (req, res) => {
  try {
    let animation = await Animation.findOne({
      _id: req.params.id
    });

    let existAnimation = false;
    for (let i = 0; i < req.user.watched.length; i++) {
      if (req.user.watched[i]._id.toString() === req.params.id)
        existAnimation =  true;
    };

    if (existAnimation)
      return res.status(403).send({
        message: "Animation already exists"
      });

    req.user.watched.unshift(animation);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// remove animation from watched list
router.put("/removeWatched/:id", validUser, async (req, res) => {
  try {
    let animation = await Animation.findOne({
      _id: req.params.id
    });

    let pos = 0;
    let existAnimation = false;
    for (let i = 0; i < req.user.watched.length; i++) {
      if (req.user.watched[i]._id.toString() === req.params.id) {
        existAnimation =  true;
        pos = i;
      }
    };

    if (!existAnimation)
      return res.status(403).send({
        message: "Animation is not watched"
      });

    req.user.watched.splice(pos, 1);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// check whether animation is watched
router.get('/:id', validUser, async (req, res) => {
  try {
    let animation = await Animation.findOne({
      _id: req.params.id
    });

    let existAnimation = false;
    for (let i = 0; i < req.user.watched.length; i++) {
      if (req.user.watched[i]._id.toString() === req.params.id)
        existAnimation =  true;
    };

    if (!existAnimation) {
      return res.status(404).send({
        message: "It is not watched"
      })
    }

    res.send(req.user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: User,
  valid: validUser
};
