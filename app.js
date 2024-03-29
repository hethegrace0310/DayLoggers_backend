const express = require("express");
const usersRoutes = require("./routes/usersRoute");
const questionRoute = require("./routes/questionRoute");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo"); // MongoDB session store
const app = express();
const bodyParser = require("body-parser");


app.use(bodyParser.json());


const sessionSecret = "Haeun Park";

var dbURL =
  process.env.MONGO_URL ||
  "mongodb+srv://cse316final:1234567890@cse316final.oxq7w.mongodb.net/test"; // insert your database URL here
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const store = MongoStore.create({
  mongoUrl: dbURL,
  secret: sessionSecret,
  touchAfter: 24 * 60 * 60,
});


const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

const sessionConfig = {
  store,
  name: "session",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    httpOnly: true,
    // sameSite: "none",
    expires: expirationDate,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    // domain: "netlify.app",
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
app.use("/api", questionRoute);

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
