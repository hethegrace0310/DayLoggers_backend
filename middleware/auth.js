const Note = require("../models/Note");
const { wrapAsync } = require("../utils/helper");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    throw new Error("Need to login first");
  }
  next();
};

// If the author has an agent, the logged in user must be that agent to access
module.exports.isAgent = wrapAsync(async (req, res, next) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (note?.writer && !note?.writer.equals(req.session.userId)) {
    throw new ExpressError("Not an authorized agent for this author", 401);
  }
  next();
});
