const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", require("./controllers/auth"));
app.use("/api/v1/posts", require("./controllers/posts"));
app.use("/api/v1/comments", require("./controllers/comments"));
app.use("/api/v1/users", require("./controllers/users"));

app.use(require("./middleware/not-found"));
app.use(require("./middleware/error"));

module.exports = app;
