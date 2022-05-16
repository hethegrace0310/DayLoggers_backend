const app = require("./app");

port = process.env.PORT || 5005;
app.listen(port, () => {
  //6000번 port에서 앱을 실행한다.
  console.log("Server started on port " + port);
});
