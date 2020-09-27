//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});




const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});


app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const user = new User({
        email : req.body.username,
        password : hash
      });

      user.save(function(err){
        if(err)
          console.log(err);
        else
          res.render("secrets");
      });

    });

});

app.post("/login", function(req, res){
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email : userName}, function(err, foundUser){
    if(err)
      console.log(err);
    else{
      if(!foundUser)
        res.send("Username not found!");
      else{
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true){
            res.render("secrets");
          }else{
            res.send("Password incorrect !");
          }
        });
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
