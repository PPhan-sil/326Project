const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})
const likeModel = mongoose.model("Like", likeSchema);
module.exports = likeModel;
