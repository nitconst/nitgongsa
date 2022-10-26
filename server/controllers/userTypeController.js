const UserType = require("schemas/userType");

exports.readUserType = async (req, res) => {
  const newUserType = await UserType.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      userType: newUserType,
    },
  });
};

// usertype 데이터 생성
