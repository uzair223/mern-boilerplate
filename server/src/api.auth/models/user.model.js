const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { ProviderToken, RefreshToken } = require("./token.model");

const UserSchema = new mongoose.Schema(
  {
    googleId: String,
    microsoftId: String,
    email: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    password: String,
    name: String,
    location: {
      lon: Number,
      lat: Number,
    },
    active: { type: Boolean, default: false },
    role: { type: String, default: "basic", enum: ["basic", "admin", "superuser"] },
    activation: String,
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password || !this.isNew) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create activation code for new users
UserSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  this.activation = await bcrypt.hash(this.username, 10);
  next();
});
// Automatically expire user if not activated after 30 minutes
UserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 1800,
    partialFilterExpression: { active: false },
  },
);

// Delete all user's objects on deletion
UserSchema.pre("delete", async function (next) {
  const user = this;
  await ProviderToken.deleteMany({ user });
  await RefreshToken.deleteMany({ user });
  next();
});

UserSchema.methods.passwordsMatch = function (password) {
  return bcrypt.compareSync(password, this.password);
};
UserSchema.methods.filter = function () {
  const { activation, _v, createdAt, updatedAt, password, ...rest } = this._doc;
  return rest;
};

module.exports = mongoose.model("User", UserSchema);
