var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  questionType: {
    type: String,
    required: true,
    // String: {
    // 	values: ["number", "boolean", "text", "multiple"],
    // 	message: "type is wrong",
    // },
    default: "text",
  },
  questionText: { type: String, default: "" },
  multipleChoice: { type: Array, default: ["", "", ""], required: true },
  date: { type: Date, default: new Date(), required: true },
  responses: { type: Schema.Types.Map, default: {}, required: true }, //{"date":"responses"} -> ex){"2022-01-02":"String으로 때려박기"}
});

//Export model
module.exports = mongoose.model("Question", QuestionSchema);
