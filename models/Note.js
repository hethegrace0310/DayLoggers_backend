var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  textTitle: { type: String },
  lastUpdatedDate: { type: Date, default: new Date() },
  text: { type: String },
  tags: { type: [Object] },
  // _id: { type: Schema.Types.ObjectId },
  writer: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

module.exports = mongoose.model("Note", NoteSchema);
