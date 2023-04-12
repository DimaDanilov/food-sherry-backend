const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());

const BACKEND_PORT = 5000;

const productRouter = require("./routes/product.routes");
const categoryRouter = require("./routes/category.routes");

app.use("/api", productRouter);
app.use("/api", categoryRouter);

app.listen(BACKEND_PORT, () => {
  console.log("SERVER IS WORKING");
});
