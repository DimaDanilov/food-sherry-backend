const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const sequelize = require("./db");
const router = require("./routes/index");
const errorHandler = require("./middleware/error.middleware");

const app = express();
app.use(express.json()); // for parsing application/json
app.use("/food_images", express.static(".vercel/output/static/food_images"));
app.use(
  "/profile_avatars",
  express.static(".vercel/output/static/profile_avatars")
);
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
    await sequelize.sync();
    app.listen(process.env.BACKEND_PORT, () =>
      console.log(`SERVER STARTED ON PORT ${process.env.BACKEND_PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
