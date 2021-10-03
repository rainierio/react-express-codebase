const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

/**
 * Create mongoose user schema
 *
 */
const UserAuthSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  emailVerificationToken: { type: String },
  emailVerified: { type: Boolean },
  google: { type: String },
  facebook: { type: String },
  linkedin: { type: String },
  instagram: { type: String },
  tokens: { type: Array },
  createdat: { type: Date },
  updatedat: { type: Date },
});

/**
 * password hash before stored to database
 */
UserAuthSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

/**
 * helper method for validating user's password
 */
UserAuthSchema.methods.isCorrectPassword = function (pass, callback) {
  bcrypt.compare(pass, this.password, function (err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

module.exports = UserAuth = mongoose.model(
  "userauth",
  UserAuthSchema,
  "userauth"
);
