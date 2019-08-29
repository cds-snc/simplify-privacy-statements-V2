module.exports = app => {
  // clear session
  app.get("/clear", (req, res) => {
    req.session = null;
    res.redirect(302, "/");
  });
};
