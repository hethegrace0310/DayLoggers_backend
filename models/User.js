var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("../utils/validators");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    validate: {
      validator: validator.validateEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: validator.validatePassword,
      message: () =>
        "Password must have at least 1 number, 1 lower, 1 uppercase letter and at least 8 characters",
    },
  },
  profileImage: {
    type: String,
  },
  address: {
    type: [Object],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.statics.findAndValidate = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : false;
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Export model
module.exports = mongoose.model("User", UserSchema);
