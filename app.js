require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
process.setMaxListeners(0);
const app = express();
const connectDB = require('./Utils/config')

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


app.use("/api/uploadCsv", require("./routes/csvRoutes"));

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
      console.log(`Server is Running at http://${process.env.HOST}:${process.env.PORT}`)
  })
})