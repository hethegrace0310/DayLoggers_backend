var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  questionText: { type: String},
  questionType: {type: String,},
  multipleChoice: { type:[String] },
  date: { type: Date, default: new Date()},
  responses: { type: Schema.Types.Map, default: {}}, 
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

//Export model
module.exports = mongoose.model("Question", QuestionSchema);
