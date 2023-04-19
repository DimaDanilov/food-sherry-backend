const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const productRouter = require("./routes/product.routes");
const categoryRouter = require("./routes/category.routes");
const authRouter = require("./routes/auth.routes");

const BACKEND_PORT = 5000;

const app = express();
app.use(express.json()); // for parsing application/json
app.use("/food_images", express.static("static/food_images"));
app.use(fileUpload({}));
app.use(cors());
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", authRouter);

const start = () => {
  try {
    app.listen(BACKEND_PORT, () =>
      console.log(`SERVER STARTED ON PORT ${BACKEND_PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
