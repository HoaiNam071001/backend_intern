const mongoose = require("mongoose");
const db = process.env.MONGGOOSE_URI;

const Connect = async () => {
  try {
    mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log("MongoDB Connected...");
        return res;
      });
  } catch (e) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = Connect;
