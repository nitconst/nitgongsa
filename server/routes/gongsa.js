const express = require("express");
const Gongsa = require("../schemas/gongsa.js");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    let q = req.query;
    if (q.regioncode2 == "100") {
      const gongsa = await Gongsa.find(req.query)
        .sort({ createdAt: -1 })
        .limit(5);
      // 지역 코드가 100인 케이스에서 날짜 순 정렬 및 5개 제한하는 쿼리
      res.send(gongsa);
    } else {
      const gongsa = await Gongsa.find().sort({ createdAt: -1 }).limit(5);
      // 날짜 순 정렬 및 5개 제한하는 쿼리, 해당 쿼리에서 sorting하는 부분만 파라미터로 받아와서 반영할 수 있게 하면 될듯
      res.send(gongsa);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
