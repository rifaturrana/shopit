const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/errors");
app.use(express.json());
const products = require("./routes/product");
app.use(errorMiddleware);

app.use("/api/v1", products);
module.exports = app;
