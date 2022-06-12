const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/errors");
app.use(express.json());
const products = require("./routes/product");
const auth = require("./routes/auth");
app.use(errorMiddleware);

app.use("/api/v1", products);
app.use("/api/v1", auth);
module.exports = app;
