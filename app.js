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

// get route will read our database to find all documents in the db collection
app.get("/articles", (req,res) => {
    Article.find((err, foundArticles) => {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});




app.listen("3000", () => console.log("Server is listening on port 3000"));