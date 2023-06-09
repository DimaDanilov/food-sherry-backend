const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const sequelize = require("./db");
const router = require("./routes/index");
const errorHandler = require("./middleware/error.middleware");
const path = require("path");
const backend_port = process.env.BACKEND_PORT || 8000;

const app = express();
app.use(express.json()); // for parsing application/json

app.use(fileUpload({}));
app.use(
  cors({
    origin: "https://food-sherry.vercel.app",
  })
);
app.use("/api", router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(backend_port, () =>
      console.log(`SERVER STARTED ON PORT ${backend_port}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
