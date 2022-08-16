const express = require("express");
const { join } = require("path");
const app = express();


// Serve static assets from the /public folder
app.use(express.static(join(__dirname, "public")));

// Endpoint to serve the configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

// Serve the index page for all other requests
app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "login.html"));
});

app.get("/index.html", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/categories.html", (_, res) => {
  res.sendFile(join(__dirname, "categories.html"));
});

app.get("/Letra.pdf", (_, res) => {
  res.sendFile(join(__dirname, "Letra.pdf"));
});

app.get("/sell.html", (_, res) => {
  res.sendFile(join(__dirname, "sell.html"));
});

app.get("/products.html", (_, res) => {
  res.sendFile(join(__dirname, "products.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }

  next(err, req, res);
});

// Listen on port 3000
app.listen(3000, () => console.log("Application running on port 3000"));