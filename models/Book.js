const { model, Schema } = require("mongoose");

const bookSchema = new Schema({
  title: String,
  description: String,
  price: String,
  createdAt: String,
  admin: String,
  owner: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Book", bookSchema);
