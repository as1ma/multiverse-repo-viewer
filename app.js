"use strict";

require("dotenv").config();

const express = require("express");
const nunjucks = require("nunjucks");
const crypto = require("crypto")
const cookieParser = require("cookie-parser")
const fetch = require("node-fetch")
const session = require("express-session")
const NodeCache = require("node-cache")

let app = express();
app.set("view engine", "njk");

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

let sessionSettings = {
  cookie: {maxAge:1000 * 60 * 60 * 24},
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}

app.use(express.static("public"));
app.use(cookieParser())
app.use(session(sessionSettings))

// Implement these routes
app.get("/", (req, res, next) => {
  res.render("index")
});

let stateKey = "github_auth_state"

app.get("/login", (req, res, next) => {
  let state = crypto.randomUUID()
  let params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    scope: "repo",
    state: state
  })
  res.cookie(stateKey, state)
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`)
});

app.get("/callback", async(req, res, next) => {
  let code = req.query.code
  let state = req.query.state
  let savedState = req.cookies[stateKey]

  res.clearCookie(stateKey)

  if (!state || state !== savedState) {
    console.error("States don't match")
    res.redirect()
    return
  }

  let params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: code
  })

  let url = `https://github.com/login/oauth/access_token?${params.toString()}`

  let requestConfig = {
    method: "POST",
    headers: {Accept: "application/json"},
  }

  try{
    let response = await fetch(url,requestConfig)
    let data = await response.json()
    req.session.token = data.access_token
    req.session.save((err) => {
      if (err) {
        next(err)
      } else {
        res.redirect("/repos")
      }
    })
  } catch (err) {
    console.error(err)
  } 

});

let cache = new NodeCache({ stdTTL: 100, checkperiod:120})

app.get("/repos", async(req, res, next) => {
  let token = req.session.token

  if (!token) {
    console.error("No token")
    res.redirect("/")
    return
  }

  let data =cache.get("repos")
  if (data) {
    console.log("serving cached data")
    res.render("repos", {repos: data})
    return
  }
  let url = "https://api.github.com/user/repos"
  let requestConfig = {
    headers: {Authorization: `Bearer ${token}`},
  }
  try {
    let response = await fetch(url,requestConfig)
    let data = await response.json()
    cache.set("repos", data)
    res.render("repos", {repos: data})
  } catch (err) {
    console.error("Problem fetching repos:", err)
    res.redirect("/")
  }
});
app.get("/logout", (req, res, next) => {
  delete req.session.token

  req.session.save((err) => {
    if (err){
      next(err)
    }
    res.redirect("/")
  })
});

let port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
