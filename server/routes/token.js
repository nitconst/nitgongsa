// const auth = require("../utils/tokenCheck");

const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const id = "vappet";
    const nick = "hodoopapa";
    const profile = "images";
    // jwt.sign() 메소드: 토큰 발급
    const token = jwt.sign(
      {
        id: id,
        nickname: nick,
        profile: profile,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "120m", //120분, 보안
        issuer: "yeogi-gong4",
      }
    );

    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

// router.get("/check", auth, (req, res) => {
//   // const nickname = req.decoded.nickname;
//   // const profile = req.decoded.profile;
//   return res.status(200).json({
//     code: 200,
//     message: "토큰이 정상입니다.",
//     // data: {
//     //   nickname: nickname,
//     //   profile: profile,
//     // },
//   });
// });

module.exports = router;
