module.exports = app => {
  // clear session
  app.get("/clear", (req, res) => {
    req.session = null;
    res.redirect(302, "/");
  });

  app.get("*", function(req, res, next) {
    res.send("Not Found");
  });
};
