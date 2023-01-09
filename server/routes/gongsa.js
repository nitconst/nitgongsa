const express = require("express");
const Gongsa = require("../schemas/gongsa.js");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      let q = req.query;
      if (q.id === "0") {
        const gongsa = await Gongsa.find().sort({ createdAt: -1 }).limit(5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, 전체 목록 조회
        res.send(gongsa);
      } else if (q.id === "1") {
        const gongsa = await Gongsa.find({ regioncode2: q.regioncode2 })
          .sort({ createdAt: -1 })
          .limit(5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, regioncode2에 따른 지역별 정렬
        res.send(gongsa);
      } else if (q.id === "2") {
        const gongsa = await Gongsa.find({ regioncode: q.regioncode })
          .sort({ createdAt: -1 })
          .limit(5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, regioncode에 따른 지역별 정렬
        res.send(gongsa);
      } else if (q.id === "3") {
        const gongsa = await Gongsa.find({ regioncode2: q.regioncode2 })
          .sort({ createdAt: -1 })
          .limit((Number(q.page) + 1) * 5)
          .skip(Number(q.page) * 5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, regioncode2에 따른 지역별 정렬 pagenation
        res.send(gongsa);
      } else if (q.id === "4") {
        const gongsa = await Gongsa.find()
          .sort({ createdAt: -1 })
          .limit((Number(q.page) + 1) * 5)
          .skip(Number(q.page) * 5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, pagenation
        res.send(gongsa);
      } else if (q.id === "5") {
        const gongsa = await Gongsa.find({ regioncode: q.regioncode })
          .sort({ createdAt: -1 })
          .limit((Number(q.page) + 1) * 5)
          .skip(Number(q.page) * 5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, regioncode에 따른 지역별 정렬 pagenation
        res.send(gongsa);
      } else if (q.id === "6") {
        const gongsa = await Gongsa.find({ regioncode2: q.regioncode })
          .sort({ createdAt: -1 })
          .limit((Number(q.page) - 1) * 5)
          .skip((Number(q.page) - 2) * 5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, regioncode2에 따른 지역별 정렬 pagenation
        res.send(gongsa);
      } else if (q.id === "7") {
        const gongsa = await Gongsa.find()
          .sort({ createdAt: -1 })
          .limit((Number(q.page) - 1) * 5)
          .skip((Number(q.page) - 2) * 5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, pagenation
        res.send(gongsa);
      } else if (q.id === "8") {
        const gongsa = await Gongsa.find({ regioncode: q.regioncode })
          .sort({ createdAt: -1 })
          .limit((Number(q.page) - 1) * 5)
          .skip((Number(q.page) - 2) * 5);
        // 날짜 순 정렬 및 5개 제한하는 쿼리, regioncode에 따른 지역별 정렬 pagenation
        res.send(gongsa);
      } else if (q.search === "my") {
        const gongsa = await Gongsa.find({ phone: q.phone });
        res.send(gongsa);
        // 현재 사용자 포스팅만 정렬
      } else {
        res.send("Wrong Request, No data.");
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    const result = await Gongsa.create(req.body)
      .then(() => res.send("OK"))
      .catch((err) => res.status(500).send(err));
    console.log(result);
  })
  .put(async (req, res, next) => {
    console.log(req.body);
    await Gongsa.findOneAndUpdate({ docKey: req.body.docKey }, req.params)
      .then((todo) => res.send(todo))
      .catch((err) => res.status(500).send(err));
  })
  .delete(async (req, res, next) => {
    console.log(req.body);
    await Gongsa.deleteOne({ docKey: req.body.docKey })
      .then(() => res.sendStatus(200))
      .catch((err) => res.status(500).send(err));
  });

router.route("/excel").get(async (req, res, next) => {
  let q = req.query;
  try {
    if (q.queryType === "0") {
      const gongsa = await Gongsa.find().sort({ createdAt: -1 });
      res.send(gongsa);
    } else if (q.queryType === "1") {
      const gongsa = await Gongsa.find({ regioncode2: q.regioncode2 }).sort({
        createdAt: -1,
      });
      res.send(gongsa);
    } else if (q.queryType === "2") {
      const gongsa = await Gongsa.find({ regioncode: q.regioncode }).sort({
        createdAt: -1,
      });
      res.send(gongsa);
    } else {
      res.send("Wrong Request, No data.");
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
