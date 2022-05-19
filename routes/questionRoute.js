const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const Note = require("../models/Note");
const Question = require("../models/Question");
const User = require("../models/User");
const { isLoggedIn, isAgent } = require("../middleware/auth");

const { wrapAsync } = require("../utils/helper");

//get qustion (날짜에 따라서)
//get all
router.get(
  "/questions",
  isAgent,
  wrapAsync(async function (req, res) {
    const questions = await Question.find({ user: req.session.userId }).sort({
      lastUpdatedDate: -1,
    });
    // console.log(notes);
    res.json(questions);
  })
);

router.get(
  "/questions/:id",
  isAgent,
  wrapAsync(async function (req, res, next) {
    let id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
      const question = await Question.findById(id);
      if (question) {
        res.json(question);
        return;
      } else {
        // The thrown error will be handled by the error handling middleware
        throw new Error("Question Not Found");
      }
    } else {
      throw new Error("Invalid Question Id");
    }
  })
);

//edit question
router.put(
  "/questions/:id",
  isAgent,
  wrapAsync(async function (req, res) {
    const id = req.params.id;
    // console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));

    await Question.findByIdAndUpdate(
      id,
      {
        user: req.body.userId,
        questionType: req.body.questionType,
        questionText: req.body.questionText,
        multipleChoice: req.body.multipleChoice,
        date: req.body.date,
        responses: req.body.responses,
        //   textTitle: req.body.textTitle,
        //   lastUpdatedDate: req.body.lastUpdatedDate,
        //   text: req.body.text,
        //   tags: req.body.tags,
        //   writer: req.session.userId,
      },
      { runValidators: true }
    );
    res.sendStatus(204);
  })
);

//delete questions
router.delete(
  "/questions/:id",
  isAgent,
  wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await Question.findByIdAndDelete(
      mongoose.Types.ObjectId(id)
    );
    console.log("Deleted successfully: " + result);
    res.json(result);
  })
);

module.exports = router;
