const express = require("express");
const UserType = require("../schemas/userType.js");

const router = express.Router();

router
  .route("/users")
  // axios.get('/users') 로부터 요청 받음
  .get(async (req, res, next) => {
    try {
      const userType = await UserType.find({});
      console.log(userType);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  // axios.post('/users', { phone, type }) 로부터 요청 받음
  .post(async (req, res, next) => {
    try {
      // UserType 컬렉션에 document 생성 & 등록
      const userType = await UserType.create({
        phone: req.body.phone,
        type: req.body.type,
      });

      console.log(userType);
      res.status(201).json(userType);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
