const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http").Server(app);
const path = require("path");
const moment = require("moment-timezone");

process.env.TZ = "Asia/Kolkata";
moment.tz.setDefault("Asia/Kolkata");

// Get error controller
const errorController = require("./helper/errorController");

// cors configurations
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
// Trust proxy headers
app.set("trust proxy", true);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define static files
app.use("/public/logo", express.static(path.join(__dirname, "./public/images/logo")));
app.use("/public/profile", express.static(path.join(__dirname, "./public/images/profile")));
app.use("/public/banner", express.static(path.join(__dirname, "./public/images/banner")));
app.use("/public/category", express.static(path.join(__dirname, "./public/images/category")));
app.use("/public/beautician", express.static(path.join(__dirname, "./public/images/beautician")));
app.use("/public/service", express.static(path.join(__dirname, "./public/images/service")));

//Admin Route
const adminRoutes = require("./routes/admin");
app.use(adminRoutes);

//User App route
const userRoute = require("./routes/app/user");
app.use(userRoute);

//Beautician App route
const beauticianRoute = require("./routes/app/beautician");
app.use(beauticianRoute);

// Error handling middleware
app.use(errorController);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", function () {
  console.log("Connected Successfully");
});

// var server = app.listen(5000);
const port = process.env.PORT || 5057;
http.listen(port, () => console.log(`http://localhost:${port}`));
