const express = require("express");
const UserType = require("../schemas/userType.js");

const router = express.Router();

router
  .route("/")
  // axios.get('/users') 로부터 요청 받음
  .get(async (req, res, next) => {
    let p = req.query.phone;
    try {
      const userType = await UserType.find({ phone: p });
      res.send(userType);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  // axios.put('/users', { phone, type, key }) 로부터 요청 받음
  .put(async (req, res, next) => {
    try {
      // UserType 컬렉션에 document 생성 & 등록
      const userType = await UserType.create({
        _id: req.body.key,
        phone: req.body.phone,
        type: req.body.type,
      });
      console.log(req.body);
      res.status(201).json(userType);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
