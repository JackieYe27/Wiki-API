const express = require('express');
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected!");
});

// create Schema for Collection
const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Used to access articles collection
const Article = mongoose.model("Article", wikiSchema);

app.route("/articles")

// GET route will read our database to find all documents in the db collection
.get((req,res) => {
    Article.find((err, foundArticles) => {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

// POST route will post to our wikiDB creating a new document to our articles collection
.post((req,res) => {
    let requestedTitle= req.body.title;
    let requestedContent = req.body.content;
    // create new article then save article
    const newArticle = new Article({
        title: requestedTitle,
        content: requestedContent
    });
    newArticle.save((err) => {
        if(!err) res.send("Successfully added a new article");
        else res.send(err);
    });
})

// DELETE route will delete all the articles in our collection
.delete((req, res) => {
    Article.deleteMany((err) => {
        if(!err) {
            res.send("Successfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});

// Using route for specific article
app.route("/articles/:articleTitle")

// chaining on a get method
.get((req,res) => {
    
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if(!err) res.send(foundArticle);
        else res.send(err);
    });
})

// updating specific article
// Note that PUT requests change the entire article with a new one so leaving out content could cause issues
.put((req,res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) => {
            if (!err) res.send("Successfully updated article");
            else res.send("Uh Oh Error!");
        }
    );
})

// updating a specific article given specific fields
.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if(!err) res.send("Successfully updated article");
            else res.send("Error!");
        }
    );
})

// Delete a specific article
.delete((req,res) => {
    Article.deleteOne(
        {title:req.params.articleTitle},
        (err) => {
            if(!err) res.send("Successfully deleted article");
            else res.send("Uh Oh Error");
        }
    );
});

app.listen("3000", () => console.log("Server is listening on port 3000"));