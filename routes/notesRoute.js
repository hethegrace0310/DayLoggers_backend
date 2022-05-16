const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Note = require("../models/Note");
const User = require("../models/User");
const { isLoggedIn, isAgent } = require("../middleware/auth");

const { wrapAsync } = require("../utils/helper");

//get all notes
router.get(
  "/notes",
  isAgent,
  wrapAsync(async function (req, res) {
    const notes = await Note.find({ writer: req.session.userId }).sort({
      lastUpdatedDate: -1,
    });
    // console.log(notes);
    res.json(notes);
  })
);

//create new note
router.post(
  "/notes",
  wrapAsync(async function (req, res) {
    // console.log("Posted with body: " + JSON.stringify(req.body));
    let writer = req.session.userId;
    console.log(writer);
    // if (typeof writer === "string") {
    //   writer = await User.findOne({ name: writer });
    // }
    const newNote = new Note({
      textTitle: req.body.textTitle,
      lastUpdatedDate: new Date(),
      text: req.body.text,
      tags: req.body.tags,
      writer: req.session.userId,
      // writer: writer,
    });

    await newNote.save();
    res.json(newNote); //newNote object를 json 형식으로 바꿔서 보내준다.
  })
);

//update a note
router.put(
  "/notes/:id",
  isAgent,
  wrapAsync(async function (req, res) {
    const id = req.params.id;
    // console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));

    await Note.findByIdAndUpdate(
      id,
      {
        textTitle: req.body.textTitle,
        lastUpdatedDate: req.body.lastUpdatedDate,
        text: req.body.text,
        tags: req.body.tags,
        writer: req.session.userId,
        // writer: writer,
      },
      { runValidators: true }
    );
    res.sendStatus(204);
  })
);

router.delete(
  "/notes/:id",
  isAgent,
  wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await Note.findByIdAndDelete(mongoose.Types.ObjectId(id));
    // console.log("Deleted successfully: " + result);
    res.json(result);
  })
);

module.exports = router;
