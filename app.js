const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mailRoutes = require("./routes/mailRoutes");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json());

app.use("/", mailRoutes);

module.exports = app;