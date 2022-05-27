const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Question = require("../models/Question");

const { wrapAsync } = require("../utils/helper");

// // Multer is middleware for multipart form data: https://www.npmjs.com/package/multer
const multer = require("multer");
const { response } = require("../app");
// // This part is a temporary place to store the uploaded files
// // In actual development we would not store it on the local server
const upload = multer({ dest: "uploads/" });

// upload.single('image') tells it we are only uploading 1 file, and the file was named "image" on the front end client.
router.post(
  "/user/:id/file",
  upload.single("image"),
  wrapAsync(async function (req, res) {
    // You can see the file details here – it also gets automatically saved into the uploads folder
    // Again, this is an example of how this works but you would do something a little different in production.
    console.log("File uploaded of length: " + req.file.size);
    console.dir(req.file);
    res.json("File uploaded successfully");
  })
);

//get
router.get(
  "/user", //relative path
  wrapAsync(async function (req, res, next) {
    const id = req.session.userId; //쿠키에 들어 있ㅡ seesion key를 기반으로 session에서 user id 가져옴
    // console.log(req);
    if (mongoose.isValidObjectId(id)) {
      //id가 mongoose에서 valid한지 검사
      const user = await User.findById(id);
      if (user) {
        res.json(user);
        return;
      } else {
        // throw new Error("User Not Found");
        res.sendStatus(404);
      }
    } else {
      // throw new Error("Invalid user Id");
      res.sendStatus(400);
    }
  })
);

//get /users
router.get(
  "/users",
  wrapAsync(async function (req, res) {
    const users = await User.find().sort({
      date: -1,
    });
    console.log(users);
    const returnUsers = await Promise.all(
      users.map(async function (user) {
        const questions = await Question.find({ user: user._id });
        console.log(questions);
        const responses = questions.map((q) => Object.keys(q.responses).length);
        // console.log(responses);
        const sum = responses.reduce((a, c) => a + c, 0);
        // console.log(sum);
        return { ...user._doc, questions: questions.length, responses: sum };
      })
    );
    console.log(returnUsers);
    res.json(returnUsers);
  })
);

//delete /user/id
router.delete(
  "/user/:id",
  wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
  })
);

//get current user
router.put(
  "/user",
  wrapAsync(async function (req, res) {
    const id = req.body._id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        profileImage: req.body.profileImage,
        address: req.body.address,
      },
      { runValidators: true }
    );
    res.sendStatus(204);
  })
);

router.post(
  "/register",
  wrapAsync(async function (req, res) {
    const { password, email, name } = req.body;
    const user = new User({
      email,
      password,
      name,
      profileImage: "",
      address: ["", ""],
      isAdmin: false,
    });
    await user.save();
    req.session.userId = user._id;
    res.json(user);
  })
);

router.post(
  "/login",
  wrapAsync(async function (req, res) {
    const { password, email } = req.body;
    const user = await User.findAndValidate(email, password);
    // console.log(user);
    if (user) {
      req.session.userId = user._id;
      console.log(user);
      res.json(user);
    } else {
      res.sendStatus(401);
    }
  })
);

router.post(
  "/logout",
  wrapAsync(async function (req, res) {
    req.session.userId = null;
    res.sendStatus(204);
  })
);

module.exports = router;
