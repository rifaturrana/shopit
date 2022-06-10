const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const product = require("../data/product.json");

dotenv.config({ path: "server/config/config.env" });
connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products are deleted");
    await Product.insertMany(product);
    console.log("All products are added.");
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
