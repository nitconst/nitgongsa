const express = require("express");
const Gongsa = require("../schemas/gongsa.js");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    res.send("OK.");
    const gongsa = await Gongsa.find({});
    console.log(gongsa);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
