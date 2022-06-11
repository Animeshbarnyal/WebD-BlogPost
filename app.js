//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
mongoose.connect("mongodb://localhost:27017/articleDB", {
  useNewUrlParser: true
});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const posts = [];

const articleSchema = new mongoose.Schema({
  name: String,
  type: Number,
  content: String
});

const article = mongoose.model("article",articleSchema);

const homeArticle = new article({
  name: "Home",
  type: 0,
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const aboutArticle = new article({
  name: "About",
  type: 0,
  content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});

const contactArticle = new article({
  name: "Contact",
  type: 0,
  content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});

const defaultArticles = [homeArticle,aboutArticle,contactArticle];
// app routing ------------------------------------------------------


app.get("/", function(req,res){
  article.find({type: 0 }, function(err, foundItems){
    if (foundItems.length === 0){
      article.insertMany(defaultArticles, function(err){
        res.redirect("/");
      });
    }else{
      article.findOne({name: "Home"}, function(err,foundItem){
        let articleHome = foundItem.content;
      article.find({type: 1 }, function(err, foundList){
        console.log(foundList);
        res.render("home", {
          homearticle: foundItem.content,
          POSTS: foundList});
      });
      });
    }
  });
});

app.get("/:token", function(req,res){
  const categoryTitle = _.capitalize(req.params.token);
  article.findOne({name: categoryTitle}, function(err,founditem){
    if(!founditem){
      if(categoryTitle === "Compose"){
        res.render("compose");
      }else{
        res.redirect("/");
      }
    }else{
      res.render("content",{
        title: founditem.name,
        content: founditem.content
      });
    }
  });
});

// app.get("/about", function(req,res){
//   res.render("about", {ABOUTCONTENT: aboutContent});
// });
//
// app.get("/contact", function(req,res){
//   res.render("contact", {CONTACTCONTENT: contactContent});
// });
//
// app.get("/compose", function(req,res){
//   res.render("compose");
// });

app.get("/posts/:token",function(req,res){
  const requestedTitle = _.lowerCase(req.params.token);
  article.findOne({name: requestedTitle}, function(err, foundItem){
    res.render("content", {
      title: foundItem.name,
      content: foundItem.content
    });
  });
});

app.post("/compose", function(req,res){
  const composeTitle = _.lowerCase(req.body.composeTitle);
  const newArticle = new article({
    name: composeTitle,
    type: 1,
    content: req.body.composePost
});
    newArticle.save();
  res.redirect("/");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
