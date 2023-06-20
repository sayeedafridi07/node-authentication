const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  console.log(process.env.DB_URL);
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected Successfully");
    })
    .catch((error) => {
      console.log("Oops Something went wrong 😢");
      console.log(error);
    });
}

module.exports = dbConnect;
