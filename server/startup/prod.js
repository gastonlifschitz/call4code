const helmet = require("helmet"); //Secure HTTP headers
const compression = require("compression");
const serveStatic = require("serve-static");
const path = require("path");
const cwd = process.cwd();

module.exports = function(app) {
  app.use(helmet());
  app.use(compression());

  console.log("serving static content: ", path.join(cwd, "build"));

  app.enable("trust proxy");

  const { PUBLIC_URL } = process.env; // Se usa cuando se ejecuta desde docker local

  // Redirect to https if not running in docker
  !PUBLIC_URL &&
    app.use((req, res, next) => {
      if (req.secure) {
        console.log("Secure request", req.secure);
        next();
      } else {
        console.log(`redirect to ... https://${req.headers}${req.url}`);
        res.redirect(`https://${req.headers}${req.url}`);
      }
    });

  // Serve static revved files with uncoditional cache
  app.use(
    serveStatic(path.join(cwd, "build"), {
      index: false,
      setHeaders: (res, path) => {
        res.setHeader("Cache-Control", "public, immutable, max-age=31536000");
      }
    })
  );

  // Route any non API and non static file to React Client Router for SPA development
  app.use((req, res) => {
    console.log("sendFile", path.join(cwd, "build", "index.html"));
    res.sendFile(path.join(cwd, "build", "index.html"));
  });
};
