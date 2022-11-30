"use strict";

require("dotenv").config();

const express = require("express");
const nunjucks = require("nunjucks");

let app = express();
app.set("view engine", "njk");

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static("public"));

// Implement these routes
app.get("/", (req, res, next) => {});
app.get("/login", (req, res, next) => {});
app.get("/callback", (req, res, next) => {});
app.get("/repos", (req, res, next) => {});
app.get("/logout", (req, res, next) => {});

let port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
