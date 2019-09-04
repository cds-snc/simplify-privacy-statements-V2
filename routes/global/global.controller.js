module.exports = app => {
  // clear session
  app.get("/clear", (req, res) => {
    req.session = null;
    res.redirect(302, "/");
  });

  app.use(function(req, res, next) {
    res.status(404);

    let message = false;

    const route_path = req.path;

    if (process.env.NODE_ENV !== "production") {
      message = `❌ Forgot to add this route? \n\nAdd the following to config/routes.config.js: \n\nconst routes = [{ name: "${route_path}", path: "${route_path}" }]\n ...\n configRoutes(app){\n  require("../routes${route_path}${route_path}.controller")(app);\n}`;
    }

    res.render("404", { message });
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
