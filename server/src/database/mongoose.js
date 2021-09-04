const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.once("open", () => {
  Logger.info("MongoDB successfully connected: " + process.env.MONGO_URI);
});
db.on("error", err => {
  Logger.error("Connection error");
  Logger.error(err);
});
