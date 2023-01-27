const express = require("express");
const app = express();
const session = require("cookie-session");
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "cf1ab74530829606b60eb32f9f66c4fc" }));
// Définition du moteur ejs
app.set("view engine", "ejs");
//Défini le dossier views
//app.set("views", __dirname + "/views");

//http://localhost:8090/
app.get("/", (req, res) => {
  res.render("home");
});

// Direction des URL
app.get("/views/form", (req, res) => {
  res.render("form");
});

// Redirection
app.post("/game/settings/add/", (req, res) => {
  req.session.playerTwo = req.body.playerTwo;
  req.session.objectName = req.body.objectName;
  req.session.objectValue = req.body.objectValue;

  res.redirect("/game");
});
// Direction sur Game
app.get("/game", (req, res) => {
  req.session.tentative = 0;
  res.render("game", {
    playerTwo: req.session.playerTwo,
    objectName: req.session.objectName,
    newTry: req.session.newTry,
    more: false,
    less: false,
    equal: false,
  });
});

// Direction /game/check/ vers /game
app.post("/game/check", (req, res) => {
  const newTry = Number(req.body.newTry);
  const objectValue = Number(req.session.objectValue);
  req.session.tentative += 1;

  let more = false;
  let less = false;
  let equal = false;

  if (newTry > objectValue) {
    less = true;
  }
  if (newTry < objectValue) {
    more = true;
  }
  if (newTry == objectValue) {
    equal = true;
  }

  res.render("game", {
    more: more,
    less: less,
    equal: equal,
    playerTwo: req.session.playerTwo,
    objectName: req.session.objectName,
    tentative: req.session.tentative,
  });
});

// Afficher la page 404
app.use((req, res) => {
  res.status(404);
  res.render("error-page");
});

// Démarre le serveur sur le port
app.listen(8090, () => {
  console.log("Le serveur démarre sur le port");
});
