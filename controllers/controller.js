//Server Routes--Require Express
var express = require("express");

//Set Up Router
var router = express.Router();

//Scrape Function
// var scrape = require("app.js");
// var articleController = require("../controller/article.js");
// var noteController = require("..controller/note.js");

//Basic route
router.get("/", function(req, res) {
  res.render("home");
});

//Testing Scrape
router.get("/test", function(req, res) {
  scrape("http://", function(data) {
    res.json(data);
  });
});

//Fetch
router.post("/fetch", function(req, res) {
  articleController.fetch();
  res.send("Success!");
});

//Check Mongodb Data
router.get("/check", function(req, res) {
  articleController.check(function(data) {
    res.json(data);
  });
});

//Gather Notes
router.post("/gather", function(req, res) {
  articleController.gather(function(data) {
    res.json(data);
  });
});

//Post Saved Note to Robo3T/mongod
router.post("/save", function(req, res) {
  noteController.save(req.body, function(data) {
    res.json(data);
  });
});

//Delete Notes from Robo3T/mongod
router.delete("/delete", function(req, res) {
  noteController.delete(req.body, function(data) {
    res.json(data);
  });
});
//Export
module.exports = router;
