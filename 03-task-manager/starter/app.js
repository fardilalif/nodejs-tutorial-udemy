const express = require("express");
const app = express();
const tasks = require("./routes/tasks.js");
const connectDB = require("./db/connect.js");
require("dotenv").config();
const notFound = require("./middlewares/notFound.js");
const errorHandler = require("./middlewares/errorHandler.js");

// middleware
app.use(express.static("./public"));
app.use(express.json()); // to parse incoming json and insert the json into req.body

// routes
app.use("/api/v1/tasks", tasks);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening to port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
