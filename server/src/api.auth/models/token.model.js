const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  token: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 36000 * 24 * 14 },
});

const ProviderTokenSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    provider: String,
    accessToken: String,
    refreshToken: String,
    expiresIn: Date,
  },
  {
    timestamps: true,
  },
);

module.exports = {
  RefreshToken: mongoose.model("RefreshToken", TokenSchema),
  ProviderToken: mongoose.model("ProviderToken", ProviderTokenSchema),
};
