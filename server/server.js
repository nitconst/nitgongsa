const express = require("express");
const path = require("path");

const connect = require("./schemas");
const usersRouter = require("./routes/users");
const gongsaRouter = require("./routes/gongsa");

const app = express();

app.set("port", process.env.PORT || 8080);
connect();

app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/gongsa", gongsaRouter);

app.get("/", (req, res, next) => {
  res.json({ man: "scraa" });
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
