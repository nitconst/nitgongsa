const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const connect = require("./schemas");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const gongsaRouter = require("./routes/post");

const app = express();

app.set("port", process.env.PORT || 8080);
connect();

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/post", gongsaRouter);
// Parse requests of content-type: application/json
app.use(bodyParser.json());

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
