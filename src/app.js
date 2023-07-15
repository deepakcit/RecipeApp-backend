const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

//import
const route = require("./route/routes");

//middleware
app.use(express.json());

//routes
app.use("/",route);

module.exports = app;