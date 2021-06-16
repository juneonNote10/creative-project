const mongoose = require('mongoose');
const express = require("express");

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const animations = require("./animations.js");
const Animation = animations.model;

const listSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  animation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Animation'
  },
  scheduled: {
    type: Boolean,
    default: false
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
});

const List = mongoose.model('List', listSchema);

// add animation to user list
router.post("/:id", validUser, async (req, res) => {
  let animation = await Animation.findOne({
    _id: req.params.id
  });

  let existAnimation = await List.findOne({
    user: req.user,
    animation: animation,
  });
  if (existAnimation)
    return res.status(403).send({
      message: "It is already in your list."
    });

  const list = new List({
    user: req.user,
    animation: animation,
  });
  try {
    await list.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// add animation to user schedule
router.put("/addSchedule/:id", validUser, async (req, res) => {
  try {
    let animation = await Animation.findOne({
      _id: req.params.id
    });

    let list = await List.findOne({
      user: req.user,
      animation: animation,
    });

    if (list.scheduled)
      return res.status(403).send({
        message: "It is already scheduled."
      });

    list.scheduled = true;
    list.addedDate = Date.now();
    await list.save();
    res.send(list);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// remove animation to user schedule
router.put("/removeSchedule/:id", validUser, async (req, res) => {
  try {
    let animation = await Animation.findOne({
      _id: req.params.id
    });

    let list = await List.findOne({
      user: req.user,
      animation: animation,
    });

    if (!list.scheduled)
      return res.status(403).send({
        message: "It is already not scheduled."
      });

    list.scheduled = false;
    await list.save();
    res.send(list);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get user list
router.get("/", validUser, async (req, res) => {
  try {
    let list = await List.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('animation');
    return res.send(list);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get user schedule
router.get("/schedule", validUser, async (req, res) => {
  try {
    let schedule = await List.find({
      user: req.user,
      scheduled: true
    }).sort({
      addedDate: 1
    }).populate('animation');
    return res.send(schedule);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get not scheduled user list
router.get("/notScheduled", validUser, async (req, res) => {
  try {
    let schedule = await List.find({
      user: req.user,
      scheduled: false
    }).populate('animation');
    return res.send(schedule);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// check whether animation is in list
router.get("/:id", validUser, async (req, res) => {
  try {
    let animation = await Animation.findOne({
      _id: req.params.id
    });

    const existAnimation = await List.findOne({
      user: req.user,
      animation: animation
    });

    if (!existAnimation)
      return res.status(404).send({
        message: "It is not in list"
      })

    res.send(existAnimation);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete animation from user list
router.delete("/:id", validUser, async (req, res) => {
  let animation = await Animation.findOne({
    _id: req.params.id
  });

  try {
    await List.deleteOne({
      user: req.user,
      animation: animation,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = {
  model: List,
  routes: router,
}
