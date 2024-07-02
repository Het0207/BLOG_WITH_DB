//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare...";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque...";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien...";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  post: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("home", { firstp: homeStartingContent, posts: posts });
  } catch (err) {
    console.log(err);
  }
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: _.capitalize(req.body.input),
    post: req.body.addpost
  });
  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts/:postName", async (req, res) => {
  try {
    const post = await Post.findOne({ title: _.capitalize(req.params.postName) });
    if (post) {
      res.render("post", { Title: post.title, Description: post.post });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/delete", (req, res) => {
  res.render("delete");
});

app.post("/delete", async (req, res) => {
  const title = (req.body.input);
  try {
    const post = await Post.findOne({ title: _.capitalize(title) });
    console.log(post);
    if (post) {
      await Post.deleteOne({ title: _.capitalize(title) });
      res.redirect("/");
    } else {
      console.log("Post not found");
      res.redirect("/delete"); 
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
