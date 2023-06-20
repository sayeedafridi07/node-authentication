const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Enter Email"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    unique: false,
  },
});
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
