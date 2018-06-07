var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exHandle = require("express-handlebars");
var request = require("request");

// Scraping Tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require All Models
var db = require("./models");

//Port
var PORT = 3000;

// Initialize Express
var app = express();

// Configure Middleware

// Use morgan For Logging Requests
app.use(logger("dev"));

// Use body-parser For Handling Form Submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Public Folder As Static Directory
app.use(express.static("public"));

// Connect to Mongo DB
mongoose.connect("mongodb://localhost/scraperdb");

// Routes

// A GET Route for Scraping Website
app.get("/scrape", function(req, res) {
  // Grab Body of html With Request
  axios.get("http://www.newscow.net/").then(function(response) {
    // Load Into Cheerio and Save to $ for Shorthand Selector
    var $ = cheerio.load(response.data);
    // Grab Every h3 Within Article Tag:
    $("article h3").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add Text and href of Every Link
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create New Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If Successfully Scrape and Save Article, Send Message to the Client
    res.send("Scrape Complete");
  });
});

// Route for Getting All Articles From db
app.get("/articles", function(req, res) {
  // Grab Every Document in Articles Collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If Successfully Find Articles, Send Them Back to Client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If Error Occurred, Send To Client
      res.json(err);
    });
});

// Route Grabs Specific Article by id, Populate With Note
app.get("/articles/:id", function(req, res) {
  // Finds Matching id in db...
  db.Article.findOne({ _id: req.params.id })
    // Populate Notes Associated With It
    .populate("note")
    .then(function(dbArticle) {
      // If Find Article With id, Send To Client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If Error, Send To Client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If Note Created, find one Article with an `_id` equal to `req.params.id`. Update Article To Be Associated With New Note
      // { new: true } Tells Query We Want It To Return Updated User -- Returns Original by Default
      // Another `.then` Receives Result of Query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If Article Successfully Updates, Send To Client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If Error, Send To Client
      res.json(err);
    });
  // //Save Notes of Article From MongoDB
  //     app.post("/save", function (req, res){
  //      ?.save(req.body, function(data){
  //          res.json(data);
  //      });
  //     });
  //     //Delete Notes of Article From MongoDB
  //     app.delete("/delete", function (req, res){
  //      ?.delete (req.body, function(data){
  //          res.json(data);
  //      });
  //     });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
