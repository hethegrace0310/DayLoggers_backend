const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const Note = require("../models/Note");
const Qeustions = require("../models/Qeustions");
const User = require("../models/User");
const { isLoggedIn, isAgent } = require("../middleware/auth");

const { wrapAsync } = require("../utils/helper");
