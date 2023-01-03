const express = require("express");
const UserType = require("../schemas/userType.js");

const router = express.Router();

router
  .route("/")
  // axios.get('/users') 로부터 요청 받음
  .get(async (req, res, next) => {
    res.send("OK.");
    try {
      const userType = await UserType.find({});
      console.log(userType);
    } catch (err) {
      console.error(err);
      next(err);
      //dfd
    }
  })

  // axios.post('/users', { phone, type }) 로부터 요청 받음
  .post(async (req, res, next) => {
    try {
      // UserType 컬렉션에 document 생성 & 등록
      // const userType = await UserType.create({
      //   phone: req.body.phone,
      //   type: req.body.type,
      // });
      console.log("ㅅㅂㅅㅂㅅㅂ");
      console.log(req.body);
      // res.status(201).json(userType);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
