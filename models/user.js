const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
userSchema.plugin(passportLocalMongoose); // this plugin will add a username, password, and some other fields to the schema. It will also hash and salt the password for us.
const User = Model("User", userSchema);
module.exports = User;
