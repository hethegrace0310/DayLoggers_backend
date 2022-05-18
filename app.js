const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/usersRoute");
const notesRoutes = require("./routes/notesRoute");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
var corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://628506e94c2cab2730c7ea4a--meek-boba-7ec9b8.netlify.app",
  ],
};

app.use(cors(corsOptions));

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // MongoDB session store

const sessionSecret = "Haeun Park";

var dbURL =
  process.env.MONGO_URL ||
  "mongodb+srv://cse316final:1234567890@cse316final.oxq7w.mongodb.net/test"; // insert your database URL here
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const store = MongoStore.create({
  mongoUrl: dbURL,
  secret: sessionSecret,
  touchAfter: 24 * 60 * 60,
});

// mongoose.set("useFindAndModify", false);

const sessionConfig = {
  store,
  name: "session",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    samesite: "none",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    // later you would want to add: 'secure: true' once your website is hosted on HTTPS.
  },
};

app.use(session(sessionConfig));

app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(req.method, req.path);
  next();
});

app.use("/api", usersRoutes);
app.use("/api", notesRoutes);

app.use((err, req, res, next) => {
  console.log("Error handling called " + err);
  res.statusMessage = err.message;

  if (err.name === "ValidationError") {
    res.status(400).end();
  } else {
    res.status(500).end();
  }
});

module.exports = app;
