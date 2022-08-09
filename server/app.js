const express = require("express");
const cors = require("cors");
const cookieparser = require("cookieparser");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/errors");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser);
app.use(fileUpload());
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
app.use(errorMiddleware);
app.use(cors({ origin: "*" }));
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);

// app.get("/rana", (req, res) => {
//   console.log("=====rana======");
//   res.send("Hellow Rana");
// });
module.exports = app;
