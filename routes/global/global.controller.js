module.exports = app => {
  // clear session
  app.get("/clear", (req, res) => {
    req.session = null;
    res.redirect(302, "/");
  });

  app.use(function(req, res, next) {
    res.status(404);
    res.render("404");
  });

  app.use(function(err, req, res, next) {
    res.status(500);

    console.error(`☠️ Error => ${err.message}`);

    let message = false;

    if (process.env.NODE_ENV !== "production") {
      message = `❌ ${err.message}`;
    }

    res.render("500", { message });
  });
};
