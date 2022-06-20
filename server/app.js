const express = require("express");
const cookieparser = require("cookieparser");
const app = express();

const errorMiddleware = require("./middlewares/errors");
app.use(express.json());
app.use(cookieparser);
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
app.use(errorMiddleware);

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("api/v1", order);

module.exports = app;
