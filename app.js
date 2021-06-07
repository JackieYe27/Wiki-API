const express = require('express');
const app = express();
const mongoose = require("mongoose");

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

const Article = mongoose.model("Article", wikiSchema);

app.get("/", (req,res) => {
    console.log("hello");
});

app.use(express.urlencoded({extended: true}));



app.listen("3000", () => console.log("Server is listening on port 3000"));