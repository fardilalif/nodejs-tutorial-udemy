require("dotenv").config();
const Product = require("./models/product.js");
const jsonProducts = require("./products.json");
const connectDB = require("./db/connect.js");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("Success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
