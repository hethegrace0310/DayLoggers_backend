var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FormSchema = new Schema({
  //   textTitle: { type: String },
  //   lastUpdatedDate: { type: Date, default: new Date() },
  //   text: { type: String },
  //   tags: { type: [Object] },
  //   // _id: { type: Schema.Types.ObjectId },
  //   writer: { type: Schema.Types.ObjectId, ref: "User", required: false },
  question: { type: String },
  responseType: { type: String },
});

module.exports = mongoose.model("Qeustions", FormSchema);
