const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track"); // แทน import ไม่งั้นจะ run TrackSchema more than once

const router = express.Router();

router.use(requireAuth); // ensure that user is signed in.

router.get("/tracks", async (req, res) => {
  const tracks = await Track.find({ userId: req.user._id });

  res.send(tracks);
});

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res.status(422).send({ error: "You must provide name and locations" });
  }

  const track = new Track({ name, locations, userId: req.user._id });
  try {
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
