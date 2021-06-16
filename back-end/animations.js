const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

const aniSchema = new mongoose.Schema({
  path: String,
  title: String,
  company: String,
  publishedYear: Number,
  seasons: Number,
  episodes: Number,
});

const Animation = mongoose.model('Animation', aniSchema);

// upload animation
router.post("/", upload.single('animation'), async (req, res) => {
  if (!req.file)
    return res.status(400).send({
      message: "Must upload a file."
    });

  const animation = new Animation({
    path: "/images/" + req.file.filename,
    title: req.body.title,
    company: req.body.company,
    publishedYear: req.body.publishedYear,
    seasons: req.body.seasons,
    episodes: req.body.episodes,
  });
  try {
    await animation.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get animations
router.get("/", async (req, res) => {
  try {
    let animations = await Animation.find();
    return res.send(animations);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get an animation
router.get("/:id", async (req, res) => {
  try {
    let animation = await Animation.findOne({
      _id: req.params.id
    });
    return res.send(animation);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: Animation,
};
