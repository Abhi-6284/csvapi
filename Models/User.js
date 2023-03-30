const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, match: /^[a-zA-Z]+$/ },
  last_name: { type: String, required: true },
  company_name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postal: { type: String, required: true },
  phone1: { type: String, required: true },
  phone2: { type: String, required: true },
  email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  web: { type: String, required: true }
}, { timestamps: true, }
);

module.exports = User = mongoose.model("User", UserSchema);
