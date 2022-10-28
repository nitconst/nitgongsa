const express = require("express");
const Gongsa = require("../schemas/gongsa.js");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const gongsa = await Gongsa.find().sort({ createdAt: -1 }).limit(5);
    // 날짜 순 정렬 및 5개 제한하는 쿼리, 해당 쿼리에서 sorting하는 부분만 파라미터로 받아와서 반영할 수 있게 하면 될듯
    res.send(gongsa);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
