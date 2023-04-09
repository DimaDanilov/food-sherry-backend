const express = require("express");
require("dotenv").config();

const productRouter = require("./routes/product.routes");
const app = express();
const BACKEND_PORT = 5000;

app.use(express.json()); // for parsing application/json

app.use("/api", productRouter);

app.listen(BACKEND_PORT, () => {
  console.log("SERVER IS WORKING");
});
