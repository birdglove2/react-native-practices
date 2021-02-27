const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmUzMjYzMzY1MWI5ZDU1NjFiNGQ3MTQiLCJpYXQiOjE2MDg3MjE5NzF9.gRv2iXZQ8Rg2C40llIv1X0Pup-zsOYhStzAvFjMxz9s'

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  // token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmUzMjYzMzY1MWI5ZDU1NjFiNGQ3MTQiLCJpYXQiOjE2MDg3MjE5NzF9.gRv2iXZQ8Rg2C40llIv1X0Pup-zsOYhStzAvFjMxz9s'

  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};
