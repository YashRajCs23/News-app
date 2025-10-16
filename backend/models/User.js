const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);


