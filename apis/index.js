const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http").Server(app);
const path = require("path");
process.env.TZ = "Asia/Kolkata";

// cors configurations
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//{ useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(process.env.DB_CONNECTION);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", function () {
  console.log("Connected Successfully");
});

app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get error controller
const errorController = require("./helper/errorController");
// Error handling middleware
app.use(errorController);

const adminRoutes = require("./routes/admin");
app.use(adminRoutes);

const port = process.env.PORT || 5055;
http.listen(port, () => console.log(`http://localhost:${port}`));
