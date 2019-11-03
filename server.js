// -- Dependencies --


// dotenv
require('dotenv').config();
// Express server
var express = require("express");
// Morgan middleware
var logger = require("morgan");
// mongoose database model
var mongoose = require("mongoose");
// Axios request tool
var axios = require("axios");
// Cheerio scraping tool
var cheerio = require("cheerio");


//  -- Database and Server --


// Require all models
var db = require("./models");
// Define port -> Heroku || Local
var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();
// Configure middlewares
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Connect to the Mongo DB
// -- ? -- process.env is not reading MONGO_URI as a string even after parser
// Alert - this is not a good way of connecting to db 
// ------- as a temporary solution, revealing info
var MONGO_URI = "mongodb://heroku_g9jmh4dd:ull2fra562vogmuruvk7haacrc@ds241258.mlab.com:41258/heroku_g9jmh4dd";
mongoose.connect(MONGO_URI);


// -- Routes --


// GET to drop the collections
app.get("/clear", function(req, res) {

  mongoose.connection.collections['articles'].drop( function(err) {
    console.log('collection dropped');
  });

  mongoose.connection.collections['notes'].drop( function(err) {
    console.log('collection dropped');
  });

});

// GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {

  // Grab the body of the html with axios
  axios.get("http://www.echojs.com/").then(function(response) {

    // Load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// GET route for getting all Articles from the db
app.get("/articles", function(req, res) {

  db.Article.find({})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// GET route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id }) 
  .populate("note")
  .then(function(data) {
    res.json(data);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// POST route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({_id: req.params.id}, { note: dbNote._id });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// GET route for fetching saved articles
app.get("/saved", function(req, res) {
  db.Article.find({ saved: true }) 
  .then(function(data) {
    res.json(data);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// GET route for saving an article
app.post("/saved/:id", function(req, res) {

  db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// POST route for unsaving an article
app.post("/unsaved/:id", function(req, res) {

  db.Article.findOneAndUpdate({_id: req.params.id}, {saved: false})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});